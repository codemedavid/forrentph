import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addDays, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { Costume, Booking, DateAvailability } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
}

export function calculatePrice(costume: Costume, startDate: Date, endDate: Date): number {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days <= 1) {
    return costume.pricePerDay;
  } else if (days <= 3) {
    return costume.pricePerDay * days * 0.9; // 10% discount for multi-day
  } else if (days <= 7) {
    return costume.pricePerWeek;
  } else {
    return costume.pricePerWeek * Math.ceil(days / 7) * 0.85; // 15% discount for extended rental
  }
}

export function getDurationLabel(startDate: Date, endDate: Date): string {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days === 1) {
    return '1 Day';
  } else if (days <= 3) {
    return `${days} Days`;
  } else if (days <= 7) {
    return '1 Week';
  } else {
    return `${Math.ceil(days / 7)} Weeks`;
  }
}

export function checkAvailability(
  costumeId: string, 
  startDate: Date, 
  endDate: Date, 
  bookings: Booking[]
): { isAvailable: boolean; conflictingBooking?: Booking } {
  const requestedDates = getDateRange(startDate, endDate);
  
  for (const booking of bookings) {
    if (booking.costumeId !== costumeId || booking.status === 'cancelled') {
      continue;
    }
    
    const bookedDates = getDateRange(booking.startDate, booking.endDate);
    
    // Check for any overlap
    const hasOverlap = requestedDates.some(requestedDate => 
      bookedDates.some(bookedDate => isSameDay(requestedDate, bookedDate))
    );
    
    if (hasOverlap) {
      return { isAvailable: false, conflictingBooking: booking };
    }
  }
  
  return { isAvailable: true };
}

export function generateDateAvailability(
  costumeId: string,
  startDate: Date,
  endDate: Date,
  bookings: Booking[]
): DateAvailability[] {
  const dates = getDateRange(startDate, endDate);
  const availability: DateAvailability[] = [];
  
  for (const date of dates) {
    const { isAvailable, conflictingBooking } = checkAvailability(
      costumeId, 
      date, 
      date, 
      bookings
    );
    
    availability.push({
      date: formatDate(date),
      isAvailable,
      bookedBy: conflictingBooking?.customerName
    });
  }
  
  return availability;
}

export function getAvailableDates(
  costumeId: string,
  bookings: Booking[],
  monthsAhead: number = 3
): DateAvailability[] {
  const today = new Date();
  const endDate = addDays(today, monthsAhead * 30);
  const dates = getDateRange(today, endDate);
  const availability: DateAvailability[] = [];
  
  for (const date of dates) {
    const { isAvailable, conflictingBooking } = checkAvailability(
      costumeId, 
      date, 
      date, 
      bookings
    );
    
    availability.push({
      date: formatDate(date),
      isAvailable,
      bookedBy: conflictingBooking?.customerName
    });
  }
  
  return availability;
}

export function generateMessengerBookingMessage(
  costume: Costume,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  startDate: Date,
  endDate: Date,
  totalPrice: number,
  specialRequests?: string
): string {
  const durationLabel = getDurationLabel(startDate, endDate);
  
  const message = `🎭 COSTUME RENTAL BOOKING REQUEST

📋 BOOKING DETAILS:
• Costume: ${costume.name}
• Duration: ${durationLabel}
• Start Date: ${formatDisplayDate(startDate)}
• End Date: ${formatDisplayDate(endDate)}
• Total Price: ₱${totalPrice}

👤 CUSTOMER INFORMATION:
• Name: ${customerName}
• Email: ${customerEmail}
• Phone: ${customerPhone}

${specialRequests ? `📝 SPECIAL REQUESTS:\n${specialRequests}\n\n` : ''}💰 COSTUME DETAILS:
• Size: ${costume.size}
• Difficulty: ${costume.difficulty}
• Setup Time: ${costume.setupTime} minutes
• Features: ${costume.features.join(', ')}

📅 BOOKING ID: #${Date.now().toString().slice(-6)}

Please confirm availability and provide payment instructions. Thank you!`;

  return message;
}

export function createMessengerURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://m.me/ForRentInflatablesph?text=${encodedMessage}`;
}

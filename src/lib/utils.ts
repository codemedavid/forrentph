import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addDays, isSameDay } from "date-fns";
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

export function calculatePrice(costume: Costume, startDate: Date, endDate: Date, duration?: string): number {
  // If duration is explicitly provided, use that for pricing
  if (duration) {
    switch (duration) {
      case '12h':
        return costume.pricePer12Hours || costume.pricePerDay * 0.6;
      case '1d':
        return costume.pricePerDay;
      case '3d':
        return costume.pricePerDay * 3 * 0.9; // 10% discount for 3-day rental
      case '1w':
        return costume.pricePerWeek;
      default:
        return costume.pricePerDay;
    }
  }
  
  // Legacy calculation based on date difference (for backward compatibility)
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

export function getDurationLabel(startDate: Date, endDate: Date, duration?: string): string {
  // If duration is explicitly provided, use that for label
  if (duration) {
    switch (duration) {
      case '12h':
        return '12 Hours';
      case '1d':
        return '1 Day';
      case '3d':
        return '3 Days';
      case '1w':
        return '1 Week';
      default:
        return '1 Day';
    }
  }
  
  // Legacy calculation based on date difference (for backward compatibility)
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
  specialRequests?: string,
  bookingReference?: string
): string {
  const durationLabel = getDurationLabel(startDate, endDate);
  const reference = bookingReference || `TEMP-${Date.now().toString().slice(-6)}`;
  
  const message = `🎭 COSTUME RENTAL BOOKING REQUEST

📋 BOOKING DETAILS:
• Reference: ${reference}
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

⏰ IMPORTANT: This costume is temporarily reserved for you for 10 minutes. Please confirm your booking to secure it!

📞 Reply with "${reference}" to confirm your booking. Thank you!`;

  return message;
}

export function createMessengerURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://m.me/ForRentInflatablesph?text=${encodedMessage}`;
}

// Seasonal rental duration rules
export function getSeasonalRentalRules(date: Date): {
  season: 'peak' | 'regular';
  allowedDurations: string[];
  minHours: number;
  description: string;
} {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, we want 1-12
  
  // October to December (months 10, 11, 12) - Peak Season
  if (month >= 10 && month <= 12) {
    return {
      season: 'peak',
      allowedDurations: ['12h'],
      minHours: 12,
      description: 'Peak season (Oct-Dec): 12-hour rentals only for faster turnover'
    };
  }
  
  // January to September (months 1-9) - Regular Season
  return {
    season: 'regular',
    allowedDurations: ['1d', '3d', '1w'],
    minHours: 24,
    description: 'Regular season (Jan-Sep): Minimum 24-hour rental'
  };
}

// Check if a rental duration is allowed for the selected date
export function isRentalDurationAllowed(startDate: Date, durationCode: string): boolean {
  const rules = getSeasonalRentalRules(startDate);
  return rules.allowedDurations.includes(durationCode);
}

// Validate rental dates against seasonal rules
export function validateSeasonalRental(
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } {
  const rules = getSeasonalRentalRules(startDate);
  const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  
  if (rules.season === 'peak' && hours > 12) {
    return {
      valid: false,
      error: `During peak season (October-December), only 12-hour rentals are available. Your selected rental is ${hours} hours.`
    };
  }
  
  if (rules.season === 'regular' && hours < 24) {
    return {
      valid: false,
      error: `During regular season (January-September), minimum rental duration is 24 hours. Your selected rental is ${hours} hours.`
    };
  }
  
  return { valid: true };
}

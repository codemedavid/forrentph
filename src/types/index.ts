export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface Costume {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  images: string[];
  pricePerDay: number;
  pricePer12Hours: number;
  pricePerWeek: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setupTime: number; // in minutes
  features: string[];
  isAvailable: boolean;
  slug: string;
}

export interface Booking {
  id: string;
  costumeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
}

export interface PricingTier {
  duration: '12h' | '1d' | '3d' | '1w';
  label: string;
  multiplier: number;
}

export interface DateAvailability {
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  bookedBy?: string;
  alternativeDate?: string;
}

export interface CartItem {
  costumeId: string;
  costume: Costume;
  startDate: Date;
  endDate: Date;
  duration: string;
  price: number;
}

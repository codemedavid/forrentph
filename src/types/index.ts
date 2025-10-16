export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string; // Emoji or icon character
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

// Site Settings Types
export interface SiteSettings {
  id: string;
  key: string;
  value: Record<string, unknown>; // JSONB value
  category: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AboutHero {
  title: string;
  subtitle: string;
}

export interface AboutStory {
  title: string;
  paragraphs: string[];
  statsTitle: string;
  statsSubtitle: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface AboutStats {
  stats: Stat[];
}

export interface Value {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface AboutValues {
  title: string;
  subtitle: string;
  values: Value[];
}

export interface Feature {
  icon?: string;
  title: string;
  description: string;
}

export interface WhyChooseUs {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface AboutCTA {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface HeaderBranding {
  companyName: string;
  companyFullName: string;
  tagline: string;
  logoEmoji: string;
}

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      costumes: {
        Row: {
          id: string;
          name: string;
          description: string;
          category_id: string;
          images: string[];
          price_per_day: number;
          price_per_12_hours: number;
          price_per_week: number;
          size: string;
          difficulty: string;
          setup_time: number;
          features: string[];
          is_available: boolean;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['costumes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['costumes']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          costume_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          start_date: string;
          end_date: string;
          total_price: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          special_requests: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          image: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
    };
  };
}


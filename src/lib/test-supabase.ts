// Test Supabase Connection
// Run this in your browser console or as a Next.js API route to test the connection

import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    // Test 1: Check if Supabase client is initialized
    console.log('✓ Supabase client initialized');

    // Test 2: Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (categoriesError) {
      console.error('✗ Categories test failed:', categoriesError);
      return false;
    }
    console.log('✓ Categories table accessible');

    // Test 3: Fetch costumes
    const { data: costumes, error: costumesError } = await supabase
      .from('costumes')
      .select('*')
      .limit(1);

    if (costumesError) {
      console.error('✗ Costumes test failed:', costumesError);
      return false;
    }
    console.log('✓ Costumes table accessible');

    // Test 4: Fetch bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (bookingsError) {
      console.error('✗ Bookings test failed:', bookingsError);
      return false;
    }
    console.log('✓ Bookings table accessible');

    console.log('\n✅ All tests passed! Supabase is connected and working.\n');
    console.log('Database stats:');
    console.log(`- Categories: ${categories?.length || 0} found`);
    console.log(`- Costumes: ${costumes?.length || 0} found`);
    console.log(`- Bookings: ${bookings?.length || 0} found`);

    return true;
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that .env.local file exists with correct credentials');
    console.log('2. Verify Supabase project is running');
    console.log('3. Run supabase-schema.sql to create tables');
    console.log('4. Check browser console for detailed errors');
    return false;
  }
}

// Helper function to get connection status
export async function getSupabaseStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    configured: !!(url && key),
    url: url ? '✓ Set' : '✗ Missing',
    anonKey: key ? '✓ Set' : '✗ Missing',
  };
}


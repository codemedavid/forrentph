// Supabase Configuration Example
// Copy this file to .env.local and fill in your Supabase credentials

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_project_url',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key'
};

// Instructions:
// 1. Go to https://supabase.com and create a new project
// 2. Navigate to Settings > API to get your credentials
// 3. Create a .env.local file with the following:
//    NEXT_PUBLIC_SUPABASE_URL=your_project_url
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
//    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key


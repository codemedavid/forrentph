/**
 * Verify Description in Database
 * Run: npx tsx verify-description.ts
 */

import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('costumes')
    .select('name, description')
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('📝 Costume:', data.name);
  console.log('\n🔍 Description (raw):');
  console.log(JSON.stringify(data.description));
  console.log('\n✅ Has \\n (newlines):', data.description.includes('\n') ? 'YES ✓' : 'NO ✗');
  console.log('✅ Line count:', data.description.split('\n').length, 'lines');
  
  if (data.description.includes('\n')) {
    console.log('\n✅ Database is correct! Line breaks are stored.');
    console.log('💡 If not showing on website, try:');
    console.log('   1. Hard refresh browser (Cmd+Shift+R)');
    console.log('   2. Clear browser cache');
    console.log('   3. Check dev server is running');
  } else {
    console.log('\n❌ Database does NOT have line breaks!');
    console.log('💡 Run the SQL update again in Supabase SQL Editor');
  }
}

main();


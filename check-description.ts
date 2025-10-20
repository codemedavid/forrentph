/**
 * Check Description Format in Database
 * 
 * This script checks how descriptions are stored in your database
 * Run: npx tsx check-description.ts
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

  console.log('🔍 Checking costume descriptions...\n');

  const { data: costumes, error } = await supabase
    .from('costumes')
    .select('id, name, description')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  costumes?.forEach((costume, index) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Costume ${index + 1}: ${costume.name}`);
    console.log('='.repeat(60));
    console.log('\n📝 Description:');
    console.log(costume.description);
    console.log('\n🔍 Raw (with escape codes):');
    console.log(JSON.stringify(costume.description));
    console.log('\n✅ Has newlines:', costume.description.includes('\n') ? 'YES' : 'NO');
    console.log('✅ Line count:', costume.description.split('\n').length);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 If "Has newlines" shows NO, that means line breaks were lost during save.');
  console.log('💡 If "Has newlines" shows YES, then the CSS fix should work!');
}

main().catch(console.error);


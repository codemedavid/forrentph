/**
 * Bulk Import Costumes Script
 * 
 * This script reads from costumes-import-template.csv and imports all costumes to Supabase
 * 
 * Usage:
 * 1. Fill in costumes-import-template.csv with your costume data
 * 2. Run: npx tsx bulk-import-costumes.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Standard description for all costumes (template literal preserves line breaks!)
const STANDARD_DESCRIPTION = `Shipping info
Lalamove - grab - move it - angkas - joyride
Pickup and return shouldered by renter

No Dp No reservation
Reserve early no rush or same day pickup unless available
Confirm availability before paying

Date and time is a must to check availability

Changing dates subject for approval and availability if the new chosen dates are not yet reserved

Email - wherefuncomesalive@gmail.com
Proposals/xdeals/collab

Mon to Sunday
8am-12nn
10pm-12mn

No pickup at 1pm-9pm`;

interface CostumeCSVRow {
  name: string;
  category: string;
  image_filename: string;
  price_per_day: string;
  price_per_12_hours: string;
  price_per_week: string;
  size: string;
  difficulty: string;
  setup_time: string;
  features: string;
  slug: string;
}

async function main() {
  // Initialize Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🚀 Starting bulk costume import...\n');

  // Read CSV file
  const csvPath = path.join(__dirname, 'costumes-import-template.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ costumes-import-template.csv not found!');
    console.log('Please create the file and fill it with costume data.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  console.log(`📊 Found ${dataLines.length} costumes to import\n`);

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name');

  if (catError) {
    console.error('❌ Error fetching categories:', catError);
    process.exit(1);
  }

  const categoryMap = new Map(categories?.map(c => [c.name, c.id]) || []);

  let successCount = 0;
  let errorCount = 0;

  // Process each costume
  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    const columns = parseCSVLine(line);
    
    if (columns.length < 11) {
      console.log(`⚠️  Skipping line ${i + 2}: Not enough columns`);
      errorCount++;
      continue;
    }

    const [name, category, imageFilename, pricePerDay, pricePer12Hours, pricePerWeek, size, difficulty, setupTime, features, slug] = columns;

    // Get category ID
    const categoryId = categoryMap.get(category);
    
    if (!categoryId) {
      console.log(`⚠️  Skipping "${name}": Category "${category}" not found`);
      errorCount++;
      continue;
    }

    // Prepare costume data
    const costumeData = {
      name: name,
      description: STANDARD_DESCRIPTION,
      category_id: categoryId,
      images: [`/all-costumes/${imageFilename}`],
      price_per_day: parseFloat(pricePerDay),
      price_per_12_hours: parseFloat(pricePer12Hours),
      price_per_week: parseFloat(pricePerWeek),
      size: size,
      difficulty: difficulty,
      setup_time: parseInt(setupTime),
      features: features.split('|').filter(f => f.trim()),
      is_available: true,
      slug: slug || generateSlug(name)
    };

    // Insert into database
    const { error } = await supabase
      .from('costumes')
      .insert([costumeData]);

    if (error) {
      console.log(`❌ Error importing "${name}": ${error.message}`);
      errorCount++;
    } else {
      console.log(`✅ Imported: ${name}`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n🎉 Import Complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${dataLines.length}\n`);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Run the import
main().catch(console.error);


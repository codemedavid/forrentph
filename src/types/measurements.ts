export type MeasurementUnit = 'cm' | 'ft';

export type SizeType = 'standard' | 'custom';

export interface SizingData {
  type: SizeType;
  
  // For standard sizes
  standardSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
  
  // For custom measurements (single value or range)
  customValueMin?: string; // e.g., "150" or first value in range
  customValueMax?: string; // e.g., "190" for range (optional)
  unit?: MeasurementUnit; // cm or ft
}

// Helper functions
export function sizingDataToString(sizingData: SizingData): string {
  if (sizingData.type === 'standard') {
    return sizingData.standardSize || 'M';
  }
  
  // Custom measurement: single or range
  if (sizingData.customValueMin && sizingData.unit) {
    if (sizingData.customValueMax) {
      // Range: "150-190cm"
      return `${sizingData.customValueMin}-${sizingData.customValueMax}${sizingData.unit}`;
    } else {
      // Single: "150cm"
      return `${sizingData.customValueMin}${sizingData.unit}`;
    }
  }
  
  return 'One Size';
}

export function parseToSizingData(sizeString: string): SizingData {
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  
  if (standardSizes.includes(sizeString)) {
    return {
      type: 'standard',
      standardSize: sizeString as SizingData['standardSize']
    };
  }
  
  // Parse custom measurement range: "150-190cm" or "5.5-6.0ft"
  const rangeMatch = sizeString.match(/^(\d+\.?\d*)-(\d+\.?\d*)(cm|ft)$/);
  if (rangeMatch) {
    return {
      type: 'custom',
      customValueMin: rangeMatch[1],
      customValueMax: rangeMatch[2],
      unit: rangeMatch[3] as MeasurementUnit
    };
  }
  
  // Parse custom measurement single: "150cm" or "5.5ft"
  const singleMatch = sizeString.match(/^(\d+\.?\d*)(cm|ft)$/);
  if (singleMatch) {
    return {
      type: 'custom',
      customValueMin: singleMatch[1],
      unit: singleMatch[2] as MeasurementUnit
    };
  }
  
  // Default fallback
  return { type: 'standard', standardSize: 'One Size' };
}


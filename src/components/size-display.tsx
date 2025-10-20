'use client';

import { parseToSizingData } from '@/types/measurements';

interface SizeDisplayProps {
  size: string;
  className?: string;
}

export function SizeDisplay({ size, className = '' }: SizeDisplayProps) {
  const sizingData = parseToSizingData(size);

  if (sizingData.type === 'standard') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
          <span className="text-2xl">👕</span>
        </div>
        <div>
          <div className="text-sm text-gray-600">Size</div>
          <div className="text-xl font-bold text-gray-900">{sizingData.standardSize}</div>
        </div>
      </div>
    );
  }

  // Custom measurement (single or range)
  const displayValue = sizingData.customValueMax 
    ? `${sizingData.customValueMin} - ${sizingData.customValueMax}`
    : sizingData.customValueMin;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
        <span className="text-2xl">📏</span>
      </div>
      <div>
        <div className="text-sm text-gray-600">Custom Size</div>
        <div className="text-2xl font-bold text-gray-900">
          {displayValue} <span className="text-lg text-gray-600">{sizingData.unit}</span>
        </div>
      </div>
    </div>
  );
}

// Compact version for cards/lists
export function SizeDisplayCompact({ size, className = '' }: SizeDisplayProps) {
  const sizingData = parseToSizingData(size);

  if (sizingData.type === 'standard') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium ${className}`}>
        <span>👕</span>
        <span>{sizingData.standardSize}</span>
      </div>
    );
  }

  // Custom measurement (single or range)
  const displayValue = sizingData.customValueMax 
    ? `${sizingData.customValueMin}-${sizingData.customValueMax}`
    : sizingData.customValueMin;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium ${className}`}>
      <span>📏</span>
      <span>{displayValue} {sizingData.unit}</span>
    </div>
  );
}


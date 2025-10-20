'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';
import { SizingData, MeasurementUnit } from '@/types/measurements';

interface SizeInputSectionProps {
  value: SizingData;
  onChange: (value: SizingData) => void;
}

export function SizeInputSection({ value, onChange }: SizeInputSectionProps) {
  // Get current display value (single or range)
  const getCurrentDisplayValue = () => {
    // If customValueMax is defined (even if empty string), show with dash
    if (value.customValueMax !== undefined) {
      return `${value.customValueMin || ''}-${value.customValueMax}`;
    }
    return value.customValueMin || '';
  };

  const handleSizeTypeChange = (type: 'standard' | 'custom') => {
    if (type === 'standard') {
      onChange({
        type: 'standard',
        standardSize: 'M'
      });
    } else {
      onChange({
        type: 'custom',
        unit: 'cm',
        customValueMin: ''
      });
    }
  };

  const handleStandardSizeChange = (size: string) => {
    onChange({
      ...value,
      type: 'standard',
      standardSize: size as SizingData['standardSize']
    });
  };

  const handleUnitChange = (unit: MeasurementUnit) => {
    onChange({
      ...value,
      type: 'custom',
      unit,
      customValueMin: value.customValueMin || '',
      customValueMax: value.customValueMax
    });
  };

  const handleCustomValueChange = (inputValue: string) => {
    // Auto-detect if it's a range (contains dash)
    if (inputValue.includes('-')) {
      const parts = inputValue.split('-');
      const min = parts[0]?.trim() || '';
      const max = parts[1]?.trim(); // Keep as is, could be undefined or empty string
      
      onChange({
        ...value,
        type: 'custom',
        customValueMin: min,
        customValueMax: max, // Keep empty string to show dash in display
        unit: value.unit || 'cm'
      });
    } else {
      // Single value
      onChange({
        ...value,
        type: 'custom',
        customValueMin: inputValue,
        customValueMax: undefined,
        unit: value.unit || 'cm'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ruler className="h-5 w-5 mr-2" />
          Size & Measurements
        </CardTitle>
        <CardDescription>Choose standard size or enter custom measurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Size Type *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSizeTypeChange('standard')}
              className={`p-4 border-2 rounded-lg transition-all ${
                value.type === 'standard'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👕</div>
              <div className="font-medium">Standard Size</div>
              <div className="text-xs text-gray-600 mt-1">
                XS, S, M, L, XL, etc.
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleSizeTypeChange('custom')}
              className={`p-4 border-2 rounded-lg transition-all ${
                value.type === 'custom'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">📏</div>
              <div className="font-medium">Custom Size</div>
              <div className="text-xs text-gray-600 mt-1">
                Enter specific measurement
              </div>
            </button>
          </div>
        </div>

        {/* Standard Size Selection */}
        {value.type === 'standard' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Size *
            </label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleStandardSizeChange(size)}
                  className={`py-3 px-2 border-2 rounded-lg font-medium transition-all text-sm ${
                    value.standardSize === size
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Size Input */}
        {value.type === 'custom' && (
          <div className="space-y-4">
            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement Unit *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUnitChange('cm')}
                  className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                    value.unit === 'cm'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="text-base">Centimeters</div>
                  <div className="text-xs opacity-80">cm</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange('ft')}
                  className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                    value.unit === 'ft'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="text-base">Feet</div>
                  <div className="text-xs opacity-80">ft</div>
                </button>
              </div>
            </div>

            {/* Custom Value Input - Single Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Size *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={getCurrentDisplayValue()}
                  onChange={(e) => handleCustomValueChange(e.target.value)}
                  placeholder={value.unit === 'cm' ? 'e.g., 150 or 150-190' : 'e.g., 5.5 or 5.5-6.0'}
                  className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="text-xl font-bold text-gray-700 bg-gray-100 px-4 py-3 rounded-lg min-w-[60px] text-center">
                  {value.unit || 'cm'}
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-700">
                  <div className="font-semibold">💡 Auto-detects:</div>
                  {value.unit === 'cm' ? (
                    <>
                      <div className="mt-1">• Type <code className="bg-white px-1 py-0.5 rounded">150</code> for single size → 150cm</div>
                      <div className="mt-1">• Type <code className="bg-white px-1 py-0.5 rounded">150-190</code> for range → 150-190cm</div>
                    </>
                  ) : (
                    <>
                      <div className="mt-1">• Type <code className="bg-white px-1 py-0.5 rounded">5.5</code> for single size → 5.5ft</div>
                      <div className="mt-1">• Type <code className="bg-white px-1 py-0.5 rounded">5.5-6.0</code> for range → 5.5-6.0ft</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            {value.customValueMin && (
              <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Preview:</div>
                <div className="text-2xl font-bold text-primary">
                  {value.customValueMin}
                  {value.customValueMax && ` - ${value.customValueMax}`}
                  {' '}{value.unit}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {value.customValueMax 
                    ? '📏 Range size (fits multiple measurements)' 
                    : '📏 Single size (exact measurement)'}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


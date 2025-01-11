import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderControl({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  unit = '', 
  onChange 
}: SliderControlProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">{label} ({value}{unit})</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );
}
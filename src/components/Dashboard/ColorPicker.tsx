import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function ColorPicker({ label, value, onChange, onReset }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 cursor-pointer rounded-lg"
        />
        <span className="text-sm text-gray-600">{value}</span>
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Reset to default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
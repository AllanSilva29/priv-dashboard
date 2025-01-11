import React from 'react';

interface TextAreaControlProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextAreaControl({
  label,
  description,
  value,
  onChange,
  placeholder
}: TextAreaControlProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
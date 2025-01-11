import React from 'react';

interface AutoRotationProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function AutoRotation({ enabled, onChange }: AutoRotationProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">Auto Rotation</label>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        <span>Enable automatic background & quote rotation</span>
      </div>
    </div>
  );
}
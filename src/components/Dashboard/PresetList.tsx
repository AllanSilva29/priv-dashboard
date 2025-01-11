import React from 'react';
import { Upload, Edit2 } from 'lucide-react';
import { ConfigPreset } from '../../types';

interface PresetListProps {
  presets: ConfigPreset[];
  currentPresetId: string | null;
  onLoadPreset: (preset: ConfigPreset) => void;
  onEditPreset: (preset: ConfigPreset) => void;
}

export function PresetList({ presets, currentPresetId, onLoadPreset, onEditPreset }: PresetListProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">Configuration Presets</label>
      <div className="grid gap-2">
        {presets.map(preset => (
          <div
            key={preset.id}
            className={`w-full px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors ${
              preset.id === currentPresetId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{preset.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoadPreset(preset)}
                  className="p-1 hover:bg-blue-100 rounded-full text-blue-600"
                  title="Load Preset"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditPreset(preset)}
                  className="p-1 hover:bg-green-100 rounded-full text-green-600"
                  title="Update Preset"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last modified: {new Date(preset.lastModified).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
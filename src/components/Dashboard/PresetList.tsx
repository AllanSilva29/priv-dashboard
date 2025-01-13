import React from 'react';
import { Upload, Edit2, Download, Trash2 } from 'lucide-react';
import { ConfigPreset } from '../../types';

interface PresetListProps {
  presets: ConfigPreset[];
  currentPresetId: string | null;
  onLoadPreset: (preset: ConfigPreset) => void;
  onEditPreset: (preset: ConfigPreset) => void;
  onExportPreset: (preset: ConfigPreset) => void;
  onDeletePreset: (preset: ConfigPreset) => void;
}

export function PresetList({ 
  presets, 
  currentPresetId, 
  onLoadPreset, 
  onEditPreset,
  onExportPreset,
  onDeletePreset
}: PresetListProps) {
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
              <div>
                <span className="font-medium">{preset.name}</span>
                {preset.type === 'user' && (
                  <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    User Preset
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoadPreset(preset)}
                  className="p-1 hover:bg-blue-100 rounded-full text-blue-600"
                  title="Load Preset"
                >
                  <Upload className="w-4 h-4" />
                </button>
                {preset.type === 'user' && (
                  <>
                    <button
                      onClick={() => onEditPreset(preset)}
                      className="p-1 hover:bg-green-100 rounded-full text-green-600"
                      title="Edit Preset"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePreset(preset)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-600"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onExportPreset(preset)}
                  className="p-1 hover:bg-purple-100 rounded-full text-purple-600"
                  title="Export Preset"
                >
                  <Download className="w-4 h-4" />
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
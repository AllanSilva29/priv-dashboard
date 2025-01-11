import React from 'react';
import { Save, Download, X } from 'lucide-react';

interface HeaderProps {
  isModified: boolean;
  onSave: () => void;
  onExport: () => void;
  onClose: () => void;
}

export function Header({ isModified, onSave, onExport, onClose }: HeaderProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-xl font-semibold">Dashboard Settings</h2>
      <div className="flex gap-2">
        <button 
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        <button 
          onClick={onExport}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isModified 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isModified}
        >
          <Download className="w-4 h-4" />
          Export Config
        </button>
        <button 
          onClick={onClose} 
          className="hover:bg-gray-100 p-2 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
import React from 'react';
import { SkipForward, Play, Pause } from 'lucide-react';

interface ControlsProps {
  isRotationPaused: boolean;
  onRandomize: () => void;
  onToggleRotation: () => void;
}

export function Controls({ isRotationPaused, onRandomize, onToggleRotation }: ControlsProps) {
  return (
    <div className="absolute top-4 left-4 flex gap-2">
      <button
        onClick={onRandomize}
        className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
        title="Change Background & Quote"
      >
        <SkipForward className="w-6 h-6" />
      </button>
      
      <button
        onClick={onToggleRotation}
        className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
        title={isRotationPaused ? "Resume Rotation" : "Pause Rotation"}
      >
        {isRotationPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
      </button>
    </div>
  );
}
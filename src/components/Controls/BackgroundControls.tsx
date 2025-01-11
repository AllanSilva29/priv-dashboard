import React, { useState } from 'react';
import { LayoutTemplate, RotateCw, Repeat } from 'lucide-react';
import { useStore } from '../../store';

interface BackgroundControlsProps {
  sizeOptions: Array<{ label: string; value: string }>;
  rotationOptions: Array<{ label: string; value: number }>;
  repeatOptions: Array<{ label: string; value: string }>;
}

export function BackgroundControls({ sizeOptions, rotationOptions, repeatOptions }: BackgroundControlsProps) {
  const [isSizeOpen, setSizeOpen] = useState(false);
  const [isRotationOpen, setRotationOpen] = useState(false);
  const { currentBackground, setBackgroundConfig } = useStore();

  return (
    <div className="fixed top-4 right-16 flex gap-2">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={currentBackground.scale}
            onChange={(e) => setBackgroundConfig(currentBackground.id, { scale: parseFloat(e.target.value) })}
            className="slider"
          />
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setRotationOpen(!isRotationOpen)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          title="Background Rotation"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setSizeOpen(!isSizeOpen)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          title="Background Size"
        >
          <LayoutTemplate className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => {
            const currentIndex = repeatOptions.findIndex(option => option.value === currentBackground.repeat);
            const nextIndex = (currentIndex + 1) % repeatOptions.length;
            setBackgroundConfig(currentBackground.id, { repeat: repeatOptions[nextIndex].value });
          }}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          title={`Background Repeat: ${repeatOptions.find(option => option.value === currentBackground.repeat)?.label}`}
        >
          <Repeat className="w-6 h-6" />
        </button>
      </div>

      {isRotationOpen && (
        <div className="fixed top-16 right-4 w-32 bg-white rounded-lg shadow-lg py-1 z-50">
          {rotationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setBackgroundConfig(currentBackground.id, { rotation: option.value });
                setRotationOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                currentBackground.rotation === option.value ? 'bg-gray-100' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      {isSizeOpen && (
        <div className="fixed top-16 right-4 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {sizeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setBackgroundConfig(currentBackground.id, { size: option.value });
                setSizeOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                currentBackground.size === option.value ? 'bg-gray-100' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
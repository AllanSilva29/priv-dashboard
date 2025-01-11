import React from 'react';
import { useStore } from '../store';

interface BackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  const currentBackground = useStore(state => state.currentBackground);

  return (
    <div className="min-h-[200vh]">
      <div 
        className="fixed inset-0 bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentBackground.url})`,
          filter: `blur(${currentBackground.blur}px)`,
          transform: `scale(${currentBackground.scale}) rotate(${currentBackground.rotation}deg)`,
          backgroundSize: currentBackground.size,
          backgroundRepeat: currentBackground.repeat,
        }}
      />
      {children}
    </div>
  );
}
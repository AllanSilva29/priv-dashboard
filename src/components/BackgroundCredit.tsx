import React from 'react';
import { useStore } from '../store';

export function BackgroundCredit() {
  const background = useStore(state => state.currentBackground);
  
  return (
    <div className="fixed bottom-4 right-4 text-white/50 text-sm">
      {background.name}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';

export function Clock() {
  const [time, setTime] = useState(new Date());
  const timeColor = useStore(state => state.timeColor);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center" style={{ color: timeColor }}>
      <div className="text-8xl font-light tracking-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xl mt-2 opacity-80">
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
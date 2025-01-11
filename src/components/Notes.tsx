import React from 'react';

export function Notes() {
  return (
    <div className="relative min-h-screen flex items-center justify-center notes-section">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-4xl mx-auto p-8">
        <div className="text-white/90">
          <h2 className="text-3xl font-light mb-8 tracking-wide">Your Notes</h2>
          <div className="grid gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
              <p className="text-lg mb-2">Click to add your first note...</p>
              <p className="text-sm text-white/60">Your thoughts will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
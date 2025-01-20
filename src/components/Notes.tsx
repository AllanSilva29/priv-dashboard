import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronUp } from 'lucide-react';

export function Notes() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigationItems = [
    { text: 'Page 1', path: '/notes/page1' },
    { text: 'Page 2', path: '/notes/page2' },
    { text: 'Page 3', path: '/notes/page3' },
  ];

  const handleScrollToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerOpen(false);
    const homeSection = document.querySelector('.home-section');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen flex overflow-hidden">
      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="absolute left-4 top-4 z-50 text-white/90"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Drawer/Sidebar */}
      <div
        className={`absolute left-0 top-0 z-40 h-full w-64 transform bg-black/80 backdrop-blur-sm border-r border-white/20 transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-white/90"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navigationItems.map((item) => (
            <a
              key={item.text}
              href={item.path}
              className="block rounded-lg px-4 py-2 text-white/90 hover:bg-white/10 transition-colors"
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-transform duration-300 ${drawerOpen ? 'translate-x-64' : 'translate-x-0'}`}>
        <div className="relative h-screen flex items-center justify-center notes-section overflow-hidden">
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Home navigation button */}
          <button 
            onClick={handleScrollToHome}
            className="absolute top-4 -translate-x-1/2 text-white/80 hover:text-white transition-all duration-300 animate-bounce"
            aria-label="Scroll to notes"
          >
            <div className="flex flex-col items-center gap-2">
              <ChevronUp className="w-8 h-8" />
              <span className="text-sm font-light tracking-widest uppercase">Home</span>
            </div>
          </button>

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
      </div>
    </div>
  );
}
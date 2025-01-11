import React, { useState } from 'react';
import { Background } from './components/Background';
import { Layout } from './components/Layout';
import { Notes } from './components/Notes';
import { BackgroundCredit } from './components/BackgroundCredit';
import { Dashboard } from './components/Dashboard';
import { Controls } from './components/Dashboard/Controls';
import { BackgroundControls } from './components/Controls/BackgroundControls';
import { Settings } from 'lucide-react';
import { useStore } from './store';

const sizeOptions = [
  { label: 'Original Size', value: 'auto auto' },
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Stretch to Fit', value: '100% 100%' },
  { label: 'Full Width', value: '100% auto' },
  { label: 'Full Height', value: 'auto 100%' },
  { label: 'Half Size', value: '50% 50%' },
  { label: 'Half Width', value: '50% auto' },
  { label: 'Half Height', value: 'auto 50%' },
  { label: 'Double Size', value: '200% 200%' },
  { label: 'Default', value: 'initial' },
  { label: 'Inherit', value: 'inherit' },
];

const rotationOptions = [
  { label: '0°', value: 0 },
  { label: '90°', value: 90 },
  { label: '180°', value: 180 },
  { label: '270°', value: 270 },
];

const repeatOptions = [
  { label: 'No Repeat', value: 'no-repeat' },
  { label: 'Repeat', value: 'repeat' },
  { label: 'Repeat X', value: 'repeat-x' },
  { label: 'Repeat Y', value: 'repeat-y' },
];

export default function App() {
  const [items, setItems] = useState(['clock', 'quote']);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { randomizeBackground, randomizeQuote, isRotationPaused, setRotationPaused } = useStore();

  React.useEffect(() => {
    const init = async () => {
      await useStore.getState().initializeFromPreset();
      randomizeBackground();
      setIsLoading(false);
    };
    init();
  }, [randomizeBackground]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const scrollToNotes = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Background>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />

        <Controls
          isRotationPaused={isRotationPaused}
          onRandomize={() => {
            randomizeBackground();
            randomizeQuote();
          }}
          onToggleRotation={() => setRotationPaused(!isRotationPaused)}
        />
      
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="fixed top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
        >
          <Settings className="w-6 h-6" />
        </button>

        <Dashboard isOpen={isDashboardOpen} setIsOpen={setIsDashboardOpen} />
        <BackgroundCredit />

        <BackgroundControls
          sizeOptions={sizeOptions}
          rotationOptions={rotationOptions}
          repeatOptions={repeatOptions}
        />

        <Layout
          items={items}
          onDragEnd={handleDragEnd}
          onScrollToNotes={scrollToNotes}
        />
      </div>

      <Notes />

      <style>{`
        .slider {
          -webkit-appearance: none;
          width: 100px;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .slider:hover {
          opacity: 1;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </Background>
  );
}
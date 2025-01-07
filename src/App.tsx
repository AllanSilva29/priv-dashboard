import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Clock } from './components/Clock';
import { Quote } from './components/Quote';
import { Dashboard } from './components/Dashboard';
import { BackgroundCredit } from './components/BackgroundCredit';
import { DraggableItem } from './components/DraggableItem';
import { useStore } from './store';
import { LayoutTemplate, RotateCw, Repeat, Settings } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState(['clock', 'quote']);
  const { 
    currentBackground, 
    blur, 
    backgroundSize, 
    backgroundRotation, 
    backgroundRepeat, // Get backgroundRepeat from the store
    setBackgroundSize, 
    setBackgroundRotation, 
    setBackgroundRepeat, // Get setBackgroundRepeat from the store
    randomizeBackground,
    randomizeQuote,
    setBackgroundScale,
    rotationInterval,
    isRotationPaused
  } = useStore();
  const [isSizeOpen, setSizeOpen] = useState(false);
  const [isRotationOpen, setRotationOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // State for Dashboard visibility
  
  useEffect(() => {
    randomizeBackground();
  }, []);

  useEffect(() => {
    if (isRotationPaused) return;
    
    const interval = setInterval(() => {
      randomizeBackground();
      randomizeQuote();
    }, rotationInterval * 1000);

    return () => clearInterval(interval);
  }, [rotationInterval, isRotationPaused]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
  ];

  const renderComponent = (id: string) => {
    switch (id) {
      case 'clock':
        return <Clock />;
      case 'quote':
        return <Quote />;
      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentBackground.url})`,
          filter: `blur(${blur}px)`,
          transform: `scale(${currentBackground.scale}) rotate(${backgroundRotation}deg)`,
          backgroundSize: backgroundSize,
          backgroundRepeat: backgroundRepeat, // Use backgroundRepeat from the store
        }}
      />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Configuration Button */}
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="fixed top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
        >
          <Settings className="w-6 h-6" />
        </button>

        <Dashboard isOpen={isDashboardOpen} setIsOpen={setIsDashboardOpen} />
        <BackgroundCredit />

        {/* Buttons Container */}
        <div className="fixed top-4 right-16 flex gap-2">
          {/* Slider */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentBackground.scale}
                onChange={(e) => setBackgroundScale(currentBackground.id, parseFloat(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          {/* Rotation Button */}
          <div className="relative">
            <button
              onClick={() => setRotationOpen(!isRotationOpen)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
              title="Background Rotation"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>

          {/* Size Button */}
          <div className="relative">
            <button
              onClick={() => setSizeOpen(!isSizeOpen)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
              title="Background Size"
            >
              <LayoutTemplate className="w-6 h-6" />
            </button>
          </div>

          {/* Repeat Button */}
          <div className="relative">
            <button
              onClick={() => {
                const currentIndex = repeatOptions.findIndex(option => option.value === backgroundRepeat);
                const nextIndex = (currentIndex + 1) % repeatOptions.length;
                setBackgroundRepeat(repeatOptions[nextIndex].value); // Update backgroundRepeat in the store
              }}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
              title={`Background Repeat: ${repeatOptions.find(option => option.value === backgroundRepeat)?.label}`}
            >
              <Repeat className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Rotation Dropdown */}
        {isRotationOpen && (
          <div className="fixed top-16 right-4 w-32 bg-white rounded-lg shadow-lg py-1 z-50">
            {rotationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setBackgroundRotation(option.value);
                  setRotationOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  backgroundRotation === option.value ? 'bg-gray-100' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Size Dropdown */}
        {isSizeOpen && (
          <div className="fixed top-16 right-4 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setBackgroundSize(option.value);
                  setSizeOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  backgroundSize === option.value ? 'bg-gray-100' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative w-full max-w-4xl mx-auto p-8 space-y-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((id) => (
                <DraggableItem key={id} id={id}>
                  {renderComponent(id)}
                </DraggableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

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
    </>
  );
}
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Clock } from './Clock';
import { Quote } from './Quote';
import { DraggableItem } from './DraggableItem';
import { ChevronDown } from 'lucide-react';

interface LayoutProps {
  items: string[];
  onDragEnd: (event: any) => void;
  onScrollToNotes: () => void;
}

export function Layout({ items, onDragEnd, onScrollToNotes }: LayoutProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleScrollToNotes = (e: React.MouseEvent) => {
    e.preventDefault();
    const notesSection = document.querySelector('.notes-section');
    if (notesSection) {
      notesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <div className="relative w-full max-w-4xl mx-auto p-8 space-y-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
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

      <button 
        onClick={handleScrollToNotes}
        className="absolute bottom-8 -translate-x-1/2 text-white/80 hover:text-white transition-all duration-300 animate-bounce"
        aria-label="Scroll to notes"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-light tracking-widest uppercase">Notes</span>
          <ChevronDown className="w-8 h-8" />
        </div>
      </button>
    </>
  );
}
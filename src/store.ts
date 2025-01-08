import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Quote, Background } from './types';

const defaultQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

const defaultBackgrounds = [
  { 
    id: "550e8400-e29b-41d4-a716-446655440000",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    name: "Mountain Sunrise",
    scale: 1.1,
    rotation: 0,
    size: 'cover',
    repeat: 'no-repeat',
    blur: 0
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
    name: "Forest Valley",
    scale: 1.1,
    rotation: 0,
    size: 'cover',
    repeat: 'no-repeat',
    blur: 0
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    name: "Tropical Beach",
    scale: 1.1,
    rotation: 0,
    size: 'cover',
    repeat: 'no-repeat',
    blur: 0
  }
];

interface Store extends Settings {
  currentBackground: Background;
  rotationInterval: number;
  isRotationPaused: boolean;
  setTimeColor: (color: string) => void;
  setQuoteColor: (color: string) => void;
  setBackgroundConfig: (id: string, config: Partial<Background>) => void;
  setRotationInterval: (interval: number) => void;
  setRotationPaused: (paused: boolean) => void;
  setQuotes: (quotesText: string) => void;
  setBackgrounds: (backgroundsText: string) => void;
  randomizeBackground: () => void;
  randomizeQuote: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      timeColor: '#ffffff',
      quoteColor: '#ffffff',
      quotes: defaultQuotes,
      backgrounds: defaultBackgrounds,
      currentBackground: defaultBackgrounds[0],
      rotationInterval: 30,
      isRotationPaused: false,

      setTimeColor: (color) => set({ timeColor: color }),
      setQuoteColor: (color) => set({ quoteColor: color }),
      
      setBackgroundConfig: (id, config) => set((state) => {
        const updatedBackgrounds = state.backgrounds.map(bg => 
          bg.id === id ? { ...bg, ...config } : bg
        );
        
        return {
          backgrounds: updatedBackgrounds,
          currentBackground: state.currentBackground.id === id 
            ? { ...state.currentBackground, ...config }
            : state.currentBackground
        };
      }),

      setRotationInterval: (interval) => set({ rotationInterval: interval }),
      setRotationPaused: (paused) => set({ isRotationPaused: paused }),
      
      setQuotes: (quotesText) => {
        const quotes = quotesText.split('\n\n').map(block => {
          const [text, author] = block.split('\n');
          return { text: text.trim(), author: author.trim() };
        }).filter(q => q.text && q.author);
        set({ quotes });
      },
      
      setBackgrounds: (backgroundsText) => {
        const backgrounds = backgroundsText.split('\n\n').map(block => {
          const [url, name] = block.split('\n');
          return { 
            id: crypto.randomUUID(),
            url: url.trim(), 
            name: name.trim(),
            scale: 1.1,
            rotation: 0,
            size: 'cover',
            repeat: 'no-repeat',
            blur: 0
          };
        }).filter(b => b.url && b.name);
        set({ backgrounds });
      },
      
      randomizeBackground: () => set((state) => ({
        currentBackground: state.backgrounds[Math.floor(Math.random() * state.backgrounds.length)]
      })),

      randomizeQuote: () => set((state) => ({
        quotes: [
          ...state.quotes.slice(1),
          state.quotes[0]
        ]
      }))
    }),
    {
      name: 'dashboard-storage'
    }
  )
);
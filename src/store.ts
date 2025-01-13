import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConfigState, Settings, Background, ConfigPreset } from './types';
import { loadPresets, saveUserPreset, updateUserPreset } from './utils/config';

const defaultSettings: Settings = {
  timeColor: '#ffffff',
  quoteColor: '#ffffff',
  quotes: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
  ],
  backgrounds: [
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
  ],
  rotationInterval: 30,
  isRotationPaused: false
};

interface Store extends ConfigState {
  setTimeColor: (color: string) => void;
  setQuoteColor: (color: string) => void;
  setBackgroundConfig: (id: string, config: Partial<Background>) => void;
  setRotationInterval: (interval: number) => void;
  setRotationPaused: (paused: boolean) => void;
  setQuotes: (quotesText: string) => void;
  setBackgrounds: (backgroundsText: string) => void;
  randomizeBackground: () => void;
  randomizeQuote: () => void;
  loadPreset: (preset: ConfigPreset) => void;
  markAsModified: () => void;
  resetModifiedState: () => void;
  initializeFromPreset: () => Promise<void>;
  saveCurrentState: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      currentBackground: defaultSettings.backgrounds[0],
      isModified: false,
      currentPresetId: null,

      initializeFromPreset: async () => {
        try {
          const presets = await loadPresets();
          if (presets.length > 0) {
            const defaultPreset = presets[0];
            const settings = {
              ...defaultSettings,
              ...defaultPreset.settings,
              quotes: defaultPreset.settings.quotes?.length > 0 
                ? defaultPreset.settings.quotes 
                : defaultSettings.quotes,
              backgrounds: defaultPreset.settings.backgrounds?.length > 0 
                ? defaultPreset.settings.backgrounds.map(bg => ({
                    ...bg,
                    scale: bg.scale ?? 1.1,
                    rotation: bg.rotation ?? 0,
                    size: bg.size ?? 'cover',
                    repeat: bg.repeat ?? 'no-repeat',
                    blur: bg.blur ?? 0
                  }))
                : defaultSettings.backgrounds,
            };
            
            set({
              ...settings,
              currentBackground: settings.backgrounds[0],
              currentPresetId: defaultPreset.id,
              isModified: false
            });
          }
        } catch (error) {
          console.error('Failed to load initial preset:', error);
          set({
            ...defaultSettings,
            currentBackground: defaultSettings.backgrounds[0],
            isModified: false,
            currentPresetId: null
          });
        }
      },

      setTimeColor: (color) => {
        set(state => {
          const newState = { ...state, timeColor: color, isModified: true };
          if (state.currentPresetId) {
            updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
          }
          return newState;
        });
      },

      setQuoteColor: (color) => {
        set(state => {
          const newState = { ...state, quoteColor: color, isModified: true };
          if (state.currentPresetId) {
            updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
          }
          return newState;
        });
      },
      
      setBackgroundConfig: (id, config) => {
        set(state => {
          const updatedBackgrounds = state.backgrounds.map(bg => 
            bg.id === id ? { ...bg, ...config } : bg
          );
          
          const newState = {
            backgrounds: updatedBackgrounds,
            currentBackground: state.currentBackground.id === id 
              ? { ...state.currentBackground, ...config }
              : state.currentBackground,
            isModified: true
          };

          if (state.currentPresetId) {
            updateUserPreset(state.currentPresetId, state.name || 'Untitled', {
              ...state,
              ...newState
            });
          }

          return newState;
        });
      },

      setRotationInterval: (interval) => {
        set(state => {
          const newState = { ...state, rotationInterval: interval, isModified: true };
          if (state.currentPresetId) {
            updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
          }
          return newState;
        });
      },

      setRotationPaused: (paused) => {
        set(state => {
          const newState = { ...state, isRotationPaused: paused, isModified: true };
          if (state.currentPresetId) {
            updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
          }
          return newState;
        });
      },
      
      setQuotes: (quotesText) => {
        set(state => {
          if (typeof quotesText !== 'string') {
            return state;
          }

          try {
            const quotes = quotesText
              .split('\n\n')
              .map(block => {
                const lines = block.split('\n');
                if (lines.length < 2) return null;
                return {
                  text: lines[0].trim(),
                  author: lines[1].trim()
                };
              })
              .filter((q): q is NonNullable<typeof q> => 
                q !== null && Boolean(q.text) && Boolean(q.author)
              );

            if (quotes.length === 0) return state;

            const newState = { ...state, quotes, isModified: true };
            if (state.currentPresetId) {
              updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
            }
            return newState;
          } catch (error) {
            return state;
          }
        });
      },
      
      setBackgrounds: (backgroundsText) => {
        set(state => {
          if (typeof backgroundsText !== 'string') {
            return state;
          }

          try {
            const newBackgrounds = backgroundsText
              .split('\n\n')
              .map(block => {
                const lines = block.split('\n');
                if (lines.length < 2) return null;
                return { 
                  id: crypto.randomUUID(),
                  url: lines[0].trim(),
                  name: lines[1].trim(),
                  scale: 1.1,
                  rotation: 0,
                  size: 'cover',
                  repeat: 'no-repeat',
                  blur: 0
                };
              })
              .filter((b): b is NonNullable<typeof b> => 
                b !== null && Boolean(b.url) && Boolean(b.name)
              );

            if (newBackgrounds.length === 0) {
              return state;
            }

            const updatedBackgrounds = newBackgrounds.map(newBg => {
              const existingBg = state.backgrounds.find(bg => 
                bg.url === newBg.url && bg.name === newBg.name
              );
              return existingBg ? { ...newBg, ...existingBg } : newBg;
            });

            const newState = { 
              ...state,
              backgrounds: updatedBackgrounds, 
              currentBackground: updatedBackgrounds[0],
              isModified: true 
            };

            if (state.currentPresetId) {
              updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
            }

            return newState;
          } catch (error) {
            return state;
          }
        });
      },
      
      randomizeBackground: () => set((state) => {
        if (state.backgrounds.length === 0) return state;
        const newBackground = state.backgrounds[Math.floor(Math.random() * state.backgrounds.length)];
        return { currentBackground: newBackground };
      }),

      randomizeQuote: () => set((state) => {
        if (state.quotes.length === 0) return state;
        return {
          quotes: [
            ...state.quotes.slice(1),
            state.quotes[0]
          ]
        };
      }),

      loadPreset: (preset) => {
        const settings = {
          ...defaultSettings,
          ...preset.settings,
          quotes: preset.settings.quotes?.length > 0 
            ? preset.settings.quotes 
            : defaultSettings.quotes,
          backgrounds: preset.settings.backgrounds?.length > 0 
            ? preset.settings.backgrounds.map(bg => ({
                ...bg,
                scale: bg.scale ?? 1.1,
                rotation: bg.rotation ?? 0,
                size: bg.size ?? 'cover',
                repeat: bg.repeat ?? 'no-repeat',
                blur: bg.blur ?? 0
              }))
            : defaultSettings.backgrounds,
        };

        set({
          ...settings,
          currentBackground: settings.backgrounds[0],
          currentPresetId: preset.id,
          isModified: false
        });
      },

      markAsModified: () => set(state => {
        const newState = { ...state, isModified: true };
        if (state.currentPresetId) {
          updateUserPreset(state.currentPresetId, state.name || 'Untitled', newState);
        }
        return newState;
      }),

      resetModifiedState: () => set({ isModified: false }),

      saveCurrentState: () => {
        const state = get();
        if (state.currentPresetId) {
          updateUserPreset(state.currentPresetId, state.name || 'Untitled', state);
        }
      }
    }),
    {
      name: 'dashboard-storage'
    }
  )
);

// Initialize the store with the default preset
useStore.getState().initializeFromPreset();
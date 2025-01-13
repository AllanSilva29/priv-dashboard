import { ConfigPreset, Settings } from '../types';

const USER_PRESETS_KEY = 'user-presets';

export async function loadPresets(): Promise<ConfigPreset[]> {
  try {
    // Load premade presets
    const premadePresets: ConfigPreset[] = [];
    const files = await Promise.all(
      Object.entries(import.meta.glob('../saves/*.json', { eager: true }))
        .map(([_, module]) => {
          const preset = module as ConfigPreset;
          return { ...preset, type: 'premade' as const };
        })
    );
    premadePresets.push(...files);

    // Load user presets from localStorage
    const userPresetsJson = localStorage.getItem(USER_PRESETS_KEY);
    let userPresets: ConfigPreset[] = [];
    
    if (userPresetsJson) {
      try {
        const parsed = JSON.parse(userPresetsJson);
        userPresets = Array.isArray(parsed) ? parsed.map(preset => ({
          ...preset,
          settings: {
            ...preset.settings,
            backgrounds: preset.settings.backgrounds.map(bg => ({
              ...bg,
              scale: bg.scale ?? 1.1,
              rotation: bg.rotation ?? 0,
              size: bg.size ?? 'cover',
              repeat: bg.repeat ?? 'no-repeat',
              blur: bg.blur ?? 0
            }))
          },
          type: 'user' as const
        })) : [];
      } catch (e) {
        console.error('Error parsing user presets:', e);
        localStorage.removeItem(USER_PRESETS_KEY);
      }
    }

    // Combine and sort all presets by last modified date
    const allPresets = [...premadePresets, ...userPresets];
    return allPresets.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  } catch (error) {
    console.error('Error loading presets:', error);
    return [];
  }
}

export function saveUserPreset(name: string, settings: Settings): ConfigPreset {
  // Create a new preset with the current settings
  const preset: ConfigPreset = {
    id: crypto.randomUUID(),
    name,
    settings: {
      ...settings,
      backgrounds: settings.backgrounds.map(bg => ({
        ...bg,
        id: bg.id || crypto.randomUUID(), // Preserve existing IDs or create new ones
        scale: bg.scale,
        rotation: bg.rotation,
        size: bg.size,
        repeat: bg.repeat,
        blur: bg.blur
      }))
    },
    lastModified: new Date().toISOString(),
    type: 'user'
  };

  // Get existing user presets
  const userPresetsJson = localStorage.getItem(USER_PRESETS_KEY);
  let userPresets: ConfigPreset[] = [];
  
  try {
    userPresets = userPresetsJson ? JSON.parse(userPresetsJson) : [];
    if (!Array.isArray(userPresets)) userPresets = [];
  } catch (e) {
    console.error('Error parsing existing user presets:', e);
  }

  // Add new preset
  userPresets.push(preset);

  // Save back to localStorage
  localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets));

  return preset;
}

export function updateUserPreset(id: string, name: string, settings: Settings): void {
  // Get existing user presets
  const userPresetsJson = localStorage.getItem(USER_PRESETS_KEY);
  let userPresets: ConfigPreset[] = [];
  
  try {
    userPresets = userPresetsJson ? JSON.parse(userPresetsJson) : [];
    if (!Array.isArray(userPresets)) userPresets = [];
  } catch (e) {
    console.error('Error parsing user presets for update:', e);
  }

  // Find and update the preset
  const updatedPresets = userPresets.map(preset => {
    if (preset.id === id) {
      return {
        ...preset,
        name,
        settings: {
          ...settings,
          backgrounds: settings.backgrounds.map(bg => ({
            ...bg,
            id: bg.id || crypto.randomUUID(),
            scale: bg.scale,
            rotation: bg.rotation,
            size: bg.size,
            repeat: bg.repeat,
            blur: bg.blur
          }))
        },
        lastModified: new Date().toISOString()
      };
    }
    return preset;
  });

  // Save back to localStorage
  localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(updatedPresets));
}

export function deleteUserPreset(id: string): void {
  // Get existing user presets
  const userPresetsJson = localStorage.getItem(USER_PRESETS_KEY);
  let userPresets: ConfigPreset[] = [];
  
  try {
    userPresets = userPresetsJson ? JSON.parse(userPresetsJson) : [];
    if (!Array.isArray(userPresets)) userPresets = [];
  } catch (e) {
    console.error('Error parsing user presets for deletion:', e);
    return;
  }

  // Filter out the preset to delete
  const updatedPresets = userPresets.filter(preset => preset.id !== id);

  // Save back to localStorage
  localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(updatedPresets));
}

export function exportPreset(preset: ConfigPreset): void {
  const content = JSON.stringify(preset, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${preset.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
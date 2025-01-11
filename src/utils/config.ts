import { ConfigPreset, Settings } from '../types';

export async function loadPresets(): Promise<ConfigPreset[]> {
  try {
    const presets: ConfigPreset[] = [];
    const files = import.meta.glob('../saves/*.json', { eager: true });
    
    for (const path in files) {
      const preset = files[path] as ConfigPreset;
      presets.push(preset);
    }
    
    return presets.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  } catch (error) {
    console.error('Error loading presets:', error);
    return [];
  }
}

export function savePreset(name: string, settings: Settings): void {
  const preset: ConfigPreset = {
    id: crypto.randomUUID(),
    name,
    settings,
    lastModified: new Date().toISOString()
  };

  const content = JSON.stringify(preset, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
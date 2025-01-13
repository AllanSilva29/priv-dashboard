import { Settings } from './types';

export interface Quote {
  text: string;
  author: string;
}

export interface Background {
  id: string;
  url: string;
  name: string;
  scale: number;
  rotation: number;
  size: string;
  repeat: string;
  blur: number;
}

export interface Settings {
  timeColor: string;
  quoteColor: string;
  quotes: Quote[];
  backgrounds: Background[];
  rotationInterval: number;
  isRotationPaused: boolean;
}

export interface ConfigPreset {
  id: string;
  name: string;
  settings: Settings;
  lastModified: string;
  type: 'user' | 'premade';
}

export interface ConfigState extends Settings {
  currentBackground: Background;
  isModified: boolean;
  currentPresetId: string | null;
}
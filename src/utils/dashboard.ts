import { Quote, Background, Settings } from '../types';

// Text parsing utilities
export function parseQuotesText(text: string): Quote[] {
  return text
    .split('\n\n')
    .map(block => {
      const [text, author] = block.split('\n');
      return { text: text?.trim(), author: author?.trim() };
    })
    .filter((q): q is Quote => Boolean(q.text && q.author));
}

export function parseBackgroundsText(text: string): Background[] {
  return text
    .split('\n\n')
    .map(block => {
      const [url, name] = block.split('\n');
      return {
        id: crypto.randomUUID(),
        url: url?.trim(),
        name: name?.trim(),
        scale: 1.1,
        rotation: 0,
        size: 'cover',
        repeat: 'no-repeat',
        blur: 0
      };
    })
    .filter((b): b is Background => Boolean(b.url && b.name));
}

// Text formatting utilities
export function formatQuotesText(quotes: Quote[]): string {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return '';
  }
  return quotes.map(q => `${q.text}\n${q.author}`).join('\n\n');
}

export function formatBackgroundsText(backgrounds: Background[]): string {
  if (!Array.isArray(backgrounds) || backgrounds.length === 0) {
    return '';
  }
  return backgrounds.map(b => `${b.url}\n${b.name}`).join('\n\n');
}

// State management utilities
export interface DashboardState {
  quotesText: string;
  backgroundsText: string;
  timeColor: string;
  quoteColor: string;
  rotationInterval: number;
  isRotationPaused: boolean;
}

export function createInitialState(settings: Settings): DashboardState {
  return {
    quotesText: settings.quotes ? formatQuotesText(settings.quotes) : '',
    backgroundsText: settings.backgrounds ? formatBackgroundsText(settings.backgrounds) : '',
    timeColor: settings.timeColor || '#ffffff',
    quoteColor: settings.quoteColor || '#ffffff',
    rotationInterval: settings.rotationInterval || 30,
    isRotationPaused: settings.isRotationPaused || false
  };
}

export function createSettingsFromState(state: DashboardState): Settings {
  return {
    timeColor: state.timeColor,
    quoteColor: state.quoteColor,
    quotes: parseQuotesText(state.quotesText),
    backgrounds: parseBackgroundsText(state.backgroundsText),
    rotationInterval: state.rotationInterval,
    isRotationPaused: state.isRotationPaused
  };
}
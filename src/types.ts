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
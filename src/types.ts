export interface Quote {
  text: string;
  author: string;
}

export interface Background {
  id: string;
  url: string;
  name: string;
  scale: number;
}

export interface Settings {
  timeColor: string;
  quoteColor: string;
  blur: number;
  quotes: Quote[];
  backgrounds: Background[];
  backgroundSize: string;
  backgroundRotation: number;
  rotationInterval: number;
  isRotationPaused: boolean;
}
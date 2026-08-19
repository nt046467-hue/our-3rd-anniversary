export interface RingMemoryItem {
  id: number;
  src: string;
  caption: string;
  category: 'photo' | 'video';
  type?: 'video';
  note: string;
  bgColor?: string;
}

export interface CarouselSettings {
  autoRotate: boolean;
  speed: number;
  radius: number;
  cardWidth: number;
  cardHeight: number;
  tiltAngle: number;
  perspective: number;
  dofEnabled: boolean;
  dofBlurMax: number;
  dofOpacityMin: number;
  snapToNearest: boolean;
  damping: number;
  soundEnabled: boolean;
  orientationMode: 'cylinder' | 'billboard';
  interactiveParallax: boolean;
  ambientGlow: boolean;
}

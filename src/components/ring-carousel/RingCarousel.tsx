import React, { useState, useEffect } from 'react';
import { RingMemoryItem, CarouselSettings } from './types';
import { useCarouselPhysics } from './useCarouselPhysics';
import { CarouselStage } from './CarouselStage';

const getResponsiveSettings = (): CarouselSettings => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const isVerySmall = width < 380;
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  return {
    autoRotate: true,
    speed: 8,
    radius: isVerySmall ? 220 : isMobile ? 260 : isTablet ? 340 : 420,
    cardWidth: isVerySmall ? 120 : isMobile ? 145 : isTablet ? 175 : 200,
    cardHeight: isVerySmall ? 165 : isMobile ? 200 : isTablet ? 240 : 275,
    tiltAngle: isVerySmall ? 10 : isMobile ? 12 : 14,
    perspective: isVerySmall ? 900 : isMobile ? 1000 : 1400,
    dofEnabled: true,
    dofBlurMax: 10,
    dofOpacityMin: 0.65,
    snapToNearest: false,
    damping: 0.988,
    soundEnabled: false,
    orientationMode: 'cylinder',
    interactiveParallax: false,
    ambientGlow: true,
  };
};

interface RingCarouselProps {
  memories: RingMemoryItem[];
  onSelectMemory: (memory: any) => void;
}

export const RingCarousel: React.FC<RingCarouselProps> = ({ memories, onSelectMemory }) => {
  const [settings, setSettings] = useState<CarouselSettings>(getResponsiveSettings);

  useEffect(() => {
    const handleResize = () => {
      setSettings(getResponsiveSettings());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    angle, activeCardIndex, isInteracting, mouseParallax, setIsHovered,
    rotateToCard, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel,
  } = useCarouselPhysics(memories.length, settings);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'visible', userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: `${settings.cardWidth < 130 ? '12px' : '24px'} 0` }}>
      <CarouselStage
        cards={memories}
        settings={settings}
        angle={angle}
        activeCardIndex={activeCardIndex}
        isInteracting={isInteracting}
        mouseParallax={mouseParallax}
        onSelectCard={(idx) => {
          if (idx === activeCardIndex) {
            onSelectMemory(memories[idx]);
          } else {
            rotateToCard(idx);
          }
        }}
        onInspectCard={(card) => onSelectMemory(card)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
};

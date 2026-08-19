import React, { useRef } from 'react';
import { RingMemoryItem, CarouselSettings } from './types';
import { CarouselCard } from './CarouselCard';

interface Props {
  cards: RingMemoryItem[];
  settings: CarouselSettings;
  angle: number;
  activeCardIndex: number;
  isInteracting: boolean;
  mouseParallax: { x: number; y: number };
  onSelectCard: (index: number) => void;
  onInspectCard: (card: RingMemoryItem) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CarouselStage: React.FC<Props> = ({
  cards, settings, angle, activeCardIndex, isInteracting, mouseParallax,
  onSelectCard, onInspectCard, onPointerDown, onPointerMove, onPointerUp, onWheel, onMouseEnter, onMouseLeave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = settings.cardHeight < 210;
  const isTablet = settings.cardHeight >= 210 && settings.cardHeight < 260;
  const stageHeight = isMobile ? 380 : isTablet ? 470 : 540;
  const currentPitch = -Math.abs(settings.tiltAngle);
  const currentYaw = 0;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', width: '100%',
        height: `${stageHeight}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'grab', overflow: 'visible', userSelect: 'none',
        touchAction: 'pan-y', margin: '8px auto',
        perspective: `${settings.perspective}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Warm ambient glow */}
      {settings.ambientGlow && (
        <div style={{
          position: 'absolute',
          width: isMobile ? '320px' : '600px',
          height: isMobile ? '180px' : '420px',
          borderRadius: '50%',
          filter: `blur(${isMobile ? '100px' : '140px'})`, opacity: 0.25, pointerEvents: 'none',
          background: 'radial-gradient(ellipse, #E4A6B1 0%, #D9B46B 60%, transparent 100%)',
          transform: 'translateY(-10%)', zIndex: -1,
        }} />
      )}

      {/* 3D Cylinder anchor */}
      <div style={{
        position: 'absolute', left: '50%', top: '46%', width: 0, height: 0,
        transformStyle: 'preserve-3d' as const, willChange: 'transform',
        transform: `translate(-50%, -50%) rotateX(${currentPitch}deg) rotateY(${currentYaw}deg)`,
        transition: isInteracting ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
      }}>
        {cards.map((card, idx) => (
          <CarouselCard
            key={card.id}
            card={card}
            index={idx}
            totalCards={cards.length}
            carouselAngle={angle}
            settings={settings}
            isActive={idx === activeCardIndex}
            onSelect={onSelectCard}
            onInspect={onInspectCard}
          />
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { RingMemoryItem, CarouselSettings } from './types';
import ProtectedImage from '../ProtectedImage';
import ProtectedVideo from '../ProtectedVideo';

interface Props {
  card: RingMemoryItem;
  index: number;
  totalCards: number;
  carouselAngle: number;
  settings: CarouselSettings;
  isActive: boolean;
  onSelect: (index: number) => void;
  onInspect?: (card: RingMemoryItem) => void;
}

export const CarouselCard: React.FC<Props> = ({
  card, index, totalCards, carouselAngle, settings, isActive, onSelect, onInspect,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const isCompact = settings.cardWidth < 125;

  const stepAngle = 360 / Math.max(1, totalCards);
  // Use a continuous angle to prevent 360-degree flip glitches during CSS transitions
  const continuousAngle = carouselAngle + index * stepAngle;
  const rad = (continuousAngle * Math.PI) / 180;

  const x = Math.sin(rad) * settings.radius;
  const z = Math.cos(rad) * settings.radius;
  const depthFactor = (1 - Math.cos(rad)) / 2;
  const blurPx = 0;
  const scale = isTouched ? 1.06 : 1.0;
  const opacity = 1 - depthFactor * 0.35;
  const zIndex = Math.round((1 - depthFactor) * 1000) + (isTouched ? 100 : 0);
  const cardRotateY = settings.orientationMode === 'cylinder' ? continuousAngle : 0;

  const handleTouchStart = () => {
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
  };

  return (
    <div
      onClick={() => {
        if (isActive) {
          onInspect?.(card);
        } else {
          onSelect(index);
        }
      }}
      onDoubleClick={(e) => { e.stopPropagation(); onInspect?.(card); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: `${settings.cardWidth}px`, height: `${settings.cardHeight}px`,
        transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${cardRotateY}deg) scale(${scale})`,
        zIndex,
        transformStyle: 'preserve-3d' as const,
        cursor: 'pointer', userSelect: 'none' as const,
        willChange: 'transform',
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease',
      }}
    >
      {/* 3D Card Container with preserve-3d */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d' as const,
      }}>
        {/* FRONT FACE (Facing 0deg) */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: isCompact ? '14px' : '18px', padding: isCompact ? '5px' : '8px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between',
          backgroundColor: '#FFFDF8',
          backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
          border: isActive || isTouched ? '1.5px solid #E4A6B1' : '1px solid #F2DFE2',
          boxShadow: isActive || isTouched
            ? '0 20px 48px -6px rgba(168, 43, 62, 0.4), 0 8px 24px rgba(228, 166, 177, 0.3)'
            : '0 12px 30px -8px rgba(168, 43, 62, 0.15), 0 4px 12px rgba(0,0,0,0.04)',
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
          opacity,
          filter: blurPx > 0.4 ? `blur(${blurPx.toFixed(1)}px)` : 'none',
          transition: 'all 0.25s ease',
        }}>
          {/* Tape strip */}
          <div style={{
            position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
            width: isCompact ? '34px' : '45px', height: isCompact ? '11px' : '14px', 
            background: 'rgba(242, 200, 205, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 2px 4px rgba(168, 43, 62, 0.08)',
            backdropFilter: 'blur(2px)',
            borderRadius: '2px', zIndex: 10, pointerEvents: 'none' as const,
          }} />

          {/* Media frame */}
          <div style={{
            position: 'relative', width: '100%', flex: 1,
            borderRadius: isCompact ? '9px' : '12px', overflow: 'hidden', background: '#F5EFE6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {card.type === 'video' ? (
              <>
                <ProtectedVideo src={card.src} muted loop playsInline preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                }}>
                  <span style={{
                    width: isCompact ? '26px' : '32px', height: isCompact ? '26px' : '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A82B3E', fontSize: isCompact ? '10px' : '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}>▶</span>
                </div>
              </>
            ) : (
              <>
                <ProtectedImage src={card.src} alt="" fit="cover" aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px) brightness(0.9)', transform: 'scale(1.15)' }}
                />
                <ProtectedImage src={card.src} alt={card.caption} fit="cover" letterbox
                  style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </>
            )}
          </div>

          {/* Polaroid Footer */}
          <div style={{
            paddingTop: isCompact ? '3px' : '6px',
            paddingBottom: isCompact ? '1px' : '2px',
            paddingLeft: isCompact ? '2px' : '4px',
            paddingRight: isCompact ? '2px' : '4px',
            display: 'flex',
            alignItems: 'center',
            gap: isCompact ? '3px' : '5px',
            pointerEvents: 'none' as const,
          }}>
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: isCompact ? '8px' : '10px',
              color: '#D49A9F',
              fontWeight: 600,
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}>
              {String(card.id).padStart(2, '0')}
            </span>
            <span style={{ color: '#A82B3E', fontSize: isCompact ? '8px' : '10px', flexShrink: 0, marginTop: '1px' }}>♥</span>
            <p style={{
              margin: 0,
              fontSize: isCompact ? '9.5px' : '11.5px',
              fontFamily: 'Fraunces, serif',
              color: '#5C3A41',
              fontStyle: 'italic',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' as const,
              flex: 1,
            }}>
              {card.caption}
            </p>
            {card.type === 'video' && (
              <span style={{ fontSize: '10px', color: '#A82B3E', flexShrink: 0 }}>▶</span>
            )}
          </div>
        </div>

        {/* BACK FACE (Rotated 180deg to show the un-mirrored real image on the back) */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: isCompact ? '14px' : '18px', padding: isCompact ? '5px' : '8px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between',
          backgroundColor: '#FFFDF8',
          backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
          border: isActive || isTouched ? '1.5px solid #E4A6B1' : '1px solid #F2DFE2',
          boxShadow: isActive || isTouched
            ? '0 20px 48px -6px rgba(168, 43, 62, 0.4), 0 8px 24px rgba(228, 166, 177, 0.3)'
            : '0 12px 30px -8px rgba(168, 43, 62, 0.15), 0 4px 12px rgba(0,0,0,0.04)',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
          opacity,
          filter: blurPx > 0.4 ? `blur(${blurPx.toFixed(1)}px)` : 'none',
          transition: 'all 0.25s ease',
        }}>
          {/* Tape strip */}
          <div style={{
            position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
            width: isCompact ? '34px' : '45px', height: isCompact ? '11px' : '14px', 
            background: 'rgba(242, 200, 205, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 2px 4px rgba(168, 43, 62, 0.08)',
            backdropFilter: 'blur(2px)',
            borderRadius: '2px', zIndex: 10, pointerEvents: 'none' as const,
          }} />

          {/* Media frame */}
          <div style={{
            position: 'relative', width: '100%', flex: 1,
            borderRadius: isCompact ? '9px' : '12px', overflow: 'hidden', background: '#F5EFE6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {card.type === 'video' ? (
              <>
                <ProtectedVideo src={card.src} muted loop playsInline preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                }}>
                  <span style={{
                    width: isCompact ? '26px' : '32px', height: isCompact ? '26px' : '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A82B3E', fontSize: isCompact ? '10px' : '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}>▶</span>
                </div>
              </>
            ) : (
              <>
                <ProtectedImage src={card.src} alt="" fit="cover" aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px) brightness(0.9)', transform: 'scale(1.15)' }}
                />
                <ProtectedImage src={card.src} alt={card.caption} fit="cover" letterbox
                  style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </>
            )}
          </div>

          {/* Polaroid Footer */}
          <div style={{
            paddingTop: isCompact ? '3px' : '6px',
            paddingBottom: isCompact ? '1px' : '2px',
            paddingLeft: isCompact ? '2px' : '4px',
            paddingRight: isCompact ? '2px' : '4px',
            display: 'flex',
            alignItems: 'center',
            gap: isCompact ? '3px' : '5px',
            pointerEvents: 'none' as const,
          }}>
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: isCompact ? '8px' : '10px',
              color: '#D49A9F',
              fontWeight: 600,
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}>
              {String(card.id).padStart(2, '0')}
            </span>
            <span style={{ color: '#A82B3E', fontSize: isCompact ? '8px' : '10px', flexShrink: 0, marginTop: '1px' }}>♥</span>
            <p style={{
              margin: 0,
              fontSize: isCompact ? '9.5px' : '11.5px',
              fontFamily: 'Fraunces, serif',
              color: '#5C3A41',
              fontStyle: 'italic',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' as const,
              flex: 1,
            }}>
              {card.caption}
            </p>
            {card.type === 'video' && (
              <span style={{ fontSize: isCompact ? '8px' : '10px', color: '#A82B3E', flexShrink: 0 }}>▶</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

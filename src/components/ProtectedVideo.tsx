import { useRef, useCallback, type CSSProperties } from 'react';

type ProtectedVideoProps = {
  src: string;
  className?: string;
  style?: CSSProperties;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLVideoElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLVideoElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLVideoElement>) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  preload?: string;
};

/**
 * Protected video wrapper that:
 * - Hides download button via controlsList="nodownload noplaybackrate"
 * - Disables Picture-in-Picture
 * - Disables Remote Playback
 * - Adds a floating watermark overlay
 * - Prevents context menu and drag
 */
export default function ProtectedVideo({
  src,
  className = '',
  style,
  muted = false,
  loop = false,
  playsInline = true,
  autoPlay = false,
  controls = false,
  poster,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  videoRef: externalRef,
  preload,
}: ProtectedVideoProps) {
  const internalRef = useRef<HTMLVideoElement | null>(null);

  const setRef = useCallback((node: HTMLVideoElement | null) => {
    internalRef.current = node;
    if (externalRef && 'current' in externalRef) {
      (externalRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
    }
  }, [externalRef]);

  return (
    <div
      className={`protected-video-container ${className}`}
      style={style}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <video
        ref={setRef}
        src={src}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        autoPlay={autoPlay}
        controls={controls}
        poster={poster}
        preload={preload}
        draggable={false}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        style={{ userSelect: 'none' }}
      />
      {/* Floating watermark overlay */}
      <div className="video-watermark-overlay" aria-hidden="true">
        <span className="video-watermark-text">N ♥ K</span>
      </div>
    </div>
  );
}

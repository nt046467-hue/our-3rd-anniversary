import { useEffect, useRef, useState, type CSSProperties } from 'react';

type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
};

/**
 * Canvas-based image renderer with invisible + floating watermarks.
 * - Draws the image onto a <canvas> so the raw src is never in an <img> tag
 * - Applies a static invisible watermark at 0.02 opacity (PRD #9)
 * - Renders a dynamic floating watermark at 0.04 opacity (PRD #10)
 * - Prevents drag, context menu, and selection
 */
export default function ProtectedImage({ src, alt, className = '', style, onLoad }: ProtectedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const watermarkPosRef = useRef({ x: 0.3, y: 0.5, dx: 0.0003, dy: 0.0002 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    imageRef.current = img;

    img.onload = () => {
      setLoaded(true);
      onLoad?.();
      drawImage();
    };

    return () => {
      img.onload = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [src]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const container = containerRef.current;
    if (!container) return;

    // Size canvas to container
    const rect = container.getBoundingClientRect();
    const displayWidth = rect.width || 400;
    const displayHeight = rect.height || 300;

    // Use device pixel ratio for sharp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Draw the image to fill the canvas (object-fit: cover behavior)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > canvasAspect) {
      // Image is wider — crop sides
      sw = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Image is taller — crop top/bottom
      sh = img.naturalWidth / canvasAspect;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displayWidth, displayHeight);

    // ─── Static Invisible Watermark (PRD #9) ───
    ctx.save();
    ctx.globalAlpha = 0.02;
    ctx.font = `${Math.max(14, displayWidth * 0.04)}px "Fraunces", serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Tile the watermark across the image
    const tileSpacingX = displayWidth * 0.35;
    const tileSpacingY = displayHeight * 0.3;

    for (let tx = tileSpacingX / 2; tx < displayWidth; tx += tileSpacingX) {
      for (let ty = tileSpacingY / 2; ty < displayHeight; ty += tileSpacingY) {
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(-0.3);
        ctx.fillText('N ♥ K', 0, 0);
        ctx.fillText('Private Memory', 0, Math.max(14, displayWidth * 0.04) + 4);
        ctx.restore();
      }
    }
    ctx.restore();

    // ─── Dynamic Floating Watermark (PRD #10) ───
    const pos = watermarkPosRef.current;
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.font = `bold ${Math.max(12, displayWidth * 0.035)}px "Fraunces", serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const wx = pos.x * displayWidth;
    const wy = pos.y * displayHeight;
    ctx.fillText('N ♥ K · Private · 2026', wx, wy);
    ctx.restore();

    // Update floating watermark position
    pos.x += pos.dx;
    pos.y += pos.dy;
    if (pos.x < 0.15 || pos.x > 0.85) pos.dx = -pos.dx;
    if (pos.y < 0.15 || pos.y > 0.85) pos.dy = -pos.dy;

    // Schedule next frame for floating watermark animation
    animFrameRef.current = requestAnimationFrame(drawImage);
  };

  // Redraw on resize
  useEffect(() => {
    if (!loaded) return;

    const handleResize = () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      drawImage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className={`protected-image-container ${className}`}
      style={style}
      role="img"
      aria-label={alt}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className="protected-canvas"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none',
          userSelect: 'none',
          pointerEvents: 'auto',
        }}
      />
      {!loaded && (
        <div className="protected-image-placeholder">
          <span className="protected-image-spinner">🌸</span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  fit?: 'cover' | 'contain';
  maxHeightVh?: number;
  letterbox?: boolean;
  animateWatermark?: boolean;
};

// How often the floating watermark redraws while a photo is actually on screen.
const WATERMARK_REDRAW_MS = 150;

export default function ProtectedImage({ src, alt, className = '', style, onLoad, fit = 'contain', maxHeightVh, letterbox = false, animateWatermark = false }: ProtectedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const watermarkPosRef = useRef({ x: 0.3, y: 0.5, dx: 0.0003, dy: 0.0002 });
  const [boxSize, setBoxSize] = useState<{ width: number; height: number } | null>(null);

  // ─── Lazy load: only start fetching the photo once it's ~400px from entering the
  // viewport, instead of every photo loading the instant it mounts. ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ─── Track real on-screen visibility so we can pause the animation loop for
  // photos that are scrolled away, instead of animating all of them forever. ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => setInViewport(!!entries[0]?.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // For fit="contain": measure the natural photo aspect ratio and size the box to match,
  // the same way a plain <img style="height:auto"> would — so masonry/lightbox layouts
  // never force a crop or a squish.
  const computeContainBox = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (fit !== 'contain' || !img || !img.naturalWidth || !container) return;

    // Use parent width, falling back to container width, then viewport width
    // (lightbox overlays may have 0 parent width during their entrance animation)
    let parentWidth = container.parentElement?.getBoundingClientRect().width || container.getBoundingClientRect().width;
    if (parentWidth < 10) {
      parentWidth = window.innerWidth * 0.88;
      // Re-measure after the lightbox entrance animation finishes
      setTimeout(() => computeContainBox(), 120);
    }

    const aspect = img.naturalWidth / img.naturalHeight;

    let width = parentWidth;
    let height = width / aspect;

    if (maxHeightVh) {
      const capPx = (maxHeightVh / 100) * window.innerHeight;
      if (height > capPx) {
        height = capPx;
        width = height * aspect;
      }
    }

    setBoxSize({ width: Math.round(width), height: Math.round(height) });
  };

  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    imageRef.current = img;

    img.onload = () => {
      setLoaded(true);
      onLoad?.();
      computeContainBox();
      drawImage();
    };

    return () => {
      img.onload = null;
    };
  }, [src, shouldLoad]);

  // Recompute the contain-mode box on resize (window size or column reflow)
  useEffect(() => {
    if (fit !== 'contain') return;
    const handle = () => computeContainBox();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [fit, maxHeightVh, loaded]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const container = containerRef.current;
    if (!container) return;

    // Use un-transformed layout dimensions to ensure crystal-sharp canvas resolution
    const displayWidth = Math.max(container.clientWidth || 0, container.offsetWidth || 0, Math.round(container.getBoundingClientRect().width) || 0, 400);
    const displayHeight = Math.max(container.clientHeight || 0, container.offsetHeight || 0, Math.round(container.getBoundingClientRect().height) || 0, 320);

    // Use high device pixel ratio (at least 2x-3x) so 3D scale-ups are pin-sharp
    const dpr = Math.max(2.5, (window.devicePixelRatio || 1) * 1.5);
    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(dpr, dpr);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;

    if (letterbox || fit === 'contain') {
      // Draw the WHOLE photo scaled to fit inside the fixed box (object-fit: contain
      // behavior) — nothing cropped. Leaves the rest of the canvas transparent.
      let dw = displayWidth, dh = displayHeight;
      if (imgAspect > canvasAspect) {
        dh = displayWidth / imgAspect;
      } else {
        dw = displayHeight * imgAspect;
      }
      const dx = (displayWidth - dw) / 2;
      const dy = (displayHeight - dh) / 2;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    } else {
      // Draw the image to fill the canvas (object-fit: cover behavior)
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (imgAspect > canvasAspect) {
        // Image is wider — crop sides
        sw = img.naturalHeight * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        // Image is taller — anchor to TOP so heads/faces are visible
        sh = img.naturalWidth / canvasAspect;
        sy = Math.max(0, (img.naturalHeight - sh) * 0.1);
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displayWidth, displayHeight);
    }

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

    // NOTE: no self-scheduling here — the redraw loop is driven externally by the
    // effect below, throttled and only while the photo is actually on screen.
  };

  // ─── Throttled watermark-drift loop — only runs if animateWatermark is explicitly enabled, loaded AND on screen. ───
  useEffect(() => {
    if (!animateWatermark || !loaded || !inViewport) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(drawImage, WATERMARK_REDRAW_MS);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animateWatermark, loaded, inViewport]);

  // Redraw once on resize (layout change), independent of the drift loop
  useEffect(() => {
    if (!loaded) return;
    const handleResize = () => drawImage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded]);

  // In contain mode, size the box exactly to the photo's own aspect ratio (pixel-perfect
  // for the canvas, no distortion). Before we know the aspect ratio, fall back to a gentle
  // placeholder ratio so layout doesn't jump around while the photo loads.
  const containStyle: CSSProperties =
    fit === 'contain'
      ? boxSize
        ? { width: boxSize.width, height: boxSize.height, ...(maxHeightVh ? { margin: '0 auto' } : {}) }
        : { width: '100%', aspectRatio: '4 / 5' }
      : {};

  return (
    <div
      ref={containerRef}
      className={`protected-image-container ${className}`}
      style={{ ...containStyle, ...style }}
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

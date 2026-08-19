import { useState, useEffect, useRef, useCallback, PointerEvent, WheelEvent } from 'react';
import { CarouselSettings } from './types';
import { soundFX } from './audio';

export function useCarouselPhysics(
  totalCards: number,
  settings: CarouselSettings,
  onActiveCardChange?: (index: number) => void
) {
  const [angle, setAngle] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const lastVelocityRef = useRef(1);
  const isHoveredRef = useRef(false);
  const targetAngleRef = useRef<number | null>(null);
  const lastActiveIndexRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now());
  const dragRef = useRef({ isDragging: false, committed: false, startX: 0, startAngle: 0, lastX: 0, lastTime: 0 });

  const stepAngle = 360 / Math.max(1, totalCards);

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);
  useEffect(() => { soundFX.setMuted(!settings.soundEnabled); }, [settings.soundEnabled]);

  const rotateToCard = useCallback((cardIndex: number, withSound = true) => {
    if (totalCards === 0) return;
    const targetIdx = ((cardIndex % totalCards) + totalCards) % totalCards;
    const currentNorm = ((-angleRef.current % 360) + 360) % 360;
    const currentIdx = Math.round(currentNorm / stepAngle) % totalCards;
    let diffIdx = targetIdx - currentIdx;
    if (diffIdx > totalCards / 2) diffIdx -= totalCards;
    if (diffIdx < -totalCards / 2) diffIdx += totalCards;
    const deltaAngle = -diffIdx * stepAngle;
    targetAngleRef.current = angleRef.current + deltaAngle;
    velocityRef.current = 0;
    if (Math.abs(deltaAngle) > 0.001) lastVelocityRef.current = deltaAngle;
    if (withSound) soundFX.playPop(580);
  }, [totalCards, stepAngle]);

  const stepNext = useCallback(() => rotateToCard(activeCardIndex + 1), [activeCardIndex, rotateToCard]);
  const stepPrev = useCallback(() => rotateToCard(activeCardIndex - 1), [activeCardIndex, rotateToCard]);

  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = now;

      if (targetAngleRef.current !== null) {
        const diff = targetAngleRef.current - angleRef.current;
        if (Math.abs(diff) < 0.05) {
          angleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
          velocityRef.current = 0;
          if (settings.snapToNearest) soundFX.playSnap();
        } else {
          angleRef.current += diff * Math.min(8.5 * dt, 0.4);
        }
      } else if (!dragRef.current.isDragging) {
        if (Math.abs(velocityRef.current) > 0.05) {
          angleRef.current += velocityRef.current * (dt * 60);
          velocityRef.current *= Math.pow(settings.damping, dt * 60);
          if (Math.abs(velocityRef.current) > 0.001) lastVelocityRef.current = velocityRef.current;
          if (Math.abs(velocityRef.current) <= 0.08 && settings.snapToNearest) {
            velocityRef.current = 0;
            const n = ((-angleRef.current % 360) + 360) % 360;
            rotateToCard(Math.round(n / stepAngle) % totalCards, false);
          }
        } else if (settings.autoRotate) {
          const dir = Math.sign(lastVelocityRef.current) || 1;
          const hf = isHoveredRef.current ? 0.2 : 1.0;
          angleRef.current += Math.abs(settings.speed) * hf * dir * dt;
        }
      }

      const norm = ((-angleRef.current % 360) + 360) % 360;
      const active = ((Math.round(norm / stepAngle) % totalCards) + totalCards) % totalCards;
      if (active !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = active;
        setActiveCardIndex(active);
        onActiveCardChange?.(active);
        soundFX.playTick(1.0 + (active % 3) * 0.1);
      }
      setAngle(angleRef.current);
      animFrameIdRef.current = requestAnimationFrame(loop);
    };
    lastFrameTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => { if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current); };
  }, [settings.autoRotate, settings.speed, settings.damping, settings.snapToNearest, stepAngle, totalCards, onActiveCardChange, rotateToCard]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = { isDragging: true, committed: false, startX: e.clientX, startAngle: angleRef.current, lastX: e.clientX, lastTime: performance.now() };
    targetAngleRef.current = null;
    velocityRef.current = 0;
    // Don't set isInteracting until drag is committed (past dead zone)
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current.isDragging && settings.interactiveParallax) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMouseParallax({
        x: Math.max(-1, Math.min(1, (e.clientX - rect.left - rect.width / 2) / (rect.width / 2))),
        y: Math.max(-1, Math.min(1, (e.clientY - rect.top - rect.height / 2) / (rect.height / 2))),
      });
    }
    if (!dragRef.current.isDragging) return;

    // Dead zone: don't treat as a drag until finger moves > 8px from start
    const totalDx = Math.abs(e.clientX - dragRef.current.startX);
    if (!dragRef.current.committed) {
      if (totalDx < 8) return; // Still within tap threshold, ignore movement
      dragRef.current.committed = true;
      setIsInteracting(true);
    }

    const now = performance.now();
    const dx = e.clientX - dragRef.current.lastX;
    const sensitivity = 0.28 * (380 / Math.max(200, settings.radius));
    angleRef.current = dragRef.current.startAngle + (e.clientX - dragRef.current.startX) * sensitivity;
    const dt = Math.max(1, now - dragRef.current.lastTime);
    const iv = (dx / dt) * 16.6 * sensitivity;
    velocityRef.current = velocityRef.current * 0.4 + iv * 0.6;
    if (Math.abs(velocityRef.current) > 0.001) lastVelocityRef.current = velocityRef.current;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;
  }, [settings.radius, settings.interactiveParallax]);

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current.isDragging) return;
    const wasDrag = dragRef.current.committed;
    if (wasDrag && Math.abs(velocityRef.current) > 0.8) soundFX.playWhoosh(Math.min(3, Math.abs(velocityRef.current) / 2));
    dragRef.current.isDragging = false;
    dragRef.current.committed = false;
    setIsInteracting(false);
    if (wasDrag && Math.abs(velocityRef.current) <= 0.8 && settings.snapToNearest) {
      const n = ((-angleRef.current % 360) + 360) % 360;
      rotateToCard(Math.round(n / stepAngle) % totalCards, false);
    }
  }, [settings.snapToNearest, stepAngle, totalCards, rotateToCard]);

  // Wheel/trackpad over the carousel now always scrolls the page (native browser behaviour),
  // never rotates the ring — avoids the old "rotates AND scrolls at once" jankiness.
  // Rotation still works fully via drag/swipe and tap-to-select.
  const handleWheel = useCallback((_e: WheelEvent) => {}, []);

  // NOTE: A global window-level ArrowUp/ArrowDown keydown listener used to live here to
  // rotate the ring. It was removed because it hijacked real page scrolling (arrow keys /
  // native scrollbar arrow buttons) everywhere on the site, not just while this section was
  // in view. Rotation is still fully available via drag/swipe and tap-to-select.

  return { angle, activeCardIndex, isInteracting, isHovered, mouseParallax, setIsHovered, rotateToCard, stepNext, stepPrev, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel };
}

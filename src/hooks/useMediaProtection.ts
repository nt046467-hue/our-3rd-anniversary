import { useEffect, useRef, useCallback, useState } from 'react';

type ToastMessage = {
  id: number;
  text: string;
};

type MediaProtectionState = {
  devToolsOpen: boolean;
  toasts: ToastMessage[];
};

let toastIdCounter = 0;

export function useMediaProtection() {
  const [state, setState] = useState<MediaProtectionState>({
    devToolsOpen: false,
    toasts: [],
  });

  const devToolsCheckRef = useRef<number | null>(null);
  const screenshotTimerRef = useRef<number | null>(null);
  const visibilityChangesRef = useRef<number[]>([]);

  const showToast = useCallback((text: string) => {
    const id = ++toastIdCounter;
    setState(prev => ({
      ...prev,
      toasts: [...prev.toasts, { id, text }],
    }));
    window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        toasts: prev.toasts.filter(t => t.id !== id),
      }));
    }, 2800);
  }, []);

  useEffect(() => {
    // ─── 1. Disable Right-Click (PRD #4) ───
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast('This memory is private ❤️');
    };

    // ─── 2. Disable Drag & Drop (PRD #5) ───
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'CANVAS') {
        e.preventDefault();
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.letter-body, .memory-caption, .polaroid-footer, .gallery-sidecopy, .hero-copy, .lb-caption, .letter-paper, .reason-card')) {
        e.preventDefault();
      }
    };

    // ─── 3. Disable Developer Shortcuts (PRD #11) ───
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        showToast('These memories are only meant for us ❤️');
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        showToast('These memories are only meant for us ❤️');
        return;
      }

      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U') && !e.shiftKey) {
        e.preventDefault();
        showToast('These memories are only meant for us ❤️');
        return;
      }

      // Ctrl+S (save page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S') && !e.shiftKey) {
        e.preventDefault();
        showToast('These memories are only meant for us ❤️');
        return;
      }

      // PrintScreen / screenshot detection (PRD #13)
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        triggerScreenshotProtection();
        return;
      }

      // Windows: Win+Shift+S (Snipping Tool)
      if (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerScreenshotProtection();
        return;
      }
    };

    // ─── 4. Screenshot Protection (PRD #13) ───
    const triggerScreenshotProtection = () => {
      document.body.classList.add('screenshot-detected');
      showToast('This memory is private ❤️');

      if (screenshotTimerRef.current) {
        window.clearTimeout(screenshotTimerRef.current);
      }

      screenshotTimerRef.current = window.setTimeout(() => {
        document.body.classList.remove('screenshot-detected');
        screenshotTimerRef.current = null;
      }, 2000);
    };

    // ─── 5. Anti Screen Recording — visibility change (PRD #14) ───
    const handleVisibilityChange = () => {
      const now = Date.now();
      visibilityChangesRef.current.push(now);

      // Keep only last 10 seconds of events
      visibilityChangesRef.current = visibilityChangesRef.current.filter(t => now - t < 10000);

      // If more than 8 rapid changes in 10 seconds, pause modal videos
      if (visibilityChangesRef.current.length > 8) {
        const videos = document.querySelectorAll<HTMLVideoElement>('video:not([loop])');
        videos.forEach(v => v.pause());
      }

      // When tab is hidden pause non-loop videos; when returning resume loop videos
      if (document.hidden) {
        const modalVideos = document.querySelectorAll<HTMLVideoElement>('video:not([loop])');
        modalVideos.forEach(v => v.pause());
      } else {
        const loopVideos = document.querySelectorAll<HTMLVideoElement>('video[loop]');
        loopVideos.forEach(v => {
          v.play().catch(() => {});
        });
      }
    };

    // ─── 6. DevTools Detection (PRD #12) ───
    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > threshold || heightDiff > threshold;

      setState(prev => {
        if (prev.devToolsOpen !== isOpen) {
          if (isOpen) {
            document.body.classList.add('devtools-open');
            // Pause non-background videos
            document.querySelectorAll<HTMLVideoElement>('video:not([loop])').forEach(v => v.pause());
          } else {
            document.body.classList.remove('devtools-open');
            document.querySelectorAll<HTMLVideoElement>('video[loop]').forEach(v => v.play().catch(() => {}));
          }
          return { ...prev, devToolsOpen: isOpen };
        }
        return prev;
      });
    };

    // ─── 7. Console Warning ───
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      originalLog.call(console,
        '%c🌸 This space is private. These memories belong to us. 🌸',
        'color: #A82B3E; font-size: 16px; font-family: serif; font-weight: bold;'
      );
      originalLog.apply(console, args);
    };

    // Wire up all listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown, true); // capture phase
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start DevTools detection interval
    devToolsCheckRef.current = window.setInterval(checkDevTools, 1000);
    checkDevTools(); // Initial check

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (devToolsCheckRef.current) {
        window.clearInterval(devToolsCheckRef.current);
      }
      if (screenshotTimerRef.current) {
        window.clearTimeout(screenshotTimerRef.current);
      }

      document.body.classList.remove('devtools-open', 'screenshot-detected');
      console.log = originalLog;
    };
  }, [showToast]);

  return state;
}

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import heroScene from "@/imports/0622d200b39c3313ae9298a149deaa15.jpg";
import albumBg from "@/imports/download.png";
import photo01 from "@/imports/IMG-20260702-WA0034.jpg";
import photo02 from "@/imports/IMG-20260702-WA0050.jpg";
import photo03 from "@/imports/IMG-20260702-WA0067.jpg";
import photo04 from "@/imports/IMG-20260707-WA0003.jpg";
import photo05 from "@/imports/IMG-20260710-WA0011.jpg";
import photo06 from "@/imports/IMG_20260730_152309.jpg";
import photo07 from "@/imports/Messenger_creation_874763100952795.jpeg";
import photo08 from "@/imports/Messenger_creation_1027833811890359.jpeg";
import photo09 from "@/imports/Messenger_creation_1377479472872957.jpeg";
import photo10 from "@/imports/Snapchat-1238995808.jpg";
import photo11 from "@/imports/Snapchat-1240271535.jpg";
import photo12 from "@/imports/Snapchat-2093873745.jpg";
import storyBg from "@/imports/background.jpg";
import GamesSection from "@/games/MemoryMatch";
import { useMediaProtection } from "@/hooks/useMediaProtection";
import DevToolsOverlay from "@/components/DevToolsOverlay";
import ProtectionToast from "@/components/ProtectionToast";
import ProtectedImage from "@/components/ProtectedImage";
import ProtectedVideo from "@/components/ProtectedVideo";

const heroVideo = "/imports/cherry_blossom_loop.mp4";
const memoryVideo01 = "/imports/HnVideoEditor_2026_07_02_205352006.mp4";
const memoryVideo02 = "/imports/HnVideoEditor_2026_07_02_204239276.mp4";
const bgMusic = "/imports/bg_music.mp3";

type Memory = { id: number; src: string; caption: string; type?: "video"; category: "photo" | "video" };

const allMemories: Memory[] = [
  { id: 1, src: photo01, caption: "A little sunlight, a lot of you.", category: "photo" },
  { id: 2, src: photo02, caption: "One of my forever favourite views.", category: "photo" },
  { id: 3, src: photo03, caption: "Us, in the in-between moments.", category: "photo" },
  { id: 4, src: memoryVideo02, caption: "Laughs that loop forever.", type: "video", category: "video" },
  { id: 5, src: photo04, caption: "You made an ordinary day feel new.", category: "photo" },
  { id: 6, src: photo05, caption: "Another page I never want to close.", category: "photo" },
  { id: 7, src: photo06, caption: "The softest kind of happy.", category: "photo" },
  { id: 8, src: photo07, caption: "Proof that we look good in memories.", category: "photo" },
  { id: 9, src: photo08, caption: "Still choosing you, every day.", category: "photo" },
  { id: 10, src: memoryVideo01, caption: "A tiny moving piece of our story.", type: "video", category: "video" },
  { id: 11, src: photo09, caption: "Tucked inside my heart.", category: "photo" },
  { id: 12, src: photo10, caption: "Golden hours beside you.", category: "photo" },
  { id: 13, src: photo11, caption: "Every smile reserved for you.", category: "photo" },
  { id: 14, src: photo12, caption: "Our quiet little universe.", category: "photo" },
];

const milestones = [
  ["01", "The beginning", "1 September 2023", "The day a simple hello became my favourite chapter."],
  ["02", "The night walk", "Our first date", "Just the two of us, walking and talking under the night sky until the streets went quiet. And when I hugged you goodnight, I remember thinking — I want a thousand more nights like this one."],
  ["03", "Our inside joke", "A memory to fill", "The one that would make absolutely no sense to anyone else."],
  ["04", "Three years in bloom", "15 Bhadra 2083", "And somehow, I keep finding new reasons to love you."],
];

function Tulip({ className = "" }: { className?: string }) {
  return <svg className={`tulip-icon ${className}`} width="36" height="48" viewBox="0 0 64 84" aria-hidden="true"><path d="M31 77V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M30 55c-9-2-14-7-17-15 9 0 15 4 18 12" fill="currentColor" opacity=".72" /><path d="M32 48c7-9 13-11 20-10-3 9-9 14-19 15" fill="currentColor" opacity=".72" /><path d="M17 9c5 0 9 3 11 6 1-5 4-9 9-9 5 0 8 4 9 9 2-3 6-6 11-6 1 15-9 24-25 25C21 33 16 22 17 9Z" fill="currentColor" /></svg>;
}

function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg className={`daisy-flower ${className}`} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="50" cy="22" rx="7" ry="20" fill="#fefcf8" stroke="#e6dccb" strokeWidth="1" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="14" fill="#f4c430" stroke="#d49b10" strokeWidth="1.5" />
      <circle cx="47" cy="47" r="10" fill="#fbd858" opacity="0.6" />
    </svg>
  );
}

function DriedFlower({ className = "" }: { className?: string }) {
  return (
    <svg className={`dried-flower ${className}`} viewBox="0 0 80 120" fill="none" aria-hidden="true">
      <path d="M40 115 Q38 60 42 10" stroke="#9a8365" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 80 Q20 65 15 50" stroke="#9a8365" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M41 70 Q60 55 65 40" stroke="#9a8365" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 40 Q25 25 20 15" stroke="#9a8365" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="50" r="5" fill="#f7f3e9" stroke="#b59e7d" />
      <circle cx="65" cy="40" r="5" fill="#f7f3e9" stroke="#b59e7d" />
      <circle cx="20" cy="15" r="4" fill="#f7f3e9" stroke="#b59e7d" />
      <circle cx="42" cy="10" r="6" fill="#f7f3e9" stroke="#b59e7d" />
    </svg>
  );
}

function InkBranch({ className = "" }: { className?: string }) {
  return (
    <svg className={`ink-branch-svg ${className}`} viewBox="0 0 340 260" fill="none" aria-hidden="true">
      <path d="M-10 -10 Q90 45 170 35 T290 90 T340 150" stroke="#2c221e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M90 45 Q140 95 200 115" stroke="#2c221e" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
      <path d="M170 35 Q220 15 270 25" stroke="#2c221e" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M230 65 Q260 115 300 135" stroke="#2c221e" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      <circle cx="130" cy="50" r="7" fill="#e8a8b8" opacity="0.6" />
      <circle cx="180" cy="32" r="8" fill="#e8a8b8" opacity="0.65" />
      <circle cx="220" cy="22" r="6" fill="#e8a8b8" opacity="0.55" />
      <circle cx="260" cy="26" r="7.5" fill="#e8a8b8" opacity="0.6" />
      <circle cx="200" cy="115" r="8" fill="#e8a8b8" opacity="0.65" />
      <circle cx="290" cy="90" r="9" fill="#e8a8b8" opacity="0.7" />
      <circle cx="300" cy="135" r="7" fill="#e8a8b8" opacity="0.6" />
      <circle cx="150" cy="70" r="5" fill="#f4c2cb" opacity="0.5" />
      <circle cx="240" cy="90" r="6" fill="#f4c2cb" opacity="0.55" />
    </svg>
  );
}

function GoldClip({ className = "" }: { className?: string }) {
  return (
    <svg className={`gold-clip ${className}`} viewBox="0 0 60 50" fill="none" aria-hidden="true">
      <path d="M15 25 L45 25 L40 45 L20 45 Z" fill="#d4af37" stroke="#aa8625" strokeWidth="1.5" />
      <path d="M22 25 C22 10 38 10 38 25" stroke="#e6c65c" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TwinHearts({ className = "" }: { className?: string }) {
  return (
    <svg className={`twin-hearts ${className}`} viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <path d="M11 23 C4 18 0 11.5 0 6.5 C0 2.9 2.9 0 6.5 0 C8.9 0 11 1.3 12.1 3.2 C13.2 1.3 15.3 0 17.7 0 C21.3 0 24.2 2.9 24.2 6.5 C24.2 11.5 20.2 18 13.2 23 L12.1 24.2 Z" fill="currentColor" opacity="0.9" />
      <path d="M23 27 C17.8 23 15 18 15 14 C15 11.2 17.2 9 20 9 C21.8 9 23.4 10 24.2 11.4 C25 10 26.6 9 28.4 9 C31.2 9 33.4 11.2 33.4 14 C33.4 18 30.6 23 25.4 27 L24.2 28 Z" fill="currentColor" />
    </svg>
  );
}

function GoldCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg className={`gold-corner ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M4 36V12C4 7.57864 7.57864 4 12 4H36" stroke="#D9B46B" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <path d="M8 32V16C8 11.5786 11.5786 8 16 8H32" stroke="#D9B46B" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <circle cx="12" cy="12" r="2" fill="#D9B46B" opacity="0.8" />
    </svg>
  );
}

function WaxSealStamp({ className = "" }: { className?: string }) {
  return (
    <div className={`wax-seal ${className}`} aria-hidden="true" title="N × K Wax Seal">
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#A82B3E" opacity="0.96" />
        <circle cx="32" cy="32" r="25" stroke="#D96375" strokeWidth="1.5" opacity="0.75" />
        <circle cx="32" cy="32" r="20" stroke="#7A1826" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
        <path d="M22 40 C22 32, 42 32, 42 40" stroke="#FFFDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <text x="32" y="35" textAnchor="middle" fill="#FFFDF8" fontSize="13" fontFamily="Fraunces, serif" fontWeight="600" letterSpacing="0.06em">N × K</text>
      </svg>
    </div>
  );
}

function AmbientVideoBackground({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? "/imports/pinterest_loop_mobile.mp4" : "/imports/pinterest_loop.mp4");

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (videoRef.current && !prefersReducedMotion) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: "300px" }
    );

    observer.observe(sectionEl);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [sectionRef]);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [shouldLoad]);

  useEffect(() => {
    const handleVis = () => {
      if (document.visibilityState === "visible" && videoRef.current) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion) {
          videoRef.current.play().catch(() => {});
        }
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  if (!shouldLoad || !videoSrc) return null;

  return (
    <video
      ref={videoRef}
      className="nc-ambient-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

export default function App() {
  const { devToolsOpen, toasts } = useMediaProtection();
  const [selected, setSelected] = useState<Memory | null>(null);
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [dateChoice, setDateChoice] = useState<string | null>(null);
  const [lovePrompt, setLovePrompt] = useState("Tap for a little challenge");
  const [showFullAlbum, setShowFullAlbum] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "photo" | "video">("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [showSecretInbox, setShowSecretInbox] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  const handleSecretClick = () => {
    setSecretClickCount((prev) => {
      if (prev + 1 >= 3) {
        setShowSecretInbox(true);
        return 0;
      }
      return prev + 1;
    });
  };
  const [vnPlaying, setVnPlaying] = useState(false);
  const [vnProgress, setVnProgress] = useState(0);
  const [vnCurrentTime, setVnCurrentTime] = useState(0);
  const [vnDuration, setVnDuration] = useState(0);
  const galleryRef = useRef<HTMLElement | null>(null);
  const letterRef = useRef<HTMLElement | null>(null);
  const nextChapterRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const vnRef = useRef<HTMLAudioElement | null>(null);
  const vnAnimRef = useRef<number | null>(null);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "—:——";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const toggleVoiceNote = () => {
    const vn = vnRef.current;
    if (!vn) return;
    if (vnPlaying) {
      vn.pause();
    } else {
      vn.play().catch(() => { });
    }
  };

  const updateVnProgress = () => {
    const vn = vnRef.current;
    if (!vn) return;
    setVnCurrentTime(vn.currentTime);
    if (vn.duration && isFinite(vn.duration)) {
      setVnProgress((vn.currentTime / vn.duration) * 100);
    }
    if (!vn.paused) {
      vnAnimRef.current = requestAnimationFrame(updateVnProgress);
    }
  };

  const handleVnPlay = () => {
    setVnPlaying(true);
    fadeAudioVolume(0.09, 600);
    vnAnimRef.current = requestAnimationFrame(updateVnProgress);
  };

  const handleVnPause = () => {
    setVnPlaying(false);
    fadeAudioVolume(0.60, 900);
    if (vnAnimRef.current) cancelAnimationFrame(vnAnimRef.current);
  };

  const handleVnEnded = () => {
    setVnPlaying(false);
    setVnProgress(0);
    setVnCurrentTime(0);
    fadeAudioVolume(0.60, 900);
    if (vnAnimRef.current) cancelAnimationFrame(vnAnimRef.current);
  };

  const handleVnLoadedMetadata = () => {
    const vn = vnRef.current;
    if (vn && isFinite(vn.duration)) setVnDuration(vn.duration);
  };

  const seekVn = (e: React.MouseEvent<HTMLDivElement>) => {
    const vn = vnRef.current;
    if (!vn || !vn.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vn.currentTime = pct * vn.duration;
    setVnProgress(pct * 100);
    setVnCurrentTime(vn.currentTime);
  };

  const fadeAudioVolume = (targetVolume: number, durationMs: number) => {
    if (!audioRef.current) return;
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    const startVolume = audioRef.current.volume;
    const startTime = performance.now();
    const stepInterval = 16; // smooth interval ramp (~60fps updates)

    fadeTimerRef.current = window.setInterval(() => {
      if (!audioRef.current) {
        if (fadeTimerRef.current !== null) {
          window.clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
        return;
      }

      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const currentVol = startVolume + (targetVolume - startVolume) * progress;
      audioRef.current.volume = Math.max(0, Math.min(1, currentVol));

      if (progress >= 1) {
        if (fadeTimerRef.current !== null) {
          window.clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      }
    }, stepInterval);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const filteredMemories = allMemories.filter((m) => categoryFilter === "all" || m.category === categoryFilter);
  const featuredMemories = allMemories.slice(0, 6);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => { });
    }
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
    }
    const handleVis = () => {
      if (document.visibilityState === "visible" && heroVideoRef.current) {
        heroVideoRef.current.play().catch(() => { });
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  useEffect(() => {
    const tryAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
      }
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser prevented autoplay before user interaction
        });
      }
    };

    tryAutoplay();

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => { });
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearInterval(fadeTimerRef.current);
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        if (showFullAlbum) setShowFullAlbum(false);
      }
      if (selected) {
        const sourceList = showFullAlbum ? filteredMemories : allMemories;
        const idx = sourceList.findIndex(m => m.id === selected.id);
        if (event.key === "ArrowLeft" && idx > 0) setSelected(sourceList[idx - 1]);
        if (event.key === "ArrowRight" && idx < sourceList.length - 1) setSelected(sourceList[idx + 1]);
      }
    };
    window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener);
  }, [showFullAlbum, selected, categoryFilter]);
  useEffect(() => {
    const startDate = new Date("2023-09-01T00:00:00");
    const tick = () => {
      const diff = Date.now() - startDate.getTime();
      const seconds = Math.floor(diff / 1000);
      setTimeTogether({
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60,
      });
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setGalleryVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const letter = letterRef.current;
    if (!letter) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLetterVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(letter);
    return () => observer.disconnect();
  }, []);

  const tiltMemory = (event: PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget; const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty("--tilt-x", `${-y * 5}deg`);
    card.style.setProperty("--tilt-y", `${x * 5}deg`);
  };
  const resetMemoryTilt = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const checkAnswer = (event: React.FormEvent) => {
    event.preventDefault();
    if (answer.trim().toLowerCase().includes("karu") || answer.trim().toLowerCase().includes("beb")) {
      setSolved(true);
      setShowCelebration(true);
      window.setTimeout(() => setShowCelebration(false), 3600);
    }
  };

  const sendReply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!replyText.trim()) return;

    const messageContent = replyText.trim();
    setLastReply(messageContent);
    setReplySent(true);
    setReplyText("");

    try {
      const existing = JSON.parse(window.localStorage.getItem("karu-replies") || "[]");
      existing.push({ text: messageContent, at: new Date().toISOString() });
      window.localStorage.setItem("karu-replies", JSON.stringify(existing));
    } catch {
      // storage unavailable
    }

    // Submit directly to FormSubmit via FormData
    try {
      const formData = new FormData();
      formData.append("name", "Karu ❤️");
      formData.append("email", "nt046467@gmail.com");
      formData.append("message", messageContent);
      formData.append("_subject", "Anniversary Love Note from Karu ❤️");
      formData.append("_captcha", "false");
      formData.append("_template", "table");

      fetch("https://formsubmit.co/ajax/nt046467@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      }).catch(() => {});
    } catch { }
  };

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return <main className="site-shell">
    <audio ref={audioRef} src={bgMusic} loop preload="auto" />
    <header className="topbar">
      <button className="wordmark" onClick={() => { goTo("home"); handleSecretClick(); }} aria-label="Return to welcome">N <span>×</span> K</button>
      <div className="chapter-count"><span>03</span> years in bloom</div>
      <button className={`sound ${isPlaying ? "playing" : ""}`} onClick={toggleMusic} aria-label={isPlaying ? "Mute background music" : "Play background music"}>
        <span>{isPlaying ? "♫" : "♪"}</span> {isPlaying ? "sound on" : "sound off"}
      </button>
    </header>

    <section id="home" className="scroll-section hero">
      <div className="hero-scene" aria-hidden="true">
        <video ref={heroVideoRef} src={heroVideo} autoPlay muted loop playsInline preload="auto" poster={heroScene} draggable={false} onContextMenu={(e) => e.preventDefault()} />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">a small place for a very big feeling</p>
        <div className="greeting">For <span>Karu</span>,</div>
        <h1>the girl who<br /><em>makes everything bloom.</em></h1>
        <p className="intro">Some stories begin loudly. Ours began on a day that quietly changed everything.</p>
        <div className="date-line"><span>15 Bhadra 2080</span><i /> <small>01 · 09 · 2023</small></div>
        <div className="live-counter" aria-label="Time together, counting live">
          <div><strong>{timeTogether.days}</strong><small>days</small></div>
          <div><strong>{String(timeTogether.hours).padStart(2, "0")}</strong><small>hrs</small></div>
          <div><strong>{String(timeTogether.minutes).padStart(2, "0")}</strong><small>min</small></div>
          <div><strong>{String(timeTogether.seconds).padStart(2, "0")}</strong><small>sec</small></div>
          <p>and counting, beb.</p>
        </div>
        <button className="primary-button" onClick={() => goTo("story")}>Begin our story <b>↓</b></button>
      </div>
      <div className="hero-portrait">
        <ProtectedImage src={photo01} alt="A tender couple's photograph" />
        <div className="portrait-wash" />
        <p>three years<br />of <em>us</em></p>
        <div className="portrait-flowers" aria-hidden="true">
          <Tulip className="portrait-tulip" />
          <Daisy className="portrait-daisy" />
        </div>
      </div>
    </section>

    <section id="story" className="scroll-section story">
      <div className="story-luxury-bg" aria-hidden="true">
        <div className="story-emerald-gradient" />
        <div className="story-bg-image" style={{ backgroundImage: `url(${storyBg})` }} />
        <div className="story-film-grain" />
        <div className="story-ambient-glow" />
        <div className="story-light" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">chapter one · the little things</p>
        <h2>Our story,<br /><em>still unfolding.</em></h2>
      </div>
      <div className="timeline">
        {milestones.map(([number, title, date, description], i) => (
          <article className="milestone" style={{ "--delay": `${i * 100}ms` } as CSSProperties} key={title}>
            <span className="milestone-no">{number}</span>
            <div>
              <p>{date}</p>
              <h3>{title}</h3>
              <small>{description}</small>
            </div>
          </article>
        ))}
      </div>
      <button className="text-button" onClick={() => goTo("memories")}>Next: the proof <span>→</span></button>
    </section>

    <section id="memories" ref={galleryRef} className={`scroll-section gallery ${galleryVisible ? "gallery-in-view" : ""}`}>
      {/* Layer 2: Warm Afternoon Sunlight Beam & Watercolor Stains */}
      <div className="gallery-sunlight" aria-hidden="true" />
      <div className="gallery-watercolor-stains" aria-hidden="true" />

      {/* Layer 3: Paper Dust & Drifting Sakura Petals */}
      <div className="gallery-dust-container" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="gallery-dust" style={{ "--gdi": i } as CSSProperties} />
        ))}
      </div>
      <div className="gallery-petals-container" aria-hidden="true">
        {Array.from({ length: 2 }, (_, i) => (
          <span key={i} className="gallery-petal" style={{ "--gpi": i } as CSSProperties}>
            {i % 2 === 0 ? "🌸" : "💮"}
          </span>
        ))}
      </div>

      {/* Edge Scrapbook Decorations */}
      <div className="gallery-corner-decor" aria-hidden="true">
        <GoldCornerOrnament className="gdecor-tl" />
        <GoldCornerOrnament className="gdecor-br" />
      </div>

      <div className="gallery-head">
        <div>
          <p className="eyebrow">chapter two · saved forever</p>
          <h2>A few frames<br />of <em>our favourite film.</em></h2>
        </div>
        <p className="gallery-sidecopy">The rest of the world can keep rushing.<br />I like it best when it is just us.</p>
      </div>

      <div className="memory-grid">
        {featuredMemories.map((memory, index) => (
          <button
            className={`memory polaroid-card ${memory.type === "video" ? "video-card" : ""}`}
            style={{
              "--delay": `${index * 75}ms`,
              "--rot": `${((index % 5) - 2) * 1.8}deg`
            } as CSSProperties}
            onPointerMove={tiltMemory}
            onPointerLeave={resetMemoryTilt}
            onClick={() => setSelected(memory)}
            key={memory.id}
          >
            {index % 3 === 0 && <Daisy className="card-daisy" />}
            {index % 4 === 1 && <DriedFlower className="card-dried" />}
            {index % 5 === 2 && <GoldClip className="card-clip" />}
            <div className="tape-strip" aria-hidden="true" />
            <div className="polaroid-frame">
              {memory.type === "video" ? (
                <>
                  <ProtectedVideo
                    src={memory.src}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    onTouchStart={(e) => {
                      if (e.currentTarget.paused) {
                        e.currentTarget.play();
                      } else {
                        e.currentTarget.pause();
                      }
                    }}
                  />
                  <div className="video-badge-overlay" aria-hidden="true">
                    <span className="video-play-disc">▶</span>
                  </div>
                </>
              ) : (
                <ProtectedImage src={memory.src} alt={memory.caption} />
              )}
            </div>
            <div className="polaroid-footer">
              <span className="memory-index">{String(index + 1).padStart(2, "0")}</span>
              <p className="memory-caption">{memory.caption}</p>
              {memory.type && <span className="play">▶</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="album-trigger-row">
        <button className="primary-button view-all-album-btn" onClick={() => setShowFullAlbum(true)}>
          View All Memories ({allMemories.length} Items) <TwinHearts className="btn-hearts" />
        </button>
      </div>

      <button className="text-button" onClick={() => goTo("reasons")}>A few reasons why <span>→</span></button>
    </section>

    {showFullAlbum && (
      <section className="full-album-overlay" style={{ "--album-bg": `url(${albumBg})` } as CSSProperties} role="dialog" aria-modal="true" aria-label="Full Scrapbook Album">

        {/* Floating petals */}
        <div className="album-petals" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="album-petal" style={{ "--pi": i } as CSSProperties}>
              {i % 3 === 0 ? "🌸" : i % 3 === 1 ? "🌷" : "💮"}
            </span>
          ))}
        </div>

        {/* Corner floral decorations */}
        <div className="album-corner-flowers" aria-hidden="true">
          <Tulip className="album-tulip album-tulip-tl" />
          <Tulip className="album-tulip album-tulip-tr" />
          <Daisy className="album-daisy album-daisy-tl" />
          <Daisy className="album-daisy album-daisy-br" />
          <DriedFlower className="album-dried album-dried-bl" />
          <DriedFlower className="album-dried album-dried-tr" />
        </div>

        <div className="full-album-header">
          <button className="back-button" onClick={() => setShowFullAlbum(false)}>
            <span>←</span> Back to Story
          </button>

          <div className="album-title-group">
            <div className="album-title-flowers" aria-hidden="true">
              <Tulip /><Daisy /><Tulip />
            </div>
            <p className="eyebrow">the complete scrapbook vault</p>
            <h2>All Our Moments,<br /><em>every single frame.</em></h2>
            <div className="album-vine" aria-hidden="true">
              <span>✿</span><span>─────</span><span>♥</span><span>─────</span><span>✿</span>
            </div>
          </div>

          <div className="album-filter-tabs">
            <button className={categoryFilter === "all" ? "active" : ""} onClick={() => setCategoryFilter("all")}>
              All ({allMemories.length})
            </button>
            <button className={categoryFilter === "photo" ? "active" : ""} onClick={() => setCategoryFilter("photo")}>
              Photos ({allMemories.filter(m => m.category === "photo").length}) 📸
            </button>
            <button className={categoryFilter === "video" ? "active" : ""} onClick={() => setCategoryFilter("video")}>
              Videos ({allMemories.filter(m => m.category === "video").length}) 🎥
            </button>
          </div>
        </div>

        <div className="full-album-grid">
          {filteredMemories.map((memory, index) => (
            <button
              className={`memory polaroid-card ${memory.type === "video" ? "video-card" : ""}`}
              style={{
                "--delay": `${index * 50}ms`,
                "--rot": `${((index % 5) - 2) * 2}deg`
              } as CSSProperties}
              onPointerMove={tiltMemory}
              onPointerLeave={resetMemoryTilt}
              onClick={() => setSelected(memory)}
              key={memory.id}
            >
              {index % 4 === 0 && <Daisy className="card-daisy" />}
              {index % 3 === 1 && <DriedFlower className="card-dried" />}
              {index % 5 === 3 && <GoldClip className="card-clip" />}
              <div className="tape-strip" aria-hidden="true" />
              <div className="polaroid-frame">
                {memory.type === "video" ? (
                  <>
                    <ProtectedVideo
                      src={memory.src}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      onTouchStart={(e) => {
                        if (e.currentTarget.paused) {
                          e.currentTarget.play();
                        } else {
                          e.currentTarget.pause();
                        }
                      }}
                    />
                    <div className="video-badge-overlay" aria-hidden="true">
                      <span className="video-play-disc">▶</span>
                    </div>
                  </>
                ) : (
                  <ProtectedImage src={memory.src} alt={memory.caption} />
                )}
              </div>
              <div className="polaroid-footer">
                <span className="memory-index">{String(index + 1).padStart(2, "0")}</span>
                <p className="memory-caption">{memory.caption}</p>
                {memory.type && <span className="play">▶</span>}
              </div>
            </button>
          ))}
        </div>
      </section>
    )}

    <section id="reasons" className="scroll-section reasons">
      <div className="section-heading">
        <p className="eyebrow">a small, incomplete list</p>
        <h2>Reasons I love you,<br /><em>numbered but never finished.</em></h2>
      </div>
      <div className="reasons-grid">
        {[
          "The way you say my name when you're half asleep.",
          "How you remember the tiny things I mention once.",
          "Your laugh — the real one, not the polite one.",
          "The way you make ordinary Tuesdays feel like an occasion.",
          "How safe your hugs feel, every single time.",
          "The way you fight for us, even on the hard days.",
          "Your voice note rambles that I replay more than once.",
          "How you still get shy when I say you're beautiful.",
          "The way home just means wherever you are.",
          "That you chose me, and somehow keep choosing me.",
        ].map((reason, i) => (
          <div className="reason-card" style={{ "--delay": `${i * 60}ms` } as CSSProperties} key={reason}>
            <span className="reason-no">{String(i + 1).padStart(2, "0")}</span>
            <p>{reason}</p>
          </div>
        ))}
      </div>
      <button className="text-button" onClick={() => goTo("path")}>Follow the tulips <span>→</span></button>
    </section>

    <GamesSection />

    <section id="path" className="scroll-section path">
      <div className="path-copy"><p className="eyebrow">chapter three · a tiny detour</p><h2>The tulip<br /><em>path.</em></h2><p>Just one easy question before the last page. Because the answer has been my favourite word since day one.</p></div>
      <div className="games-panel">
        <div className={`riddle-card ${solved ? "solved" : ""}`}><div className="bud-row">{Array.from({ length: 6 }, (_, i) => <Tulip key={i} className={solved || i === 0 ? "bloom" : "bud"} />)}</div><p className="riddle-number">01 / 03 · nickname bloom</p><h3>What nickname makes my whole day  softer?</h3>{solved ? <div className="success"><Tulip /><p>Exactly, beb.<br /><small>You found the way.</small></p><button className="primary-button" onClick={() => goTo("letter")}>Open my letter <b>→</b></button></div> : <form onSubmit={checkAnswer}><input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="type your answer, beb..." autoComplete="off" /><button aria-label="Submit answer">→</button><small>{answer ? "A little hint: it is one of the names above. 💗" : "No pressure—this is not an exam, sanu."}</small></form>}</div>
        <div className="mini-games">
          <article className="mini-game date-game"><p>02 / 03 · lucky date</p><h3>When did our story begin?</h3><div className="date-options">{["29 Aug", "01 Sept", "15 Sept"].map((date) => <button key={date} className={dateChoice === date ? "picked" : ""} onClick={() => setDateChoice(date)}>{date}</button>)}</div><small>{dateChoice === "01 Sept" ? "That’s our day. 💗" : dateChoice ? "Almost, beb — look for 01." : "Pick the day you would never forget."}</small></article>
          <article className="mini-game prompt-game"><p>03 / 03 · love roulette</p><h3>{lovePrompt}</h3><button onClick={() => { const prompts = ["Send me the first photo you took of us.", "Name one tiny thing you love about us.", "Plan our next soft little date.", "Give me the longest hug when you see me."]; setLovePrompt(prompts[Math.floor(Math.random() * prompts.length)]); }}>Draw a prompt <span>↻</span></button></article>
        </div>
      </div>
    </section>

    <section id="letter" ref={letterRef} className={`scroll-section letter ${letterVisible ? "letter-in-view" : ""}`}>
      {/* Layer 1 — Handmade Parchment Base */}
      <div className="letter-washi-base" aria-hidden="true" />
      <div className="letter-paper-grain" aria-hidden="true" />

      {/* Layer 2 — Japanese Landscape (Soft blurred watercolor mountains, 18% opacity, warm sepia) */}
      <div className="letter-mountains-layer" aria-hidden="true" style={{ backgroundImage: `url(/forletter.jpg)` }} />
      <div className="letter-cream-overlay" aria-hidden="true" />
      <div className="letter-vignette" aria-hidden="true" />

      {/* Layer 3 — Ink Branch (Swaying traditional sakura branch, top-left corner, 10% opacity) */}
      <div className="letter-ink-branch" aria-hidden="true">
        <InkBranch />
      </div>

      {/* Layer 4 — Warm Sunlight (Huge top-right radial cream light source, 900px radius, 18% opacity) */}
      <div className="letter-sunlight-beam" aria-hidden="true" />

      {/* Layer 5 — Mist (Slow horizontal drifting fog, 25-35s duration) */}
      <div className="letter-watercolor-fog" aria-hidden="true" />

      {/* Layer 6 — Floating Atmosphere (48 glowing dust particles, floating pollen, drifting sakura petals) */}
      <div className="letter-atmosphere-particles" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => {
          const type = i % 4 === 0 ? "petal" : i % 3 === 0 ? "pollen" : "dust";
          const posX = (i * 2.1) % 94 + 3;
          const posY = (i * 3.7) % 90 + 5;
          const delay = (i * 0.45) % 12;
          const duration = 14 + (i % 16);
          const opacity = 0.08 + (i % 5) * 0.05;
          const size = type === "petal" ? 14 : type === "pollen" ? 4 : 2.5;
          return (
            <span
              key={i}
              className={`atm-particle atm-${type}`}
              style={{
                "--px": `${posX}%`,
                "--py": `${posY}%`,
                "--pd": `${delay}s`,
                "--dur": `${duration}s`,
                "--po": opacity,
                "--ps": `${size}px`,
              } as CSSProperties}
            >
              {type === "petal" ? (i % 2 === 0 ? "🌸" : "💮") : null}
            </span>
          );
        })}
      </div>

      {solved ? (
        <div className="letter-paper">
          <GoldCornerOrnament className="corner-tl" />
          <GoldCornerOrnament className="corner-tr" />
          <GoldCornerOrnament className="corner-bl" />
          <GoldCornerOrnament className="corner-br" />

          <p className="eyebrow">the last page, for now</p>
          <h2>My dearest Karu,</h2>
          <div className="letter-body">
            <p>Three years ago, I did not know that one date could become a whole universe. But then there was you—your laugh, your little ways, the way every ordinary moment feels a little more alive beside you.</p>
            <p>Thank you for being my home in all the small moments and my favourite adventure in every new one. I hope we keep choosing each other, making memories, and finding reasons to laugh until our next anniversary—and all the ones after that.</p>
            <p className="signature">Always yours,<br /><em>with all my love.</em></p>
          </div>

          <div className="voice-note vintage-music-box">
            <div className="music-box-header">
              <span className="music-note-icon">♪</span>
              <p className="eyebrow">handcrafted music box · for your ears</p>
            </div>
            <audio
              ref={vnRef}
              preload="metadata"
              src="/voice-note.mp3"
              onPlay={handleVnPlay}
              onPause={handleVnPause}
              onEnded={handleVnEnded}
              onLoadedMetadata={handleVnLoadedMetadata}
            />
            <div className={`vn-player ${vnPlaying ? "vn-playing" : ""}`}>
              <button className="vn-play-btn" onClick={toggleVoiceNote} aria-label={vnPlaying ? "Pause voice note" : "Play voice note"}>
                {vnPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div className="vn-body">
                <div className="vn-wave" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => (
                    <span key={i} className="vn-bar" style={{ "--bi": i, "--h": `${20 + Math.sin(i * 0.7) * 35 + Math.cos(i * 1.3) * 25}%` } as CSSProperties} />
                  ))}
                </div>
                <div className="vn-track" onClick={seekVn}>
                  <div className="vn-track-fill" style={{ width: `${vnProgress}%` }} />
                  <div className="vn-thumb" style={{ left: `${vnProgress}%` }} />
                </div>
                <div className="vn-times">
                  <span>{formatTime(vnCurrentTime)}</span>
                  <span>{formatTime(vnDuration)}</span>
                </div>
              </div>
            </div>
            <small>{vnPlaying ? "listening to your voice..." : "press play, beb."}</small>
          </div>

          <WaxSealStamp className="letter-wax-seal" />
        </div>
      ) : (
        <div className="locked-letter">
          <GoldCornerOrnament className="corner-tl" />
          <GoldCornerOrnament className="corner-tr" />
          <GoldCornerOrnament className="corner-bl" />
          <GoldCornerOrnament className="corner-br" />
          <div className="lock-flower"><Tulip /><span>for karu, always</span></div>
          <p className="eyebrow">a little promise, tucked away</p>
          <h2>A letter waits<br /><em>at the end of the path.</em></h2>
          <p className="locked-copy">One small answer opens a page written only for you — and for all the quiet, beautiful moments we still get to make.</p>
          <button className="primary-button" onClick={() => goTo("path")}>Find the key <b>←</b></button>
          <div className="sealed-note">sealed with a tulip <span>♥</span></div>
        </div>
      )}
    </section>

    {solved && (
      <section id="next-chapter" ref={nextChapterRef} className="scroll-section next-chapter">
        <div className="nc-atmosphere" aria-hidden="true">
          {/* Deep emerald base with warm top-left gradient */}
          <div className="nc-base" />

          {/* Handmade paper texture — 6% opacity */}
          <div className="nc-paper" />

          {/* Ambient Video Layer — Pinterest 30s seamless loop */}
          <AmbientVideoBackground sectionRef={nextChapterRef} />

          {/* Soft warm light from upper-left */}
          <div className="nc-warmth" />

          {/* Elegant vignette */}
          <div className="nc-vignette" />

          {/* Far-layer bokeh — only 6px blur */}
          <div className="nc-bokeh">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="nc-bokeh-dot" style={{ "--bi": i } as CSSProperties} />
            ))}
          </div>

          {/* Floating pollen / dust */}
          <div className="nc-pollen">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} className="nc-pollen-particle" style={{ "--pi": i } as CSSProperties} />
            ))}
          </div>

          <div className="nc-dust">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="nc-dust-particle" style={{ "--di": i } as CSSProperties} />
            ))}
          </div>
        </div>

        <div className="section-heading">
          <p className="eyebrow">what's next</p>
          <h2>Our next chapter,<br /><em>already being written.</em></h2>
        </div>
        <div className="bucket-grid">
          {[
            "A trip somewhere we've never been together.",
            "Trying that recipe we keep saying we'll cook.",
            "A slow, do-nothing weekend, just us.",
            "That night walk, again — every anniversary from now on.",
          ].map((item, i) => (
            <div className="bucket-card" style={{ "--delay": `${i * 80}ms` } as CSSProperties} key={item}>
              <Tulip className="bucket-tulip" />
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="reply-box">
          <p className="eyebrow">your turn, beb</p>
          <h3>Leave me something back?</h3>
          {replySent ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p className="reply-thanks" style={{ margin: 0 }}>Received, with my whole heart. <Tulip className="reply-tulip" /></p>
              <a
                href={`mailto:nt046467@gmail.com?subject=Anniversary%20Love%20Note%20from%20Karu%20%E2%9D%A4%EF%B8%8F&body=${encodeURIComponent(lastReply)}`}
                className="text-button"
                style={{ fontSize: '13px', opacity: 0.85, marginTop: '6px' }}
              >
                Or click here to send via Email App ✉️
              </a>
            </div>
          ) : (
            <form onSubmit={sendReply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="say anything, sanu..."
                rows={3}
              />
              <button className="primary-button" type="submit">Send it my way <b>♥</b></button>
            </form>
          )}
        </div>
      </section>
    )}

    {showCelebration && (
      <div className="celebration-overlay" role="status" aria-live="polite">
        <div className="celebration-burst" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="celebration-piece" style={{ "--ci": i } as CSSProperties}>
              {i % 3 === 0 ? "🌸" : i % 3 === 1 ? "♥" : "✿"}
            </span>
          ))}
        </div>
        <div className="celebration-message">
          <Tulip className="celebration-tulip" />
          <p>You know me so well, Karu.</p>
          <small>of course you got it right away — it was always going to be you.</small>
        </div>
      </div>
    )}

    {selected && (() => {
      const sourceList = showFullAlbum ? filteredMemories : allMemories;
      const currentIdx = sourceList.findIndex(m => m.id === selected.id);
      const hasPrev = currentIdx > 0;
      const hasNext = currentIdx < sourceList.length - 1;
      return (
        <div className="lightbox romantic-lightbox" role="dialog" aria-modal="true" aria-label="Memory viewer" onClick={() => setSelected(null)}>
          {/* Floating hearts background */}
          <div className="lb-hearts" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} className="lb-heart" style={{ "--hi": i } as CSSProperties}>♥</span>
            ))}
          </div>

          {/* Soft bokeh circles */}
          <div className="lb-bokeh" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="lb-bokeh-dot" style={{ "--bi": i } as CSSProperties} />
            ))}
          </div>

          <button className="close lb-close" aria-label="Close memory" onClick={(e) => { e.stopPropagation(); setSelected(null); }}>×</button>

          {/* Prev arrow */}
          {hasPrev && (
            <button className="lb-nav lb-prev" aria-label="Previous memory" onClick={(e) => { e.stopPropagation(); setSelected(sourceList[currentIdx - 1]); }}>
              <span>‹</span>
            </button>
          )}

          {/* Main content */}
          <div className="lightbox-inner lb-romantic-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lb-media-frame">
              <div className="lb-corner lb-corner-tl" />
              <div className="lb-corner lb-corner-tr" />
              <div className="lb-corner lb-corner-bl" />
              <div className="lb-corner lb-corner-br" />
              {selected.type === "video" ? (
                <ProtectedVideo src={selected.src} controls autoPlay playsInline />
              ) : (
                <ProtectedImage src={selected.src} alt={selected.caption} />
              )}
            </div>
            <div className="lb-caption-area">
              <span className="lb-heart-icon">♥</span>
              <p className="lb-caption">{selected.caption}</p>
              <span className="lb-counter">{String(currentIdx + 1).padStart(2, "0")} / {String(sourceList.length).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Next arrow */}
          {hasNext && (
            <button className="lb-nav lb-next" aria-label="Next memory" onClick={(e) => { e.stopPropagation(); setSelected(sourceList[currentIdx + 1]); }}>
              <span>›</span>
            </button>
          )}
        </div>
      );
    })()}

    {showSecretInbox && (
      <div className="lightbox romantic-lightbox" role="dialog" aria-modal="true" onClick={() => setShowSecretInbox(false)}>
        <div className="lightbox-inner lb-romantic-inner secret-inbox-inner" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '92%', padding: '28px 24px', background: '#082E22', borderRadius: '24px', border: '1px solid rgba(255, 157, 180, 0.35)', color: '#fef8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <button className="close lb-close" onClick={() => setShowSecretInbox(false)}>×</button>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p className="eyebrow" style={{ color: 'var(--pink)' }}>secret inbox · for your eyes only</p>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#fef8f0', margin: '4px 0' }}>Messages from Karu ❤️</h2>
          </div>
          <div style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
            {(() => {
              try {
                const replies = JSON.parse(window.localStorage.getItem("karu-replies") || "[]");
                if (!replies || replies.length === 0) {
                  return <p style={{ textAlign: 'center', opacity: 0.7, fontStyle: 'italic', padding: '20px 0' }}>No messages sent yet, beb.</p>;
                }
                return replies.map((r: { text: string; at: string }, idx: number) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '16px 18px', borderRadius: '16px', borderLeft: '4px solid var(--pink)' }}>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: '#fefcf8', fontFamily: 'Fraunces, serif' }}>"{r.text}"</p>
                    <small style={{ display: 'block', marginTop: '8px', opacity: 0.65, fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                      {new Date(r.at).toLocaleString()}
                    </small>
                  </div>
                ));
              } catch {
                return <p>Unable to load stored messages.</p>;
              }
            })()}
          </div>
        </div>
      </div>
    )}

    {/* Media Protection UI */}
    <ProtectionToast toasts={toasts} />
    <DevToolsOverlay visible={devToolsOpen} />
  </main>;
}

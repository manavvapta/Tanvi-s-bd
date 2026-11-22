import { useEffect, useRef, useState } from "react";
import HeartLoader from "./components/HeartLoader.jsx";
import LockScreen from "./components/LockScreen.jsx";
import BirthdayPage from "./components/BirthdayPage.jsx";

export default function App() {
  const [stage, setStage] = useState("loading"); // loading | locked | unlocked
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Pehla tap/click/key press hote hi song start ho jaayega
  useEffect(() => {
    const startMusic = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, []);

  // Agar tab change karke wapas aaye aur song ruk gaya ho, toh dobara chalao
  useEffect(() => {
    const resume = () => {
      const audio = audioRef.current;
      if (document.visibilityState === "visible" && audio && audio.paused && !muted) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [muted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <>
      {/* Audio hamesha mounted rehta hai, isliye stage change hone par bhi nahi rukta */}
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />

      {stage === "loading" && <HeartLoader onDone={() => setStage("locked")} />}
      {stage === "locked" && <LockScreen onUnlock={() => setStage("unlocked")} />}
      {stage === "unlocked" && <BirthdayPage />}

      <button className="mute-btn glass" onClick={toggleMute} aria-label="Mute toggle">
        {muted ? "🔇" : "🎵"}
      </button>
    </>
  );
}
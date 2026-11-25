import { useEffect, useRef, useState } from "react";
import HeartLoader from "./components/HeartLoader.jsx";
import LockScreen from "./components/LockScreen.jsx";
import BirthdayPage from "./components/BirthdayPage.jsx";

export default function App() {
  const [stage, setStage] = useState("loading"); // loading | locked | unlocked
  const [playing, setPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef(null);

  const playSong = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) playSong();
    else audio.pause();
  };

  // Pehle user tap par bhi koshish karo, jab tak song na chale
  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) playSong();
    };
    const events = ["click", "touchend", "keydown"];
    events.forEach((e) => window.addEventListener(e, tryPlay));
    return () => events.forEach((e) => window.removeEventListener(e, tryPlay));
  }, []);

  // Audio ka asli state (play/pause) sync rakho
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <>
      {/* Audio hamesha mounted rehta hai, isliye stage change hone par bhi nahi rukta */}
      <audio
        ref={audioRef}
        src="/song.mp3"
        loop
        preload="auto"
        onError={() => setLoadError(true)}
      />

      {stage === "loading" && <HeartLoader onDone={() => setStage("locked")} />}
      {stage === "locked" && <LockScreen onUnlock={() => setStage("unlocked")} />}
      {stage === "unlocked" && <BirthdayPage />}

      <button
        className="music-toggle glass"
        onClick={togglePlay}
        aria-label={playing ? "Song pause karo" : "Song chalao"}
      >
        {playing ? "⏸ Pause" : "Your Song ♥️🎵 "}
      </button>

      {loadError && (
        <p className="music-error">Song load nahi hua, net check karo</p>
      )}
    </>
  );
}
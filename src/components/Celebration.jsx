import { useEffect, useMemo, useState } from "react";
import "./Celebration.css";

const COLORS = ["#ff4d8d", "#ffa3c4", "#c2185b", "#ffd1e3", "#ffffff", "#ffb703", "#8ecae6"];
const SPARKS = ["💖", "✨", "🎉", "💕", "🌸"];
const SHOW_TIME = 3000; // ms

const rand = (min, max) => Math.random() * (max - min) + min;

export default function Celebration() {
  const [visible, setVisible] = useState(true);

  // 3 second baad celebration hat jaayega
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SHOW_TIME);
    return () => clearTimeout(t);
  }, []);

  const balloons = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: rand(2, 92),
        size: rand(44, 70),
        color: COLORS[i % COLORS.length],
        delay: rand(0, 0.4),
        duration: rand(2.4, 3),
      })),
    []
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        w: rand(6, 11),
        h: rand(10, 18),
        color: COLORS[i % COLORS.length],
        delay: rand(0, 0.5),
        duration: rand(2.2, 3),
        spin: rand(0.6, 1.2),
      })),
    []
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        emoji: SPARKS[i % SPARKS.length],
        delay: rand(0, 0.5),
        duration: rand(2.4, 3),
      })),
    []
  );

  if (!visible) return null;

  return (
    <div className="celebration" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={`b${b.id}`}
          className="balloon"
          style={{
            left: `${b.left}%`,
            "--s": `${b.size}px`,
            "--c": b.color,
            "--d": `${b.duration}s`,
            "--dl": `${b.delay}s`,
          }}
        />
      ))}

      {confetti.map((c) => (
        <span
          key={`c${c.id}`}
          className="confetti"
          style={{
            left: `${c.left}%`,
            "--w": `${c.w}px`,
            "--h": `${c.h}px`,
            "--c": c.color,
            "--d": `${c.duration}s`,
            "--dl": `${c.delay}s`,
            "--spin": `${c.spin}s`,
          }}
        />
      ))}

      {sparks.map((s) => (
        <span
          key={`s${s.id}`}
          className="spark"
          style={{
            left: `${s.left}%`,
            "--d": `${s.duration}s`,
            "--dl": `${s.delay}s`,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
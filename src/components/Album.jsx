
import { useEffect, useRef, useState } from "react";
import "./Album.css";
const ALBUM = [
  { src: "t21.JPG", caption: "That beautiful smile ✨" },
  { src: "t22.JPG", caption: "Effortlessly pretty 🤍" },
  { src: "t23.JPG", caption: "A whole vibe 🦋" },
  { src: "t24.JPG", caption: "Pretty without even trying 🌷" },
  { src: "t25.JPG", caption: "That perfect smile again 🥹" },
  { src: "t26.JPG", caption: "Beauty in every little detail ✨" },
  { src: "t27.JPG", caption: "Just being effortlessly you 💗" },
  { src: "t28.JPG", caption: "Simply one of a kind 🫶🏻" },
];

const INTRO_TEXT =
  "Every picture has a story, and every memory has you in it. Let's take a little trip down memory lane... 💖";

const DODGE_TARGET = 3; // Number of times the "One last thing" button needs to be caught

export default function Album({ onDone }) {
  const [catches, setCatches] = useState(0);
  const [pos, setPos] = useState({ left: 30, top: 30 });

  const handleLastClick = () => {
    const next = catches + 1;

    if (next >= DODGE_TARGET) {
      setCatches(next);
      onDone();
      return;
    }

    setCatches(next);
    setPos({
      left: 5 + Math.random() * 55,
      top: Math.random() * 60,
    });
  };

  return (
    <div className="stage album-scroll-stage">
      <h2 className="stage-title">Your Memories 📸</h2>

      <TypingText text={INTRO_TEXT} />

      <div className="album-scroll">
        {ALBUM.map((p, i) => (
          <RevealPhoto key={i} photo={p} index={i} />
        ))}
      </div>

      <p className="end-hint">
        {catches === 0
          ? "There's one last thing... catch me if you can! 😜"
          : `Almost there! ${catches}/${DODGE_TARGET} 💕`}
      </p>

      <div className="dodge-zone">
        <button
          className="btn dodge-btn"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
          onClick={handleLastClick}
        >
          One Last Thing 💌
        </button>
      </div>
    </div>
  );
}

/* Typing effect: Displays the text one character at a time */
function TypingText({ text, speed = 45 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, text, speed]);

  const done = count >= text.length;

  return (
    <p className="typing-text glass">
      {text.slice(0, count)}
      {!done && <span className="typing-caret">|</span>}
    </p>
  );
}

/* Photos appear with a side animation when they become visible while scrolling */
function RevealPhoto({ photo, index }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fromLeft = index % 2 === 0;

  return (
    <figure
      ref={ref}
      className={`polaroid reveal ${fromLeft ? "from-left" : "from-right"} ${shown ? "show" : ""}`}
    >
      {broken ? (
        <div className="photo-missing">📷 Could not load {photo.src}</div>
      ) : (
        <img
          src={photo.src}
          alt={photo.caption}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

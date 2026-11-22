import { useEffect, useState } from "react";
import RunawayNo from "./RunawayNo.jsx";
import PhotoQuiz from "./PhotoQuiz.jsx";
import "./BirthdayPage.css";

const NAME = "Tanvi";
const WISH = "I hope your day is filled with happiness, laughter, and beautiful moments. You deserve all the good things life has to offer. Keep smiling, stay happy, and never stop being the wonderful person you are. Wishing you a beautiful year ahead! ✨🥰🫶🏻❤️";

// Photos: public/photos/ mein rakho, phir yahan paths daalo
const PHOTOS = [
  "t1.JPG",
   "t2.JPG",
    "t4.JPG",
     "t3.JPG",
  
];

export default function BirthdayPage() {
  const [typed, setTyped] = useState("");
  const [answered, setAnswered] = useState(false);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setTyped(WISH.slice(0, i + 1));
      i++;
      if (i >= WISH.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);

  // "Yes" dabne ke baad sirf quiz dikhega, baaki sab hat jaayega
  if (answered) {
    return (
      <div className="page quiz-only">
        <PhotoQuiz />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero glass">
        <h1 className="hero-title">Happy Birthday, {NAME} ♥️🎂</h1>
        <p className="hero-sub">it's only for u Honey 💗</p>
      </header>

      <section className="glass card">
        <h2>For my Side 🫶🏻</h2>
        <p className="wish">{typed}<span className="caret">|</span></p>
      </section>

      <section className="gallery">
        {PHOTOS.map((src, i) => (
          <img key={i} src={src} alt={`Memory ${i + 1}`} className="photo glass" />
        ))}
      </section>

      <section className="glass card">
        <h2>Can we play A Small Game? 💕</h2>
        <p>plzzz... Yrwww No mt boliyooo 😭🙏🏻</p>
        <div className="game-row">
          <button className="btn yes" onClick={() => setAnswered(true)}>Yes</button>
          <RunawayNo />
        </div>
      </section>
    </div>
  );
}
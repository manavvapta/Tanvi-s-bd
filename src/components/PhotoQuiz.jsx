import { useState } from "react";
import "./PhotoQuiz.css";

// Yahan apni photos aur sawal daalo
const QUESTIONS = [
  {
    image: "t11.JPG",
    question: "Saste Nashe km kiya kar 😂",
    options: [
      { label: "Sach mein🥹", reply: "hannn 😁" },
      { label: "Nhi😤", reply: "thik hai 😒" },
      { label: "jesi hu wesi theek hu 🙈", reply: "👉👈💖" },
    ],
  },
  {
    image: "t12.JPG",
    question: "Tumhari sabse kharab adat?",
    options: [
      { label: "stikers 😭", reply: "👺" },
      { label: "bat bat pr Backchodi😒", reply: "😡" },
      { label: "Kuch nahi🙄", reply: "🙂" },
    ],
  },
  {
    image: "t13.JPG",
    question: "What u think. Why i'm liking you because?",
    options: [
      { label: "you r cuteeeeiiiii😻", reply: "nhi hai😽" },
      { label: "you r understanding 🫶🏻", reply: "nhi hai💞" },
      { label: "same habites✊", reply: "ji 👉👈" },
    ],
  },
];

export default function PhotoQuiz({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  const choose = (option) => {
    if (selected) return;
    setSelected(option);
  };

  const next = () => {
    if (index + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <section className="glass quiz-card final">
        <h2>many many returns of the day Bebe 💖</h2>
        <p>One Last step let's fuck the Cake 🎂😄</p>
        <button className="btn" onClick={onFinish}>
          okiiiee 😚🎂
        </button>
      </section>
    );
  }

  return (
    <section className="glass quiz-card">
      <div className="quiz-progress">
        {index + 1} / {QUESTIONS.length}
      </div>

      <img src={current.image} alt="Quiz" className="quiz-img" />
      <h2>{current.question}</h2>

      <div className="options">
        {current.options.map((opt, i) => (
          <button
            key={i}
            className={`option ${selected === opt ? "picked" : ""} ${selected && selected !== opt ? "dim" : ""}`}
            onClick={() => choose(opt)}
            disabled={!!selected}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="reply glass">
          <p>{selected.reply}</p>
          <button className="btn" onClick={next}>
            {index + 1 >= QUESTIONS.length ? "Result dekho" : "Next ➜"}
          </button>
        </div>
      )}
    </section>
  );
}

import { useState } from "react";
import "./PhotoQuiz.css";

// Yahan apni photos aur sawal daalo
const QUESTIONS = [
  {
    image: "t11.JPG",
    question: "Ye photo dekh ke kya lagta hai?",
    options: [
      { label: "Sach mein cute hai 🥹", reply: "Haan, aur tum sabse cute ho 💕" },
      { label: "Thoda ajeeb lag raha hai 😤", reply: "Ruko, main tumhe baad mein dekhta hoon 😏" },
      { label: "Ye main hi hoon 🙈", reply: "Haan, aur yehi mera favourite hai 💖" },
    ],
  },
  {
    image: "t12.JPG",
    question: "Is din tum kya soch rahi thi?",
    options: [
      { label: "Pizza 🍕", reply: "Pizza ke liye bhi main hi le jaunga 😄" },
      { label: "Mujhe 🥰", reply: "Pakka, main bhi tumhe hi soch raha tha 💕" },
      { label: "Kuch nahi 🙄", reply: "Ye bahana nahi chalega, sach batao 😜" },
    ],
  },
  {
    image: "t13.JPG",
    question: "Tum sabse zyada kya karti ho?",
    options: [
      { label: "Mujhe chidhati ho 😂", reply: "Bilkul, aur main bhi tumhe chidhata hoon 😌" },
      { label: "Mujhse pyaar karti ho ❤️", reply: "Ye sach hai, aur ye hamesha rahega 💞" },
      { label: "Sote rehti ho 😴", reply: "Ye sach hai, par tumhare sapne mein main aata hoon 😘" },
    ],
  },
];

export default function PhotoQuiz() {
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
        <h2>Result 💖</h2>
        <p>Tum sabse cute ho aur main tumhe hamesha chidhata rahunga 😄</p>
        <button className="btn" onClick={() => { setIndex(0); setSelected(null); setFinished(false); }}>
          Phir se khelo
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
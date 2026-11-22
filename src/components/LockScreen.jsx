import { useState } from "react";
import "./LockScreen.css";

const PASSCODE = "2008";
const KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

export default function LockScreen({ onUnlock }) {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);

  const press = (key) => {
    if (key === "⌫") return setCode((c) => c.slice(0, -1));
    if (key === "" || code.length >= 4) return;

    const next = code + key;
    setCode(next);

    if (next.length === 4) {
      if (next === PASSCODE) {
        setTimeout(onUnlock, 350);
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setCode(""); }, 500);
      }
    }
  };

  return (
    <div className="lock">
      <div className="lock-top">
        <div className="lock-date">Tanvi's Day 🥳</div>
        <h1 className="lock-title">Unlock ur bd gift💝</h1>
        <p className="lock-hint">Passcode ?</p>
      </div>

      <div className={`dots ${shake ? "shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`dot ${i < code.length ? "filled" : ""}`} />
        ))}
      </div>

      <div className="keypad">
        {KEYS.map((k, i) => (
          <button
            key={i}
            className={`key glass ${k === "" ? "empty" : ""}`}
            onClick={() => press(k)}
            disabled={k === ""}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
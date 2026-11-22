import { useEffect, useState } from "react";
import "./HeartLoader.css";

export default function HeartLoader({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2600);
    const t2 = setTimeout(onDone, 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`loader ${fading ? "fade-out" : ""}`}>
      <div className="heart-wrap">
        <svg className="heart" viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.6-9.5-9.1C1 8.6 3 5 6.5 5c2 0 3.5 1.2 5.5 3.2C14 6.2 15.5 5 17.5 5 21 5 23 8.6 21.5 11.9 19.5 16.4 12 21 12 21z" />
        </svg>
        <div className="fill" />
      </div>
      <p className="loader-text">Loading your surprise babe...🥀</p>
    </div>
  );
}
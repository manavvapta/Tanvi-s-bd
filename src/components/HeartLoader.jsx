import { useEffect, useRef, useState } from "react";
import "./HeartLoader.css";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.5-9.1C1 8.6 3 5 6.5 5c2 0 3.5 1.2 5.5 3.2C14 6.2 15.5 5 17.5 5 21 5 23 8.6 21.5 11.9 19.5 16.4 12 21 12 21z";

export default function HeartLoader({ onDone }) {
  const [fading, setFading] = useState(false);

  // Ref use kiya taaki parent ke re-render par timers reset na hon
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2600);
    const t2 = setTimeout(() => doneRef.current(), 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`loader ${fading ? "fade-out" : ""}`}>
      <div className="heart-wrap">
        <svg className="heart" viewBox="0 0 24 24">
          <defs>
            <clipPath id="heartClip">
              <path d={HEART_PATH} />
            </clipPath>
            <linearGradient id="heartGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#c2185b" />
              <stop offset="100%" stopColor="#ffa3c4" />
            </linearGradient>
          </defs>

          {/* Base heart (halka white) */}
          <path d={HEART_PATH} className="heart-base" />

          {/* Pink fill, heart ke andar neeche se upar uthta hai */}
          <g clipPath="url(#heartClip)">
            <rect
              className="heart-fill"
              x="0"
              y="0"
              width="24"
              height="24"
              fill="url(#heartGrad)"
            />
          </g>

          {/* Outline sabse upar */}
          <path d={HEART_PATH} className="heart-outline" />
        </svg>
      </div>
      <p className="loader-text">Loading Your Surprise Babe...♥️🥀</p>
    </div>
  );
}
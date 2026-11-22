import { useState } from "react";
import "./RunawayNo.css";

export default function RunawayNo() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const run = () => {
    setPos({
      x: (Math.random() - 0.5) * 220,
      y: (Math.random() - 0.5) * 120,
    });
  };

  return (
    <button
      className="btn no"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseEnter={run}
      onTouchStart={run}
      onClick={run}
    >
      No
    </button>
  );
}
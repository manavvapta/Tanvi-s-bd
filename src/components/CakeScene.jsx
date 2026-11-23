import { useEffect, useState } from "react";
import Celebration from "./Celebration.jsx";
import "./CakeScene.css";

const WISHES = [
  "Happy Birthday Tanvi 🎂",
  "Hamesha itni hi khush raho 💖",
  "Tumhari har wish poori ho ✨",
  "Mere saath har din aur bhi pyara ho 🫶🏻",
  "Bahut sara pyaar, bebe 💕",
];

const ALBUM = [
  { src: "/photos/t1.JPG", caption: "Meri favourite smile 🥹" },
  { src: "/photos/t2.JPG", caption: "Hamesha tumhare saath 💕" },
  { src: "/photos/t3.JPG", caption: "Cutest memory 😻" },
  { src: "/photos/t4.JPG", caption: "Bebe 🫶🏻" },
];

export default function CakeScene() {
  const [stage, setStage] = useState("wishes"); // wishes | candle | cutting | gift | album
  const [wishIndex, setWishIndex] = useState(0);
  const [lit, setLit] = useState(true);
  const [blows, setBlows] = useState(0);
  const [msg, setMsg] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  // Wishes ek-ek karke dikhao
  useEffect(() => {
    if (stage !== "wishes" || wishIndex >= WISHES.length) return;
    const t = setTimeout(() => setWishIndex((i) => i + 1), 1100);
    return () => clearTimeout(t);
  }, [stage, wishIndex]);

  const blow = () => {
    if (!lit || blows >= 2) return;
    const next = blows + 1;
    setBlows(next);
    setLit(false);

    if (next === 1) {
      setMsg("Oops! Candle phir jal gayi 😜 ek aur try karo!");
      setTimeout(() => setLit(true), 1500);
    } else {
      setMsg("Wish poori hogi! 🎉");
      setCelebrate(true);
    }
  };

  const cutCake = () => {
    setStage("cutting");
    setTimeout(() => setStage("gift"), 1800);
  };

  const openGift = () => {
    setGiftOpen(true);
    setTimeout(() => setStage("album"), 900);
  };

  const showCake = stage === "candle" || stage === "cutting";

  return (
    <div className="cake-scene">
      {celebrate && <Celebration />}

      {stage === "wishes" && (
        <>
          <h2 className="cake-title">Make a wish ✨</h2>
          <div className="wish-list">
            {WISHES.slice(0, wishIndex).map((w, i) => (
              <div key={i} className="glass wish-item">{w}</div>
            ))}
          </div>
          {wishIndex >= WISHES.length && (
            <button className="btn" onClick={() => setStage("candle")}>See ur Cake 🎂</button>
          )}
        </>
      )}

      {showCake && (
        <>
          <h2 className="cake-title">Candle bujhao 🕯️</h2>
          <div className="cake-stage">
            <div className="candle">
              {lit && <span className="flame" />}
            </div>

            <div className={`cake ${stage === "cutting" ? "split" : ""}`}>
              <div className="half left">
                <CakeBody />
              </div>
              <div className="half right">
                <CakeBody />
              </div>
              {stage === "cutting" && <div className="knife">🔪</div>}
            </div>
            <div className="plate" />
          </div>

          {stage === "candle" && blows < 2 && (
            <button className="btn" onClick={blow} disabled={!lit}>💨 Blow</button>
          )}
          {stage === "candle" && blows === 2 && (
            <button className="btn" onClick={cutCake}>Cake cut karo ✂️</button>
          )}
          {msg && <div className="glass cake-msg">{msg}</div>}
        </>
      )}

      {stage === "gift" && (
        <>
          <h2 className="cake-title">Tumhara gift 🎁</h2>
          <div className="gift-wrap" onClick={openGift}>
            <div className={`gift-box ${giftOpen ? "open" : ""}`}>
              <div className="gift-lid" />
              <div className="gift-ribbon" />
            </div>
          </div>
          <button className="btn" onClick={openGift}>Gift kholo 🎀</button>
        </>
      )}

      {stage === "album" && (
        <>
          <h2 className="cake-title">Our memories 📸</h2>
          <div className="album-grid">
            {ALBUM.map((p, i) => (
              <figure key={i} className="polaroid" style={{ "--i": i }}>
                <img src={p.src} alt={p.caption} />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="the-end">The End 💖</p>
        </>
      )}
    </div>
  );
}

function CakeBody() {
  return (
    <div className="cake-body">
      <div className="sponge" />
      <div className="icing" />
      <div className="sprinkles" />
    </div>
  );
}
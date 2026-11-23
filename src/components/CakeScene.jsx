
import { useEffect, useRef, useState } from "react";
import Celebration from "./Celebration.jsx";
import useMicBlow from "../hooks/useMicBlow.js";
import Album from "./Album.jsx";
import "./CakeScene.css";

const WISHES = [
  "Happy Birthday, Tanvi 🎂",
  "Always stay this happy 💖",
  "May all your wishes come true ✨",
  "May every day with me be even more special 🫶🏻",
  "Sending you lots of love, bebe 💕",
];

const LOVE_LETTER = [
  "The first time I saw you on Instagram, I thought, 'If I ever find a friend, I hope she's just like her.' ❤️",
  "I'm so glad you commented on my reel 😂 Otherwise, a crazy person like me might never have found someone like you!",
  "You're exactly my kind of person, babe. I'm really lucky to have found a friend like you. 🫶🏻",
  "I hope we always stay together, make countless memories, laugh at stupid things, and never stop being ourselves. ❤️",
  "Anyway, enjoy your day, bestie! How did you like the surprise? It took me SO much effort to make this happen 😭😂",
];

const CHARGE_STEP = 4; // How much breath is added during each hold tick

export default function CakeScene() {
  const [stage, setStage] = useState("wishes");

  return (
    <div className="cake-scene">
      {stage === "wishes" && <WishesStage onDone={() => setStage("candles")} />}
      {stage === "candles" && <CandleStage onDone={() => setStage("cutting")} />}
      {stage === "cutting" && <CuttingStage onDone={() => setStage("gift")} />}
      {stage === "gift" && <GiftStage onDone={() => setStage("album")} />}
      {stage === "album" && <Album onDone={() => setStage("message")} />}
      {stage === "message" && <MessageStage />}
    </div>
  );
}

/* ---------- Stage 1: Wishes ---------- */
function WishesStage({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= WISHES.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 1100);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="stage">
      <h2 className="stage-title">Make a wish ✨</h2>
      <div className="wish-list">
        {WISHES.slice(0, count).map((w, i) => (
          <div key={i} className="glass wish-item">
            {w}
          </div>
        ))}
      </div>
      {count >= WISHES.length && (
        <button className="btn" onClick={onDone}>
          View Your Cake 🎂
        </button>
      )}
    </div>
  );
}

/* ---------- Stage 2: Candles (hold game + mic blow) ---------- */
function CandleStage({ onDone }) {
  const [lit, setLit] = useState([true, true, true]);
  const [charge, setCharge] = useState(0);
  const [holding, setHolding] = useState(false);
  const [relit, setRelit] = useState(false);
  const [msg, setMsg] = useState("Turn on your mic or press and hold to blow 💨");
  const [finished, setFinished] = useState(false);

  const target = lit.indexOf(true);

  // The first lit candle goes out when the mic detects a blow
  const blowOut = () => {
    setLit((prev) => {
      const t = prev.indexOf(true);
      if (t === -1) return prev;
      const next = [...prev];
      next[t] = false;
      return next;
    });
  };

  const mic = useMicBlow({ onBlow: blowOut });

  // Hold game: Keep the button pressed to build up breath
  useEffect(() => {
    if (!holding || target === -1) return;
    const id = setInterval(() => {
      setCharge((c) => Math.min(100, c + CHARGE_STEP));
    }, 60);
    return () => clearInterval(id);
  }, [holding, target]);

  // The candle goes out when the breath meter is full
  useEffect(() => {
    if (charge < 100 || target === -1) return;
    setLit((prev) => prev.map((on, i) => (i === target ? false : on)));
    setCharge(0);
    setHolding(false);
  }, [charge, target]);

  // Candle 2 lights up once again as a little surprise
  useEffect(() => {
    if (relit || lit[0] || lit[1]) return;
    const t = setTimeout(() => {
      setLit((prev) => prev.map((on, i) => (i === 1 ? true : on)));
      setRelit(true);
      setMsg("Oops! One candle is lit again 😜 Give it another try!");
    }, 1200);
    return () => clearTimeout(t);
  }, [lit, relit]);

  // All candles are out: game completed
  useEffect(() => {
    if (lit.some(Boolean)) return;
    setMsg("Your wish is on its way! 🎉 Now it's time to cut the cake 🫶🏻");
    setFinished(true);
    mic.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lit]);

  const stopHolding = () => {
    setHolding(false);
    setCharge(0);
  };

  return (
    <div className="stage">
      <h2 className="stage-title">Blow out the candles 🕯️</h2>
      <Cake lit={lit} />

      {finished && <Celebration />}

      {!finished && (
        <>
          <div className="breath">
            <div className="breath-fill" style={{ width: `${charge}%` }} />
          </div>

          <button
            className="btn blow-btn"
            onPointerDown={() => setHolding(true)}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
          >
            💨 Press and hold to blow
          </button>

          {mic.status === "idle" && (
            <button className="btn ghost" onClick={mic.start}>
              🎤 Blow using microphone
            </button>
          )}
          {mic.status === "asking" && <p className="mic-note">Waiting for microphone permission...</p>}
          {mic.status === "on" && <p className="mic-note">🎤 Microphone is on. Blow now!</p>}
          {mic.status === "denied" && (
            <p className="mic-note">Microphone access denied. Use the hold button instead 💕</p>
          )}
          {mic.status === "unsupported" && (
            <p className="mic-note">Your browser does not support microphone access. Please use the hold button.</p>
          )}
        </>
      )}

      <div className="glass cake-msg">{msg}</div>

      {finished && (
        <button className="btn" onClick={onDone}>
          Cut the cake 🎂
        </button>
      )}
    </div>
  );
}

/* ---------- Stage 3: Cutting ---------- */
function CuttingStage({ onDone }) {
  // Using a ref prevents the timer from resetting on parent re-renders
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => doneRef.current(), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="stage">
      <h2 className="stage-title">Cutting the birthday cake 🎂</h2>
      <Cake lit={[false, false, false]} cut />
      <Celebration />
    </div>
  );
}

/* ---------- Stage 4: Gift ---------- */
function GiftStage({ onDone }) {
  const [opened, setOpened] = useState(false);

  const openGift = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(onDone, 1400);
  };

  return (
    <div className="stage">
      <h2 className="stage-title">A little gift for you 🎁</h2>
      <div className="gift-wrap" onClick={openGift}>
        <div className={`gift-box ${opened ? "open" : ""}`}>
          <div className="gift-lid" />
          <div className="gift-ribbon" />
        </div>
      </div>
      {!opened && (
        <button className="btn" onClick={openGift}>
          Open your gift 🎀
        </button>
      )}
    </div>
  );
}

/* ---------- Stage 5: Love letter ---------- */
function MessageStage() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= LOVE_LETTER.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 2400);
    return () => clearTimeout(t);
  }, [shown]);

  const done = shown >= LOVE_LETTER.length;

  return (
    <div className="stage">
      <Celebration />
      <div className="glass letter">
        {LOVE_LETTER.slice(0, shown).map((line, i) => (
          <p key={i} className="letter-line">
            {line}
          </p>
        ))}
      </div>
      {done && <p className="the-end">The End 💖</p>}
    </div>
  );
}

/* ---------- Shared 3-tier cake ---------- */
function Cake({ lit = [true, true, true], cut = false }) {
  return (
    <div className={`cake3d ${cut ? "is-cut" : ""}`}>
      <div className="candles">
        {lit.map((on, i) => (
          <div key={i} className="candle-stick">
            {on ? (
              <span className="flame" style={{ animationDelay: `${i * 0.07}s` }} />
            ) : (
              <span className="smoke" />
            )}
          </div>
        ))}
      </div>

      <div className="tier tier-top">
        <div className="drips" />
      </div>
      <div className="tier tier-mid">
        <div className="drips" />
      </div>
      <div className="tier tier-bottom">
        <div className="drips" />
      </div>

      <div className="plate" />
      <div className="slice" />
      <div className="knife">🔪</div>
    </div>
  );
}

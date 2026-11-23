import { useEffect, useRef, useState } from "react";

export default function useMicBlow({ onBlow, threshold = 0.12, sustain = 250 }) {
  const [status, setStatus] = useState("idle"); // idle | asking | on | denied | unsupported

  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const onBlowRef = useRef(onBlow);
  onBlowRef.current = onBlow;

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close();
    streamRef.current = null;
    ctxRef.current = null;
    setStatus("idle");
  };

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    setStatus("asking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      await ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      let loudSince = 0;
      let lastBlow = 0;

      const loop = () => {
        analyser.getByteTimeDomainData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const volume = Math.sqrt(sum / data.length);
        const now = performance.now();

        if (volume > threshold) {
          if (!loudSince) loudSince = now;
          if (now - loudSince > sustain && now - lastBlow > 800) {
            lastBlow = now;
            loudSince = 0;
            onBlowRef.current?.();
          }
        } else {
          loudSince = 0;
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      setStatus("on");
      loop();
    } catch {
      setStatus("denied");
    }
  };

  // Component unmount hone par mic band ho jaaye
  useEffect(() => stop, []);

  return { status, start, stop };
}
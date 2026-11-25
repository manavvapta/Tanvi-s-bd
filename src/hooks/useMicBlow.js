import { useEffect, useRef, useState } from "react";

// Tuning values: inhe apne phone ke hisaab se badal sakte ho
const DEFAULTS = {
  minVolume: 0.2,   // phoonk itni tez honi chahiye (0 se 1). Speaker se bhi awaaz aayegi toh ye badhao
  minLowRatio: 0.6, // kitna sound bass (low frequency) wala ho. Phoonk = zyada, bolna = kam
  sustain: 180,     // itni der (ms) lagatar phoonk jaari rahe
  cooldown: 900,    // do blow ke beech gap (ms)
};

const LOW_CUTOFF_HZ = 350;  // isse neeche ki awaaz = phoonk wali hawa
const VOICE_CUTOFF_HZ = 3000; // bolne ki awaaz ka range

export default function useMicBlow({ onBlow, ...options }) {
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

    const opts = { ...DEFAULTS, ...options };

    setStatus("asking");
    try {
      // echoCancellation: speaker ki awaaz mic se hat jaaye
      // noiseSuppression off: taaki phoonk wali hawa ko filter na kare
      // autoGainControl off: mic ki volume apne aap na badhe
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      await ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.3;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const binHz = ctx.sampleRate / analyser.fftSize;
      const lowEnd = Math.floor(LOW_CUTOFF_HZ / binHz);
      const voiceEnd = Math.floor(VOICE_CUTOFF_HZ / binHz);

      const timeData = new Float32Array(analyser.fftSize);
      const freqData = new Float32Array(analyser.frequencyBinCount);

      let blowStart = 0;
      let lastBlow = 0;

      const loop = () => {
        analyser.getFloatTimeDomainData(timeData);
        analyser.getFloatFrequencyData(freqData);

        // 1. Awaaz kitni tez hai (volume)
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          sum += timeData[i] * timeData[i];
        }
        const rms = Math.sqrt(sum / timeData.length);

        // 2. Energy kitni bass (phoonk) mein hai aur kitni voice mein
        let lowPower = 0;
        let voicePower = 0;
        for (let i = 1; i <= voiceEnd; i++) {
          const power = 10 ** (freqData[i] / 10);
          if (i <= lowEnd) lowPower += power;
          else voicePower += power;
        }
        const lowRatio = lowPower / (lowPower + voicePower + 1e-12);

        // 3. Dono conditions ek saath sach hon, tab hi phoonk maano
        const now = performance.now();
        const isBlow = rms > opts.minVolume && lowRatio > opts.minLowRatio;

        if (isBlow) {
          if (!blowStart) blowStart = now;
          if (now - blowStart >= opts.sustain && now - lastBlow > opts.cooldown) {
            lastBlow = now;
            blowStart = 0;
            onBlowRef.current?.();
          }
        } else {
          blowStart = 0;
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
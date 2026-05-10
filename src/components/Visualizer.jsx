import { useEffect, useRef } from "react";

const audioCtxRef = { current: null };
const sourceRef = { current: null };
const analyserRef = { current: null };

export default function Visualizer({ audioElement, isPlaying }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!audioElement) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    const audioCtx = audioCtxRef.current;

    if (!sourceRef.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audioElement);
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 64;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtx.destination);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barW = canvas.width / dataArray.length;
      dataArray.forEach((val, i) => {
        const barH = (val / 255) * canvas.height;
        const color =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--album-color")
            .trim() || "rgb(99,102,241)";
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(i * barW, canvas.height - barH, barW - 1, barH);
      });
    };

    if (isPlaying) {
      if (audioCtx.state === "suspended") audioCtx.resume();
      draw();
    } else {
      cancelAnimationFrame(animRef.current);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, audioElement]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={40}
      style={{ borderRadius: "6px", opacity: 0.85 }}
    />
  );
}

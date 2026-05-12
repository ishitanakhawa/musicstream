import { useState, useEffect } from "react";

/**
 * LyricsStrip — always-visible lyrics panel that sits just above the player.
 * Current line: large + bold white.
 * Next lines: progressively dimmed.
 * Only visible when a track is playing and has lyrics.
 */
export default function LyricsStrip({ track, currentTime, isPlaying }) {
  const [activeIdx, setActiveIdx] = useState(-1);

  const lyrics = track?.lyrics;

  useEffect(() => {
    if (!lyrics || !lyrics.length) { setActiveIdx(-1); return; }
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) idx = i;
      else break;
    }
    setActiveIdx(idx);
  }, [currentTime, lyrics]);

  if (!track || !lyrics || !lyrics.length) return null;

  // Show current line + next 2 lines
  const lines = [
    { text: lyrics[activeIdx]?.text ?? "", dim: 0 },
    { text: lyrics[activeIdx + 1]?.text ?? "", dim: 1 },
    { text: lyrics[activeIdx + 2]?.text ?? "", dim: 2 },
  ];

  return (
    <div className={`lyrics-strip ${isPlaying ? "lyrics-strip--playing" : "lyrics-strip--paused"}`}>
      <div className="lyrics-strip__inner">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`lyrics-strip__line lyrics-strip__line--dim${line.dim}`}
          >
            {line.text || "\u00A0"}
          </p>
        ))}
      </div>
    </div>
  );
}

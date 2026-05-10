import Icon, { Icons } from "./Icon";
import { fmt } from "../util";


const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const secs = Math.floor(s);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
};

export default function Player({
  track,
  isPlaying,
  toggle,
  next,
  prev,
  progress,
  setProgress, // progress: 0–1, setProgress(ratio) seeks
  duration, // real audio duration in seconds
  volume,
  setVolume,
  shuffle,
  toggleShuffle,
  repeat,
  toggleRepeat,
}) {
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    setProgress(ratio);
  };

  const currentSec = (progress || 0) * (duration || 0);

  if (!track) {
    return (
      <footer className="player player--empty">
        <span>Pick a song to start playing ♪</span>
      </footer>
    );
  }

  return (
    <footer className="player">
      {/* Left – track info */}
      <div className="player__info">
        <img src={track.cover} alt={track.title} className="player__cover" />
        <div>
          <div className="player__title">{track.title}</div>
          <div className="player__artist">{track.artist}</div>
        </div>
      </div>

      {/* Center – controls + progress */}
      <div className="player__center">
        <div className="player__controls">
          <button
            className={`icon-btn ${shuffle ? "icon-btn--accent" : ""}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Icon d={Icons.shuffle} size={15} />
          </button>

          <button
            className="icon-btn icon-btn--lg"
            onClick={prev}
            title="Previous"
          >
            <Icon d={Icons.prev} fill="currentColor" stroke="none" size={20} />
          </button>

          <button
            className="play-btn"
            onClick={toggle}
            title={isPlaying ? "Pause" : "Play"}
          >
            <Icon
              d={isPlaying ? Icons.pause : Icons.play}
              fill="currentColor"
              stroke="none"
              size={20}
            />
          </button>

          <button className="icon-btn icon-btn--lg" onClick={next} title="Next">
            <Icon d={Icons.skip} fill="currentColor" stroke="none" size={20} />
          </button>

          <button
            className={`icon-btn ${repeat !== "none" ? "icon-btn--accent" : ""}`}
            onClick={toggleRepeat}
            title={`Repeat: ${repeat}`}
          >
            <Icon d={Icons.repeat} size={15} />
            {repeat === "one" && <span className="repeat-badge">1</span>}
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-bar__track" onClick={handleSeek}>
            <div
              className="progress-bar__fill"
              style={{ width: `${(progress || 0) * 100}%` }}
            />
            <div
              className="progress-bar__thumb"
              style={{ left: `${(progress || 0) * 100}%` }}
            />
          </div>
          <div className="progress-bar__times">
            <span>{fmt(currentSec)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* Right – volume */}
      <div className="player__right">
        <button
          className="icon-btn"
          onClick={() => setVolume(volume === 0 ? 75 : 0)}
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          <Icon d={volume === 0 ? Icons.volumeMute : Icons.volume} size={15} />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
          title={`Volume: ${volume}%`}
        />
        <span className="volume-label">{volume}</span>
      </div>
    </footer>
  );
}
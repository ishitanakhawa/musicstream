import Icon, { Icons } from "./Icon";
import { fmt } from "../util";

export default function Player({
  track,
  isPlaying,
  toggle,
  next,
  prev,
  progress,
  setProgress,
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

  if (!track) {
    return (
      <footer className="player player--empty">
        <span>Nothing playing</span>
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

          <button className="icon-btn icon-btn--lg" onClick={prev}>
            <Icon d={Icons.prev} fill="currentColor" stroke="none" size={20} />
          </button>

          <button className="play-btn" onClick={toggle}>
            <Icon
              d={isPlaying ? Icons.pause : Icons.play}
              fill="white"
              stroke="none"
              size={20}
            />
          </button>

          <button className="icon-btn icon-btn--lg" onClick={next}>
            <Icon d={Icons.skip} fill="currentColor" stroke="none" size={20} />
          </button>

          <button
            className={`icon-btn ${repeat !== "none" ? "icon-btn--accent" : ""}`}
            onClick={toggleRepeat}
            title="Repeat"
          >
            <Icon d={Icons.repeat} size={15} />
            {repeat === "one" && <span className="repeat-badge">1</span>}
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" onClick={handleSeek}>
          <div className="progress-bar__track">
            <div
              className="progress-bar__fill"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="progress-bar__thumb"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <div className="progress-bar__times">
            <span>{fmt(Math.floor(progress * track.duration))}</span>
            <span>{fmt(track.duration)}</span>
          </div>
        </div>
      </div>

      {/* Right – volume */}
      <div className="player__right">
        <Icon d={volume === 0 ? Icons.volumeMute : Icons.volume} size={15} />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
        />
        <span className="volume-label">{volume}</span>
      </div>
    </footer>
  );
}

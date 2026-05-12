import Icon, { Icons } from "./Icon";
import Visualizer from "./Visualizer";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const secs = Math.floor(s);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
};

export default function Player({
  audioRef,
  track,
  isPlaying,
  toggle,
  next,
  prev,
  progress,
  setProgress,
  duration,
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
      {/* Left controls: shuffle, prev, next, repeat */}
      <div className="player__left-controls">
        <button
          className={`player-ctrl-btn ${shuffle ? "player-ctrl-btn--active" : ""}`}
          onClick={toggleShuffle}
          title="Shuffle"
        >
          <Icon d={Icons.shuffle} size={17} />
        </button>
        <button className="player-ctrl-btn" onClick={prev} title="Previous">
          <Icon d={Icons.prev} fill="currentColor" stroke="none" size={22} />
        </button>
      </div>

      {/* Center pill: cover + title + progress + play/pause */}
      <div className="player__pill">
        <div className="player__pill-track" onClick={handleSeek}>
          <div
            className="player__pill-fill"
            style={{ width: `${(progress || 0) * 100}%` }}
          />
        </div>
        <div className="player__pill-inner">
          <img
            src={track.cover}
            alt={track.title}
            className={`player__pill-cover ${isPlaying ? 'spin-animation' : ''}`}
            style={{ borderRadius: '50%' }}
          />
          <div className="player__pill-info">
            <div className="player__pill-title">{track.title}</div>
            <div className="player__pill-artist">{track.artist}</div>
          </div>
          <div className="player__pill-times">
            <span>{fmt(currentSec)}</span>
            <span>{fmt(duration)}</span>
          </div>
          <button className="play-btn" onClick={toggle}>
            <Icon
              d={isPlaying ? Icons.pause : Icons.play}
              fill="currentColor"
              stroke="none"
              size={20}
            />
          </button>
        </div>
      </div>

      {/* Right controls: next, repeat, visualizer, volume */}
      <div className="player__right-controls">
        <button className="player-ctrl-btn" onClick={next} title="Next">
          <Icon d={Icons.skip} fill="currentColor" stroke="none" size={22} />
        </button>
        <button
          className={`player-ctrl-btn ${repeat !== "none" ? "player-ctrl-btn--active" : ""}`}
          onClick={toggleRepeat}
          title="Repeat"
        >
          <Icon d={Icons.repeat} size={17} />
          {repeat === "one" && <span className="repeat-badge">1</span>}
        </button>
        <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
        <button
          className="player-ctrl-btn"
          onClick={() => setVolume(volume === 0 ? 75 : 0)}
        >
          <Icon d={volume === 0 ? Icons.volumeMute : Icons.volume} size={17} />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
        />
      </div>
    </footer>
  );
}

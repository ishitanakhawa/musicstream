import Icon, { Icons } from "../components/Icon";
import { fmt } from "../util";

export default function QueueView({
  queue,
  currentTrack,
  isPlaying,
  onPlay,
  onRemove,
}) {
  return (
    <div className="view">
      <h1 className="view__heading">Queue</h1>

      {queue.length === 0 && (
        <p className="empty-state">Your queue is empty.</p>
      )}

      <div className="track-list">
        {queue.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className={`track-row ${currentTrack?.id === t.id ? "track-row--active" : ""}`}
          >
            <div className="track-row__cover" onClick={() => onPlay(t)}>
              <img src={t.cover} alt={t.title} />
              <div className="track-row__play-overlay">
                <Icon
                  d={
                    currentTrack?.id === t.id && isPlaying
                      ? Icons.pause
                      : Icons.play
                  }
                  fill="white"
                  stroke="none"
                  size={16}
                />
              </div>
            </div>
            <div className="track-row__info">
              <span className="track-row__title">{t.title}</span>
              <span className="track-row__artist">{t.artist}</span>
            </div>
            <span className="track-row__dur">{fmt(t.duration)}</span>
            <button className="icon-btn" onClick={() => onRemove(i)}>
              <Icon d={Icons.close} size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

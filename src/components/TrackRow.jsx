import Icon, { Icons } from "./Icon";
import { fmt } from "../util";

export default function TrackRow({
  track,
  isPlaying,
  isCurrent,
  onPlay,
  onLike,
  liked,
  onAddToQueue,
  onAddToPlaylist,
}) {
  return (
    <div className={`track-row ${isCurrent ? "track-row--active" : ""}`}>
      <div className="track-row__cover" onClick={onPlay}>
        <img src={track.cover} alt={track.title} />
        <div className="track-row__play-overlay">
          <Icon
            d={isCurrent && isPlaying ? Icons.pause : Icons.play}
            fill="white"
            stroke="none"
            size={16}
          />
        </div>
      </div>
      <div className="track-row__info">
        <span className="track-row__title">{track.title}</span>
        <span className="track-row__artist">{track.artist}</span>
      </div>
      <span className="track-row__genre">{track.genre}</span>
      <span className="track-row__dur">{fmt(track.duration)}</span>
      <div className="track-row__actions">
        <button
          className={`icon-btn ${liked ? "icon-btn--liked" : ""}`}
          onClick={onLike}
          title="Like"
        >
          <Icon
            d={liked ? Icons.heartFill : Icons.heart}
            fill={liked ? "currentColor" : "none"}
            size={15}
          />
        </button>
        <button
          className="icon-btn"
          onClick={onAddToQueue}
          title="Add to queue"
        >
          <Icon d={Icons.queue} size={15} />
        </button>
        <button
          className="icon-btn"
          onClick={onAddToPlaylist}
          title="Add to playlist"
        >
          <Icon d={Icons.plus} size={15} />
        </button>
      </div>
    </div>
  );
}

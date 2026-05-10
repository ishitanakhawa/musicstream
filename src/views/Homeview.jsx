import Icon, { Icons } from "../components/Icon";
import TrackRow from "../components/TrackRow";

export default function HomeView({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  liked,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
}) {
  const featured = tracks.slice(0, 4);

  return (
    <div className="view">
      <h1 className="view__heading">Good Evening ✦</h1>

      <div className="featured-grid">
        {featured.map((t) => (
          <div
            key={t.id}
            className={`featured-card ${currentTrack?.id === t.id ? "featured-card--active" : ""}`}
            onClick={() => onPlay(t)}
          >
            <img src={t.cover} alt={t.title} />
            <div className="featured-card__info">
              <div className="featured-card__title">{t.title}</div>
              <div className="featured-card__artist">{t.artist}</div>
            </div>
            <div className="featured-card__overlay">
              <div className="featured-card__play">
                <Icon
                  d={
                    currentTrack?.id === t.id && isPlaying
                      ? Icons.pause
                      : Icons.play
                  }
                  fill="white"
                  stroke="none"
                  size={22}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="view__subheading">All Tracks</h2>
      <div className="track-list">
        {tracks.map((t) => (
          <TrackRow
            key={t.id}
            track={t}
            isCurrent={currentTrack?.id === t.id}
            isPlaying={isPlaying}
            onPlay={() => onPlay(t)}
            liked={liked.includes(t.id)}
            onLike={() => onLike(t.id)}
            onAddToQueue={() => onAddToQueue(t)}
            onAddToPlaylist={() => onAddToPlaylist(t)}
          />
        ))}
      </div>
    </div>
  );
}

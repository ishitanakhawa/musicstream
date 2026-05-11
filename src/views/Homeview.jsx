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
  const featured = tracks.slice(0, 6);

  return (
    <div className="view">
      <h1 className="view__heading">Good Evening ✦</h1>

      {/* Carousel */}
      <div className="carousel-wrapper">
        <div className="carousel">
          {featured.map((t, i) => {
            const isCurrent = currentTrack?.id === t.id;
            const offset =
              featured.indexOf(currentTrack) !== -1
                ? i - featured.findIndex((x) => x.id === currentTrack?.id)
                : i - 2;
            return (
              <div
                key={t.id}
                className={`carousel-card ${isCurrent ? "carousel-card--active" : ""}`}
                style={{ "--offset": offset }}
                onClick={() => onPlay(t)}
              >
                <img src={t.cover} alt={t.title} />
                <div className="carousel-card__info">
                  <div className="carousel-card__title">{t.title}</div>
                  <div className="carousel-card__artist">{t.artist}</div>
                </div>
                {!isCurrent && (
                  <div className="carousel-card__overlay">
                    <Icon d={Icons.play} fill="white" stroke="none" size={22} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

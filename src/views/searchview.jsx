import { useState } from "react";
import Icon, { Icons } from "../components/Icon";
import TrackRow from "../components/TrackRow";

const GENRES = ["All", "Synthwave", "Lo-fi", "Electronic", "Dream Pop"];

export default function SearchView({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  liked,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
}) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const filtered = tracks.filter((t) => {
    const matchGenre = genre === "All" || t.genre === genre;
    const matchQ =
      !q ||
      t.title.toLowerCase().includes(q.toLowerCase()) ||
      t.artist.toLowerCase().includes(q.toLowerCase());
    return matchGenre && matchQ;
  });

  return (
    <div className="view">
      <h1 className="view__heading">Search</h1>

      <div className="search-bar">
        <Icon d={Icons.search} size={16} />
        <input
          placeholder="Search artists, songs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
        />
        {q && (
          <button className="icon-btn" onClick={() => setQ("")}>
            <Icon d={Icons.close} size={14} />
          </button>
        )}
      </div>

      <div className="genre-chips">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-chip ${genre === g ? "genre-chip--active" : ""}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="track-list">
        {filtered.length === 0 && (
          <p className="empty-state">No results found.</p>
        )}
        {filtered.map((t) => (
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

import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

// Data
import { ARTISTS, TRACKS } from "./data";

// Components
import Sidebar from "./components/sidebar";
import Player from "./components/player";
import AddToPlaylistModal from "./components/AddToPlaylist";

// Views
import HomeView from "./views/Homeview";
import SearchView from "./views/searchview";
import LikedView from "./views/Likedview";
import QueueView from "./views/queueview";
import ArtistsView from "./views/Artistsview";
import PlaylistsView from "./views/playlistview";
import PlaylistDetailView from "./views/playlistdetailview";

export default function App() {
  const [view, setView] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState([]);
  const [queue, setQueue] = useState([...TRACKS]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Chill Mix", color: "#38bdf8", tracks: [4, 5, 9] },
    { id: 2, name: "Late Night", color: "#e879f9", tracks: [1, 6, 8] },
  ]);
  const [addModal, setAddModal] = useState(null);

  // ── Real audio element ────────────────────────────────────────────────────
  const audioRef = useRef(new Audio());

  // Sync volume whenever it changes (0–100 → 0.0–1.0)
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  // Load + play when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.audio;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    // Update progress bar from real audio time
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  // Play / pause in sync with isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ── Playback controls ─────────────────────────────────────────────────────
  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying((p) => !p);
      return;
    }
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleNext = useCallback(() => {
    if (!currentTrack) return;
    if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    const pool = shuffle ? [...TRACKS].sort(() => Math.random() - 0.5) : TRACKS;
    const idx = pool.findIndex((t) => t.id === currentTrack.id);
    const next = pool[(idx + 1) % pool.length];
    setCurrentTrack(next);
    setProgress(0);
    setIsPlaying(true);
  }, [currentTrack, shuffle, repeat]);

  const handlePrev = () => {
    const audio = audioRef.current;
    // If more than 3 s in, restart current track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
    const idx = TRACKS.findIndex((t) => t.id === currentTrack?.id);
    const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    setCurrentTrack(prev);
    setProgress(0);
    setIsPlaying(true);
  };

  // Seek: called from Player progress bar click (ratio 0–1)
  const handleSeek = (ratio) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
    }
    setProgress(ratio);
  };

  // ── Misc helpers ──────────────────────────────────────────────────────────
  const toggleLike = (id) =>
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const addToQueue = (t) => setQueue((q) => [...q, t]);
  const removeFromQueue = (i) =>
    setQueue((q) => q.filter((_, idx) => idx !== i));
  const toggleRepeat = () =>
    setRepeat((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"));

  const common = {
    tracks: TRACKS,
    currentTrack,
    isPlaying,
    onPlay: handlePlay,
    liked,
    onLike: toggleLike,
    onAddToQueue: addToQueue,
    onAddToPlaylist: (t) => setAddModal(t),
  };

  const renderView = () => {
    if (view === "home") return <HomeView {...common} />;
    if (view === "search") return <SearchView {...common} />;
    if (view === "liked") return <LikedView {...common} />;
    if (view === "queue")
      return (
        <QueueView
          queue={queue}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onRemove={removeFromQueue}
        />
      );
    if (view === "artists")
      return <ArtistsView artists={ARTISTS} {...common} />;
    if (view === "playlists")
      return (
        <PlaylistsView
          playlists={playlists}
          setPlaylists={setPlaylists}
          {...common}
        />
      );
    if (view.startsWith("playlist-")) {
      const pl = playlists.find((p) => p.id === Number(view.split("-")[1]));
      if (pl) return <PlaylistDetailView playlist={pl} {...common} />;
    }
    return <HomeView {...common} />;
  };

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} playlists={playlists} />
      <main className="main">{renderView()}</main>
      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        toggle={() => setIsPlaying((p) => !p)}
        next={handleNext}
        prev={handlePrev}
        progress={progress}
        setProgress={handleSeek}
        duration={duration}
        volume={volume}
        setVolume={setVolume}
        shuffle={shuffle}
        toggleShuffle={() => setShuffle((s) => !s)}
        repeat={repeat}
        toggleRepeat={toggleRepeat}
      />
      {addModal && (
        <AddToPlaylistModal
          track={addModal}
          playlists={playlists}
          setPlaylists={setPlaylists}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  );
}
 
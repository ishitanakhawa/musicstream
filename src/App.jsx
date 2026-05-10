import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

import { ARTISTS, TRACKS } from "./data";
import { applyAlbumDNA } from "./extractColor";
import Sidebar from "./components/sidebar";
import Player from "./components/player";
import AddToPlaylistModal from "./components/AddToPlaylist";
import HomeView from "./views/Homeview";
import SearchView from "./views/searchview";
import LikedView from "./views/Likedview";
import QueueView from "./views/queueview";
import ArtistsView from "./views/Artistsview";
import PlaylistsView from "./views/playlistview";
import PlaylistDetailView from "./views/playlistdetailview";

export default function App() {
  const [view, setView] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState([]);
  const [queue, setQueue] = useState([...TRACKS]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Chill Mix", color: "#f5a623", tracks: [4, 5, 9] },
    { id: 2, name: "Late Night", color: "#e8742a", tracks: [1, 6, 8] },
  ]);
  const [addModal, setAddModal] = useState(null);

  const audioRef = useRef(new Audio());

  // ── Volume sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  // ── Load track + wire events ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.audio;
    audio.load();
    audio.volume = volume / 100;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    if (isPlaying) audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  // ── Play / pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  // ── Album DNA — repaint UI colors on every track change ───────────────────
  useEffect(() => {
    if (!currentTrack) return;
    applyAlbumDNA(currentTrack.cover, currentTrack.id);
  }, [currentTrack]);

  // ── Controls ──────────────────────────────────────────────────────────────
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
    setCurrentTrack(pool[(idx + 1) % pool.length]);
    setProgress(0);
    setIsPlaying(true);
  }, [currentTrack, shuffle, repeat]);

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
    const idx = TRACKS.findIndex((t) => t.id === currentTrack?.id);
    setCurrentTrack(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length]);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleSeek = (ratio) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

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
        audioRef={audioRef}
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

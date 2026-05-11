import Icon, { Icons } from "./Icon";

export default function Sidebar({ view, setView, playlists }) {
  const navItems = [
    { id: "home", icon: Icons.home, label: "Home" },
    { id: "search", icon: Icons.search, label: "Search" },
    { id: "liked", icon: Icons.heart, label: "Liked Songs" },
    { id: "queue", icon: Icons.queue, label: "Queue" },
    { id: "artists", icon: Icons.artist, label: "Artists" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="logo-text">MusicStream</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${view === item.id ? "nav-item--active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <Icon d={item.icon} size={17} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__section">
        <div className="sidebar__section-header">
          <span>Playlists</span>
          <button className="icon-btn" onClick={() => setView("playlists")}>
            <Icon d={Icons.plus} size={14} />
          </button>
        </div>
        {playlists.map((pl) => (
          <button
            key={pl.id}
            className={`playlist-item ${view === `playlist-${pl.id}` ? "playlist-item--active" : ""}`}
            onClick={() => setView(`playlist-${pl.id}`)}
          >
            <span className="playlist-dot" style={{ background: pl.color }} />
            {pl.name}
          </button>
        ))}
      </div>
    </aside>
  );
}

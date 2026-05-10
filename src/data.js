export const ARTISTS = [
  {
    id: 1,
    name: "Neon Drift",
    genre: "Synthwave",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=neon&backgroundColor=0f0035",
    albums: [
      {
        id: 1,
        title: "Midnight Pulse",
        cover: "https://picsum.photos/seed/album1/200",
        year: 2023,
      },
      {
        id: 2,
        title: "Chrome Dreams",
        cover: "https://picsum.photos/seed/album2/200",
        year: 2022,
      },
    ],
  },
  {
    id: 2,
    name: "Solar Haze",
    genre: "Lo-fi",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=solar&backgroundColor=1a0a2e",
    albums: [
      {
        id: 3,
        title: "Lazy Afternoons",
        cover: "https://picsum.photos/seed/album3/200",
        year: 2024,
      },
    ],
  },
  {
    id: 3,
    name: "Void Runner",
    genre: "Electronic",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=void&backgroundColor=001122",
    albums: [
      {
        id: 4,
        title: "Signal Loss",
        cover: "https://picsum.photos/seed/album4/200",
        year: 2023,
      },
      {
        id: 5,
        title: "Binary Ghost",
        cover: "https://picsum.photos/seed/album5/200",
        year: 2021,
      },
    ],
  },
  {
    id: 4,
    name: "Iris Black",
    genre: "Dream Pop",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=iris&backgroundColor=0d001a",
    albums: [
      {
        id: 6,
        title: "Glass Garden",
        cover: "https://picsum.photos/seed/album6/200",
        year: 2024,
      },
    ],
  },
];

// Audio files are local — stored in /public and served by Vite at root path
// This guarantees playback with zero CORS or 403 issues
export const TRACKS = [
  {
    id: 1,
    title: "Retrowave City",
    artist: "Neon Drift",
    genre: "Synthwave",
    albumId: 1,
    cover: "https://picsum.photos/seed/t1/200",
    audio: "/track1.mp3",
  },
  {
    id: 2,
    title: "Neon Highways",
    artist: "Neon Drift",
    genre: "Synthwave",
    albumId: 1,
    cover: "https://picsum.photos/seed/t2/200",
    audio: "/track2.mp3",
  },
  {
    id: 3,
    title: "Chromatic Pulse",
    artist: "Neon Drift",
    genre: "Synthwave",
    albumId: 2,
    cover: "https://picsum.photos/seed/t3/200",
    audio: "/track3.mp3",
  },
  {
    id: 4,
    title: "Sunday Haze",
    artist: "Solar Haze",
    genre: "Lo-fi",
    albumId: 3,
    cover: "https://picsum.photos/seed/t4/200",
    audio: "/track4.mp3",
  },
  {
    id: 5,
    title: "Coffee at 3am",
    artist: "Solar Haze",
    genre: "Lo-fi",
    albumId: 3,
    cover: "https://picsum.photos/seed/t5/200",
    audio: "/track5.mp3",
  },
  {
    id: 6,
    title: "Static Dreams",
    artist: "Void Runner",
    genre: "Electronic",
    albumId: 4,
    cover: "https://picsum.photos/seed/t6/200",
    audio: "/track6.mp3",
  },
  {
    id: 7,
    title: "Data Cascade",
    artist: "Void Runner",
    genre: "Electronic",
    albumId: 4,
    cover: "https://picsum.photos/seed/t7/200",
    audio: "/track7.mp3",
  },
  {
    id: 8,
    title: "Phantom Signal",
    artist: "Void Runner",
    genre: "Electronic",
    albumId: 5,
    cover: "https://picsum.photos/seed/t8/200",
    audio: "/track8.mp3",
  },
  {
    id: 9,
    title: "Petal Rain",
    artist: "Iris Black",
    genre: "Dream Pop",
    albumId: 6,
    cover: "https://picsum.photos/seed/t9/200",
    audio: "/track9.mp3",
  },
];

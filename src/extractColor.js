
const PALETTES = [
  { accent: "#f5a623", accent2: "#e8742a", accent3: "#ffcf72", bg: "#1c0800" },
  { accent: "#a78bfa", accent2: "#7c3aed", accent3: "#c4b5fd", bg: "#0d0118" },
  { accent: "#34d399", accent2: "#059669", accent3: "#6ee7b7", bg: "#001a0f" },
  { accent: "#38bdf8", accent2: "#0284c7", accent3: "#7dd3fc", bg: "#00101a" },
  { accent: "#f472b6", accent2: "#db2777", accent3: "#fbcfe8", bg: "#1a0010" },
  { accent: "#fb923c", accent2: "#ea580c", accent3: "#fed7aa", bg: "#1a0800" },
];

function applyPalette(p) {
  const r = document.documentElement;
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--accent2", p.accent2);
  r.style.setProperty("--accent3", p.accent3);
  r.style.setProperty("--bg", p.bg);
  r.style.setProperty(
    "--grad",
    `linear-gradient(145deg, ${p.bg} 0%, ${p.accent2}44 50%, ${p.accent}88 100%)`,
  );
  r.style.setProperty(
    "--grad-sidebar",
    `linear-gradient(180deg, ${p.bg}f8 0%, ${p.bg}fd 100%)`,
  );
  r.style.setProperty(
    "--grad-player",
    `linear-gradient(90deg, ${p.bg}cc 0%, ${p.bg}ee 100%)`,
  );
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

function extractFromCanvas(img, trackId) {
  try {
    const SIZE = 64;
    const canvas = Object.assign(document.createElement("canvas"), {
      width: SIZE,
      height: SIZE,
    });
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

    const buckets = {};
    for (let i = 0; i < data.length; i += 12) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      if (a < 128) continue;
      const brightness = (r + g + b) / 3;
      if (brightness < 25 || brightness > 230) continue;
      const key = `${Math.round(r / 40) * 40},${Math.round(g / 40) * 40},${Math.round(b / 40) * 40}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) throw new Error("no colors");

    const parse = (k) => k.split(",").map(Number);
    const [r1, g1, b1] = parse(sorted[0][0]);

    // Find second distinct color
    let r2 = r1,
      g2 = g1,
      b2 = b1;
    for (const [key] of sorted.slice(1)) {
      const [r, g, b] = parse(key);
      if (Math.abs(r - r1) + Math.abs(g - g1) + Math.abs(b - b1) > 90) {
        [r2, g2, b2] = [r, g, b];
        break;
      }
    }

    // Boost vibrancy
    const boost = (r, g, b) => {
      const max = Math.max(r, g, b);
      const f = max > 0 ? Math.min(255 / max, 1.7) : 1;
      return [Math.min(255, r * f), Math.min(255, g * f), Math.min(255, b * f)];
    };

    const [br1, bg1, bb1] = boost(r1, g1, b1);
    const [br2, bg2, bb2] = boost(r2, g2, b2);

    const accent = rgbToHex(br1, bg1, bb1);
    const accent2 = rgbToHex(br2, bg2, bb2);
    const accent3 = rgbToHex((br1 + 255) / 2, (bg1 + 255) / 2, (bb1 + 255) / 2);
    const bg = rgbToHex(
      Math.round(br1 * 0.07),
      Math.round(bg1 * 0.07),
      Math.round(bb1 * 0.07),
    );

    applyPalette({ accent, accent2, accent3, bg });
  } catch (e) {
    // Fall back to preset palette based on trackId
    applyPalette(PALETTES[trackId % PALETTES.length]);
  }
}

export function applyAlbumDNA(coverUrl, trackId) {
  // Always apply a preset immediately for instant color change
  applyPalette(PALETTES[trackId % PALETTES.length]);

  // Then try to extract real colors from the image
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => extractFromCanvas(img, trackId);
  img.onerror = () => {
    // CORS blocked — preset already applied, nothing more to do
  };

  // Try with crossOrigin first; picsum supports it
  img.src = coverUrl;
}


const PALETTES = [
  { h: 28, s: 85, l: 35 }, // warm amber
  { h: 260, s: 70, l: 40 }, // purple
  { h: 160, s: 65, l: 30 }, // teal green
  { h: 200, s: 75, l: 35 }, // ocean blue
  { h: 330, s: 70, l: 35 }, // pink
  { h: 15, s: 80, l: 32 }, // burnt orange
];

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return `#${[f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function applyTheme(h, s, l) {
  const root = document.documentElement;

  // Dark base for bg
  const bgDark = hslToHex(h, s, 8);
  const bgMid = hslToHex(h, s, 18);
  const bgBright = hslToHex(h, s, 38);
  const accent = hslToHex(h, s, 60);
  const accent2 = hslToHex(h, s + 5, 48);
  const accent3 = hslToHex(h, s - 10, 72);

  root.style.setProperty("--bg", bgDark);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent2", accent2);
  root.style.setProperty("--accent3", accent3);

  // Full-page radial gradient that changes with song
  root.style.setProperty(
    "--grad",
    `radial-gradient(ellipse 80% 60% at 60% 30%, ${bgBright}cc 0%, ${bgMid} 50%, ${bgDark} 100%)`,
  );
}

function extractFromCanvas(img, trackId) {
  try {
    const SIZE = 80;
    const canvas = Object.assign(document.createElement("canvas"), {
      width: SIZE,
      height: SIZE,
    });
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

    // Build color buckets
    const buckets = {};
    for (let i = 0; i < data.length; i += 8) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      if (a < 100) continue;
      const brightness = (r + g + b) / 3;
      if (brightness < 20 || brightness > 235) continue;

      // Convert to HSL to check saturation
      const max = Math.max(r, g, b) / 255,
        min = Math.min(r, g, b) / 255;
      const sat = max === 0 ? 0 : (max - min) / max;
      if (sat < 0.2) continue; // skip grey/brown/muted

      const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) throw new Error("no vivid colors");

    const [r, g, b] = sorted[0][0].split(",").map(Number);

    // Convert dominant color to HSL
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d !== 0) {
      if (max === rn) h = ((gn - bn) / d) % 6;
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    applyTheme(h, Math.round(s * 100), Math.round(l * 100));
  } catch {
    const p = PALETTES[trackId % PALETTES.length];
    applyTheme(p.h, p.s, p.l);
  }
}

export function applyAlbumDNA(coverUrl, trackId) {
  // Instant palette swap
  const p = PALETTES[trackId % PALETTES.length];
  applyTheme(p.h, p.s, p.l);

  // Then extract real color
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => extractFromCanvas(img, trackId);
  img.onerror = () => {};
  img.src = coverUrl;
}

import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Open Graph standard: 1200x630 (1.91:1)
const W = 1200;
const H = 630;

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(10, 60, 93, 0.55)"/>
      <stop offset="60%" stop-color="rgba(10, 30, 50, 0.78)"/>
      <stop offset="100%" stop-color="rgba(5, 15, 25, 0.92)"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#f39e1e"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <!-- Brand mark (mountain in rounded blue chip) -->
  <g transform="translate(72, 64)">
    <rect width="76" height="76" rx="16" ry="16" fill="#0a3c5d" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
    <g transform="translate(6, 6) scale(1.0156)">
      <path fill="#f39e1e" d="M6 50 L20 26 L28 36 L36 22 L46 38 L52 32 L58 50 Z"/>
      <circle cx="48" cy="16" r="3.6" fill="#f39e1e"/>
    </g>
  </g>
  <text x="172" y="100" fill="#ffffff" font-family="'Outfit', 'Inter', system-ui, sans-serif" font-size="34" font-weight="800" letter-spacing="-0.5">Himvigo Tours</text>
  <text x="172" y="130" fill="rgba(255,255,255,0.7)" font-family="'Inter', system-ui, sans-serif" font-size="16" font-weight="500" letter-spacing="2">PREMIUM HIMALAYAN EXPERIENCES</text>

  <!-- Headline -->
  <text x="72" y="380" fill="#ffffff" font-family="'Outfit','Inter', system-ui, sans-serif" font-size="78" font-weight="800" letter-spacing="-1.5">Trek the Himalayas.</text>
  <text x="72" y="465" fill="url(#accent)" font-family="'Outfit','Inter', system-ui, sans-serif" font-size="78" font-weight="800" letter-spacing="-1.5">Explore Himachal.</text>

  <!-- Sub -->
  <text x="72" y="525" fill="rgba(255,255,255,0.85)" font-family="'Inter', system-ui, sans-serif" font-size="24" font-weight="500">Spiti expeditions, family escapes &amp; reliable cab services.</text>

  <!-- Footer URL -->
  <rect x="72" y="556" width="180" height="40" rx="20" ry="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  <text x="162" y="582" fill="#ffffff" font-family="'Inter', system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle">himvigo.com</text>
</svg>
`;

async function buildOg() {
  const bg = await sharp(resolve(ROOT, "public/hero-spiti.png"))
    .resize(W, H, { fit: "cover", position: "centre" })
    .toBuffer();

  const out = await sharp(bg)
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  const target = resolve(ROOT, "public/opengraph-image.png");
  const fs = await import("node:fs");
  fs.writeFileSync(target, out);
  console.log("wrote opengraph-image.png", out.length, "bytes,", W, "x", H);
}

await buildOg();

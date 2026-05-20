import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Source is the master 320×320 PNG mark at src/app/icon.png. Every other
// icon (apple-icon.png, favicon.ico) is generated from it so they stay
// in sync.
const SRC = resolve(ROOT, "src/app/icon.png");
const srcBuf = readFileSync(SRC);

async function buildAppleIcon() {
  // iOS displays this on the home screen — render edge-to-edge over the
  // source's existing background (no extra padding).
  const out = await sharp(srcBuf)
    .resize(180, 180, { fit: "cover" })
    .ensureAlpha()
    .png()
    .toBuffer();
  writeFileSync(resolve(ROOT, "src/app/apple-icon.png"), out);
  console.log("wrote apple-icon.png", out.length, "bytes");
}

async function buildIconPng() {
  // 512 is the manifest's recommended icon size. We keep src/app/icon.png
  // as the master (untouched) and write the resized version next to it
  // via Next's file-convention path — but since src/app/icon.png IS the
  // master, we only need to re-emit it if you want to standardise the
  // resolution. Skipped intentionally; Next will use the master directly.
}

async function buildFaviconIco() {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((size) =>
      sharp(srcBuf)
        .resize(size, size, { fit: "cover" })
        .ensureAlpha() // Turbopack's ICO decoder requires RGBA PNG frames
        .png()
        .toBuffer()
    )
  );

  const headerSize = 6 + 16 * pngs.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = ICO
  header.writeUInt16LE(pngs.length, 4); // image count

  let offset = headerSize;
  pngs.forEach((png, i) => {
    const size = sizes[i];
    const entry = 6 + 16 * i;
    header.writeUInt8(size === 256 ? 0 : size, entry + 0);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });

  const ico = Buffer.concat([header, ...pngs]);
  writeFileSync(resolve(ROOT, "src/app/favicon.ico"), ico);
  console.log("wrote favicon.ico", ico.length, "bytes");
}

await buildAppleIcon();
await buildIconPng();
await buildFaviconIco();

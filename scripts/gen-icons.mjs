import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const svgPath = resolve(ROOT, "src/app/icon.svg");
const svg = readFileSync(svgPath, "utf8");

async function buildAppleIcon() {
  // The icon.svg is already a self-contained square (rounded blue chip with
  // mountain mark) so we render it edge-to-edge for the iOS home-screen icon.
  const size = 180;
  const out = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 10, g: 60, b: 93, alpha: 1 } })
    .png()
    .toBuffer();
  writeFileSync(resolve(ROOT, "src/app/apple-icon.png"), out);
  console.log("wrote apple-icon.png", out.length, "bytes");
}

async function buildIconPng() {
  const size = 512;
  const out = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  writeFileSync(resolve(ROOT, "src/app/icon.png"), out);
  console.log("wrote icon.png", out.length, "bytes");
}

async function buildFaviconIco() {
  // Multi-resolution ICO (PNG-encoded entries) for legacy clients & SEO crawlers.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((size) =>
      sharp(Buffer.from(svg))
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    )
  );

  const headerSize = 6 + 16 * pngs.length;
  const header = Buffer.alloc(headerSize);
  // ICONDIR
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = ICO
  header.writeUInt16LE(pngs.length, 4); // image count

  let offset = headerSize;
  pngs.forEach((png, i) => {
    const size = sizes[i];
    const entryStart = 6 + 16 * i;
    header.writeUInt8(size === 256 ? 0 : size, entryStart + 0); // width
    header.writeUInt8(size === 256 ? 0 : size, entryStart + 1); // height
    header.writeUInt8(0, entryStart + 2); // colorCount
    header.writeUInt8(0, entryStart + 3); // reserved
    header.writeUInt16LE(1, entryStart + 4); // planes
    header.writeUInt16LE(32, entryStart + 6); // bpp
    header.writeUInt32LE(png.length, entryStart + 8); // bytesInRes
    header.writeUInt32LE(offset, entryStart + 12); // imageOffset
    offset += png.length;
  });

  const ico = Buffer.concat([header, ...pngs]);
  writeFileSync(resolve(ROOT, "src/app/favicon.ico"), ico);
  console.log("wrote favicon.ico", ico.length, "bytes");
}

await buildAppleIcon();
await buildIconPng();
await buildFaviconIco();

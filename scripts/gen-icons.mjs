import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const svgPath = resolve(ROOT, "src/app/icon.svg");
const svg = readFileSync(svgPath, "utf8");

async function buildAppleIcon() {
  const size = 180;
  const padding = 24;
  const inner = size - padding * 2;

  const logo = await sharp(Buffer.from(svg))
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const out = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo, top: padding, left: padding }])
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

await buildAppleIcon();
await buildIconPng();

// Imports app screenshots (iOS / desktop) for an entry, since apps can't be
// captured from a link.
//
//   npm run import-screens -- <entry-id> <image> [<image> ...]
//
// Writes public/media/<entry-id>/screen-1.webp, screen-2.webp, …, a
// cover.webp (screens side by side on a light grey card), and
// drafts/<entry-id>/report.md with the measured palette and harmony
// suggestions. Fonts can't be measured from images: identify them by eye or
// from the brand's guidelines.

import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { pixelPalette } from "./lib/analyze.mjs";
import { suggestHarmonies } from "./lib/harmony.mjs";
import { hexToHsl, isNeutral } from "../src/lib/color.ts";

const [id, ...files] = process.argv.slice(2);
if (!id || files.length === 0) {
  console.error(
    "Usage: npm run import-screens -- <entry-id> <image> [<image> ...]",
  );
  process.exit(1);
}
const mediaDir = `public/media/${id}`;
const draftDir = `drafts/${id}`;
await mkdir(mediaDir, { recursive: true });
await mkdir(draftDir, { recursive: true });

const screens = [];
for (const [i, file] of files.entries()) {
  const out = `${mediaDir}/screen-${i + 1}.webp`;
  await sharp(file)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(out);
  screens.push(out);
  console.log(`✓ ${out}`);
}

// Cover: up to three screens side by side on a cool light grey card.
const W = 960;
const H = 600;
const pad = 40;
const shown = screens.slice(0, 3);
const slot = Math.floor((W - pad * (shown.length + 1)) / shown.length);
const tiles = await Promise.all(
  shown.map((s) =>
    sharp(s)
      .resize({ width: slot, height: H - pad * 2, fit: "inside" })
      .toBuffer({ resolveWithObject: true }),
  ),
);
await sharp({
  create: { width: W, height: H, channels: 3, background: "#f1f3f6" },
})
  .composite(
    tiles.map((t, i) => ({
      input: t.data,
      left: pad + i * (slot + pad) + Math.floor((slot - t.info.width) / 2),
      top: Math.floor((H - t.info.height) / 2),
    })),
  )
  .webp({ quality: 82 })
  .toFile(`${mediaDir}/cover.webp`);
console.log(`✓ ${mediaDir}/cover.webp`);

// Palette from all screens together.
const merged = new Map();
for (const s of screens) {
  for (const c of await pixelPalette(s)) {
    merged.set(c.hex, (merged.get(c.hex) ?? 0) + c.share / screens.length);
  }
}
const palette = [...merged.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 14)
  .map(([hex, share]) => {
    const { h, s, l } = hexToHsl(hex);
    return {
      hex,
      score: Math.round(share * 10) / 10,
      hue: Math.round(h),
      saturation: Math.round(s * 100),
      lightness: Math.round(l * 100),
      neutral: isNeutral(hex),
      sources: ["pixels"],
    };
  });
const harmonies = suggestHarmonies(palette);
const lines = [
  `# Screens import: ${id}`,
  "",
  `Screens: ${screens.join(", ")}`,
  "",
  "## Palette (pixels, all screens)",
  "",
  "| Hex | Share % | Hue | Sat | Light | Neutral |",
  "|---|---|---|---|---|---|",
  ...palette.map(
    (c) =>
      `| ${c.hex} | ${c.score} | ${c.hue}° | ${c.saturation}% | ${c.lightness}% | ${c.neutral ? "yes" : ""} |`,
  ),
  "",
  "## Harmony suggestions",
  "",
  ...harmonies.map(
    (h) => `- **${h.harmony}** (score ${h.score}): ${h.explanation}`,
  ),
  "",
  "Fonts can't be measured from images: identify them from the brand's guidelines or by eye.",
];
await writeFile(`${draftDir}/report.md`, lines.join("\n") + "\n");
console.log(`✓ ${draftDir}/report.md`);

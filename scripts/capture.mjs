// Captures a live page into a draft entry.
//
//   npm run capture -- <url> [--product <id>] [--type landing|ios|desktop]
//                            [--id <entry-id>] [--no-motion]
//   npm run capture -- --redraft <entry-id>   rebuild draft + report from the
//                                             saved measurements (no browser)
//
// Writes:
//   public/media/<id>/full.webp, cover.webp   screenshots used by the entry
//   drafts/<id>/entry.md                      draft entry with TODOs
//   drafts/<id>/report.md                     everything measured, for review
//   drafts/<id>/sections.png                  page with y-coordinates, for cropping
//   drafts/<id>/full.png                      lossless screenshot (crop source)
//   drafts/<id>/motion-*.webp                 recorded motion candidates
//   drafts/<id>/capture.json                  raw measurements
//
// The judgment calls (brand sources, naming styles, the why) stay manual.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { VIEWPORT, launch, open, scrollThrough } from "./lib/browser.mjs";
import { measurePage, pixelPalette, suggestPalette } from "./lib/analyze.mjs";
import { suggestHarmonies } from "./lib/harmony.mjs";
import { captureMotion } from "./lib/motion.mjs";
import { draftEntry, report } from "./lib/draft.mjs";
import { isNeutral } from "../src/lib/color.ts";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    product: { type: "string" },
    type: { type: "string", default: "landing" },
    id: { type: "string" },
    "no-motion": { type: "boolean", default: false },
    redraft: { type: "string" },
  },
});

if (values.redraft) {
  await redraft(values.redraft);
  process.exit(0);
}

const url = positionals[0];
if (!url || !/^https?:\/\//.test(url)) {
  console.error(
    "Usage: npm run capture -- <url> [--product <id>] [--type landing] [--id <entry-id>] [--no-motion]",
  );
  process.exit(1);
}
const host = new URL(url).hostname.replace(/^www\./, "");
const productId = values.product ?? host.split(".")[0];
const type = values.type;
const id = values.id ?? `${productId}-${type}`;
const draftDir = `drafts/${id}`;
const mediaDir = `public/media/${id}`;
await mkdir(draftDir, { recursive: true });
await mkdir(mediaDir, { recursive: true });

const step = (s) => console.log(`\n▸ ${s}`);
const started = Date.now();
const browser = await launch();

step(`Opening ${url}`);
const page = await open(browser, url);
const height = await scrollThrough(page);
console.log(`  page height ${height}px`);

step("Screenshots");
await page.screenshot({ path: `${draftDir}/viewport.png` });
// Capped below WebP's 16383px limit; clipped to the viewport width so
// sideways-overflowing carousels don't widen the image.
const fullHeight = Math.min(height, 16000);
await page.screenshot({
  path: `${draftDir}/full.png`,
  fullPage: true,
  clip: { x: 0, y: 0, width: VIEWPORT.width, height: fullHeight },
});
await sharp(`${draftDir}/full.png`)
  .webp({ quality: 78, effort: 6 })
  .toFile(`${mediaDir}/full.webp`);
await sharp(`${draftDir}/viewport.png`)
  .resize(960, 600)
  .webp({ quality: 80 })
  .toFile(`${mediaDir}/cover.webp`);
console.log(`  ${mediaDir}/full.webp, cover.webp`);

step("Measuring fonts, type scale and colors");
const measure = await measurePage(page);
const pixels = await pixelPalette(`${draftDir}/full.png`);
const palette = suggestPalette(measure, pixels);
const harmonies = suggestHarmonies(palette);
console.log(
  `  fonts: ${Object.entries(measure.fonts)
    .map(([f, w]) => `${f} (${w.join(", ")})`)
    .join("; ")}`,
);
console.log(
  `  palette: ${palette
    .slice(0, 8)
    .map((c) => c.hex)
    .join(" ")}`,
);
console.log(
  `  harmony: ${harmonies[0] ? `${harmonies[0].harmony}: ${harmonies[0].explanation}` : "none found"}`,
);
await page.context().close();

let motion = [];
if (!values["no-motion"]) {
  step("Detecting and recording motion (takes a few minutes)");
  motion = await captureMotion(browser, url, draftDir);
  for (const m of motion)
    console.log(`  ${m.kind} at y ${Math.round(m.box.y)} → ${m.file}`);
}
await browser.close();

step("Contact sheet for cropping");
await sectionsSheet(
  `${draftDir}/full.png`,
  `${draftDir}/sections.png`,
  fullHeight,
);

step("Writing draft and report");
const capture = { ...measure, palette, pixels, harmonies, motion };
await writeFile(`${draftDir}/capture.json`, JSON.stringify(capture, null, 2));
const date = new Date().toISOString().slice(0, 10);
await writeFile(
  `${draftDir}/meta.json`,
  JSON.stringify({ productId, type, url, date }, null, 2),
);
await writeFile(
  `${draftDir}/entry.md`,
  draftEntry(capture, { productId, type, url, date }),
);
await writeFile(
  `${draftDir}/report.md`,
  report(capture, {
    id,
    url,
    files: [`${mediaDir}/full.webp`, `${mediaDir}/cover.webp`],
  }),
);
if (!existsSync(`src/content/products/${productId}.yaml`)) {
  await writeFile(
    `${draftDir}/product.yaml`,
    `name: ${measure.title.split(/[|\-–·:]/)[0].trim()}\nwebsite: ${new URL(url).origin}\ncategory: TODO\n`,
  );
}

console.log(
  `\nDone in ${Math.round((Date.now() - started) / 1000)}s. Review ${draftDir}/report.md, then finish ${draftDir}/entry.md.`,
);

/** Full page at 600px wide with a ruler every 500px (page coordinates). */
async function sectionsSheet(src, out, pageHeight) {
  const width = 600;
  const scale = width / VIEWPORT.width;
  const h = Math.round(pageHeight * scale);
  const marks = [];
  for (let y = 0; y < pageHeight; y += 500) {
    const sy = Math.round(y * scale);
    marks.push(
      `<line x1="0" x2="${width}" y1="${sy}" y2="${sy}" stroke="#ff0066" stroke-width="1" stroke-dasharray="4 4"/>` +
        `<rect x="0" y="${sy}" width="54" height="16" fill="#ff0066"/>` +
        `<text x="4" y="${sy + 12}" font-family="monospace" font-size="11" fill="#fff">y ${y}</text>`,
    );
  }
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">${marks.join("")}</svg>`,
  );
  await sharp(src)
    .resize({ width })
    .composite([{ input: svg, top: 0, left: 0 }])
    .png()
    .toFile(out);
}

/** Rebuilds a draft from saved measurements, re-applying the current rules. */
async function redraft(id) {
  const dir = `drafts/${id}`;
  const capture = JSON.parse(await readFile(`${dir}/capture.json`, "utf8"));
  capture.palette = capture.palette.map((c) => ({
    ...c,
    neutral: isNeutral(c.hex),
  }));
  capture.harmonies = suggestHarmonies(capture.palette);
  const meta = JSON.parse(await readFile(`${dir}/meta.json`, "utf8"));
  await writeFile(`${dir}/capture.json`, JSON.stringify(capture, null, 2));
  await writeFile(`${dir}/entry.md`, draftEntry(capture, meta));
  await writeFile(
    `${dir}/report.md`,
    report(capture, {
      id,
      url: meta.url,
      files: [`public/media/${id}/full.webp`, `public/media/${id}/cover.webp`],
    }),
  );
  console.log(`Rebuilt ${dir}/entry.md and report.md`);
}

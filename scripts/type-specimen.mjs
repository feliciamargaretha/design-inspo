// Generates brand-guideline-style type specimens for an entry.
//
//   node scripts/type-specimen.mjs <entry-id>
//
// Custom brand fonts can't be redistributed, so the specimen is laid out
// inside the brand's own page (where the real font is already loaded) and
// saved as an image: public/media/<entry-id>/<font.specimen>.
// Fonts with `webFont` set are rendered live on the site instead and skipped.

import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";
import { parse } from "yaml";

const entryId = process.argv[2];
if (!entryId) {
  console.error("Usage: node scripts/type-specimen.mjs <entry-id>");
  process.exit(1);
}

const markdown = await readFile(`src/content/entries/${entryId}.md`, "utf8");
const entry = parse(markdown.split(/^---$/m)[1]);
const fonts = entry.typography.fonts.filter((f) => f.specimen);
if (fonts.length === 0) {
  console.log("No fonts with a `specimen` file; nothing to do.");
  process.exit(0);
}

const WIDTH = 1200;
const INK = "#16161A";
const MUTED = "#6B6B76";
const LINE = "#E4E4E7";

const humanize = (id) =>
  id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function specimenHtml(font) {
  const family = `'${font.family}'`;
  const weights = font.weights
    .map(
      (w) => `
      <div style="flex:1;min-width:0">
        <div style="font-weight:${w.value};font-size:72px;line-height:1">Aa</div>
        <div style="margin-top:12px;font-size:15px;color:${MUTED}">${esc(w.name)} · ${w.value}</div>
      </div>`,
    )
    .join("");
  const scale = (font.scale ?? [])
    .map(
      (s) => `
      <div style="display:flex;gap:32px;align-items:baseline;padding:20px 0;border-top:1px solid ${LINE}">
        <div style="width:150px;flex:none;font-size:13px;line-height:1.5;color:${MUTED}">
          ${esc(s.label)}<br>${s.size}/${s.lineHeight} · ${s.weight}${s.tracking ? ` · ${s.tracking}px` : ""}
        </div>
        <div style="min-width:0;font-size:${s.size}px;line-height:${s.lineHeight}px;font-weight:${s.weight};letter-spacing:${s.tracking ?? 0}px">${esc(s.sample)}</div>
      </div>`,
    )
    .join("");
  const regular = font.weights[0].value;
  return `
    <div id="__specimen" style="all:initial;position:absolute;left:0;top:0;z-index:2147483647;
      box-sizing:border-box;width:${WIDTH}px;padding:64px;background:#fff;color:${INK};
      font-family:${family};font-weight:${regular};-webkit-font-smoothing:antialiased">
      <div style="display:flex;justify-content:space-between;font-size:15px;color:${MUTED}">
        <span>${esc(font.family)}</span><span>${esc(humanize(font.style))}${font.source ? ` · ${esc(font.source)}` : ""}</span>
      </div>
      <div style="display:flex;gap:56px;align-items:center;margin-top:40px">
        <div style="font-size:240px;line-height:1;letter-spacing:-4px;font-weight:${font.weights.at(-1).value}">Aa</div>
        <div style="font-size:30px;line-height:1.45;word-break:break-all">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>!?@#&amp;%()[]{}/*+–—.,:;“”
        </div>
      </div>
      <div style="display:flex;gap:24px;margin-top:56px;padding-top:32px;border-top:1px solid ${LINE}">${weights}</div>
      ${scale ? `<div style="margin-top:48px">${scale}</div>` : ""}
    </div>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page
  .goto(entry.sourceUrl, { waitUntil: "load", timeout: 60_000 })
  .catch((e) => console.warn(`Page load: ${e.message} (continuing)`));
await page.waitForTimeout(3000);

for (const font of fonts) {
  await page.evaluate((html) => {
    document.getElementById("__specimen")?.remove();
    window.scrollTo(0, 0);
    document.body.insertAdjacentHTML("beforeend", html);
  }, specimenHtml(font));

  // Make sure every weight in the specimen is a real cut on the brand's page
  // (otherwise the browser silently substitutes the nearest weight).
  const missing = await page.evaluate(async (font) => {
    await Promise.all(
      font.weights.map((w) =>
        document.fonts.load(`${w.value} 40px '${font.family}'`),
      ),
    );
    await document.fonts.ready;
    const faces = [...document.fonts].filter(
      (f) =>
        f.family.replace(/["']/g, "") === font.family && f.style === "normal",
    );
    const covers = (face, value) => {
      const [min, max = min] = face.weight.split(" ").map(Number);
      return value >= min && value <= max;
    };
    return font.weights
      .filter((w) => !faces.some((f) => covers(f, w.value)))
      .map((w) => w.value);
  }, font);
  if (missing.length) {
    console.error(
      `✗ ${font.family}: weights ${missing} are not loaded by ${entry.sourceUrl}; fix \`weights\` in the entry.`,
    );
    process.exitCode = 1;
    continue;
  }

  const png = await page.locator("#__specimen").screenshot();
  const out = `public/media/${entryId}/${font.specimen}`;
  await sharp(png).webp({ quality: 85 }).toFile(out);
  console.log(`✓ ${font.family} → ${out}`);
}

await browser.close();

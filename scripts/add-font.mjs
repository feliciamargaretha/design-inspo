// Adds a font to the Font library from a link.
//
//   npm run add-font -- <url> [--family "Name"] [--id <font-id>]
//
// Google Fonts (fonts.google.com/specimen/...): reads Google's catalogue for
// the designers, category, year and every weight; the site renders the
// specimen live, so no image is needed.
//
// Any other page (a foundry's font page, a site using the font): opens it,
// finds the font (or uses --family), checks which weights the page loads, and
// renders a specimen image inside that page.
//
// Writes drafts/fonts/<id>.md with TODOs for the judgment calls
// (classification, personality, notes). Move it to src/content/fonts/ when done.

import { mkdir, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { stringify } from "yaml";
import { launch, open, scrollThrough } from "./lib/browser.mjs";
import { measurePage } from "./lib/analyze.mjs";
import {
  DEFAULT_SCALE,
  renderPreview,
  renderSpecimen,
} from "./lib/specimen.mjs";

const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};
const named = (value) => ({ value, name: WEIGHT_NAMES[value] ?? `${value}` });
const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Google's categories only narrow the classification down; the precise
// glossary term (geometric vs humanist sans, etc.) is a judgment call.
const GOOGLE_CATEGORY = {
  Monospace: "monospace",
  Handwriting: "script-face",
  Display: "display-face",
  "Sans Serif":
    "TODO (sans: geometric-sans, humanist-sans, grotesque-sans or neo-grotesque-sans)",
  Serif:
    "TODO (serif: old-style-serif, transitional-serif, didone or slab-serif)",
};

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { family: { type: "string" }, id: { type: "string" } },
});
const url = positionals[0];
if (!url || !/^https?:\/\//.test(url)) {
  console.error(
    'Usage: npm run add-font -- <url> [--family "Name"] [--id <font-id>]',
  );
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const googleMatch = /fonts\.google\.com\/specimen\/([^/?#]+)/.exec(url);
const draft = googleMatch
  ? await fromGoogle(decodeURIComponent(googleMatch[1]).replace(/\+/g, " "))
  : await fromPage(url);

await mkdir("drafts/fonts", { recursive: true });
const file = `drafts/fonts/${draft.id}.md`;
await writeFile(
  file,
  `---\n${stringify(draft.data, { lineWidth: 0 })}---\n\nTODO: notes. Why it's good, where it works, what it pairs with.\n`,
);
console.log(`\n✓ ${file}`);
console.log(
  `  Fill in the TODOs, then move it to src/content/fonts/${draft.id}.md and run npm run build.`,
);

async function fromGoogle(family) {
  console.log(`▸ Google Fonts: ${family}`);
  // Loaded through the browser so it works wherever page capture works
  // (including behind a proxy).
  const browser = await launch();
  const page = await browser.newPage();
  const res = await page.goto("https://fonts.google.com/metadata/fonts");
  const text = await res.text();
  await browser.close();
  const meta = JSON.parse(text.slice(text.indexOf("{")));
  const f = meta.familyMetadataList.find(
    (x) => x.family.toLowerCase() === family.toLowerCase(),
  );
  if (!f) throw new Error(`"${family}" isn't in the Google Fonts catalogue.`);
  const weights = Object.keys(f.fonts)
    .filter((k) => /^\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b)
    .map(named);
  const variable = f.axes?.some((a) => a.tag === "wght") ?? false;
  console.log(
    `  ${f.category} · ${f.designers.join(", ")} · ${weights.map((w) => w.name).join(", ")}${variable ? " (variable)" : ""}`,
  );
  const id = values.id ?? kebab(f.family);
  return {
    id,
    data: {
      family: f.family,
      style: GOOGLE_CATEGORY[f.category] ?? "TODO",
      source: {
        kind: "google",
        url: `https://fonts.google.com/specimen/${f.family.replace(/ /g, "+")}`,
        name: "Google Fonts",
      },
      designers: f.designers,
      free: true,
      year: f.dateAdded ? Number(f.dateAdded.slice(0, 4)) : undefined,
      variable,
      weights,
      tags: ["TODO"],
      addedAt: today,
      webFont: { provider: "google", family: f.family },
    },
  };
}

async function fromPage(pageUrl) {
  console.log(`▸ Opening ${pageUrl}`);
  const browser = await launch();
  const page = await open(browser, pageUrl);
  await scrollThrough(page);
  const measure = await measurePage(page);
  const candidates = Object.entries(measure.allFonts);
  console.log(
    `  fonts loaded: ${candidates.map(([f, w]) => `${f} (${w.join(", ")})`).join("; ") || "none"}`,
  );
  // Prefer --family; otherwise a loaded font named in the page title or URL
  // (a foundry's own interface font must not be picked by mistake).
  const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const haystack = squash(`${measure.title} ${pageUrl}`);
  const family =
    values.family ??
    candidates
      .map(([f]) => f)
      .find((f) => {
        const core = squash(coreWords(f).join(""));
        return core.length >= 3 && haystack.includes(core);
      });
  const loaded = family ? measure.allFonts[family] : null;
  if (!family || !loaded?.length) {
    await browser.close();
    console.error(
      `\n✗ ${family ? `"${family}" isn't loaded on this page.` : "Couldn't tell which font this page is about."}` +
        `\n  Loaded here: ${candidates.map(([f]) => f).join(", ") || "none"}` +
        `\n  Pass --family "<name>" with one of those, or use a page that actually renders the font` +
        `\n  (some foundries show specimens as images; a site that uses the font works too).`,
    );
    process.exit(1);
  }
  // Variable fonts load a range ("100 900"); show the standard stops in it.
  const values_ = [
    ...new Set(
      loaded.flatMap((w) => {
        const [a, b = a] = w.split(" ").map(Number);
        return a === b
          ? [a]
          : [100, 200, 300, 400, 500, 600, 700, 800, 900].filter(
              (v) => v >= a && v <= b,
            );
      }),
    ),
  ].sort((a, b) => a - b);
  const weights = values_.map(named);
  const variable = loaded.some((w) => w.includes(" "));
  // CSS names are often internal ("k-tiempos-text-vf"); keep that for
  // rendering and store a readable name.
  const displayName = coreWords(family)
    .map((w) =>
      w === w.toUpperCase()
        ? w.charAt(0) + w.slice(1).toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
  const id = values.id ?? kebab(displayName);
  const pick = (...prefs) =>
    prefs.find((p) => values_.includes(p)) ?? values_.at(-1);
  const font = {
    family,
    style: "TODO",
    source: new URL(pageUrl).hostname.replace(/^www\./, ""),
    weights,
    scale: [
      { ...DEFAULT_SCALE[0], weight: pick(700, 600, 800, 500) },
      { ...DEFAULT_SCALE[1], weight: pick(600, 500, 700) },
      { ...DEFAULT_SCALE[2], weight: pick(400, 300, 500) },
      { ...DEFAULT_SCALE[3], weight: pick(500, 400, 600) },
    ],
  };
  await mkdir(`public/media/fonts/${id}`, { recursive: true });
  const out = `public/media/fonts/${id}/specimen.webp`;
  const missing = await renderSpecimen(
    page,
    { ...font, label: displayName },
    out,
  );
  if (!missing.length)
    await renderPreview(page, font, `public/media/fonts/${id}/preview.webp`);
  await browser.close();
  if (missing.length)
    throw new Error(`Weights ${missing} didn't load on the page.`);
  console.log(`  ✓ ${out}`);
  return {
    id,
    data: {
      family: displayName,
      style: "TODO",
      source: {
        kind: "foundry",
        url: pageUrl,
        name: "TODO (foundry or publisher)",
      },
      designers: ["TODO"],
      free: false,
      variable,
      weights,
      tags: ["TODO"],
      addedAt: today,
      specimen: "specimen.webp",
      preview: "preview.webp",
    },
  };
}

/** Meaningful words of a CSS font-family name, without vendor prefixes or format suffixes. */
function coreWords(family) {
  const noise = new Set([
    "k",
    "vf",
    "web",
    "webfont",
    "pro",
    "std",
    "variable",
    "var",
    "rounded",
  ]);
  return family
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter((w) => w && !noise.has(w.toLowerCase()));
}

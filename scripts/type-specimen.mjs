// Generates brand-guideline-style type specimens for an entry.
//
//   npm run specimen -- <entry-id>
//
// Custom brand fonts can't be redistributed, so the specimen is laid out
// inside the brand's own page (where the real font is already loaded) and
// saved as an image: public/media/<entry-id>/<font.specimen>.
// Fonts with `webFont` set are rendered live on the site instead and skipped.

import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { parse } from "yaml";
import { renderSpecimen } from "./lib/specimen.mjs";

const entryId = process.argv[2];
if (!entryId) {
  console.error("Usage: npm run specimen -- <entry-id>");
  process.exit(1);
}

const markdown = await readFile(`src/content/entries/${entryId}.md`, "utf8");
const entry = parse(markdown.split(/^---$/m)[1]);
const fonts = entry.typography.fonts.filter((f) => f.specimen);
if (fonts.length === 0) {
  console.log("No fonts with a `specimen` file; nothing to do.");
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page
  .goto(entry.sourceUrl, { waitUntil: "load", timeout: 60_000 })
  .catch((e) => console.warn(`Page load: ${e.message} (continuing)`));
await page.waitForTimeout(3000);

for (const font of fonts) {
  const out = `public/media/${entryId}/${font.specimen}`;
  const missing = await renderSpecimen(page, font, out);
  if (missing.length) {
    console.error(
      `✗ ${font.family}: weights ${missing} are not loaded by ${entry.sourceUrl}; fix \`weights\` in the entry.`,
    );
    process.exitCode = 1;
  } else console.log(`✓ ${font.family} → ${out}`);
}

await browser.close();

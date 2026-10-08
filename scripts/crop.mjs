// Crops an example from a captured page into the entry's media folder.
//
//   npm run crop -- <entry-id> <name> <x> <y> <width> <height> [--zoom 2] [--from <file>]
//
// Coordinates are page pixels at 1440px wide (see drafts/<id>/sections.png
// and the y positions in drafts/<id>/report.md). --zoom enlarges small
// details such as textures. Writes public/media/<entry-id>/<name>.webp.

import { parseArgs } from "node:util";
import sharp from "sharp";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { zoom: { type: "string", default: "1" }, from: { type: "string" } },
});
const [id, name, ...nums] = positionals;
const [left, top, width, height] = nums.map(Number);
if (
  !id ||
  !name ||
  [left, top, width, height].some((n) => !Number.isFinite(n))
) {
  console.error(
    "Usage: npm run crop -- <entry-id> <name> <x> <y> <width> <height> [--zoom 2]",
  );
  process.exit(1);
}
const zoom = Number(values.zoom);
const src = values.from ?? `drafts/${id}/full.png`;
const out = `public/media/${id}/${name.replace(/\.webp$/, "")}.webp`;
await sharp(src)
  .extract({ left, top, width, height })
  .resize({ width: Math.min(1200, Math.round(width * zoom)) })
  .webp({ quality: 85 })
  .toFile(out);
console.log(
  `✓ ${out} (${width}×${height} from ${src}${zoom > 1 ? `, zoomed ${zoom}×` : ""})`,
);

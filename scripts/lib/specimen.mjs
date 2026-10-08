// Brand-guideline-style type specimens, laid out inside a page where the
// font is already loaded (custom fonts can't be redistributed), and saved as
// an image. Shared by type-specimen.mjs (entry fonts) and add-font.mjs
// (font library).

import sharp from "sharp";

const WIDTH = 1200;
const INK = "#16161A";
const MUTED = "#6B6B76";
const LINE = "#E4E4E7";

const humanize = (id) =>
  id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function specimenHtml(font) {
  // `family` is the CSS name used to render; `label` is what the specimen says.
  const name = font.label ?? font.family;
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
          ${esc(s.label)}<br>${s.size}/${s.lineHeight} · ${s.weight ?? font.weights[0].value}${s.tracking ? ` · ${s.tracking}px` : ""}
        </div>
        <div style="min-width:0;font-size:${s.size}px;line-height:${s.lineHeight}px;font-weight:${s.weight ?? font.weights[0].value};letter-spacing:${s.tracking ?? 0}px;text-transform:${s.uppercase ? "uppercase" : "none"}">${esc(name)}</div>
      </div>`,
    )
    .join("");
  const regular = font.weights[0].value;
  return `
    <div id="__specimen" style="all:initial;position:absolute;left:0;top:0;z-index:2147483647;
      box-sizing:border-box;width:${WIDTH}px;padding:64px;background:#fff;color:${INK};
      font-family:${family};font-weight:${regular};-webkit-font-smoothing:antialiased">
      <div style="display:flex;justify-content:space-between;font-size:15px;color:${MUTED}">
        <span>${esc(name)}</span><span>${[font.style && !/^TODO/.test(font.style) ? humanize(font.style) : null, font.source].filter(Boolean).map(esc).join(" · ")}</span>
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

/** Generic type scale for fonts that aren't measured from a page. */
export const DEFAULT_SCALE = [
  { label: "Display", size: 72, lineHeight: 76, weight: null, tracking: -1.5 },
  { label: "Heading", size: 40, lineHeight: 46, weight: null, tracking: -0.5 },
  { label: "Body", size: 18, lineHeight: 28, weight: null },
  {
    label: "Caption",
    size: 13,
    lineHeight: 18,
    weight: null,
    uppercase: true,
    tracking: 1,
  },
];

/**
 * Renders a specimen for `font` on `page` and writes it to `out`.
 * Returns the weights the page doesn't actually load (empty when all good).
 */
export async function renderSpecimen(page, font, out) {
  await page.evaluate((html) => {
    document.getElementById("__specimen")?.remove();
    window.scrollTo(0, 0);
    document.body.insertAdjacentHTML("beforeend", html);
  }, specimenHtml(font));

  // Every weight shown must be a real cut on the page (otherwise the
  // browser silently substitutes the nearest weight).
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
      const w =
        face.weight === "normal"
          ? "400"
          : face.weight === "bold"
            ? "700"
            : face.weight;
      const [min, max = min] = w.split(" ").map(Number);
      return value >= min && value <= max;
    };
    return font.weights
      .filter((w) => !faces.some((f) => covers(f, w.value)))
      .map((w) => w.value);
  }, font);
  if (missing.length) return missing;

  const png = await page.locator("#__specimen").screenshot();
  await sharp(png).webp({ quality: 85 }).toFile(out);
  return [];
}

/** Small "Aa Bb Cc" card image for the font library grid. */
export async function renderPreview(page, font, out) {
  const regular = (font.weights.find((w) => w.value === 400) ?? font.weights[0])
    .value;
  await page.evaluate(
    ([family, weight]) => {
      document.getElementById("__preview")?.remove();
      window.scrollTo(0, 0);
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div id="__preview" style="all:initial;position:absolute;left:0;top:0;z-index:2147483647;width:720px;height:144px;box-sizing:border-box;padding:24px 0;background:#fff;color:#16161A;font-family:'${family}';font-weight:${weight};font-size:96px;line-height:96px;white-space:nowrap;-webkit-font-smoothing:antialiased">Aa Bb Cc</div>`,
      );
    },
    [font.family, regular],
  );
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("#__preview").screenshot();
  await sharp(png).webp({ quality: 85 }).toFile(out);
}

// Turns capture measurements into a draft entry (YAML front matter with
// TODOs for the judgment calls) and a human-readable report.

import { stringify } from "yaml";

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

const TODO = "TODO";
const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The weight the browser actually renders when `wanted` is requested but only
 * some cuts are loaded (CSS font-matching rules). Variable fonts report a
 * range ("100 800") and render any weight inside it.
 */
export function renderedWeight(loaded, wanted) {
  const ranges = loaded
    .map((w) => w.split(" ").map(Number))
    .map(([a, b = a]) => [a, b]);
  if (ranges.some(([a, b]) => wanted >= a && wanted <= b)) return wanted;
  const cuts = ranges.map(([a]) => a).sort((x, y) => x - y);
  const up = cuts.filter((c) => c > wanted);
  const down = cuts.filter((c) => c < wanted).reverse();
  if (wanted >= 400 && wanted <= 500) {
    return up.find((c) => c <= 500) ?? down[0] ?? up[0];
  }
  return wanted < 400 ? (down[0] ?? up[0]) : (up[0] ?? down[0]);
}

/** Weights that really render for a family, lightest first. */
function usedWeights(capture, family) {
  const loaded = capture.fonts[family] ?? [];
  const used = [
    ...new Set(
      capture.typeScale
        .filter((s) => s.family === family)
        .map((s) =>
          loaded.length ? renderedWeight(loaded, s.weight) : s.weight,
        ),
    ),
  ];
  return used
    .sort((a, b) => a - b)
    .map((value) => ({
      value,
      name: WEIGHT_NAMES[value] ?? `${value} (variable)`,
    }));
}

function guessRoles(capture, family) {
  const styles = capture.typeScale.filter((s) => s.family === family);
  const tags = styles.flatMap((s) => Object.keys(s.tags));
  const roles = new Set();
  if (/mono|code/i.test(family)) roles.add("code");
  if (styles.some((s) => s.size >= 40)) roles.add("display");
  if (tags.some((t) => /^h[1-4]$/.test(t))) roles.add("heading");
  if (
    tags.some((t) => ["p", "li", "span"].includes(t)) &&
    styles.some((s) => s.size <= 20 && s.chars > 200)
  )
    roles.add("body");
  if (tags.some((t) => ["button", "a", "label", "input"].includes(t)))
    roles.add("ui");
  return roles.size ? [...roles] : ["body"];
}

function scaleFor(capture, family, max = 6) {
  const picked = [];
  for (const s of capture.typeScale.filter((t) => t.family === family)) {
    if (picked.some((p) => p.size === s.size && p.weight === s.weight))
      continue;
    const tag =
      Object.entries(s.tags).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    const label = /^h\d$/.test(tag)
      ? `Heading ${tag[1]}`
      : tag === "button"
        ? "Button"
        : s.uppercase
          ? "Eyebrow"
          : s.size >= 40
            ? "Display"
            : s.size >= 20
              ? "Lead"
              : "Body";
    picked.push({
      label,
      size: s.size,
      lineHeight: s.lineHeight ?? Math.round(s.size * 1.2),
      weight: capture.fonts[family]?.length
        ? renderedWeight(capture.fonts[family], s.weight)
        : s.weight,
      ...(s.tracking ? { tracking: s.tracking } : {}),
      ...(s.uppercase ? { uppercase: true } : {}),
    });
    if (picked.length === max) break;
  }
  return picked;
}

function guessPalette(palette) {
  const neutrals = palette.filter((c) => c.neutral);
  const background =
    neutrals.find((c) => c.sources.includes("css-background")) ?? neutrals[0];
  // Main text: the highest-contrast text color among the prominent ones.
  const contrast = (c) =>
    Math.abs(c.lightness - (background?.lightness ?? 100));
  const text = neutrals
    .filter(
      (c) =>
        c !== background && c.sources.includes("css-text") && contrast(c) > 40,
    )
    .slice(0, 3)
    .sort((a, b) => contrast(b) - contrast(a))[0];
  const surface = neutrals.find(
    (c) =>
      c !== background &&
      c !== text &&
      c.sources.includes("css-background") &&
      Math.abs(c.lightness - (background?.lightness ?? 100)) <= 25,
  );
  const out = [];
  // Tier guesses: the background and the most prominent hue are primary.
  if (background)
    out.push({
      hex: background.hex,
      name: TODO,
      role: "background",
      tier: "primary",
    });
  if (surface)
    out.push({
      hex: surface.hex,
      name: TODO,
      role: "surface",
      tier: "secondary",
    });
  if (text)
    out.push({ hex: text.hex, name: TODO, role: "text", tier: "secondary" });
  palette
    .filter((c) => !c.neutral)
    .slice(0, 6)
    .forEach((c, i) =>
      out.push({
        hex: c.hex,
        name: TODO,
        role: i === 0 ? "brand" : "accent",
        tier: i === 0 ? "primary" : i <= 2 ? "secondary" : "tertiary",
      }),
    );
  return out;
}

export function draftEntry(capture, { productId, type, url, date }) {
  const { palette, harmonies } = capture;
  const top = harmonies[0];
  const chromaticScore = palette
    .filter((c) => !c.neutral)
    .reduce((s, c) => s + c.score, 0);
  const neutralScore = palette
    .filter((c) => c.neutral)
    .reduce((s, c) => s + c.score, 0);
  const bg =
    palette.find((c) => c.neutral && c.sources.includes("css-background")) ??
    palette[0];
  const chromatic = palette.filter((c) => !c.neutral);
  const warm = chromatic.filter((c) => c.hue < 70 || c.hue > 300).length;

  const motion = capture.motion ?? [];
  const data = {
    product: productId,
    type,
    sourceUrl: url,
    capturedAt: date,
    cover: "cover.webp",
    media: [
      {
        src: "full.webp",
        alt: `Full-page screenshot of the ${capture.title} page`,
      },
    ],
    tags: [TODO],
    colors: {
      palette: guessPalette(palette),
      harmony: top?.harmony ?? TODO,
      harmonyColors: top?.colors ?? [],
      strategy:
        chromaticScore < neutralScore * 0.35
          ? "neutral-with-accent"
          : "multicolor",
      mode: bg && bg.lightness < 30 ? "dark" : "light",
      temperature:
        chromatic.length === 0
          ? "neutral"
          : warm > chromatic.length / 2
            ? "warm"
            : "cool",
      what: top ? `${TODO} (measured: ${top.explanation})` : TODO,
      why: TODO,
      basis: "interpretation",
      sources: [],
    },
    typography: {
      fonts: Object.keys(capture.fonts).map((family) => ({
        family,
        style: /mono|code/i.test(family) ? "monospace" : TODO,
        roles: guessRoles(capture, family),
        source: TODO,
        specimen: `specimen-${kebab(family)}.webp`,
        weights: usedWeights(capture, family),
        scale: scaleFor(capture, family),
      })),
      what: TODO,
      why: TODO,
      basis: "interpretation",
      sources: [],
    },
    imagery: {
      styles: [TODO],
      treatments: [],
      textures: [],
      what: TODO,
      why: TODO,
      basis: "interpretation",
      sources: [],
      examples: [],
    },
    ...(motion.length
      ? {
          motion: {
            types: [TODO],
            what: TODO,
            why: TODO,
            basis: "interpretation",
            sources: [],
            examples: motion.map((m) => ({
              src: m.file.split("/").pop(),
              alt: TODO,
              caption: TODO,
              terms: [TODO],
            })),
          },
        }
      : {}),
  };
  return `---\n${stringify(data, { lineWidth: 0 })}---\n\n${TODO}: one or two sentences summing up the page.\n`;
}

const swatch = (hex) =>
  `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${hex};border:1px solid #ccc"></span>`;

export function report(capture, { id, url, files }) {
  const lines = [];
  const p = (s = "") => lines.push(s);
  p(`# Capture report: ${id}`);
  p();
  p(`- **URL:** ${url}`);
  p(`- **Title:** ${capture.title}`);
  if (capture.description) p(`- **Description:** ${capture.description}`);
  p(`- **Page height:** ${capture.height}px at 1440px wide`);
  p(`- **Files:** ${files.join(", ")}`);
  p();
  p(`## Fonts (loaded and used)`);
  p();
  for (const [family, weights] of Object.entries(capture.fonts)) {
    p(
      `- **${family}**: loaded weights ${weights.join(", ")}; used ${usedWeights(
        capture,
        family,
      )
        .map((w) => `${w.value} ${w.name}`)
        .join(", ")}`,
    );
  }
  if (capture.unusedFonts.length)
    p(`- Loaded but not used for text: ${capture.unusedFonts.join(", ")}`);
  p();
  p(`## Type scale (largest first)`);
  p();
  p(
    `| Family | Size / line | Weight | Tracking | Caps | Chars | Tags | Sample |`,
  );
  p(`|---|---|---|---|---|---|---|---|`);
  for (const s of capture.typeScale.slice(0, 24)) {
    p(
      `| ${s.family} | ${s.size}/${s.lineHeight ?? "normal"} | ${s.weight} | ${s.tracking || ""} | ${s.uppercase ? "yes" : ""} | ${s.chars} | ${Object.keys(s.tags).join(" ")} | ${s.sample.replace(/\|/g, "/").slice(0, 40)} |`,
    );
  }
  p();
  p(`## Palette (by prominence)`);
  p();
  p(`| | Hex | Score | Hue | Sat | Light | Neutral | Found in |`);
  p(`|---|---|---|---|---|---|---|---|`);
  for (const c of capture.palette) {
    p(
      `| ${swatch(c.hex)} | ${c.hex} | ${c.score} | ${c.hue}° | ${c.saturation}% | ${c.lightness}% | ${c.neutral ? "yes" : ""} | ${c.sources.join(", ")} |`,
    );
  }
  p();
  p(`Colors found only in pixels come from images or illustrations.`);
  p();
  p(`## Harmony suggestions`);
  p();
  for (const h of capture.harmonies)
    p(`- **${h.harmony}** (score ${h.score}): ${h.explanation}`);
  p();
  p(`## Motion candidates`);
  p();
  if (!capture.motion?.length)
    p(`None detected (or motion capture was skipped).`);
  for (const m of capture.motion ?? []) {
    const where = `y ${Math.round(m.box.y)}–${Math.round(m.box.y + m.box.height)}`;
    p(
      `- **${m.kind}** at ${where}: \`${m.file.split("/").pop()}\`${m.samples?.length ? `; text seen: ${m.samples.map((s) => `"${s}"`).join(", ")}` : ""}${m.hints?.length ? `; ${m.hints.join(", ")}` : ""}`,
    );
  }
  p();
  if (capture.webgl?.length) {
    p(`### WebGL canvases (likely shaders)`);
    p();
    for (const c of capture.webgl)
      p(
        `- ${c.w}×${c.h} at x ${c.x}, y ${c.y}: check for a shader (imagery: \`shader\`, motion: \`shader-animation\`)`,
      );
    p();
  }
  p(`### Browser animation list`);
  p();
  for (const a of capture.animations.slice(0, 20)) {
    const kind =
      a.duration === "auto"
        ? "scroll-driven"
        : a.iterations === Infinity
          ? "infinite loop"
          : `${a.duration}ms`;
    p(
      `- ${a.name} on \`${a.target}\` (${kind})${a.box ? ` at y ${a.box.y}` : ""}`,
    );
  }
  p();
  p(`## Page structure (for cropping examples)`);
  p();
  p(`See \`sections.png\` for the page with y-coordinates. Headings:`);
  p();
  for (const h of capture.headings.slice(0, 40))
    p(`- y ${h.y} · ${h.tag} · ${h.text}`);
  p();
  p(`Large images / media blocks:`);
  p();
  for (const m of capture.media.slice(0, 30))
    p(
      `- ${m.tag} at x ${m.x}, y ${m.y}, ${m.w}×${m.h}${m.alt ? ` ("${m.alt.slice(0, 50)}")` : ""}`,
    );
  p();
  p(`## Still to do by hand`);
  p();
  p(
    `1. Look for brand guidelines, a design system or designer interviews; set \`basis\` and \`sources\`.`,
  );
  p(
    `2. Name everything with glossary terms: harmony check, type classification, imagery styles / treatments / textures, motion types.`,
  );
  p(
    `3. Crop imagery examples: \`npm run crop -- ${id} <name> <x> <y> <width> <height>\`.`,
  );
  p(
    `4. Keep the motion clips that matter: copy them from \`drafts/${id}/\` to \`public/media/${id}/\`, label their terms.`,
  );
  p(
    `5. Write the what / why, tags and summary; then \`npm run specimen -- ${id}\` and \`npm run build\`.`,
  );
  return lines.join("\n") + "\n";
}

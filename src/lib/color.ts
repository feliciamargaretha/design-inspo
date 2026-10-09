// Color maths for the color wheel and for checking that an entry's stated
// color harmony matches its actual hues.

import type { COLOR_HARMONIES } from "@/data/taxonomies";

export type Harmony = (typeof COLOR_HARMONIES)[number];

export interface Hsl {
  /** 0–360, 0 = red */
  h: number;
  /** 0–1 */
  s: number;
  /** 0–1 */
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  ) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}

/**
 * Text color for a label on top of `hex`: dark on light colors, white on dark
 * ones. Uses perceived brightness (WCAG relative luminance), so bright
 * yellows get dark text even though their HSL lightness is only middling.
 */
export function textOn(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.18 ? "#0f172a" : "#fff";
}

/**
 * Whites, greys and near-blacks have no meaningful place on the wheel. That
 * includes faintly tinted greys (low chroma), which read as grey.
 */
export function isNeutral(hex: string): boolean {
  const { s, l } = hexToHsl(hex);
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const chroma = (Math.max(...channels) - Math.min(...channels)) / 255;
  return s < 0.15 || l > 0.94 || l < 0.08 || chroma < 0.1;
}

/** Shortest distance between two hues, 0–180. */
export function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

const near = (value: number, target: number, tolerance: number) =>
  Math.abs(value - target) <= tolerance;

/** True if every hue sits within `spread` of either `anchor` or its opposite. */
function twoSided(hues: number[], spread: number): boolean {
  return hues.some(
    (anchor) =>
      hues.every(
        (h) =>
          hueDistance(h, anchor) <= spread ||
          hueDistance(h, anchor + 180) <= spread,
      ) && hues.some((h) => hueDistance(h, anchor + 180) <= spread),
  );
}

/**
 * Checks whether a set of hues forms the given harmony, with tolerance for
 * real-world palettes. Returns an explanation when it doesn't.
 */
export function checkHarmony(harmony: Harmony, hexes: string[]): string | null {
  const hues = hexes.map((hex) => hexToHsl(hex).h);
  const pairs = hues.flatMap((a, i) =>
    hues.slice(i + 1).map((b) => hueDistance(a, b)),
  );
  const maxPair = Math.max(...pairs);
  const n = hues.length;
  const fail = (rule: string) =>
    `${hexes.join(", ")} (hues ${hues.map((h) => Math.round(h) + "°").join(", ")}) don't form ${/^[aeiou]/.test(harmony) ? "an" : "a"} ${harmony} harmony: ${rule}`;

  switch (harmony) {
    case "monochromatic":
      return maxPair <= 20 ? null : fail("all hues should be within 20°.");
    case "analogous":
      return n >= 2 && maxPair <= 90
        ? null
        : fail("2+ hues, all within 90° of each other.");
    case "complementary":
      return n >= 2 && twoSided(hues, 40)
        ? null
        : fail(
            "hues should cluster on two opposite sides of the wheel (180° ± 40°).",
          );
    case "split-complementary":
      return n === 3 &&
        hues.some((base) => {
          const others = hues.filter((h) => h !== base);
          return others.every((h) => near(hueDistance(h, base), 150, 25));
        })
        ? null
        : fail("3 hues: a base plus two hues about 150° away on either side.");
    case "triadic":
      return n === 3 && pairs.every((d) => near(d, 120, 25))
        ? null
        : fail("3 hues about 120° apart.");
    case "tetradic": {
      // Two complementary pairs (a rectangle on the wheel).
      if (n !== 4) return fail("4 hues forming two opposite pairs.");
      const [a, b, c, d] = hues as [number, number, number, number];
      const ok = [
        [a, b, c, d],
        [a, c, b, d],
        [a, d, b, c],
      ].some(
        ([w, x, y, z]) =>
          near(hueDistance(w!, x!), 180, 30) &&
          near(hueDistance(y!, z!), 180, 30),
      );
      return ok
        ? null
        : fail("4 hues forming two pairs that are each about 180° apart.");
    }
    case "square": {
      if (n !== 4) return fail("4 hues about 90° apart.");
      const sorted = [...hues].sort((x, y) => x - y);
      const gaps = sorted.map(
        (h, i) => (sorted[(i + 1) % n]! - h + 360) % 360 || 360,
      );
      return gaps.every((g) => near(g, 90, 25))
        ? null
        : fail("4 hues about 90° apart.");
    }
  }
}

/** Ideal hue offsets (from a base hue) for each harmony, used by the harmony guide. */
export const HARMONY_OFFSETS: Record<Harmony, number[]> = {
  monochromatic: [0, 0, 0],
  analogous: [-30, 0, 30],
  complementary: [0, 180],
  "split-complementary": [0, 150, 210],
  triadic: [0, 120, 240],
  tetradic: [0, 60, 180, 240],
  square: [0, 90, 180, 270],
};

/** Plain-English sentence explaining how the given colors form the harmony. */
export function describeHarmony(
  harmony: Harmony,
  colors: { hex: string; name?: string }[],
): string {
  const pts = colors.map((c) => ({
    label: `${c.name ?? c.hex} (${Math.round(hexToHsl(c.hex).h)}°)`,
    h: hexToHsl(c.hex).h,
  }));
  const apart = (a: (typeof pts)[number], b: (typeof pts)[number]) =>
    `${a.label} and ${b.label} are ${Math.round(hueDistance(a.h, b.h))}° apart`;
  const list = (items: string[]) =>
    items.length < 2
      ? (items[0] ?? "")
      : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

  switch (harmony) {
    case "monochromatic":
    case "analogous": {
      const span = Math.max(
        ...pts.flatMap((a) => pts.map((b) => hueDistance(a.h, b.h))),
      );
      return `${list(pts.map((p) => p.label))} all sit within ${Math.round(span)}° of each other.`;
    }
    case "complementary": {
      const anchor = pts[0]!;
      const far = pts.filter((p) => hueDistance(p.h, anchor.h) > 90);
      const near = pts.filter((p) => hueDistance(p.h, anchor.h) <= 90);
      const main = `${apart(anchor, far[0]!)}: opposite sides of the wheel.`;
      const extras = [...near.slice(1), ...far.slice(1)];
      return extras.length
        ? `${main} ${list(extras.map((p) => p.label))} ${extras.length > 1 ? "sit beside them as analogous neighbors" : "sits beside them as an analogous neighbor"}.`
        : main;
    }
    case "tetradic": {
      // Pair each color with its most opposite partner.
      const [a, ...rest] = pts;
      const partner = rest.reduce((best, p) =>
        hueDistance(p.h, a!.h) > hueDistance(best.h, a!.h) ? p : best,
      );
      const [c, d] = rest.filter((p) => p !== partner);
      return `Two complementary pairs: ${apart(a!, partner)}, and ${apart(c!, d!)}.`;
    }
    default: {
      const sorted = [...pts].sort((x, y) => x.h - y.h);
      const gaps = sorted.map((p, i) =>
        apart(p, sorted[(i + 1) % sorted.length]!),
      );
      return `${list(gaps)}.`;
    }
  }
}

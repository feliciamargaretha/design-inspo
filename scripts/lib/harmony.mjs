// Suggests color harmonies for a palette using the site's own checker.

import {
  checkHarmony,
  describeHarmony,
  hueDistance,
} from "../../src/lib/color.ts";

const HARMONIES = [
  "monochromatic",
  "complementary",
  "split-complementary",
  "triadic",
  "tetradic",
  "square",
  "analogous",
];

function* subsets(items, min, max) {
  const n = items.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    const pick = items.filter((_, i) => mask & (1 << i));
    if (pick.length >= min && pick.length <= max) yield pick;
  }
}

/**
 * Returns harmony candidates, best first. Always includes the most-used
 * chromatic color; a larger share of the palette scores higher.
 */
export function suggestHarmonies(palette, { limit = 3 } = {}) {
  const chromatic = [];
  for (const c of palette.filter((p) => !p.neutral)) {
    if (chromatic.every((x) => hueDistance(x.hue, c.hue) >= 12))
      chromatic.push(c);
    if (chromatic.length === 5) break;
  }
  if (chromatic.length === 0) return [];
  if (chromatic.length === 1) {
    return [
      {
        harmony: "monochromatic",
        colors: [chromatic[0].hex],
        score: chromatic[0].score,
        explanation:
          "Only one hue is used; check whether its tints and shades make it monochromatic.",
      },
    ];
  }

  const lead = chromatic[0];
  const results = [];
  for (const set of subsets(chromatic, 2, 4)) {
    if (!set.includes(lead)) continue;
    const hexes = set.map((c) => c.hex);
    for (const harmony of HARMONIES) {
      if (checkHarmony(harmony, hexes)) continue;
      const weight = set.reduce((s, c) => s + c.score, 0);
      // Specific harmonies beat analogous when they explain the same colors.
      const specificity = harmony === "analogous" ? 0.8 : 1;
      results.push({
        harmony,
        colors: hexes,
        score: Math.round(weight * specificity * 10) / 10,
        explanation: describeHarmony(
          harmony,
          set.map((c) => ({ hex: c.hex })),
        ),
      });
    }
  }
  const seen = new Set();
  return results
    .sort((a, b) => b.score - a.score || b.colors.length - a.colors.length)
    .filter((r) => !seen.has(r.harmony) && seen.add(r.harmony))
    .slice(0, limit);
}

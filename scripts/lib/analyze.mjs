// Design measurements taken from a live page (run after scrollThrough).

import sharp from "sharp";
import { hexToHsl, isNeutral } from "../../src/lib/color.ts";

const toHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const rgbStringToHex = (s) => {
  const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
  if (!m) return null;
  if (m[4] !== undefined && Number(m[4]) < 0.5) return null; // mostly transparent
  return toHex(+m[1], +m[2], +m[3]);
};

/** Everything measurable from the DOM in one pass. */
export async function measurePage(page) {
  const raw = await page.evaluate(async () => {
    await document.fonts.ready;
    const clean = (f) => f.split(",")[0].replace(/["']/g, "").trim();

    // Fonts the page actually loaded, with their real weight ranges.
    const fonts = {};
    for (const f of document.fonts) {
      if (f.status !== "loaded" || f.style !== "normal") continue;
      const family = clean(f.family);
      const weight =
        f.weight === "normal" ? "400" : f.weight === "bold" ? "700" : f.weight;
      (fonts[family] ||= new Set()).add(weight);
    }

    // Type scale: every distinct text style, with how much text uses it.
    const styles = {};
    const bg = {};
    const fg = {};
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const cs = getComputedStyle(el);
      if (
        cs.visibility === "hidden" ||
        cs.display === "none" ||
        Number(cs.opacity) === 0
      )
        continue;

      const area = r.width * Math.min(r.height, 2000);
      if (cs.backgroundColor)
        bg[cs.backgroundColor] = (bg[cs.backgroundColor] || 0) + area;

      const text = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ")
        .trim();
      if (!text) continue;
      fg[cs.color] = (fg[cs.color] || 0) + text.length;
      const key = [
        clean(cs.fontFamily),
        parseFloat(cs.fontSize),
        cs.fontWeight,
        cs.lineHeight === "normal"
          ? "normal"
          : Math.round(parseFloat(cs.lineHeight)),
        cs.letterSpacing === "normal"
          ? 0
          : Math.round(parseFloat(cs.letterSpacing) * 100) / 100,
        cs.textTransform === "uppercase",
      ].join("|");
      const s = (styles[key] ||= {
        chars: 0,
        count: 0,
        tags: {},
        sample: text.slice(0, 60),
      });
      s.chars += text.length;
      s.count += 1;
      s.tags[el.tagName.toLowerCase()] =
        (s.tags[el.tagName.toLowerCase()] || 0) + 1;
    }

    const headings = [...document.querySelectorAll("h1, h2, h3")]
      .map((h) => {
        const r = h.getBoundingClientRect();
        return {
          tag: h.tagName.toLowerCase(),
          text: h.innerText.trim().slice(0, 80),
          y: Math.round(r.top + scrollY),
        };
      })
      .filter((h) => h.text);

    const media = [
      ...document.querySelectorAll("img, svg, video, canvas, picture"),
    ]
      .map((m) => {
        const r = m.getBoundingClientRect();
        return {
          tag: m.tagName.toLowerCase(),
          x: Math.round(r.left),
          y: Math.round(r.top + scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
          alt: m.getAttribute("alt") || "",
        };
      })
      .filter((m) => m.w * m.h > 40000);

    const animations = document.getAnimations().map((a) => {
      const t = a.effect?.target;
      const r = t?.getBoundingClientRect?.();
      const timing = a.effect?.getTiming?.() ?? {};
      return {
        name: a.animationName || a.constructor.name,
        duration: timing.duration,
        iterations: timing.iterations,
        target: t
          ? `${t.tagName.toLowerCase()}${t.className && typeof t.className === "string" ? "." + t.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`
          : null,
        box: r
          ? {
              x: Math.round(r.left),
              y: Math.round(r.top + scrollY),
              w: Math.round(r.width),
              h: Math.round(r.height),
            }
          : null,
      };
    });

    // WebGL canvases are where shaders live.
    const webgl = [...document.querySelectorAll("canvas")]
      .filter((c) => {
        const r = c.getBoundingClientRect();
        if (r.width < 150 || r.height < 100) return false;
        try {
          return !!(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
          return false;
        }
      })
      .map((c) => {
        const r = c.getBoundingClientRect();
        return {
          x: Math.round(r.left),
          y: Math.round(r.top + scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });

    const meta = (n) =>
      document
        .querySelector(`meta[name="${n}"], meta[property="${n}"]`)
        ?.getAttribute("content") ?? null;

    return {
      title: document.title,
      description: meta("description") ?? meta("og:description"),
      themeColor: meta("theme-color"),
      lang: document.documentElement.lang,
      height: document.documentElement.scrollHeight,
      fonts: Object.fromEntries(
        Object.entries(fonts).map(([k, v]) => [k, [...v]]),
      ),
      styles,
      bg,
      fg,
      headings,
      media,
      animations,
      webgl,
    };
  });

  // Type scale, largest first, dropping one-off tiny styles.
  const typeScale = Object.entries(raw.styles)
    .map(([key, s]) => {
      const [family, size, weight, lineHeight, tracking, uppercase] =
        key.split("|");
      return {
        family,
        size: Number(size),
        weight: Number(weight),
        lineHeight: lineHeight === "normal" ? null : Number(lineHeight),
        tracking: Number(tracking),
        uppercase: uppercase === "true",
        chars: s.chars,
        count: s.count,
        tags: s.tags,
        sample: s.sample,
      };
    })
    .filter((s) => s.chars >= 12 || (s.size >= 24 && s.chars >= 2))
    .sort((a, b) => b.size - a.size || b.chars - a.chars);

  const cssColors = (map, unit) =>
    Object.entries(map)
      .map(([css, amount]) => ({ hex: rgbStringToHex(css), amount }))
      .filter((c) => c.hex)
      .reduce((acc, c) => {
        const found = acc.find((a) => a.hex === c.hex);
        found ? (found.amount += c.amount) : acc.push({ ...c });
        return acc;
      }, [])
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({ ...c, unit }));

  const usedFamilies = new Set(typeScale.map((s) => s.family));
  return {
    ...raw,
    styles: undefined,
    bg: undefined,
    fg: undefined,
    fonts: Object.fromEntries(
      Object.entries(raw.fonts).filter(([f]) => usedFamilies.has(f)),
    ),
    allFonts: raw.fonts,
    unusedFonts: Object.keys(raw.fonts).filter((f) => !usedFamilies.has(f)),
    typeScale,
    backgroundColors: cssColors(raw.bg, "px²").slice(0, 16),
    textColors: cssColors(raw.fg, "chars").slice(0, 10),
  };
}

const dist = (a, b) => {
  const [x, y] = [a, b].map((h) =>
    [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)),
  );
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};

/**
 * Dominant colors by pixel area, from the full-page screenshot. Catches colors
 * that live in images and illustrations, which CSS can't see.
 */
export async function pixelPalette(pngPath, { max = 14 } = {}) {
  const { data, info } = await sharp(pngPath)
    .resize({ width: 360 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 3) {
    // 4-bit-per-channel buckets, averaged back to a real color.
    const key =
      (data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4);
    const b = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    b.r += data[i];
    b.g += data[i + 1];
    b.b += data[i + 2];
    b.n += 1;
    buckets.set(key, b);
  }
  const total = info.width * info.height;
  const merged = [];
  for (const b of [...buckets.values()].sort((x, y) => y.n - x.n)) {
    const hex = toHex(b.r / b.n, b.g / b.n, b.b / b.n);
    const near = merged.find((m) => dist(m.hex, hex) < 28);
    if (near) near.share += b.n / total;
    else merged.push({ hex, share: b.n / total });
  }
  return merged
    .filter((c) => c.share >= 0.002)
    .slice(0, max)
    .map((c) => ({ ...c, share: Math.round(c.share * 1000) / 10 }));
}

/**
 * Combined palette suggestion: exact CSS colors first (they're the real
 * tokens), plus pixel-only colors that come from imagery.
 */
export function suggestPalette(measure, pixels) {
  const out = [];
  const add = (hex, source, weight) => {
    const near = out.find((c) => dist(c.hex, hex) < 20);
    if (near) {
      near.sources.add(source);
      near.weight += weight;
    } else out.push({ hex, sources: new Set([source]), weight });
  };
  const bgTotal =
    measure.backgroundColors.reduce((s, c) => s + c.amount, 0) || 1;
  const fgTotal = measure.textColors.reduce((s, c) => s + c.amount, 0) || 1;
  measure.backgroundColors.forEach((c) =>
    add(c.hex, "css-background", c.amount / bgTotal),
  );
  measure.textColors.forEach((c) =>
    add(c.hex, "css-text", (c.amount / fgTotal) * 0.5),
  );
  pixels.forEach((c) => add(c.hex, "pixels", c.share / 100));
  return out
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 14)
    .map((c) => {
      const { h, s, l } = hexToHsl(c.hex);
      return {
        hex: c.hex,
        sources: [...c.sources],
        /** Relative prominence (area + text use + pixels); for ranking only. */
        score: Math.round(c.weight * 1000) / 10,
        hue: Math.round(h),
        saturation: Math.round(s * 100),
        lightness: Math.round(l * 100),
        neutral: isNeutral(c.hex),
      };
    });
}

// Finds and records motion on a live page.
//
// Two kinds of motion are detected:
// - time-based: things that move while you just watch (marquees, rotating or
//   typing text, idle animations), found by comparing the page with itself
//   over time at each scroll position;
// - scroll reveals: things that animate in when scrolled into view, found by
//   comparing each element before and after it enters the viewport.
// The browser's own animation list adds evidence (e.g. infinite CSS
// animations, scroll-driven animations).

import sharp from "sharp";
import {
  VIEWPORT,
  clipFor,
  open,
  scrollThrough,
  scrollToY,
  setAnimationRate,
} from "./browser.mjs";

/** In-page: style snapshot of every visible, reasonably sized element. */
const SNAPSHOT = () => {
  window.__motionEls ||= [];
  const out = {};
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    if (r.width * r.height > window.innerWidth * window.innerHeight * 0.9)
      continue;
    let i = window.__motionEls.indexOf(el);
    if (i === -1) i = window.__motionEls.push(el) - 1;
    const cs = getComputedStyle(el);
    const text = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(" ")
      .slice(0, 60);
    out[i] = {
      o: cs.opacity,
      t: cs.transform,
      tr: cs.translate,
      c: cs.clipPath,
      text,
      box: { x: r.left, y: r.top + scrollY, width: r.width, height: r.height },
      inView: r.bottom > 0 && r.top < window.innerHeight,
    };
  }
  return out;
};

const changed = (a, b) =>
  a.o !== b.o || a.t !== b.t || a.tr !== b.tr || a.c !== b.c;

/**
 * Merges overlapping boxes (with padding) into regions. With `rows`, boxes
 * that share a horizontal band merge even when side by side (a row of cards).
 * Boxes entirely outside the viewport's width are ignored.
 */
function mergeRegions(items, pad = 24, { rows = false } = {}) {
  const regions = [];
  for (const item of items) {
    const b = item.box;
    if (b.x >= VIEWPORT.width || b.x + b.width <= 0) continue;
    const box = {
      x: b.x - pad,
      y: b.y - pad,
      width: b.width + 2 * pad,
      height: b.height + 2 * pad,
    };
    const hit = regions.find(
      (r) =>
        (rows ||
          (box.x < r.box.x + r.box.width && box.x + box.width > r.box.x)) &&
        box.y < r.box.y + r.box.height &&
        box.y + box.height > r.box.y,
    );
    if (hit) {
      const x = Math.min(hit.box.x, box.x);
      const y = Math.min(hit.box.y, box.y);
      hit.box = {
        x,
        y,
        width: Math.max(hit.box.x + hit.box.width, box.x + box.width) - x,
        height: Math.max(hit.box.y + hit.box.height, box.y + box.height) - y,
      };
      hit.items.push(item);
    } else regions.push({ box, items: [item] });
  }
  for (const r of regions) {
    const right = Math.min(VIEWPORT.width, r.box.x + r.box.width);
    r.box.x = Math.max(0, r.box.x);
    r.box.width = right - r.box.x;
  }
  return regions;
}

function widen(box, minWidth) {
  if (box.width >= minWidth) return box;
  const x = Math.max(
    0,
    Math.min(VIEWPORT.width - minWidth, box.x - (minWidth - box.width) / 2),
  );
  return { ...box, x, width: minWidth };
}

/** Things that move while the page sits still, at each scroll position. */
export async function detectTimeMotion(page, height, { wait = 1600 } = {}) {
  const found = [];
  for (let y = 0; y < height; y += VIEWPORT.height - 100) {
    await scrollToY(page, y);
    await page.waitForTimeout(1500); // let reveals at this position finish
    const a = await page.evaluate(SNAPSHOT);
    await page.waitForTimeout(wait);
    const b = await page.evaluate(SNAPSHOT);
    for (const [i, s] of Object.entries(a)) {
      const t = b[i];
      if (!t || !s.inView) continue;
      const textChanged = s.text !== t.text && (s.text || t.text);
      if (textChanged || changed(s, t)) {
        found.push({
          box: t.box,
          kind: textChanged ? "text" : "loop",
          text: textChanged ? [s.text, t.text] : null,
        });
      }
    }
  }
  return mergeRegions(found)
    .map((r) => ({
      kind: r.items.some((i) => i.kind === "text") ? "text" : "loop",
      // Text grows as it types or swaps, so give it room.
      box: r.items.some((i) => i.kind === "text") ? widen(r.box, 560) : r.box,
      samples: [
        ...new Set(r.items.flatMap((i) => i.text ?? []).filter(Boolean)),
      ].slice(0, 6),
    }))
    .filter((r) => r.box.height <= VIEWPORT.height && r.box.width >= 40);
}

/** Things that animate in as they scroll into view (call on a fresh page). */
export async function detectReveals(page, height, exclude = []) {
  const initial = await page.evaluate(SNAPSHOT);
  const revealed = new Map();
  for (let y = 300; y < height; y += 300) {
    await scrollToY(page, y);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(1200);
  // Settled state, checked section by section so every element has been in view.
  for (let y = 0; y < height; y += VIEWPORT.height) {
    await scrollToY(page, y);
    await page.waitForTimeout(600);
    const now = await page.evaluate(SNAPSHOT);
    for (const [i, s] of Object.entries(initial)) {
      const t = now[i];
      if (!t || !t.inView || s.box.y < VIEWPORT.height) continue; // skip first screen
      if (changed(s, t)) revealed.set(i, { box: t.box, from: s, to: t });
    }
  }
  const overlaps = (box) =>
    exclude.some(
      (e) =>
        box.y < e.box.y + e.box.height &&
        box.y + box.height > e.box.y &&
        box.x < e.box.x + e.box.width &&
        box.x + box.width > e.box.x,
    );
  // Items still off to the side count towards their row (stagger evidence).
  const rowItems = [...revealed.values()]
    .filter((r) => !overlaps(r.box))
    .map((r) => ({
      ...r,
      box: {
        ...r.box,
        x: Math.min(Math.max(r.box.x, 0), VIEWPORT.width - 1),
        width: Math.max(1, Math.min(r.box.width, VIEWPORT.width)),
      },
    }));
  return mergeRegions(rowItems, 8, { rows: true })
    .map((r) => {
      const opacity = r.items.some((i) => Number(i.from.o) < Number(i.to.o));
      const moved = r.items.some(
        (i) => i.from.t !== i.to.t || i.from.tr !== i.to.tr,
      );
      const xs = r.items
        .map(
          (i) =>
            /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([-\d.]+)/.exec(i.from.t)?.[1],
        )
        .filter(Boolean)
        .map(Number);
      return {
        kind: "reveal",
        box: r.box,
        hints: [
          opacity && "fades in",
          moved && "moves into place",
          xs.some((x) => x > 0) && "from the right",
          xs.some((x) => x < 0) && "from the left",
          new Set(xs).size > 2 &&
            "staggered (items start at different offsets)",
        ].filter(Boolean),
        elements: r.items.length,
      };
    })
    .filter((r) => r.box.height >= 40 && r.box.height <= VIEWPORT.height * 1.5);
}

async function writeClip(frames, durations, file, width) {
  const resized = await Promise.all(
    frames.map((f) =>
      sharp(f).resize({ width, withoutEnlargement: true }).png().toBuffer(),
    ),
  );
  await sharp(resized, { join: { animated: true } })
    .webp({ loop: 0, delay: durations, quality: 60, effort: 5 })
    .toFile(file);
}

/** Records a time-based region for `seconds` at `fps`. */
export async function recordTime(
  page,
  region,
  file,
  { seconds = 6, fps = 8 } = {},
) {
  const box = {
    ...region.box,
    height: Math.min(region.box.height, VIEWPORT.height - 20),
  };
  await scrollToY(
    page,
    box.y,
    Math.max(10, (VIEWPORT.height - box.height) / 2),
  );
  await page.waitForTimeout(500);
  const clip = await clipFor(page, box);
  const frames = [];
  const start = Date.now();
  while (Date.now() - start < seconds * 1000) {
    frames.push(await page.screenshot({ clip }));
    await page.waitForTimeout(1000 / fps);
  }
  const step = Math.round((seconds * 1000) / frames.length);
  await writeClip(
    frames,
    frames.map(() => step),
    file,
    Math.min(1200, clip.width),
  );
  return { frames: frames.length };
}

/**
 * Records a scroll reveal on a fresh page: slows animations 10×, then
 * scrolls the region into view step by step, capturing the viewport.
 */
export async function recordReveal(
  browser,
  url,
  region,
  file,
  { rate = 0.1 } = {},
) {
  const page = await open(browser, url);
  await setAnimationRate(page, rate);
  const startY = Math.max(0, region.box.y - VIEWPORT.height - 40);
  const endY = Math.max(startY + 60, region.box.y - 260);
  await scrollToY(page, startY);
  await page.waitForTimeout(400);
  const frames = [];
  for (let y = startY; y <= endY; y += 36) {
    await scrollToY(page, y);
    await page.waitForTimeout(40);
    frames.push(await page.screenshot());
  }
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(120);
    frames.push(await page.screenshot());
  }
  await page.context().close();
  const durations = frames.map((_, i) => (i < frames.length - 24 ? 45 : 60));
  durations[durations.length - 1] = 1500;
  await writeClip(frames, durations, file, 800);
  return { frames: frames.length };
}

/** Full motion pass: detect everything, then record each region. */
export async function captureMotion(browser, url, dir, { max = 4 } = {}) {
  const page = await open(browser, url);
  const height = await scrollThrough(page);
  const time = (await detectTimeMotion(page, height)).slice(0, max);
  await page.context().close();

  const fresh = await open(browser, url);
  const reveals = (await detectReveals(fresh, height, time)).slice(0, max);
  await fresh.context().close();

  const results = [];
  const watcher = await open(browser, url);
  await scrollThrough(watcher);
  for (const [n, region] of time.entries()) {
    const file = `${dir}/motion-${region.kind}-${n + 1}.webp`;
    await recordTime(watcher, region, file);
    results.push({ ...region, file });
  }
  await watcher.context().close();
  for (const [n, region] of reveals.entries()) {
    const file = `${dir}/motion-reveal-${n + 1}.webp`;
    await recordReveal(browser, url, region, file);
    results.push({ ...region, file });
  }
  return results;
}

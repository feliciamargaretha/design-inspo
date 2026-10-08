// Shared Playwright helpers for the capture scripts.

import { chromium } from "playwright";

export const VIEWPORT = { width: 1440, height: 900 };

const COOKIE_BUTTONS = [
  "Accept all",
  "Accept All",
  "Accept all cookies",
  "Accept Cookies",
  "Accept cookies",
  "Accept",
  "Allow all",
  "Allow all cookies",
  "I agree",
  "Agree",
  "Got it",
  "OK",
];

export async function launch() {
  return chromium.launch();
}

/**
 * Opens a page like a visitor would: waits for load (not network idle, which
 * busy marketing sites never reach), dismisses cookie banners, and settles.
 */
export async function open(browser, url, { settle = 3000 } = {}) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page
    .goto(url, { waitUntil: "load", timeout: 60_000 })
    .catch((e) =>
      console.warn(`  page load: ${e.message.split("\n")[0]} (continuing)`),
    );
  await page.waitForTimeout(settle);
  await dismissCookies(page);
  return page;
}

export async function dismissCookies(page) {
  for (const name of COOKIE_BUTTONS) {
    const button = page.getByRole("button", { name, exact: true });
    if (await button.count().catch(() => 0)) {
      await button
        .first()
        .click({ timeout: 2000 })
        .catch(() => {});
      await page.waitForTimeout(500);
      return name;
    }
  }
  return null;
}

/** Scrolls through the whole page so lazy-loaded content appears, then returns to the top. */
export async function scrollThrough(page, { step = 700, pause = 250 } = {}) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(pause);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  return page.evaluate(() => document.documentElement.scrollHeight);
}

/** Slows CSS and Web Animations (not JS-driven ones) by `rate` (e.g. 0.1 = 10× slower). */
export async function setAnimationRate(page, rate) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Animation.enable");
  await cdp.send("Animation.setPlaybackRate", { playbackRate: rate });
  return cdp;
}

/** Scrolls so that page coordinate `y` sits `offset` px below the top of the viewport. */
export async function scrollToY(page, y, offset = 0) {
  await page.evaluate(
    ([v, o]) =>
      window.scrollTo({ top: Math.max(0, v - o), behavior: "instant" }),
    [y, offset],
  );
}

/** Viewport-relative clip for a page-coordinate box, clamped to the viewport. */
export async function clipFor(page, box) {
  const scrollY = await page.evaluate(() => window.scrollY);
  const x = Math.max(0, Math.round(box.x));
  const y = Math.max(0, Math.round(box.y - scrollY));
  return {
    x,
    y,
    width: Math.min(VIEWPORT.width - x, Math.round(box.width)),
    height: Math.min(VIEWPORT.height - y, Math.round(box.height)),
  };
}

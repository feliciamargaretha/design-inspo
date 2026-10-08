// The single source of truth for every category, filter and tag on the site.
// Entries can only use values listed here; the build fails otherwise.
// To add a value: append it to the right list (kebab-case). Labels are
// generated automatically; add an override in LABEL_OVERRIDES if needed.

/** Where a source comes from. Each maps to a tab under Inspiration. */
export const ENTRY_TYPES = ["landing", "ios", "desktop"] as const;

/** Shared by landing pages (industry) and apps (product category). */
export const CATEGORIES = [
  "ai",
  "developer-tools",
  "design-tools",
  "e-commerce",
  "education",
  "finance",
  "food-and-drink",
  "health-and-wellness",
  "marketing",
  "media-and-entertainment",
  "productivity",
  "real-estate",
  "social",
  "travel",
] as const;

/** What kind of screen an iOS / desktop entry shows. */
export const SCREEN_TYPES = [
  "onboarding",
  "sign-up",
  "login",
  "home",
  "dashboard",
  "empty-state",
  "list",
  "detail",
  "search",
  "profile",
  "settings",
  "notifications",
  "pricing",
  "paywall",
  "checkout",
  "error",
] as const;

/** Personality / branding tags shown on every entry. */
export const PERSONALITY_TAGS = [
  "approachable",
  "bold",
  "calm",
  "editorial",
  "energetic",
  "friendly",
  "minimal",
  "optimistic",
  "playful",
  "premium",
  "professional",
  "quirky",
  "reassuring",
  "sophisticated",
  "technical",
  "trustworthy",
  "warm",
] as const;

/** Colors topic filters. */
export const COLOR_MODES = ["light", "dark", "mixed"] as const;
export const COLOR_TEMPERATURES = ["warm", "cool", "neutral"] as const;
export const COLOR_ROLES = [
  "background",
  "surface",
  "text",
  "primary",
  "secondary",
  "accent",
] as const;

/** Typography topic filters. */
export const TYPE_CLASSIFICATIONS = [
  "sans-serif",
  "serif",
  "monospace",
  "display",
  "script",
] as const;
export const TYPE_ROLES = ["display", "heading", "body", "ui", "code"] as const;

/** Imagery topic filters. */
export const IMAGERY_STYLES = [
  "photography",
  "product-ui",
  "line-illustration",
  "flat-illustration",
  "3d",
  "hand-drawn",
  "mascot",
  "abstract-shapes",
  "gradient",
  "iconography",
  "collage",
] as const;

/** Motion topic filters. */
export const MOTION_TYPES = [
  "scroll-reveal",
  "hover",
  "micro-interaction",
  "page-transition",
  "loading",
  "parallax",
  "animated-illustration",
  "carousel",
  "text-animation",
  "video",
] as const;

const LABEL_OVERRIDES: Record<string, string> = {
  ai: "AI",
  ios: "iOS",
  "3d": "3D",
  "product-ui": "Product UI",
  "e-commerce": "E-commerce",
};

/** Turns a taxonomy value into a display label, e.g. "health-and-wellness" → "Health and wellness". */
export function label(value: string): string {
  if (value in LABEL_OVERRIDES) return LABEL_OVERRIDES[value]!;
  const text = value.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

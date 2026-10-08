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
/** How the main hues relate on the colour wheel (defined in glossary.ts). */
export const COLOR_HARMONIES = [
  "monochromatic",
  "analogous",
  "complementary",
  "split-complementary",
  "triadic",
  "tetradic",
  "square",
] as const;
/** How much of each colour is used (defined in glossary.ts). */
export const COLOR_STRATEGIES = [
  "neutral-with-accent",
  "multicolour",
  "tonal",
] as const;

/** Typography topic filters. Broad groups, used for filtering. */
export const TYPE_CLASSIFICATIONS = [
  "sans-serif",
  "serif",
  "monospace",
  "display",
  "script",
] as const;
/** Named type classifications (defined in glossary.ts), each in one broad group. */
export const TYPE_STYLES = [
  "geometric-sans",
  "humanist-sans",
  "grotesque-sans",
  "neo-grotesque-sans",
  "old-style-serif",
  "transitional-serif",
  "didone",
  "slab-serif",
  "monospace",
  "display-face",
  "script-face",
] as const;
export const TYPE_STYLE_GROUP: Record<
  (typeof TYPE_STYLES)[number],
  (typeof TYPE_CLASSIFICATIONS)[number]
> = {
  "geometric-sans": "sans-serif",
  "humanist-sans": "sans-serif",
  "grotesque-sans": "sans-serif",
  "neo-grotesque-sans": "sans-serif",
  "old-style-serif": "serif",
  "transitional-serif": "serif",
  didone: "serif",
  "slab-serif": "serif",
  monospace: "monospace",
  "display-face": "display",
  "script-face": "script",
};
export const TYPE_ROLES = ["display", "heading", "body", "ui", "code"] as const;

/** Imagery: what kind of image (defined in glossary.ts). */
export const IMAGERY_STYLES = [
  "product-ui",
  "device-mockup",
  "portrait-photography",
  "lifestyle-photography",
  "flat-illustration",
  "line-illustration",
  "3d-render",
  "hand-drawn",
  "character-mascot",
  "abstract-shapes",
  "line-icons",
  "logo-wall",
  "mixed-media-collage",
] as const;

/** Imagery: how images are treated or framed (defined in glossary.ts). */
export const IMAGERY_TREATMENTS = [
  "black-and-white",
  "duotone",
  "cutout",
  "colour-blocking",
  "layered-cards",
  "multiplayer-cursors",
  "soft-glow",
  "decorative-sparkles",
] as const;

/** Imagery: surface texture and background pattern (defined in glossary.ts). */
export const TEXTURES = [
  "flat-colour",
  "grid-pattern",
  "dot-grid",
  "grain",
  "halftone",
  "soft-gradient",
  "gradient-mesh",
  "glassmorphism",
  "paper",
] as const;

/** Motion techniques (defined in glossary.ts). Combine them: a card can scroll-reveal with a fade-in, slide-in and stagger. */
export const MOTION_TYPES = [
  "scroll-reveal",
  "fade-in",
  "slide-in",
  "stagger",
  "parallax",
  "typewriter",
  "text-rotator",
  "marquee",
  "carousel",
  "idle-animation",
  "hover-state",
  "micro-interaction",
  "page-transition",
  "skeleton-loading",
  "background-video",
] as const;

/**
 * Where the "why" of a breakdown comes from. Brand sources always win over
 * our own interpretation when they exist.
 * - brand-guidelines: the company's own published guidelines / design system
 * - brand-statement: the brand or its designers explaining choices elsewhere
 *   (press interviews, agency or type-foundry case studies)
 * - interpretation: our own informed assumption
 */
export const RATIONALE_BASES = [
  "brand-guidelines",
  "brand-statement",
  "interpretation",
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

// Design vocabulary: the proper name and a plain-English definition for every
// style, treatment, texture, motion technique, color harmony and strategy, and type
// classification used on the site. The site shows these wherever a term
// appears, so browsing entries doubles as learning the vocabulary.
//
// Every value in the matching taxonomy list must have an entry here; the
// TypeScript build fails otherwise.

import type {
  COLOR_HARMONIES,
  COLOR_STRATEGIES,
  IMAGERY_STYLES,
  IMAGERY_TREATMENTS,
  MOTION_TYPES,
  TEXTURES,
  TYPE_STYLES,
} from "./taxonomies";

export interface Term {
  /** The name designers use. */
  name: string;
  /** Other names you'll hear for the same thing. */
  aka?: string[];
  /** One or two plain-English sentences. */
  definition: string;
}

type Glossary<T extends readonly string[]> = Record<T[number], Term>;

export const IMAGERY_STYLE_TERMS: Glossary<typeof IMAGERY_STYLES> = {
  "product-ui": {
    name: "Product UI showcase",
    aka: ["hero shot", "UI screenshot"],
    definition:
      "Real screenshots of the product's interface, cleaned up and shown large, so the product itself becomes the main image.",
  },
  "device-mockup": {
    name: "Device mock-up",
    definition:
      "The interface placed inside a drawing or render of a phone, laptop or tablet, to show it in context.",
  },
  "portrait-photography": {
    name: "Portrait photography",
    definition:
      "Photos of real people, usually head and shoulders, often next to a quote to add a human face to a claim.",
  },
  "lifestyle-photography": {
    name: "Lifestyle photography",
    definition:
      "Natural-looking photos of people in everyday settings, used to make a product feel part of real life.",
  },
  "flat-illustration": {
    name: "Flat vector illustration",
    aka: ["flat design illustration"],
    definition:
      "Drawings made of solid shapes of color with little or no shading or perspective; clean, simple and scalable.",
  },
  "line-illustration": {
    name: "Line illustration",
    aka: ["line art", "outline illustration"],
    definition:
      "Drawings built from strokes rather than filled shapes, often in a single color; feels light and sketch-like.",
  },
  "3d-render": {
    name: "3D render",
    definition:
      "Computer-generated objects or scenes with depth, lighting and materials, from glossy blobs to realistic products.",
  },
  "3d-type": {
    name: "3D extruded type",
    aka: ["dimensional type", "extruded lettering"],
    definition:
      "Letters given depth, as if pushed out of the page into solid 3D objects, with visible sides and shading. Loud, playful and hard to ignore.",
  },
  "hand-drawn": {
    name: "Hand-drawn",
    aka: ["doodle"],
    definition:
      "Imagery with visible imperfection (wobbly lines, scribbles, marker or pencil marks) that feels human and informal.",
  },
  "character-mascot": {
    name: "Character mascot",
    aka: ["brand character"],
    definition:
      "A recurring character that personifies the brand and gives it a face people can connect with.",
  },
  "abstract-shapes": {
    name: "Abstract shapes",
    aka: ["geometric shapes"],
    definition:
      "Circles, blobs, lines or other non-representational forms used for rhythm, color and energy rather than meaning.",
  },
  shader: {
    name: "Shader (WebGL)",
    aka: ["WebGL graphics", "generative graphics"],
    definition:
      "Graphics drawn live by the graphics card from code rather than loaded as an image: liquid gradients, noise and grain, glowing blobs, distortions. Usually animated.",
  },
  "line-icons": {
    name: "Outline icons",
    aka: ["Line icons", "stroke icons"],
    definition:
      "Small symbols drawn with an even stroke and no fill, used to label features at a glance.",
  },
  "logo-wall": {
    name: "Logo wall",
    aka: ["logo cloud", "social proof strip"],
    definition:
      "A row or grid of customer or partner logos, used as social proof: 'companies like these trust us'.",
  },
  "data-visualization": {
    name: "Data visualization",
    aka: ["chart", "infographic"],
    definition:
      "Numbers shown as a picture (line or bar charts, diagrams), so a trend or comparison is understood at a glance.",
  },
  "mixed-media-collage": {
    name: "Mixed-media collage",
    definition:
      "Photos, illustration, UI and graphic shapes layered together in one composition.",
  },
};

export const IMAGERY_TREATMENT_TERMS: Glossary<typeof IMAGERY_TREATMENTS> = {
  "black-and-white": {
    name: "Black-and-white photography",
    aka: ["greyscale", "monochrome photo"],
    definition:
      "Photos with the color removed, so they don't clash with the brand palette and feel timeless or editorial.",
  },
  duotone: {
    name: "Duotone",
    definition:
      "A photo recolored using just two colors (often brand colors), mapping the darks to one and the lights to the other.",
  },
  cutout: {
    name: "Cutout",
    aka: ["silhouetted photo", "knockout"],
    definition:
      "A subject cut away from its original background so it can sit directly on a color or overlap other elements.",
  },
  "color-blocking": {
    name: "Color blocking",
    definition:
      "Large flat areas of solid color placed behind or next to content, used to group things and add boldness.",
  },
  "layered-cards": {
    name: "Layered cards",
    aka: ["floating UI cards"],
    definition:
      "Pieces of interface pulled out into separate cards that overlap and float with shadows, to highlight specific features.",
  },
  "multiplayer-cursors": {
    name: "Multiplayer cursors",
    aka: ["collaboration cursors", "cursor callouts"],
    definition:
      "Colored mouse pointers with name labels placed over a UI, borrowed from collaborative tools to suggest many people (or agents) working together live.",
  },
  "soft-glow": {
    name: "Soft glow",
    aka: ["colored shadow"],
    definition:
      "A blurred, often tinted shadow or halo around an element, softer and warmer than a hard drop shadow.",
  },
  "decorative-sparkles": {
    name: "Decorative sparkles",
    aka: ["accent shapes"],
    definition:
      "Small stars, dots and twinkles scattered around a composition to add delight and lead the eye.",
  },
};

export const TEXTURE_TERMS: Glossary<typeof TEXTURES> = {
  "flat-color": {
    name: "Flat color",
    definition: "Solid fills with no pattern, grain or gradient.",
  },
  "grid-pattern": {
    name: "Grid pattern",
    aka: ["graph-paper background"],
    definition:
      "A faint square grid in the background, often fading out at the edges, that hints at structure, planning or blueprints.",
  },
  "dot-grid": {
    name: "Dot grid",
    aka: ["dot matrix pattern"],
    definition:
      "Evenly spaced tiny dots in the background; feels technical and precise without being as heavy as a full grid.",
  },
  grain: {
    name: "Grain",
    aka: ["noise texture", "film grain"],
    definition:
      "A fine speckled noise laid over colors or gradients to make digital surfaces feel tactile and less flat.",
  },
  halftone: {
    name: "Halftone",
    definition:
      "An image or shading made of dots of varying size, borrowed from print; feels retro or editorial.",
  },
  "soft-gradient": {
    name: "Soft gradient",
    definition:
      "A smooth blend between two or more colors across a shape or background, giving gentle depth and warmth.",
  },
  "gradient-mesh": {
    name: "Gradient mesh",
    aka: ["mesh gradient", "aurora gradient"],
    definition:
      "Several colors blending in organic, blurry clouds rather than a straight line.",
  },
  glassmorphism: {
    name: "Glassmorphism",
    aka: ["frosted glass"],
    definition:
      "Semi-transparent panels that blur what is behind them, like frosted glass, usually with a thin light border.",
  },
  paper: {
    name: "Paper texture",
    definition:
      "A subtle scan-like texture of paper or card that makes a screen feel printed and crafted.",
  },
};

export const MOTION_TERMS: Glossary<typeof MOTION_TYPES> = {
  "scroll-reveal": {
    name: "Scroll-triggered reveal",
    aka: ["reveal on scroll", "scroll animation"],
    definition:
      "Elements animate into place the moment they scroll into view, instead of simply being there already.",
  },
  "scroll-scrubbed": {
    name: "Scroll-linked animation",
    aka: ["scroll scrubbing", "scrollytelling"],
    definition:
      "The animation's progress is tied to the scroll position: scroll down and it plays forward, scroll up and it rewinds, like scrubbing through a video. Different from a scroll-triggered reveal, which plays once on its own.",
  },
  pinning: {
    name: "Pinning",
    aka: ["sticky scrolling", "scroll pinning"],
    definition:
      "A section stays fixed on screen while you keep scrolling, so the scrolling drives what happens inside it instead of moving it away.",
  },
  "fade-in": {
    name: "Fade-in",
    definition:
      "An element goes from invisible (0% opacity) to fully visible; the gentlest way to make something appear.",
  },
  "blur-reveal": {
    name: "Blur-in",
    aka: ["focus pull", "blur reveal"],
    definition:
      "Content starts blurred and sharpens into focus as it arrives, like a camera finding focus; softer and more cinematic than a plain fade.",
  },
  "slide-in": {
    name: "Slide-in",
    aka: ["translate in", "fly-in"],
    definition:
      "An element moves into its final position from off to one side (left, right, up or down), often combined with a fade-in.",
  },
  stagger: {
    name: "Stagger",
    aka: ["staggered animation", "cascade"],
    definition:
      "Several items run the same animation one after another with a small delay, creating a wave instead of everything moving at once.",
  },
  parallax: {
    name: "Parallax",
    definition:
      "Layers scroll at different speeds (background slower than foreground), creating a sense of depth.",
  },
  typewriter: {
    name: "Typewriter effect",
    aka: ["typing animation"],
    definition:
      "Text appears letter by letter as if being typed, often with a blinking cursor and deleted again before the next phrase.",
  },
  "text-rotator": {
    name: "Text rotator",
    aka: ["rotating headline", "word swap", "word carousel"],
    definition:
      "One word or line of a headline swaps between several options on a loop while the rest stays fixed.",
  },
  marquee: {
    name: "Infinite marquee",
    aka: ["ticker", "logo scroller"],
    definition:
      "A strip of text or logos that scrolls sideways on its own in an endless loop.",
  },
  carousel: {
    name: "Carousel",
    aka: ["slider"],
    definition:
      "A row of cards you move through sideways with arrows, swipes or dots, showing a few at a time.",
  },
  "idle-animation": {
    name: "Idle animation",
    aka: ["ambient animation"],
    definition:
      "A small, looping movement on a character or object while nothing else is happening (breathing, blinking, floating) that makes it feel alive.",
  },
  "hover-state": {
    name: "Hover state",
    aka: ["hover effect"],
    definition:
      "A visual change (lift, color shift, underline, zoom) when the pointer moves over something clickable.",
  },
  "cursor-distortion": {
    name: "Cursor-reactive distortion",
    aka: ["hover distortion", "mouse-trail effect", "fluid cursor"],
    definition:
      "A WebGL effect where whatever is under the pointer warps, smears or dissolves, leaving a soft trail that settles back once the cursor moves on. More playful than a hover state: it reacts to where the mouse is, not just whether it's over something.",
  },
  "micro-interaction": {
    name: "Micro-interaction",
    definition:
      "A tiny animated response to a single action, like a toggle sliding, a heart popping or a button confirming.",
  },
  "page-transition": {
    name: "Page transition",
    definition:
      "Animation between two pages or views (fade, slide, morph) so navigation feels continuous.",
  },
  "skeleton-loading": {
    name: "Skeleton loading",
    aka: ["skeleton screen", "shimmer"],
    definition:
      "Grey placeholder shapes in the layout of the coming content, often shimmering, shown while it loads.",
  },
  "intro-animation": {
    name: "Intro animation",
    aka: ["page-load animation", "entrance animation", "loading reveal"],
    definition:
      "A short sequence that plays once when the page first opens, before you do anything: a curtain, fade or mist clearing to reveal the first screen. It sets the mood and hides the moment the page is still loading.",
  },
  "shader-animation": {
    name: "Shader animation",
    aka: ["WebGL animation", "real-time graphics"],
    definition:
      "A shader that moves: colors flowing, surfaces rippling or warping, often reacting to the mouse or to scrolling. Smoother and lighter than video because it's computed live.",
  },
  "background-video": {
    name: "Background video",
    definition:
      "A silent, looping video playing behind content to set a mood or show the product in motion.",
  },
};

export const COLOR_HARMONY_TERMS: Glossary<typeof COLOR_HARMONIES> = {
  monochromatic: {
    name: "Monochromatic",
    definition:
      "Tints, tones and shades of a single hue. Calm, cohesive and easy to get right, but can feel flat without contrast in lightness.",
  },
  analogous: {
    name: "Analogous",
    definition:
      "Hues that sit next to each other on the color wheel (e.g. yellow, orange, red). Harmonious and natural-feeling, because nothing clashes.",
  },
  complementary: {
    name: "Complementary",
    definition:
      "Hues from opposite sides of the color wheel (e.g. blue and orange). Maximum contrast: each makes the other look more vivid, so one usually leads and the other is used sparingly.",
  },
  "split-complementary": {
    name: "Split-complementary",
    definition:
      "A base hue plus the two hues on either side of its opposite. Nearly as much contrast as complementary, with less tension.",
  },
  triadic: {
    name: "Triadic",
    definition:
      "Three hues evenly spaced around the wheel, 120° apart (e.g. red, yellow, blue). Vibrant and balanced, often playful.",
  },
  tetradic: {
    name: "Tetradic (rectangle)",
    aka: ["double complementary"],
    definition:
      "Two complementary pairs, forming a rectangle on the wheel. Rich and varied; works best when one hue dominates and the others are accents.",
  },
  square: {
    name: "Square",
    definition:
      "Four hues evenly spaced around the wheel, 90° apart. Bold and diverse, and the hardest to balance.",
  },
};

export const COLOR_STRATEGY_TERMS: Glossary<typeof COLOR_STRATEGIES> = {
  "neutral-with-accent": {
    name: "Neutral with a single accent",
    aka: ["accent color scheme"],
    definition:
      "Mostly whites, greys and black, with one strong color reserved for what matters most (usually actions). Other hues, if any, stay small.",
  },
  multicolor: {
    name: "Multicolor",
    aka: ["polychromatic"],
    definition:
      "Many saturated hues used generously, each often owning a section or category; playful and expressive.",
  },
  tonal: {
    name: "Tonal",
    definition:
      "Built mainly from lighter and darker versions of one color family, with neutrals; quiet and sophisticated.",
  },
};

export const TYPE_STYLE_TERMS: Glossary<typeof TYPE_STYLES> = {
  "geometric-sans": {
    name: "Geometric sans",
    definition:
      "Sans-serif built from near-perfect circles and straight lines (e.g. Futura); clean, modern and friendly.",
  },
  "humanist-sans": {
    name: "Humanist sans",
    definition:
      "Sans-serif with proportions based on handwriting and varied stroke widths (e.g. Gill Sans); warm and readable.",
  },
  "grotesque-sans": {
    name: "Grotesque sans",
    definition:
      "Early-style sans-serif with slightly quirky, irregular shapes (e.g. Franklin Gothic); characterful but sturdy.",
  },
  "neo-grotesque-sans": {
    name: "Neo-grotesque sans",
    definition:
      "Plain, uniform sans-serif designed to feel neutral (e.g. Helvetica, Inter); efficient and corporate.",
  },
  "old-style-serif": {
    name: "Old-style serif",
    definition:
      "Serif with angled stress and low contrast, based on Renaissance printing (e.g. Garamond); classic and bookish.",
  },
  "transitional-serif": {
    name: "Transitional serif",
    definition:
      "Serif with more vertical stress and sharper contrast than old-style (e.g. Times, Baskerville); formal and trustworthy.",
  },
  didone: {
    name: "Didone",
    aka: ["modern serif"],
    definition:
      "Serif with extreme thick-thin contrast and hairline serifs (e.g. Didot, Bodoni); elegant, often used in fashion.",
  },
  "slab-serif": {
    name: "Slab serif",
    aka: ["Egyptian"],
    definition:
      "Serif with thick, block-like serifs (e.g. Rockwell); sturdy, confident and a bit retro.",
  },
  monospace: {
    name: "Monospace",
    aka: ["fixed-width"],
    definition:
      "Every character takes the same width, like a typewriter or code editor; reads as technical.",
  },
  "display-face": {
    name: "Display typeface",
    definition:
      "A typeface designed for large sizes only (headlines, posters), often with strong personality.",
  },
  "script-face": {
    name: "Script typeface",
    definition: "A typeface that imitates handwriting or calligraphy.",
  },
};

/** Every term, keyed by its id, for looking up any term from anywhere. */
export const GLOSSARY: Record<string, Term> = {
  ...IMAGERY_STYLE_TERMS,
  ...IMAGERY_TREATMENT_TERMS,
  ...TEXTURE_TERMS,
  ...MOTION_TERMS,
  ...COLOR_HARMONY_TERMS,
  ...COLOR_STRATEGY_TERMS,
  ...TYPE_STYLE_TERMS,
};

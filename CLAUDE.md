# design-inspo: conventions

Astro + TypeScript static site, deployed to GitHub Pages (`base: /design-inspo`).

## Git

- Never push to `main`. Work on a `claude/<short-topic>` branch and open a pull request.
- Before pushing, run `npm run format:check`, `npm run check` and `npm run build`; all must pass.

## Content

- Products live in `src/content/products/`, entries (one per source: landing / ios / desktop) in `src/content/entries/`.
- Entry file name: `<product>-<type>` (e.g. `jira-landing`, `jira-ios`). Add a suffix if a product has two entries of the same type.
- The entry structure is defined in `src/content.config.ts`; use `src/content/entries/jira-landing.md` as the reference example.
- Only use categories, screen types, tags and filter labels that exist in `src/data/taxonomies.ts`. If a new one is genuinely needed, add it there in the same PR and mention it in the PR description.
- Every breakdown (colors, typography, imagery, motion) has a factual _what_, a _why_, a `basis` and `examples`.
- Before writing a _why_, look for the brand's own reasoning, in this order:
  1. Official brand guidelines or design system → `basis: brand-guidelines`
  2. The brand or its designers explaining choices elsewhere (press interviews, agency or type-foundry case studies) → `basis: brand-statement`
  3. Nothing found → `basis: interpretation`
     Always link what you used in `sources` (required for 1 and 2). Quote or closely paraphrase the source; never invent brand intent. When adding your own reading on top of a brand source, put it in a final sentence starting `(Our read: ...)`.
- Name things properly. A goal of this site is learning design vocabulary, so use the most precise term from `src/data/glossary.ts` (e.g. "staggered slide-in", "multiplayer cursors", "dot grid", "geometric sans") in lists, captions and the _what_ text. If a precise term is missing, add it to the taxonomy list and glossary (with a plain-English definition) in the same PR.
  - Colors: `harmony` (color-wheel relationship, with the `harmonyColors` that form it; the build checks the hues really match) and `strategy` (how much of each color is used). Typography: each font's `style`. Imagery: `styles`, `treatments`, `textures`. Motion: `types`.
  - Every imagery/motion example lists the `terms` it shows; every term claimed in a section needs at least one example showing it (the build enforces both).
- Examples:
  - Colors: the palette (hex codes) is the example.
  - Typography: a type specimen per font, never a screenshot crop. Fill in `weights` (only cuts the page really loads) and `scale` (measured from the page), set `specimen: specimen-<font>.webp`, then run `npm run specimen -- <entry-id>`. Free fonts can use `webFont` instead to render live.
  - Imagery: one cropped example per imagery style.
  - Motion: a short animated `.webp` per kind of movement. Always check for scroll-triggered animations (elements that fade or slide in when scrolled into view), not just ones that play on load; slow the page's animations down while recording fast ones, then play back at real speed.
- New entries start from `npm run capture -- <url> --product <id>` (or `npm run import-screens` for app screenshots); see README "Adding an entry". The capture measures, the human judges: treat its harmony and role guesses as suggestions, check every motion clip, and never leave a `TODO` (the build fails on them).
- Standalone fonts go in the Font library (`src/content/fonts/`), started with `npm run add-font -- <url>`. Google Fonts use `webFont` (rendered live; never self-host or redistribute font files); other fonts get a generated `specimen` and `preview` in `public/media/fonts/<id>/`.
- Media goes in `public/media/<entry-id>/`. Prefer `.webp` for screenshots and `.mp4`/`.webm` for recordings; keep files small. Each entry needs a `cover.webp` (960×600 crop of the first viewport) for cards.
- Only describe motion you have actually observed on the live page.

## Site design

- Light mode only, white background. UI uses only cool greys, black and white: no accent colors. The only color on the site comes from the inspiration itself.
- UI is built with shadcn/ui (React, Tailwind v4, theme tokens in `src/styles/global.css`). Pages are static Astro; only interactive parts are React islands (`FilterBar`, `Terms`).
- American spelling in all user-facing text ("color", not "colour"), except inside quotes from sources.

## Links

Internal links must include the base path: use `import.meta.env.BASE_URL`.

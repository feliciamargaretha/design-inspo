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
- Every breakdown (colors, typography, imagery, motion) has a factual _what_ and an interpretive _why_. The _why_ is an informed assumption about the brand's intent; write it as such, not as fact.
- Media goes in `public/media/<entry-id>/`. Prefer `.webp` for screenshots and `.mp4`/`.webm` for recordings; keep files small. Each entry needs a `cover.webp` (960×600 crop of the first viewport) for cards.
- Only describe motion you have actually observed on the live page.

## Links

Internal links must include the base path: use `import.meta.env.BASE_URL`.

# design-inspo

A personal library of design inspiration: landing pages, iOS and desktop apps, with breakdowns of their colors, typography, imagery and motion, and why they made those choices.

Live site: https://feliciamargaretha.github.io/design-inspo

## Site map

| Page                                            | What it shows                                               |
| ----------------------------------------------- | ----------------------------------------------------------- |
| `/`                                             | Home                                                        |
| `/inspiration/landing`                          | Landing pages, filtered by category                         |
| `/inspiration/ios`, `/inspiration/desktop`      | App screens, filtered by screen type and category           |
| `/inspiration/<entry>`                          | Detail: screenshot, live link, personality tags, breakdown  |
| `/colors`, `/typography`, `/imagery`, `/motion` | Every entry's breakdown for that topic, with simple filters |
| `/tags/<tag>`                                   | Every entry with that personality tag                       |
| `/typography/library`                           | Fonts saved on their own, with live or generated specimens  |
| `/glossary`                                     | Every design term, defined, with real examples              |

## How content is organized

- **Product** (`src/content/products/`): one file per product, e.g. Jira. Holds the name, website and category.
- **Entry** (`src/content/entries/`): one file per source, e.g. Jira's landing page _or_ Jira's iOS app. Holds the media, tags and the color / typography / imagery / motion breakdown. Each section has a _what_, a _why_, visual examples, and a label showing where the _why_ comes from: the brand's own guidelines, a brand statement (press, agency or foundry case study), or our interpretation.
- **Glossary** (`src/data/glossary.ts`): the proper name and a plain-English definition for every style, treatment, texture, motion technique, color scheme and type classification, so browsing doubles as learning the vocabulary.
- **Taxonomies** (`src/data/taxonomies.ts`): the single list of allowed categories, screen types, personality tags and filter labels.
- **Media** (`public/media/<entry>/`): screenshots and recordings.

## Adding an entry

### From a link (landing pages and web apps)

```sh
npm run capture -- https://example.com --product example
```

This opens the page like a visitor, then writes:

- `public/media/<id>/full.webp` and `cover.webp`: the screenshots
- `drafts/<id>/report.md`: fonts and loaded weights, the type scale, the palette (from CSS and from pixels) with hue angles, harmony suggestions, motion it detected, and the page structure with y-coordinates
- `drafts/<id>/motion-*.webp`: recordings of each detected motion (scroll reveals are recorded with animations slowed down, so fast ones are visible)
- `drafts/<id>/entry.md`: a draft entry with everything measurable filled in and `TODO` for the judgment calls
- `drafts/<id>/sections.png`: the page with a y-coordinate ruler, for cropping

Then, by hand:

1. Look for brand guidelines or designer interviews and fill in `basis` and `sources`.
2. Name everything with glossary terms, crop imagery examples (`npm run crop -- <id> <name> <x> <y> <w> <h> [--zoom 2]`) and keep the motion clips that matter.
3. Write the what / why, tags and summary. Move the draft to `src/content/entries/<id>.md` (and `drafts/<id>/product.yaml` to `src/content/products/` if the product is new).
4. `npm run specimen -- <id>`, then `npm run build`. The build lists every remaining `TODO` and anything invalid.

`npm run capture -- --redraft <id>` rebuilds the draft and report from the saved measurements without opening the page again.

### A font on its own (Font library)

```sh
npm run add-font -- https://fonts.google.com/specimen/Space+Grotesk
npm run add-font -- https://klim.co.nz/retail-fonts/tiempos-text/ [--family "<css name>"]
```

- **Google Fonts link**: reads Google's catalogue (designers, category, year, every weight, variable or not). The site renders the specimen live.
- **Any other page** (a foundry page, or a site using the font): finds the font named in the page title or URL (or `--family`), checks the weights the page really loads, and renders a specimen and a preview image inside that page. Some foundries show their fonts as images; then use a page that actually loads the font.

It writes `drafts/fonts/<id>.md`. Fill in the classification, personality and notes, then move it to `src/content/fonts/`.

### From screenshots (iOS and desktop apps)

```sh
npm run import-screens -- <id> screen1.png screen2.png
```

Converts the screenshots, makes a cover, and writes a palette and harmony report. Fonts can't be measured from images.

## Development

Requires Node 22 (see `.nvmrc`).

```sh
npm install
npm run dev           # local dev server
npm run check         # type + content checks
npm run format        # format all files
npm run build         # production build into dist/
```

## Workflow

`main` is the live site. All changes go through a pull request; CI must pass before merging. Merging to `main` deploys automatically to GitHub Pages.

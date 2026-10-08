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

## How content is organised

- **Product** (`src/content/products/`): one file per product, e.g. Jira. Holds the name, website and category.
- **Entry** (`src/content/entries/`): one file per source, e.g. Jira's landing page _or_ Jira's iOS app. Holds the media, tags and the color / typography / imagery / motion breakdown, each with a _what_ and a _why_.
- **Taxonomies** (`src/data/`): the single list of allowed categories, screen types, personality tags and filter labels.
- **Media** (`public/media/<entry>/`): screenshots and recordings.

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

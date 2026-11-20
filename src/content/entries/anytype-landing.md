---
product: anytype
type: landing
sourceUrl: https://anytype.io/
capturedAt: 2026-11-20
cover: cover.webp
media:
  - src: storyboard.webp
    alt: Twelve screens from the Anytype landing page, from the white hero with pixel-art computer icons and a coral serif headline, through dark product sections and white privacy sections with soft pastel glows, to the dark closing section with a pixel-art network
    caption: The page scrolls inside a fixed frame and fades each section in as it arrives, so this shows twelve screens in order instead of one full-page screenshot.
tags: [minimal, trustworthy, sophisticated, calm]
colors:
  palette:
    - { hex: "#FFFFFF", name: White, role: background, tier: primary }
    - { hex: "#000000", name: Black, role: background, tier: primary }
    - { hex: "#FF6A7B", name: Coral, role: brand, tier: primary }
    - { hex: "#3CD9B3", name: Mint, role: accent, tier: secondary }
    - { hex: "#FFBCC3", name: Blush, role: accent, tier: secondary }
    - { hex: "#FFEDBE", name: Peach, role: accent, tier: secondary }
    - { hex: "#B9EEFF", name: Sky, role: accent, tier: secondary }
    - { hex: "#E7D4FF", name: Lavender, role: accent, tier: tertiary }
    - { hex: "#C9EFB2", name: Lime, role: accent, tier: tertiary }
    - { hex: "#808080", name: Grey, role: text, tier: tertiary }
  harmony: complementary
  harmonyColors: ["#FF6A7B", "#3CD9B3"]
  strategy: neutral-with-accent
  mode: mixed
  temperature: neutral
  what: >-
    Mostly black and white: white sections and true-black sections take
    turns, with thin black rules boxing everything into a grid. Two
    accents carry the brand: a coral pink for "for digital collaboration"
    in the hero, and a mint green for "create your own piece" and the
    links at the end. On the color wheel they sit almost exactly opposite
    (coral 353°, mint 165°), a complementary pair. The rest of the color
    is soft pastel glows (peach into blush, sky, lavender and lime) that
    fade in from the corners of white sections and behind icons. Hex
    values were measured from the page's CSS.
  why: >-
    No statement from Anytype about the design was found, so this is our
    interpretation. Anytype sells privacy and calm ("a safe haven"), and a
    stark black-and-white grid with no shouting colors feels sober and
    trustworthy, like a well-made tool rather than an ad. The pastel glows
    soften that, so it doesn't feel cold, and keeping the two
    complementary accents for a few words makes them the only things that
    pop.
  basis: interpretation
  sources:
    - title: Anytype, Why we are building Anytype
      url: https://anytype.io/why
typography:
  fonts:
    - family: Riccione
      cssFamily: riccionets
      style: transitional-serif
      roles: [display]
      source: Licensed (TS Riccione / Riccione Serial)
      specimen: specimen-riccione.webp
      weights:
        - { value: 400, name: Regular }
      scale:
        - {
            label: Big statement,
            size: 120,
            lineHeight: 100,
            weight: 400,
            tracking: -3.2,
          }
        - {
            label: Hero accent,
            size: 96,
            lineHeight: 90,
            weight: 400,
            tracking: -2.4,
          }
        - {
            label: Section title,
            size: 88,
            lineHeight: 76,
            weight: 400,
            tracking: -2.4,
          }
    - family: Inter
      style: neo-grotesque-sans
      roles: [display, heading, body, ui]
      source: Google Fonts
      webFont: { provider: google, family: Inter }
      weights:
        - { value: 300, name: Light }
        - { value: 400, name: Regular }
        - { value: 500, name: Medium }
      scale:
        - { label: Hero, size: 88, lineHeight: 90, weight: 300, tracking: -5.2 }
        - {
            label: Statement,
            size: 48,
            lineHeight: 48,
            weight: 500,
            tracking: -2.4,
          }
        - {
            label: Card title,
            size: 28,
            lineHeight: 32,
            weight: 500,
            tracking: -0.64,
          }
        - {
            label: Lead,
            size: 18,
            lineHeight: 26,
            weight: 300,
            tracking: -0.28,
          }
        - { label: Body, size: 16, lineHeight: 24, weight: 400, tracking: -0.2 }
  what: >-
    A sans and a serif swap places line by line. The hero sets "A safe
    haven" in Inter Light (88px, very tight tracking) and "for digital
    collaboration" in a classic serif in coral, and the big statements
    further down ("Enjoy true privacy", "Never lose access", "Think Fast")
    are in that serif at up to 120px, stacked one word per line. The serif
    is Riccione, a Times New Roman–style face (loaded under the name
    "riccionets"), used in a single Regular weight. Everything else,
    including the "Nobody can see what's in your vault" headings, card
    titles and body text, is Inter in Light, Regular and Medium.
  why: >-
    No statement from Anytype about the fonts was found, so this is our
    interpretation. Typewolf describes Riccione as "a serif typeface
    heavily inspired by Times New Roman", a face most people associate
    with documents, letters and books. Pairing it with Inter, a plain
    screen font, mixes "personal writing" with "modern software", which
    fits an app for your private notes. Setting the serif huge and one
    word per line turns plain promises like "Never lose access" into
    calm, almost editorial statements.
  basis: interpretation
  sources:
    - title: Typewolf, Riccione
      url: https://typewolf.com/riccione
imagery:
  styles: [pixel-art, product-ui, data-visualization]
  treatments: [soft-glow, color-blocking]
  textures: [soft-gradient, grid-pattern]
  what: >-
    Overall, the imagery is an old personal computer: crisp 1-bit pixel
    art of desks, folders, faces and networks, set on a strict grid of
    thin black lines.

    The hero is a pixel-art pile of computer things, a framed picture, a
    document, a calendar showing 31, an inbox tray and a smiling laptop,
    drawn in black and white pixels. The privacy sections use small
    pixel-art icons (a lock, a key, a person, a monitor) floating on soft
    pastel glows. Dark sections show the real product UI as cards (chats,
    documents, databases) and a data visualization of a network graph
    next to a table, and the closing section is a pixel-art network of
    boxes with two smiling faces. On the WHO page the whole team appears
    as pixel-art portraits, each on its own pastel tile in a color-blocked
    grid.
  why: >-
    No statement from Anytype about the imagery was found, so this is our
    interpretation, read against its own manifesto. Anytype says that on
    today's web "application developers are the keepers of our keys", and
    it wants an alternative where your data lives with you. Pixel art
    recalls the early personal computer, when your files sat on your own
    machine and nobody else held them, so the whole page quietly points
    back to that idea of a computer that's yours.

    In detail: the pastel glows keep the pixel icons from feeling harsh or
    technical, the real product UI shows the app is serious, and drawing
    the team as pixel portraits puts the people behind it into the same
    friendly, handmade world.
  basis: interpretation
  sources:
    - title: Anytype, Why we are building Anytype
      url: https://anytype.io/why
  examples:
    - src: imagery-pixel-art.webp
      alt: Black-and-white pixel art of a framed picture, documents, a calendar showing 31, an inbox tray and a smiling laptop
      caption: Pixel-art hero illustration
      terms: [pixel-art]
    - src: imagery-soft-icons.webp
      alt: Two small pixel-art icons, a person and a diamond-shaped network, each floating on a soft blue glow
      caption: Pixel icons on soft pastel glows
      terms: [pixel-art, soft-glow, soft-gradient]
    - src: imagery-product-ui.webp
      alt: Three dark product cards showing a chat, a document called My Idea, and a list of pages, lists, tasks and bookmarks, inside a grid of thin lines
      caption: Product UI cards in a line grid
      terms: [product-ui, grid-pattern]
    - src: imagery-graph.webp
      alt: A white-on-black network graph of dots and lines around a person's photo, next to a table of tasks with colored tags
      caption: Network graph beside a database table
      terms: [data-visualization, product-ui]
    - src: imagery-line-graph.webp
      alt: White pixel-art network of boxes connected by lines, with two boxes showing smiling faces, on black
      caption: Pixel-art network in the closing section
      terms: [pixel-art]
    - src: imagery-portraits.webp
      alt: Two rows of black-and-white pixel-art portraits of the team, each on a pastel tile of blue, yellow, lavender, pink or green
      caption: Team as pixel portraits on pastel tiles (WHO page)
      terms: [pixel-art, color-blocking]
motion:
  types:
    [
      intro-animation,
      fade-in,
      scroll-reveal,
      tabbed-crossfade,
      page-transition,
      hover-state,
    ]
  what: >-
    On load, an intro animation fades the page up from black through grey
    to white. The page itself is a fixed frame you scroll inside, and each
    new section does a scroll-reveal, fading in from faint to full as it
    reaches you. In the database section, a tabbed crossfade switches the
    sample data between Table, Kanban and Gallery views in place. The
    floating WHAT / WHY / WHO pill at the bottom is the main navigation:
    each choice runs a page transition, crossfading to a different page
    (the product, the manifesto, the team) without a reload. On the WHO
    page, hovering an investor's name gives it a hover state like a
    highlighter mark in a random pastel color. Nothing moves while you sit
    still.
  why: >-
    No statement from Anytype about motion was found, so this is our
    interpretation. The motion is slow and quiet: fades rather than slides
    or bounces, and nothing that loops. That fits a product about calm and
    control, where the page waits for you instead of performing. The
    WHAT / WHY / WHO pill turns three pages into one small, always-visible
    switch, and the pastel highlighter marks add a touch of play at the
    end.
  basis: interpretation
  sources: []
  examples:
    - src: motion-intro.webp
      alt: The page fading up from black through grey to the white hero
      caption: Intro fade from black (recorded at quarter speed, played back at real speed)
      terms: [intro-animation, fade-in]
    - src: motion-reveal.webp
      alt: Scrolling from the hero into a dark section and then white privacy sections, each fading in from faint as it arrives
      caption: Sections fading in as they scroll into view
      terms: [scroll-reveal, fade-in]
    - src: motion-views.webp
      alt: Clicking Kanban, Gallery and Table above a network graph, the sample data crossfading between a board, a grid of images and a table
      caption: Table, Kanban and Gallery views crossfading in place
      terms: [tabbed-crossfade]
    - src: motion-page-switch.webp
      alt: Clicking WHY and WHO in the bottom pill, the page crossfading to the manifesto and then to the team page with pixel portraits
      caption: WHAT / WHY / WHO pill crossfading between pages
      terms: [page-transition, fade-in]
    - src: motion-highlight.webp
      alt: Moving the mouse over a list of investor names, each name getting a pastel highlighter background in turn
      caption: Pastel highlighter on hover (WHO page)
      terms: [hover-state]
---

A private, local-first workspace with a quiet, old-computer charm:
1-bit pixel art, a Times-style serif next to Inter, black-and-white
grids with pastel glows, and a WHAT / WHY / WHO pill instead of a menu.

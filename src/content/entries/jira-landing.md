---
product: jira
type: landing
sourceUrl: https://www.atlassian.com/software/jira
capturedAt: 2026-10-08
cover: cover.webp
media:
  - src: full.webp
    alt: Full-page screenshot of the Jira landing page
tags: [professional, approachable, trustworthy, technical]

colors:
  palette:
    - { hex: "#FFFFFF", name: White, role: background, tier: primary }
    - { hex: "#1868DB", name: Atlassian blue, role: brand, tier: primary }
    - { hex: "#F8F8F8", name: Off-white, role: surface, tier: secondary }
    - { hex: "#101214", name: Near-black, role: text, tier: secondary }
    - { hex: "#1F1F21", name: Charcoal, role: surface, tier: secondary }
    - { hex: "#803FA5", name: Purple, role: accent, tier: tertiary }
    - { hex: "#4C6B1F", name: Olive green, role: accent, tier: tertiary }
    - { hex: "#FFE48F", name: Soft yellow, role: accent, tier: tertiary }
  harmony: tetradic
  harmonyColors: ["#1868DB", "#FFE48F", "#803FA5", "#4C6B1F"]
  strategy: neutral-with-accent
  mode: mixed
  temperature: cool
  what: >-
    A mostly white and light-grey page with near-black text, where a single
    saturated blue carries every call to action. A charcoal band breaks the
    page for the AI/developer section, and purple, olive and soft-yellow
    tints appear only in small cards and labels. On the color wheel the
    four hues form a tetradic (rectangle) harmony: Atlassian blue (215°) and
    soft yellow (46°) are a complementary pair 170° apart, and purple (278°)
    and olive (85°) are a second pair 166° apart. The strategy is neutral
    with a single accent: only the blue is used at any size. Hex values were
    measured from the live page.
  why: >-
    Atlassian's design system gives every color a role. The "brand" role is
    reserved for "primary actions or elements that communicate the Atlassian
    brand", which is why blue appears almost only on buttons and links.
    Neutrals cover "most backgrounds, text, and shapes", and accent colors
    are explicitly meaningless and interchangeable, so the purple, olive and
    yellow cards decorate without competing with the call to action.
    (Our read: a tetradic harmony is rich but hard to balance, so letting
    blue dominate and keeping the other three as small accents is what
    stops it feeling busy. The dark band borrows the look of a code editor
    to signal "this part is for developers".)
  basis: brand-guidelines
  sources:
    - title: Atlassian Design System, Color
      url: https://atlassian.design/foundations/color

typography:
  fonts:
    - family: Charlie Display
      style: geometric-sans
      roles: [display, heading]
      source: Custom (Charlie Sans family, by Ohno Type Co.)
      specimen: specimen-charlie-display.webp
      weights:
        - { value: 400, name: Regular }
        - { value: 500, name: Medium }
        - { value: 800, name: ExtraBold }
      scale:
        - label: Heading 1
          size: 64
          lineHeight: 67
          weight: 500
          tracking: -1.28
        - label: Heading 2
          size: 48
          lineHeight: 56
          weight: 500
          tracking: -0.96
        - label: Heading 3
          size: 32
          lineHeight: 40
          weight: 500
        - label: Quote
          size: 24
          lineHeight: 33
          weight: 400
          tracking: -0.24
    - family: Charlie Text
      style: geometric-sans
      roles: [body, ui]
      source: Custom (Charlie Sans family, by Ohno Type Co.)
      specimen: specimen-charlie-text.webp
      weights:
        - { value: 400, name: Regular }
        - { value: 500, name: Medium }
        - { value: 700, name: Bold }
      scale:
        - label: Lead
          size: 20
          lineHeight: 31
          weight: 400
          tracking: -0.2
        - label: Body
          size: 16
          lineHeight: 25
          weight: 400
          tracking: -0.16
        - label: Eyebrow
          size: 16
          lineHeight: 19
          weight: 500
          tracking: 1.28
          uppercase: true
        - label: Button
          size: 16
          lineHeight: 24
          weight: 500
    - family: Atlassian Mono
      style: monospace
      roles: [code]
      source: Atlassian app typeface
      specimen: specimen-atlassian-mono.webp
      weights:
        - { value: 500, name: Medium }
      scale:
        - label: Terminal
          size: 48
          lineHeight: 56
          weight: 500
  what: >-
    Atlassian's custom brand typeface in two optical cuts: Charlie Display at
    large sizes (medium weight, tight letter-spacing) for headlines, Charlie
    Text for everything else. Atlassian Mono, the company's in-app monospace,
    appears only in the terminal-style "Jira for the AI era" block.
  why: >-
    Atlassian's guidelines say that "when you need to express the Atlassian
    brand, such as in marketing", it uses its custom brand font, Charlie
    Sans, while apps use Atlassian Sans and Atlassian Mono. Its stated
    principles are to optimize for readability and "create visual harmony".
    The type designer describes the brief as a typeface that conveyed "bold
    energy, without annoying their pragmatically minded clientele", used
    across every product logotype so the many products still feel related.
    The Text cut has a larger x-height and wider spacing for comfortable
    reading, and the switch from headline to paragraph is meant to go
    unnoticed. (Our read: borrowing the product's own monospace for the
    developer section speaks developers' visual language before saying
    anything.)
  basis: brand-guidelines
  sources:
    - title: Atlassian Design System, Typography
      url: https://atlassian.design/foundations/typography
    - title: Ohno Type Co., Atlassian custom typeface
      url: https://ohnotype.co/custom/atlassian

imagery:
  styles: [product-ui, portrait-photography, line-icons, logo-wall]
  treatments:
    [layered-cards, multiplayer-cursors, black-and-white, color-blocking]
  textures: [grid-pattern, dot-grid]
  what: >-
    Overall, the imagery is the product itself: almost every image is the
    real Jira interface or a real customer, set on quiet structural textures,
    with no illustration beyond small line icons.

    A product UI showcase leads: real Jira boards shown large and early, with
    layered cards pulled out of the interface and multiplayer cursors
    labeled with people and AI agents ("Design", "Claude Agent", "Figma
    Agent"). Testimonials use black-and-white portrait photography on soft
    color-blocked panels. Features are labeled with line icons, and a logo
    wall of customers runs below the hero. Backgrounds carry two quiet
    textures: a grid pattern fading out behind the hero, and a dot grid on
    the dark developer section.
  why: >-
    Atlassian's public illustration guidance covers in-app use (and reserves
    collage for marketing), so these choices on the marketing page are our
    interpretation. The overall idea seems to be "show, don't illustrate":
    Jira sells clarity and coordination, so the page shows the work itself,
    literally and in order, and adds one new message on top: people and AI
    agents now work in it together.

    In detail: for a tool people use all day, showing the actual interface is
    the strongest argument; it lowers the "what am I signing up for" anxiety.
    Multiplayer cursors borrow the language of collaborative tools to say
    "humans and agents work here together" without a single word.
    Black-and-white portraits keep real customer faces from clashing with the
    brand palette, and the grid and dot textures quietly signal structure
    and precision.
  basis: interpretation
  sources:
    - title: Atlassian Design System, Illustrations
      url: https://atlassian.design/foundations/illustrations
  examples:
    - src: imagery-product-ui.webp
      alt: Jira board with floating task cards and labeled cursors for a designer and AI agents
      caption: Product UI with layered cards and multiplayer cursors
      terms: [product-ui, layered-cards, multiplayer-cursors]
    - src: imagery-photography.webp
      alt: Testimonial card with a black-and-white portrait on a pale blue panel
      caption: Black-and-white portraits on color blocks
      terms: [portrait-photography, black-and-white, color-blocking]
    - src: imagery-icons.webp
      alt: Row of four line icons labeled Intake, Plan, Coordinate and Review on a dark background
      caption: Line icons
      terms: [line-icons]
    - src: imagery-logo-wall.webp
      alt: Row of customer logos including Reddit, Cisco, Rippling, Roblox, Dropbox and Databricks
      caption: Logo wall
      terms: [logo-wall]
    - src: texture-grid.webp
      alt: Close-up of a faint square grid fading out behind the hero form
      caption: Grid pattern, fading at the edges (zoomed in)
      terms: [grid-pattern]
    - src: texture-dot-grid.webp
      alt: Close-up of tiny evenly spaced dots on a charcoal background
      caption: Dot grid on the dark section (zoomed in)
      terms: [dot-grid]
motion:
  types: [scroll-reveal, slide-in, fade-in, stagger, typewriter, marquee]
  what: >-
    A scroll-triggered reveal: as the testimonial and "Discover the latest"
    rows come into view, each card slides in from the right while fading in,
    with a stagger so they arrive one after another. A terminal block uses a
    typewriter effect, typing and deleting rotating phrases ("> in your
    IDE", "> built for agents", "> connect anywhere") with a blinking block
    cursor and a color-coded keyword. The logo wall runs as an infinite
    marquee.
  why: >-
    Atlassian's motion principles call for motion that is "human" (subtle
    and rhythmic), a "clarifying layer, not decoration", accessible and fast.
    Those are written for the product, so applying them here is our
    interpretation: the staggered slide-in from the right hints that the row
    continues sideways and invites you to use the carousel; the typewriter
    effect mimics a command line, so the AI/developer message feels native;
    and the marquee shows scale ("everyone uses this") without taking up a
    whole section.
  basis: interpretation
  sources:
    - title: Atlassian Design System, Motion
      url: https://atlassian.design/foundations/motion
  examples:
    - src: motion-scroll-reveal.webp
      alt: Testimonial cards sliding in from the right and fading in, one after another, as the section scrolls into view
      caption: Scroll-triggered reveal (slide-in + fade-in, staggered)
      terms: [scroll-reveal, slide-in, fade-in, stagger]
    - src: motion-text.webp
      alt: Terminal typing "in your IDE", "built for agents" and "connect anywhere" with a blinking cursor
      caption: Typewriter effect
      terms: [typewriter]
    - src: motion-marquee.webp
      alt: Customer logos scrolling sideways in an endless loop
      caption: Infinite marquee
      terms: [marquee]
---

Jira's page reads as "serious tool, friendly door": enterprise-grade proof
(logos, stats, real UI) delivered with a light layout, generous white space
and a single, very clear call to action.

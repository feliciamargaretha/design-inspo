---
product: lunagraph
type: landing
sourceUrl: https://www.lunagraph.com/
capturedAt: 2026-10-18
cover: cover.webp
media:
  - src: full.webp
    alt: Full Lunagraph landing page, from the Design with code headline over a faint glyph grid and a large product window, through feature sections built from real interface pieces, to a closing call to action drawn as a selected object on a canvas
    caption: Full page. Body text appears here in a fallback font, because the page uses Articulat only if it's already installed on your computer.
tags: [minimal, technical, sophisticated, playful]
colors:
  palette:
    - { hex: "#FFFFFF", name: White, role: background, tier: primary }
    - { hex: "#0A0A0A", name: Near-black, role: brand, tier: primary }
    - { hex: "#F1F1F1", name: Light grey, role: surface, tier: secondary }
    - { hex: "#686868", name: Grey, role: text, tier: secondary }
    - { hex: "#8A8A94", name: Mist, role: text, tier: secondary }
    - { hex: "#16161A", name: Ink, role: text, tier: secondary }
    - { hex: "#4D90FE", name: Selection blue, role: accent, tier: tertiary }
    - { hex: "#AD46FF", name: Component purple, role: accent, tier: tertiary }
    - { hex: "#15803D", name: Status green, role: accent, tier: tertiary }
  harmony: achromatic
  strategy: tonal
  mode: light
  temperature: neutral
  what: >-
    Black and white, almost nothing else: a white page, near-black
    headlines and buttons, and a ladder of greys for text, panels and
    borders: an achromatic palette, with no hue doing any of the work. The
    darker greys lean very slightly cool (the sample design system on the
    page names them ink #16161a and mist #8a8a94), and the strategy is
    tonal, built from lighter and darker steps of that one grey family.
    Color only appears inside the product, where a design tool
    would use it: selection blue for selected objects, purple for
    components in the layers panel, green for status dots. A footer switch
    offers system, light and dark themes; this breakdown covers light.
    Hex values were measured from the live page.
  why: >-
    No statement from the team about the site's design was found, so this
    is our interpretation. Lunagraph is a canvas for designing interfaces,
    and the page treats itself like a blank canvas: with the chrome
    reduced to black, white and grey, the only color you see is the
    tool's own working color (selection blue, component purple). That
    keeps attention on the work, the way design tools keep their own
    interface grey so your design stands out.
  basis: interpretation
  sources: []
typography:
  fonts:
    - family: Larken
      style: old-style-serif
      roles: [display, heading]
      source: Licensed (Ellen Luff Type Foundry)
      specimen: specimen-larken.webp
      weights:
        - { value: 200, name: ExtraLight }
      scale:
        - { label: Hero, size: 72, lineHeight: 76, weight: 200 }
        - {
            label: Closing line,
            size: 52,
            lineHeight: 55,
            weight: 200,
            tracking: -1.04,
          }
        - {
            label: Section title,
            size: 48,
            lineHeight: 50,
            weight: 200,
            tracking: -0.96,
          }
        - {
            label: Heading,
            size: 40,
            lineHeight: 44,
            weight: 200,
            tracking: -0.8,
          }
    - family: Geist Mono
      style: monospace
      roles: [ui, code]
      source: Google Fonts (by Vercel)
      webFont: { provider: google, family: Geist Mono }
      weights:
        - { value: 400, name: Regular }
        - { value: 500, name: Medium }
      scale:
        - {
            label: Eyebrow,
            size: 11,
            lineHeight: 17,
            weight: 400,
            tracking: 0.88,
            uppercase: true,
          }
        - { label: Code, size: 10.5, lineHeight: 18, weight: 400 }
        - { label: State label, size: 9.5, lineHeight: 14, weight: 500 }
  what: >-
    Every headline is set in Larken at ExtraLight (200), a very thin serif
    at 40 to 72px with slightly tight tracking ("Design with code.",
    "Bring your own agent."). Geist Mono, a monospace, labels steps and
    states in small caps-size text ("01·DESIGN", "ready · confirm ·
    burning"), and sets the code in the mockups. The body text asks for
    Articulat CF, a grotesque sans, but the page only uses it if it's
    already installed on your computer (it's never downloaded), so most
    visitors read the body in their system font, such as San Francisco on
    a Mac. The product mockups set their interface text in Inter the same
    way.
  why: >-
    No statement from the team about the fonts was found, so this is our
    interpretation, using type reviewers' and foundry descriptions. Type
    reviewer Pimp my Type calls Larken "an elegant serif typeface that
    mixes tradition with simplicity", and at ExtraLight it reads like a
    calm editorial headline, a counterweight to the dense, technical
    interface underneath. The MyFonts field guide describes Articulat as
    Connary Fagen's take on midcentury design that "hews closer to
    geometric shapes", "built for use at medium sizes" in "the web, user
    interfaces", which suits body copy that sits next to UI. Geist Mono's
    fixed-width letters say "this is code" at a glance, which is the
    product's whole promise.
  basis: interpretation
  sources:
    - title: Pimp my Type, Larken review
      url: https://pimpmytype.com/font/larken/
    - title: MyFonts, Articulat CF field guide
      url: https://www.myfonts.com/a/font/content/font-field-guide/articulat-cf
    - title: Geist font (GitHub)
      url: https://github.com/vercel/geist-font
imagery:
  styles: [product-ui, line-illustration]
  treatments: [selection-box, layered-cards]
  textures: [glyph-grid]
  what: >-
    Overall, the imagery is the product's own canvas: nearly every visual
    is real Lunagraph interface, staged as if someone is working in it
    right now, with a small space-mission story running through the
    sample content.

    The hero is a large product UI window (layers, canvas, style panel),
    and each feature section is built from interface pieces: a component
    in several states, a props panel, a code file, a repo tree being
    imported onto the canvas. Property popovers float over them as
    layered cards. The sample project is mission control for a
    spacecraft: "Soyuz docking", a "burn plan", and a line illustration
    of a capsule. The closing call to action is drawn as an object
    selected on a canvas, with a selection box and popovers for radius,
    border, fill and shadow around it. Behind the hero and the closing
    section sits a faint glyph grid of dots, slashes, plus signs and
    brackets that fades toward the center.
  why: >-
    No statement from the team about the imagery was found, so this is
    our interpretation. The page's own headline is the overall idea:
    "Design with code. Code with design." Instead of illustrating that,
    the page is staged as the canvas itself, so even the call to action is
    an editable object, and the glyph grid mixes design shapes with code
    brackets.

    In detail: showing real interface pieces proves the claim that what
    you design is real React code. The space-mission sample content gives
    those pieces a story and a sense of humor (and fits a product named
    after the moon) without adding illustration that would compete with
    the UI.
  basis: interpretation
  sources: []
  examples:
    - src: imagery-canvas-ui.webp
      alt: The Lunagraph app with a layers panel on the left, an empty canvas with a floating toolbar, and a style panel on the right
      caption: The product UI as the hero image
      terms: [product-ui]
    - src: imagery-steps.webp
      alt: Three feature cards showing a component in several states with a radius popover, a props panel, and a code file with a Send to agent button
      caption: Interface pieces with property popovers as layered cards
      terms: [product-ui, layered-cards]
    - src: imagery-spacecraft.webp
      alt: A shared prototype window titled Mission control with a thin line drawing of a spacecraft capsule labeled CSM-111
      caption: Line illustration of a capsule in the sample mission project
      terms: [line-illustration, product-ui]
    - src: imagery-selection.webp
      alt: The closing call to action, Code with design, drawn inside a blue selection box with popovers for radius, border, fill and shadow around it
      caption: Call to action drawn as a selected object, with a selection box
      terms: [selection-box, layered-cards]
    - src: texture-glyphs.webp
      alt: Close-up of the faint background grid of tiny dots, slashes, brackets, triangles and circles
      caption: Glyph grid behind the hero (contrast boosted 3× so the faint pattern shows)
      terms: [glyph-grid]
motion:
  types: [scripted-cursor, cursor-reactive-pattern, scroll-reveal]
  what: >-
    The page demonstrates the product with a scripted cursor that never
    stops working. In the hero it selects the word "code", lifts it out of
    the headline, drops it at the front, then switches to a text caret to
    fix the capitals, turning "Design with code." into "Code with
    design." and back. In the large product window it follows an agent
    building a "Mission control" card while the chat and code panels
    update, and at the end of the page it restyles the call to action,
    raising its corner radius, changing its fill to a warm off-white and
    deepening its shadow. The feature cards also run on their own: the
    burn plan component cycles through its states with a live timer. The
    glyph grid is a cursor-reactive pattern: where your mouse passes, the
    dots turn into darker code brackets and small shapes, then fade back.
    The "Bring your own agent" diagram slides up with a scroll-reveal as it
    comes into view.
  why: >-
    No statement from the team about motion was found, so this is our
    interpretation. A design tool is easiest to understand by watching it
    being used, so the page plays the role of a live demo: the scripted
    cursor performs exactly the actions the copy promises (select, drag,
    edit, restyle), and swapping the two halves of the headline acts out
    "design with code, code with design" literally. The reactive glyph
    grid rewards you for moving your mouse, hinting that the whole page
    is something you can touch.
  basis: interpretation
  sources: []
  examples:
    - src: motion-headline.webp
      alt: A pointer selects the word code in the headline, drags it to the front, then fixes the capitals so the line reads Code with design, and back again
      caption: Scripted cursor swapping the two halves of the headline
      terms: [scripted-cursor]
    - src: motion-demo.webp
      alt: The product window while an agent builds a mission control card on the canvas and the chat and code panels update
      caption: Scripted demo of an agent working in the product window
      terms: [scripted-cursor]
    - src: motion-cta.webp
      alt: A pointer edits the radius, fill and shadow popovers around the call to action, and the card rounds off, turns warm off-white and gains a shadow
      caption: Scripted cursor restyling the call to action
      terms: [scripted-cursor]
    - src: motion-glyphs.webp
      alt: The faint background grid darkening into code brackets and small shapes along the path of the mouse
      caption: Glyph grid reacting to the mouse (contrast boosted 3× so the faint pattern shows)
      terms: [cursor-reactive-pattern]
    - src: motion-reveal.webp
      alt: Scrolling into the Bring your own agent section as its diagram of chat, canvas and Codex windows slides up into place
      caption: Section sliding up as it scrolls into view
      terms: [scroll-reveal]
---

A design canvas that writes code, sold by letting a scripted cursor work
the page in front of you: thin serif headlines, black and white, and
real interface pieces staged on a canvas.

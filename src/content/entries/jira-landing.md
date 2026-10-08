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
    - { hex: "#FFFFFF", name: White, role: background }
    - { hex: "#F8F8F8", name: Off-white, role: surface }
    - { hex: "#101214", name: Near-black, role: text }
    - { hex: "#1868DB", name: Atlassian blue, role: primary }
    - { hex: "#1F1F21", name: Charcoal, role: surface }
    - { hex: "#803FA5", name: Purple, role: accent }
    - { hex: "#4C6B1F", name: Olive green, role: accent }
    - { hex: "#FFE48F", name: Soft yellow, role: accent }
  mode: mixed
  temperature: cool
  what: >-
    A mostly white and light-grey page with near-black text, where a single
    saturated blue carries every call to action. A charcoal band breaks the
    page for the AI/developer section, and purple, olive and soft-yellow
    tints appear only in small cards and labels. Hex values were measured
    from the live page.
  why: >-
    Atlassian's design system gives every colour a role. The "brand" role is
    reserved for "primary actions or elements that communicate the Atlassian
    brand", which is why blue appears almost only on buttons and links.
    Neutrals cover "most backgrounds, text, and shapes", and accent colours
    are explicitly meaningless and interchangeable, so the purple, olive and
    yellow cards decorate without competing with the call to action.
    (Our read: the dark band borrows the look of a code editor to signal
    "this part is for developers".)
  basis: brand-guidelines
  sources:
    - title: Atlassian Design System, Color
      url: https://atlassian.design/foundations/color

typography:
  fonts:
    - family: Charlie Display
      classification: sans-serif
      roles: [display, heading]
      source: Custom (Charlie Sans family, by Ohno Type Co.)
    - family: Charlie Text
      classification: sans-serif
      roles: [body, ui]
      source: Custom (Charlie Sans family, by Ohno Type Co.)
    - family: Monospace (terminal)
      classification: monospace
      roles: [code]
  what: >-
    Atlassian's custom brand typeface in two optical cuts: Charlie Display at
    large sizes (64px, medium weight, tight letter-spacing) for headlines,
    Charlie Text for everything else. A monospace face appears only inside
    the terminal-style "Jira for the AI era" block.
  why: >-
    Atlassian's guidelines say that "when you need to express the Atlassian
    brand, such as in marketing", it uses its custom brand font, Charlie
    Sans, while product UI uses Atlassian Sans. Its stated principles are to
    optimise for readability and "create visual harmony". The type designer
    describes the brief as a typeface that conveyed "bold energy, without
    annoying their pragmatically minded clientele", and one family used
    across every product logotype so the many products still feel related.
    The Text cut has a larger x-height and wider spacing for comfortable
    reading, and the switch from headline to paragraph is meant to go
    unnoticed. (Our read: the monospace block speaks the visual language of
    developers before saying anything.)
  basis: brand-guidelines
  sources:
    - title: Atlassian Design System, Typography
      url: https://atlassian.design/foundations/typography
    - title: Ohno Type Co., Atlassian custom typeface
      url: https://ohnotype.co/custom/atlassian
  examples:
    - src: type-headline.webp
      alt: Headline "Turn ideas into forward motion" in Charlie Display with body copy in Charlie Text
      caption: Charlie Display headline, Charlie Text body
    - src: type-mono.webp
      alt: Terminal-style block reading "Jira for the AI era" in a monospace font
      caption: Monospace, used only for the developer section

imagery:
  styles: [product-ui, photography, iconography]
  what: >-
    The page is dominated by real, polished product screenshots (boards,
    timelines, agent panels) shown large and early. Supporting imagery is
    simple line icons, partner logos and customer portrait photos next to
    testimonials.
  why: >-
    For a tool people use all day, showing the actual interface is the
    strongest argument; it lowers the "what am I signing up for" anxiety.
    Avoiding illustration keeps the tone serious and enterprise-ready, while
    real customer faces add the human, trustworthy side that a wall of UI
    can't. Atlassian's public illustration guidance covers in-app use (and
    reserves collage for marketing), so the choice of product UI over
    illustration on this page is our interpretation.
  basis: interpretation
  sources:
    - title: Atlassian Design System, Illustrations
      url: https://atlassian.design/foundations/illustrations
  examples:
    - src: imagery-product-ui.webp
      alt: Jira board screenshot with cards and AI agents assigned to tasks
      caption: Product UI as the hero image
    - src: imagery-photography.webp
      alt: Customer testimonial card with a black-and-white portrait photo
      caption: Customer portraits in testimonials
    - src: imagery-icons.webp
      alt: Row of four line icons labelled Intake, Plan, Coordinate and Review
      caption: Simple line icons

motion:
  types: [text-animation, carousel]
  what: >-
    A terminal-style block types and deletes rotating phrases ("> in your
    IDE", "> built for agents", "> connect anywhere", "> all your context"),
    each with a colour-coded keyword and a blinking block cursor.
    Testimonials and articles sit in horizontal carousels with arrow
    controls.
  why: >-
    Atlassian's motion principles call for motion that is "human", a
    "clarifying layer, not decoration", accessible and fast. Those are
    written for the product, so applying them here is our interpretation:
    the typing effect mimics a command line, which makes the AI/developer
    message feel native rather than like marketing, and it cycles through
    several benefits in one small space without slowing anyone down.
  basis: interpretation
  sources:
    - title: Atlassian Design System, Motion
      url: https://atlassian.design/foundations/motion
  examples:
    - src: motion-text.webp
      alt: Animation of a terminal typing "in your IDE", "built for agents" and "connect anywhere"
      caption: Typing terminal (recorded from the live page)
---

Jira's page reads as "serious tool, friendly door": enterprise-grade proof
(logos, stats, real UI) delivered with a light layout, generous white space
and a single, very clear call to action.

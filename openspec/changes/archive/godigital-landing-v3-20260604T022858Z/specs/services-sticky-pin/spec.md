# Spec: services-sticky-pin

> **Modified**: 2026-06-04

## Purpose

The Services section renders 4 service cards in a glass card system using `.liquid-glass` from the liquid-glass-system spec. The section uses GSAP ScrollTrigger for multi-vector entrance animation on desktop. The sticky pin behavior is replaced by liquid-glass card styling and scroll-snap on mobile. This spec supersedes the v2 `services-sticky-pin` spec with the liquid-glass system and restored subtitle rendering.

Ref: Proposal §What Changes · §Capabilities (services-sticky-pin, modified)

## MODIFIED Requirements

> **Modified**: 2026-06-04

### Requirement: SERVICES_LIQUID_GLASS_CARDS
The Services section SHALL render 4 cards using `.liquid-glass` from the liquid-glass-system spec (variant: `default`).

Each card contains:
- mmx-generated icon via `<img>` with `data-mmx-generated` attribute
- Service title in Plus Jakarta Sans 600
- Service subtitle in Inter 400 at 60% opacity (RESTORED from v2 gap)
- Brief description

The services data array in `Services.astro` frontmatter:

```typescript
const services = [
  {
    title: 'UX/UI Design',
    subtitle: 'Experiencias que enamoran',
    desc: 'Diseñamos interfaces que conectan con tus usuarios.',
    icon: 'assets/generated/icons/ux-ui.png',
    iconMmx: 'ux-ui-icon'
  },
  {
    title: 'Desarrollo Web',
    subtitle: 'Código que performa',
    desc: 'Construimos sitios rápidos, seguros y escalables.',
    icon: 'assets/generated/icons/web.png',
    iconMmx: 'web-icon'
  },
  {
    title: 'Apps Mobile',
    subtitle: 'Tu proyecto en el bolsillo',
    desc: 'Apps nativas para iOS y Android que destacan.',
    icon: 'assets/generated/icons/mobile.png',
    iconMmx: 'mobile-icon'
  },
  {
    title: 'SEO & Analytics',
    subtitle: 'Visibilidad que convierte',
    desc: 'Posicionamos tu negocio en los primeros resultados.',
    icon: 'assets/generated/icons/seo.png',
    iconMmx: 'seo-icon'
  }
];
```

#### Scenario: cards use liquid-glass styling
Given the Services section is rendered
When the cards appear
Then each card uses the `.liquid-glass` class
And each card has a gradient border via the `::before` pseudo-element
And the backdrop blur creates a frosted glass effect over the background

#### Scenario: subtitles render below title
Given the Services section is rendered
When a service card is inspected
Then the subtitle text is visible below the title
And the subtitle uses Inter 400 at 60% opacity
And the subtitle text matches the `subtitle` field from the data array

### Requirement: SERVICES_MULTI_VECTOR_ENTRANCE
The 4 service cards SHALL animate in from different entrance vectors on desktop:

- Card 1 (UX/UI): `x: -80, opacity: 0` → `x: 0, opacity: 1` (from left)
- Card 2 (Web Dev): `x: 80, opacity: 0` → `x: 0, opacity: 1` (from right)
- Card 3 (Mobile): `y: 60, opacity: 0` → `y: 0, opacity: 1` (from bottom)
- Card 4 (SEO): `scale: 0.8, opacity: 0` → `scale: 1, opacity: 1` (scale in)

Each card has `stagger: 0.15`, `duration: 0.8`, `ease: 'power3.out'`.

The animation is triggered by ScrollTrigger when the Services section enters the viewport (not pinned like v2).

#### Scenario: cards enter from different vectors on scroll
Given the user scrolls to the Services section on desktop
When the section top reaches 80% of viewport height
Then card 1 slides in from the left
And card 2 slides in from the right with 150ms delay
And card 3 rises from below with 300ms delay
And card 4 scales in with 450ms delay

### Requirement: SERVICES_MMX_ICONS
Each service card SHALL display a mmx-generated icon via `<img>` with `data-mmx-generated` attribute:

- UX/UI card: `data-mmx-generated="ux-ui-icon"`, src `assets/generated/icons/ux-ui.png`
- Web Dev card: `data-mmx-generated="web-icon"`, src `assets/generated/icons/web.png`
- Mobile card: `data-mmx-generated="mobile-icon"`, src `assets/generated/icons/mobile.png`
- SEO card: `data-mmx-generated="seo-icon"`, src `assets/generated/icons/seo.png`

Fallback: Lucide SVG equivalents (figma, code, smartphone, search) when `getMmxAsset().is_ready === false`.

#### Scenario: icon renders with mmx asset
Given the Services section is rendering
When `getMmxAsset('ux-ui-icon').is_ready` is true
Then the card shows `assets/generated/icons/ux-ui.png`
And `img[data-mmx-generated="ux-ui-icon"]` exists in the DOM

### Requirement: SERVICES_STICKY_PIN_DESKTOP_ONLY
The sticky pin behavior from v2 is removed. On desktop (≥769px), the cards animate in via ScrollTrigger entrance but do not pin the section.

On mobile (<769px), the cards render in a single column with scroll-snap (`scroll-snap-type: y mandatory`) and the entrance animation is simplified to fade-up only (no multi-vector).

#### Scenario: no sticky pin on desktop, simpler scroll behavior
Given the user scrolls to the Services section on desktop
When the section pins
Then the section does NOT become position:fixed
And the cards animate in on scroll-triggered entrance
And the next section pushes up naturally as the user scrolls

#### Scenario: mobile uses scroll-snap with fade-up
Given a viewport of 375px (mobile)
When the user scrolls through Services
Then each card snaps into view vertically
And each card fades up with a simple opacity animation
And no multi-vector entrance runs on mobile

### Requirement: SERVICES_DEPTH_VARIANTS
The 4 cards use depth variant classes from liquid-glass-system to create visual hierarchy:

- Card 1: `.liquid-glass` (default depth)
- Card 2: `.liquid-glass--soft` (slightly subtler)
- Card 3: `.liquid-glass--strong` (slightly heavier)
- Card 4: `.liquid-glass--accent` (blue-tinted for SEO — the growth-focused service)

#### Scenario: cards have progressive depth variants
Given the 4 service cards are visible
When inspected in DOM order
Then card 1 uses `.liquid-glass` (default)
And card 2 uses `.liquid-glass--soft`
And card 3 uses `.liquid-glass--strong`
And card 4 uses `.liquid-glass--accent` (blue-tinted)
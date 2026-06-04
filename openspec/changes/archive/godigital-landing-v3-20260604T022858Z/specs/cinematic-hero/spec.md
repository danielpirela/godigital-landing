# Spec: cinematic-hero

> **Modified**: 2026-06-04

## Purpose

The Hero section is the primary brand impression for godigital-landing. It delivers the cinematic dark glassmorphism experience through a multi-layered composition: fullscreen video background, parallax depth orbs, macOS strip overlay, shiny gradient headline, liquid-glass CTAs, and stat counter. This spec supersedes the v2 `cinematic-hero` spec with Aura-inspired visual language and GoDigital's Spanish copy.

Ref: Proposal §What Changes · §Capabilities (cinematic-hero, modified)

## MODIFIED Requirements

> **Modified**: 2026-06-04

### Requirement: HERO_VIDEO_BACKGROUND_AUTOPLAY
The Hero component SHALL render a full-bleed `<video>` element with `autoplay muted loop playsinline`, using `assets/generated/hero-loop.mp4` as the primary source and `assets/generated/bg/obsidian-mesh.png` as the `poster` attribute while the video buffers.

The system SHALL apply `object-fit: cover`, `width: 100vw`, `height: 100vh`, `position: absolute`, and `z-index: 0` to the video element.

The video element SHALL be desktop-only via a media query: `<source media="(min-width: 769px)" src="assets/generated/hero-loop.mp4" type="video/mp4">`. On mobile, the `poster` image is shown as a static background.

#### Scenario: video loads and plays on desktop
Given the user navigates to the homepage on a desktop viewport
When the page loads
Then the `<video>` element plays `assets/generated/hero-loop.mp4` silently in a loop
And the `poster` image is visible for ≤ 500ms before video starts

#### Scenario: video hidden on mobile, poster shown
Given the user navigates on a 375px viewport (mobile)
When the page renders
Then the video element is not loaded (media query hides it)
And the `poster` image (obsidian-mesh.png) serves as the static background
And no video bandwidth is consumed on mobile

### Requirement: HERO_PARALLAX_ORBS
The Hero SHALL render 2 ambient orbs (reduced from v2's 3) as `<div>` elements with CSS `border-radius: 50%` and radial gradient backgrounds. The orbs are absolute positioned at `z-index: 1`.

GSAP ScrollTrigger scrubs the orbs' Y position at different rates (0.3× and 0.5× scroll velocity) to create parallax depth.

Each orb SHALL have `will-change: transform` applied and removed after animation setup.

#### Scenario: two orbs create parallax depth on desktop scroll
Given the user is on a desktop viewport (≥769px)
When the user scrolls from top to 50% of the page
Then orb 1 moves at 0.3× scroll velocity
And orb 2 moves at 0.5× scroll velocity
And both orbs remain within viewport bounds

### Requirement: HERO_SHINY_HEADLINE
The Hero headline SHALL use Spanish copy: "Convertimos ideas en / experiencias digitales" with a line break between "en" and "experiencias".

The word "experiencias" SHALL use the `.shiny-text` and `.animate-shiny` classes from the shiny-gradient-text spec. The surrounding words render in white.

```html
<h1 class="hero-headline">
  Convertimos ideas en<br />
  <span class="shiny-text animate-shiny">experiencias</span>
  digitales
</h1>
```

#### Scenario: headline renders with shiny gradient on 'experiencias'
Given the Hero section is rendered
When the page loads
Then "experiencias" displays the animated shimmer gradient
And the words "Convertimos ideas en" and "digitales" render in plain white
And the line break is visually balanced (larger text, two lines)

### Requirement: HERO_MACOS_STRIP_OVERLAY
The macOS strip from the macos-strip-navbar spec SHALL be rendered above the Hero video background.

The strip animates in from `opacity: 0 + translateY: -10` to `opacity: 1 + translateY: 0` on the Hero load timeline (delay 0.3s, duration 0.5s, ease power3.out).

#### Scenario: macOS strip appears at top of Hero
Given the Hero section is rendered
When the page finishes loading
Then the `.macos-strip` slides down from above the viewport
And the strip is visible above the video background within 0.8s of page load

### Requirement: HERO_CLIP_PATH_TAGLINE_REVEAL
The Hero headline text SHALL animate using GSAP `clip-path` reveal on the load timeline, preserving the v2 effect: `fromTo(clipPath: 'inset(0 100% 0 0)', 'inset(0 0% 0 0)')` with `duration: 1.2` and `ease: 'expo.out'`.

The tagline element uses class `.hero-tagline`. This animation is separate from the shiny shimmer (shimmer is a background animation, clip-path is the entrance).

#### Scenario: tag line reveals left-to-right on load
Given the Hero section is in the viewport
When the page finishes loading
Then the headline text reveals left-to-right over 1.2 seconds
And the clip-path uses expo.out easing
And the shiny gradient animation runs independently (background-position)

### Requirement: HERO_LIQUID_GLASS_CTAS
The Hero CTAs SHALL use liquid-glass styling via the `.liquid-glass` class:

**Primary CTA**: "Ver proyectos" — uses `.liquid-glass--accent` variant (blue-tinted glass), Plus Jakarta Sans 600, full-rounded corners.

**Secondary CTA**: "Hablemos" — uses `.liquid-glass` with outline-only appearance (no fill, just border gradient visible).

Both CTAs use the `magnetic-btn` class for the magnetic hover interaction.

```html
<div class="hero-ctas">
  <a href="#servicios" class="liquid-glass liquid-glass--accent magnetic-btn">
    Ver proyectos
  </a>
  <a href="#contacto" class="liquid-glass hero-cta-outline magnetic-btn">
    Hablemos
  </a>
</div>
```

#### Scenario: CTAs use glass styling with Spanish copy
Given the Hero section is rendered
When the CTAs are visible
Then the primary CTA reads "Ver proyectos" in blue-tinted liquid glass
And the secondary CTA reads "Hablemos" in outline liquid glass
And both buttons have the `.magnetic-btn` class active on desktop

### Requirement: HERO_STAT_BADGE_3_METRICS
The Hero stat badge SHALL display a row of 3 metrics instead of v2's single counter:

- "5+ años" (years of experience)
- "30+ proyectos" (projects delivered)
- "98% satisfacción" (client satisfaction)

The badge uses a horizontal flex layout with the 3 metrics separated by vertical dividers. Each metric uses Inter 500 at 14px, white text.

```html
<div class="hero-stat-badge">
  <span class="stat">5+ años</span>
  <span class="stat-divider">|</span>
  <span class="stat">30+ proyectos</span>
  <span class="stat-divider">|</span>
  <span class="stat">98% satisfacción</span>
</div>
```

#### Scenario: stat badge displays three metrics in a row
Given the Hero section is rendered
When the badge is visible
Then "5+ años", "30+ proyectos", and "98% satisfacción" are displayed horizontally
And each metric is separated by a vertical divider
And the badge uses the glass-card styling with 3 horizontal stats

### Requirement: HERO_SCROLL_INDICATOR
The Hero SHALL include a scroll indicator (chevron or arrow) at the bottom of the section indicating scroll encouragement. The indicator uses a CSS bounce animation.

#### Scenario: scroll indicator bounces
Given the Hero section is rendered
When the page is idle
Then the scroll indicator bounces vertically with a 2s cycle
And the animation is `ease-in-out` timing
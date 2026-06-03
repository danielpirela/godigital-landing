# Cinematic Hero

## Purpose

The Hero section is the primary brand impression for godigital-landing. It MUST deliver the "B BOLD" cinematic experience through a multi-layered composition: mmx-generated video background, parallax depth orbs, clip-path text reveal, and a floating iPhone mockup showing mmx-generated screen content via I2V. The Hero establishes premium boutique credibility within 2 seconds of page load.

Ref: Proposal §Approach (Hero row) · §Capabilities (cinematic-hero)

## Requirements

### Requirement: HERO_VIDEO_BACKGROUND_AUTOPLAY
The Hero component SHALL render a full-bleed `<video>` element with `autoplay muted loop playsinline`, using `assets/generated/hero-loop.mp4` as the primary source and `assets/generated/bg/obsidian-mesh.png` as the `poster` attribute while the video buffers.

The system SHALL apply `object-fit: cover`, `width: 100vw`, `height: 100vh`, `position: absolute`, and `z-index: 0` to the video element.

The video element SHALL receive the attribute `data-mmx-generated="hero-loop"`.

#### Scenario: Video loads successfully
Given the user navigates to the homepage
When the page loads on a desktop connection
Then the `<video>` element plays `hero-loop.mp4` silently in a loop
And the `poster` image is visible for ≤ 500ms before video starts

#### Scenario: Video fails to load
Given the `hero-loop.mp4` file is missing or returns HTTP 404
When the page renders
Then the `poster` (obsidian-mesh.png) remains visible as a static background
And the page remains fully functional without console errors

### Requirement: HERO_PARALLAX_ORBS
The Hero SHALL render 3 parallax orbs as `<div>` elements with CSS `border-radius: 50%`, `background: radial-gradient(circle, rgba(0,102,255,0.4) 0%, transparent 70%)`, absolute positioning at `z-index: 1`, and GSAP `ScrollTrigger` pinning.

The orbs SHALL respond to scroll position by translating on the Y axis at 0.3×, 0.5×, and 0.7× scroll velocity respectively (parallax depth layers).

Each orb SHALL have `will-change: transform` applied.

#### Scenario: Desktop scroll produces parallax depth
Given the user is on a desktop viewport (≥769px)
When the user scrolls from top to 50% of the page
Then the furthest-back orb moves 15% of scroll distance
And the closest orb moves 35% of scroll distance
And all three orbs remain within viewport bounds

### Requirement: HERO_CLIP_PATH_REVEAL
The Hero headline and subheadline text SHALL animate using GSAP `clip-path` reveal: `fromTo(clipPath: 'inset(0 100% 0 0)', 'inset(0 0% 0 0)')` with `duration: 1.2` and `ease: 'expo.out'`.

The tagline element SHALL be the `.hero-tagline` CSS class. The clip-path animation SHALL trigger on page load (after DOMContentReady) with no scroll dependency.

#### Scenario: Tagline reveals on load
Given the Hero section is in the viewport
When the page finishes loading
Then the tagline text reveals left-to-right over 1.2 seconds
And easing follows an expo.out curve
And no layout shift occurs during the animation

### Requirement: HERO_FLOATING_IPHONE
The Hero SHALL display a floating iPhone mockup using `assets/iphone-15-pro-marco.png` as the device frame, with an inner `<video>` or `<img>` showing mmx-generated screen content (`assets/generated/iphone-screen.mp4` via I2V, or `assets/iphone-15-pro-marco.png` as fallback).

The iPhone element SHALL have `class="floating-device"` with CSS `animation: float 6s ease-in-out infinite`.

The iPhone screen video SHALL receive `data-mmx-generated="iphone-screen"`.

#### Scenario: Floating animation is smooth
Given the iPhone mockup is rendered in the Hero
When the page is idle (no user interaction)
Then the iPhone floats vertically with a 6-second cycle
And the animation uses `ease-in-out` timing
And the device frame does not blur during animation

### Requirement: HERO_STAT_BADGE_COUNTER
The Hero SHALL display a stat badge reading "10+ proyectos entregados" using a scroll-scrubbed GSAP counter that animates from 0 to 10 when the Hero enters the viewport.

The counter SHALL use `gsap.to()` with an object `{ val: 0 }` proxy and an `onUpdate` callback that writes `Math.round(val) + "+ proyectos"` to the DOM element.

#### Scenario: Counter animates on scroll into view
Given the Hero section is below the fold
When the user scrolls the Hero into viewport
Then the counter animates from 0 to 10 over 1.5 seconds
And the final display reads "10+ proyectos entregados"
And the animation is non-blocking (user can scroll during animation)
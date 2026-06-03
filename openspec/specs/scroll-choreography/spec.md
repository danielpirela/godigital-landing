# Scroll Choreography

## Purpose

Scroll choreography provides the unified animation pattern for all 6 page sections plus Navbar. It uses a `sectionReveal` factory function that creates GSAP timelines triggered by ScrollTrigger, applies `matchMedia` responsive rules, and orchestrates frame-by-frame clip-path entrances. This capability is the animation backbone that makes "B BOLD" intensity consistent across sections.

Ref: Proposal §Animation System · §scroll-choreography capability

## Requirements

### Requirement: SECTION_REVEAL_FACTORY
The system SHALL export `function sectionReveal(trigger: string, children: string[], opts: RevealOpts): GSAPTimeline` from `src/scripts/animations.ts`.

`RevealOpts` SHALL contain: `stagger` (number, default 0.1), `duration` (number, default 0.8), `ease` (string, default 'power3.out'), `start` (string, default 'top 80%'), `clip` (boolean, default false).

The factory SHALL create a GSAP timeline that animates each child element using ScrollTrigger as the trigger.

#### Scenario: sectionReveal animates service cards
Given `sectionReveal('.services-card', ['.card-1', '.card-2', '.card-3', '.card-4'], { stagger: 0.15, clip: true })` is called
When the Services section enters the viewport
Then each card animates with 150ms stagger
And each card uses clip-path reveal from left
And the animation completes within 1 second total

### Requirement: FRAME_BY_FRAME_PATTERN
The system SHALL implement frame-by-frame animation using GSAP `fromTo` with `clipPath: 'inset(0 100% 0 0)'` → `'inset(0 0% 0 0)'` for text and headline elements.

Frame-by-frame SHALL be the default entrance for: Hero tagline, section headings, CTA headline.

#### Scenario: Headline uses clip-path entrance
Given a section heading has `class="reveal-clip"`
When `initAnimations()` runs
Then GSAP applies `fromTo` clip-path animation
And the heading reveals left-to-right over 1.2 seconds with expo.out easing

### Requirement: MATCHMEDIA_RESPONSIVE_WRAPPER
The `initAnimations()` function in `src/scripts/animations.ts` SHALL wrap all ScrollTrigger setup in a `gsap.matchMedia()` context with these four rules:

- `(max-width: 768px)`: fade-ups only, no parallax, no pins, particles reduced to 10
- `(prefers-reduced-motion: reduce)`: CSS-only animations, all GSAP skipped
- `(hover: hover) and (pointer: fine)`: magnetic + cursor attraction enabled
- `(min-width: 769px)`: full choreography including parallax orbs, sticky pins, scroll-scrubbed counters

#### Scenario: Mobile disables parallax and pins
Given the viewport is 375px wide (mobile)
When `initAnimations()` runs
Then `ScrollTrigger` does not create parallax animations on orbs
And sticky-pin is not applied to any section
And the matchMedia rule `(max-width: 768px)` is active

### Requirement: GPU_HINTS_ON_ANIMATED_ELEMENTS
All elements animated by GSAP SHALL receive `el.style.willChange = 'transform, opacity'` and `gsap.set(el, { force3D: true })` before the animation timeline runs.

This applies to: parallax orbs, floating iPhone, service cards, process timeline circles, CTA orbs.

#### Scenario: GPU hints applied before animation
Given an orb element exists in the DOM
When `initAnimations()` initializes
Then `will-change: transform` is set inline on the orb
And `gsap.set()` is called with `force3D: true`
And animation runs on the compositor thread (no paint)
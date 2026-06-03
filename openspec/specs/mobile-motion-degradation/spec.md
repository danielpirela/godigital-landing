# Mobile Motion Degradation

## Purpose

Mobile Motion Degradation ensures the godigital-landing v2 achieves 30fps minimum on mobile devices through a `gsap.matchMedia()` ruleset that disables or reduces expensive animations (parallax, sticky pins, particle count, blur intensity) on viewports below 768px. It also respects `prefers-reduced-motion` by skipping all GSAP animations entirely. This protects the mobile experience from animation-induced jank.

Ref: Proposal §Performance Budget (FPS row) · §Animation System (matchMedia section) · §mobile-motion-degradation capability

## Requirements

### Requirement: MATCHMEDIA_FOUR_CONTEXT_RULES
The `initAnimations()` function SHALL create a `gsap.matchMedia()` instance with exactly four registered contexts in this priority order:

1. `(prefers-reduced-motion: reduce)`: Skip all GSAP. All animation elements set to `opacity: 1, visibility: visible` via CSS. mmx video and audio elements paused/removed.
2. `(max-width: 768px)`: Disable parallax orbs (Y-axis translations). Disable sticky-pin on all sections. Reduce particle count from 35 to 10. Reduce orb blur from 80px to 40px. Use fade-up entrances only.
3. `(hover: hover) and (pointer: fine)`: Enable magnetic hover buttons and cursor-attracted orbs.
4. `(min-width: 769px)`: Full choreography — parallax orbs, sticky pins, scroll-scrubbed counters, full particle count (35), full blur (80px).

#### Scenario: matchMedia correctly disables motion on reduced-motion
Given `prefers-reduced-motion: reduce` is set in OS preferences
When `initAnimations()` runs
Then no GSAP ScrollTrigger instances are created
And no parallax animations run
And no clip-path animations run
And all content is visible in its final state immediately

### Requirement: PARALLAX_DISABLED_MOBILE
On `(max-width: 768px)`, parallax orbs SHALL NOT translate based on scroll position. Instead, orbs SHALL be `position: static` with `transform: none`.

The `.parallax-orb` elements SHALL have `will-change: auto` applied (removing GPU hint).

#### Scenario: Mobile parallax orbs are static
Given viewport is 390px
When the page is scrolled
Then orbs remain in their original positions
And no `translateY` is applied via GSAP
And orb `will-change` is reset to `auto`

### Requirement: STICKY_PIN_DISABLED_MOBILE
On `(max-width: 768px)`, `ScrollTrigger.create({ pin: true })` SHALL NOT be called for any section.

All sections use normal document flow on mobile.

#### Scenario: Services section flows normally on mobile
Given viewport is 375px
When the user scrolls to the Services section
Then the section does not become position:fixed
And cards enter with fade-up only (no multi-vector entrance)

### Requirement: PARTICLE_COUNT_DEGRADED_MOBILE
On desktop (≥769px), particle/orb count SHALL be 35. On mobile (<768px), particle count SHALL be 10.

The particle container SHALL read the count from a CSS custom property `--particle-count` set by the matchMedia context.

#### Scenario: Particle count halves on mobile
Given the window resizes from 1024px to 375px
When the window `resize` event fires
Then `--particle-count` changes from 35 to 10
And only 10 orb elements are rendered/animated
And the GSAP matchMedia context for mobile is active

### Requirement: BLUR_INTENSITY_DEGRADED_MOBILE
On desktop, orb blur SHALL be 80px (`filter: blur(80px)`). On mobile, orb blur SHALL be 40px.

The blur value SHALL be stored in `--orb-blur` CSS custom property and updated by the matchMedia context.

#### Scenario: Orb blur reduces on mobile
Given viewport is 1024px
Then `--orb-blur` is `80px`
When viewport resizes to 375px
Then `--orb-blur` becomes `40px`
And existing orbs update their blur via CSS variable reference
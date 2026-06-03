# Curtain Transitions

## Purpose

Curtain transitions provide a cinematic wipe effect between page sections, driven by either a mmx-generated video (`assets/generated/curtain.mp4`) on capable browsers, or a CSS `clip-path` wipe fallback. The curtain is a 3-second SEF (start-end-frame) video that acts as an animated transition overlay. This creates the "B BOLD" continuous-flow sensation between sections.

Ref: Proposal §Approach (Inter-section row) · §Capabilities (curtain-transitions) · §Asset #12

## Requirements

### Requirement: CURTAIN_VIDEO_PLAYBACK
The curtain overlay SHALL be a `<video>` element with `autoplay muted loop` at `z-index: 100`, `pointer-events: none`, positioned `fixed` to cover the viewport.

The video source SHALL be `assets/generated/curtain.mp4` with `data-mmx-generated="curtain-video"`.

The curtain video SHALL only play when `prefers-reduced-motion: no-preference` AND viewport ≥ 768px.

#### Scenario: Curtain plays on desktop with motion preference
Given the user has `prefers-reduced-motion: no-preference`
And viewport is ≥ 768px
When a section transition occurs
Then the curtain video plays `curtain.mp4` as an overlay
And the overlay does not block pointer interaction with page content

### Requirement: CURTAIN_CSS_FALLBACK
When the curtain video is disabled (mobile or reduced-motion), the system SHALL use CSS `clip-path` wipe animation: `inset(0 100% 0 0)` → `inset(0 0 0 0)` over 0.6s with `power2.inOut`.

The CSS curtain SHALL be a `div.curtain-wipe` with `position: fixed`, `width: 100vw`, `height: 100vh`, `background: var(--color-curtain)`, `z-index: 100`.

#### Scenario: CSS fallback on mobile
Given the viewport is < 768px
When a section transition occurs
Then the CSS `.curtain-wipe` div animates with clip-path
And the animation completes in 0.6 seconds
And no video element is created for the curtain

### Requirement: CURTAIN_TIMING_COORDINATION
The curtain transition SHALL be coordinated with `ScrollTrigger` section enter/exit callbacks.

When a new section's `onEnter` fires, the curtain SHALL begin its reveal (wipe out) animation.

The transition SHALL NOT block scrolling — it runs concurrently with scroll, not preventing it.

#### Scenario: Curtain triggers on section enter
Given the user scrolls from Hero to Services section
When the Services section `ScrollTrigger.onEnter` fires
Then the curtain (video or CSS) begins its exit animation
And after 3 seconds (video) or 0.6 seconds (CSS), the curtain is fully gone
And the user can scroll freely during the animation
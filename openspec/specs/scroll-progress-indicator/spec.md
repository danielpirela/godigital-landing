# Scroll Progress Indicator

## Purpose

The scroll progress indicator provides users with persistent awareness of their position within the page via a thin global progress bar at the top of the viewport. `SectionProgress.astro` renders a `<div class="scroll-progress">` fixed at `top: 0`, `left: 0`, `width: 0% → 100%` tied to `window.scrollY / (document.body.scrollHeight - window.innerHeight)`. The Navbar also tracks active section for anchor-based section identification.

Ref: Proposal §Approach (Navbar row) · §Capabilities (scroll-progress-indicator) · §Design System Updates (SectionProgress.astro)

## Requirements

### Requirement: SCROLL_PROGRESS_BAR
`SectionProgress.astro` SHALL render a full-width `<div>` at `position: fixed`, `top: 0`, `left: 0`, `height: 3px`, `background: var(--color-electric-blue)`, `z-index: 200`.

The bar width SHALL be updated via `requestAnimationFrame` on scroll: `width = (scrollY / (scrollHeight - innerHeight)) * 100%`.

The bar SHALL only exist and update when viewport ≥ 768px; it is hidden on mobile.

#### Scenario: Progress bar fills as user scrolls
Given the page is at the top (scrollY = 0)
When the user scrolls to the middle of the page
Then the progress bar width is approximately 50%
When the user reaches the bottom
Then the progress bar width is 100%

### Requirement: SECTION_ANCHOR_TRACKING
The Navbar SHALL track the currently-visible section using `ScrollTrigger` `onEnter`/`onLeave` callbacks for each section's trigger element.

The active section SHALL update a `data-active-section` attribute on the `<body>` element and highlight the corresponding Navbar link with `aria-current="section"`.

Section trigger IDs: `#hero`, `#services`, `#boutique-edge`, `#process`, `#cta`, `footer`.

#### Scenario: Active section link highlighted in navbar
Given the user is viewing the Services section
When the Services `ScrollTrigger.onEnter` fires
Then `body[data-active-section="services"]` is set
And the Navbar link for Services has `aria-current="section"`
And all other Navbar links have no `aria-current`

### Requirement: SCROLL_PROGRESS_HIDDEN_MOBILE
On `(max-width: 768px)`, the `.scroll-progress` element SHALL be `display: none` via CSS.

The element SHALL still exist in the DOM for potential later use but SHALL NOT be visible or consume layout space.

#### Scenario: Progress bar hidden on mobile
Given viewport is 375px
When the page renders
Then `.scroll-progress` has `display: none` applied
And the 3px bar does not appear at the top of the viewport
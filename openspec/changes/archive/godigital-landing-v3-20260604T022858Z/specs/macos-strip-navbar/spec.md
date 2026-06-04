# Spec: macos-strip-navbar

## Purpose

The macOS-style strip replaces the v2 Navbar with a 40px-tall translucent black bar that appears above the Hero section's video background. It renders the GoDigital wordmark centered, traffic-light dots on the left, and a subtle time/date display on the right. The strip animates in on Hero load and stays sticky at the top of the viewport as the user scrolls.

Ref: Proposal §New infrastructure · §Capabilities (macos-strip-navbar)

## Requirements

### Requirement: MACOS_STRIP_STRUCTURE
The Navbar component SHALL render a `.macos-strip` element with these characteristics:

- Height: 40px fixed
- Background: rgba(0, 0, 0, 0.4) with `backdrop-filter: blur(12px)`
- Position: fixed at top of viewport, `z-index: 100`
- Full width: `width: 100vw`

The strip SHALL contain three zones:
1. **Left zone**: 3 traffic-light dots (12px diameter), horizontally centered, with `aria-hidden="true"`.
2. **Center zone**: GoDigital wordmark in Plus Jakarta Sans 600, 14px, white, no navigation links in strip.
3. **Right zone**: Current time in Inter 11px, white at 60% opacity, updating every minute.

```html
<header class="macos-strip" role="banner">
  <div class="macos-strip__left" aria-hidden="true">
    <span class="traffic-light traffic-light--red"></span>
    <span class="traffic-light traffic-light--yellow"></span>
    <span class="traffic-light traffic-light--green"></span>
  </div>
  <div class="macos-strip__center">
    <span class="wordmark">GoDigital</span>
  </div>
  <div class="macos-strip__right">
    <time class="strip-time" datetime=""></time>
  </div>
</header>
```

#### Scenario: strip renders above Hero video
Given the page loads
When the Hero section renders
Then the `.macos-strip` appears at the very top of the viewport
And the strip is visible above the video background
And the strip has 40px height with translucent black background

### Requirement: MACOS_STRIP_TRAFFIC_LIGHTS
The traffic-light dots SHALL use desaturated colors (60% saturation) to match GoDigital's boutique tone, NOT the full saturation of macOS's Finder dots:

- Red: `hsl(4, 100%, 60%)` — desaturated from pure red
- Yellow: `hsl(38, 100%, 55%)` — desaturated from pure yellow
- Green: `hsl(130, 80%, 45%)` — desaturated from pure green

The dots SHALL have `border-radius: 50%`, `width: 12px`, `height: 12px`, and `flex-gap: 8px` between them. The dots are decorative only; they have `aria-hidden="true"` and no click handlers.

#### Scenario: traffic-light dots are desaturated for boutique tone
Given the traffic-light dots are rendered
When inspected in the browser
Then the red dot color is `hsl(4, 100%, 60%)` (not the bright macOS red)
And the yellow dot color is `hsl(38, 100%, 55%)`
And the green dot color is `hsl(130, 80%, 45%)`

### Requirement: MACOS_STRIP_ANIMATION_ON_LOAD
The `.macos-strip` SHALL animate in on Hero load using a GSAP timeline:

1. Initial state: `opacity: 0`, `translateY: -10px`
2. After 0.3s delay: animate to `opacity: 1`, `translateY: 0` over `0.5s` with `power3.out` easing

The animation triggers from the Hero component's `hero.ts` timeline, not as an independent scroll trigger.

#### Scenario: strip appears on Hero load with slide-down
Given the Hero section is in the viewport
When the page finishes loading (after DOMContentReady + 0.3s)
Then the strip slides down from `translateY: -10px` and fades in over 0.5s
And the animation completes before the user begins scrolling

### Requirement: MACOS_STRIP_STICKY_BEHAVIOR
The `.macos-strip` SHALL remain fixed at the top of the viewport (`position: fixed`) as the user scrolls through the page. It does NOT become transparent or compress on scroll — it remains a consistent 40px dark strip throughout.

Unlike v2's Navbar which had 3 states (transparent → glass-scrolled → compact-blue), the v3 strip maintains a single consistent appearance.

#### Scenario: strip stays at top during page scroll
Given the user has scrolled to the middle of the page
When the viewport is observed
Then the strip remains fixed at the very top
And the strip height stays at 40px
And the strip background remains at rgba(0,0,0,0.4)

### Requirement: MACOS_STRIP_MOBILE_REPLACEMENT
On viewports below 769px, the `.macos-strip` SHALL be hidden (`display: none`) and replaced by the existing `Navbar.astro` mobile hamburger menu pattern.

The mobile Navbar remains functional with its existing CSS-driven hamburger → X animation and mobile menu overlay.

#### Scenario: strip hidden on mobile
Given a viewport of 375px (mobile)
When the page renders
Then the `.macos-strip` has `display: none`
And the existing mobile hamburger menu is visible
And the mobile menu functions as designed in v2

### Requirement: MACOS_STRIP_TIME_DISPLAY
The time display in the right zone SHALL update every 60 seconds using JavaScript `new Date()` to set the current locale time in 12-hour or 24-hour format matching the user's OS preference.

The `<time>` element SHALL have an empty `datetime` attribute that is updated alongside the displayed time for accessibility.

#### Scenario: time updates every minute
Given the page is rendered
When 60 seconds pass
Then the time displayed in the right zone updates to the current system time
And the `datetime` attribute is updated in ISO format

### Requirement: MACOS_STRIP_NAV_LINKS
The GoDigital wordmark in the center zone acts as a visual anchor, NOT a navigation link. Navigation links (Inicio, Servicios, Proceso, Calidad, Contacto) are rendered by a secondary `<nav>` element that appears below the strip or integrated within the existing `Navbar.astro` component for desktop.

The strip itself contains no `<a>` elements.

#### Scenario: wordmark is not a link
Given the `.macos-strip` is rendered
When a user interacts with the center wordmark
Then no navigation occurs (not a link)
And the wordmark is `<span class="wordmark">` not `<a>`
# Spec: curtain-transitions

> **Modified**: 2026-06-04

## Purpose

The curtain transition fires between adjacent sections as the user scrolls, creating a liquid-glass radial reveal that replaces v2's clip-path wipe. The curtain uses a blue-tinted glass effect (rgba(0, 102, 255, 0.2) gradient, blurred) that sweeps across the screen between sections. This spec supersedes the v2 `curtain-transitions` spec by extending the effect to all section pairs and using the liquid-glass style.

Ref: Proposal §What Changes · §Capabilities (curtain-transitions, modified)

## MODIFIED Requirements

> **Modified**: 2026-06-04

### Requirement: CURTAIN_LIQUID_GLASS_STYLE
The curtain overlay SHALL use a liquid-glass radial reveal effect instead of v2's clip-path wipe:

```css
.curtain-liquid {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(0, 102, 255, 0.2) 0%,
    rgba(0, 102, 255, 0.1) 50%,
    transparent 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 600ms ease-out;
}
```

The curtain uses a radial clip-path (`circle(0% at 50% 50%)`) that expands to `circle(150% at 50% 50%)` when triggered.

#### Scenario: curtain uses liquid-glass style with blue tint
Given the curtain is triggered between sections
When the animation runs
Then the curtain has a radial gradient from Electric Blue (20% opacity) at center to transparent at edges
And the backdrop blur creates a frosted glass effect
And the clip-path circle expands from 0% to 150% over 600ms

### Requirement: CURTAIN_FIRES_BETWEEN_ALL_SECTIONS
The curtain SHALL fire between every adjacent section pair in the page:

1. Hero → Services
2. Services → BoutiqueEdge
3. BoutiqueEdge → Process
4. Process → QualityAssurance
5. QualityAssurance → CTASection

Each section transition gets its own ScrollTrigger with `start: 'bottom 80%'` on the outgoing section and `end: 'top 20%'` on the incoming section.

The curtain is created once in `scroll.ts` and reused for all transitions (single overlay div).

```javascript
// In scroll.ts
const curtain = document.createElement('div');
curtain.className = 'curtain-liquid';
document.body.appendChild(curtain);

const sectionPairs = [
  ['#hero', '#servicios'],
  ['#servicios', '#boutique-edge'],
  ['#boutique-edge', '#proceso'],
  ['#proceso', '#quality-assurance'],
  ['#quality-assurance', '#cta']
];

sectionPairs.forEach(([outSection, inSection]) => {
  const outEl = document.querySelector(outSection);
  const inEl = document.querySelector(inSection);

  ScrollTrigger.create({
    trigger: outEl,
    start: 'bottom 80%',
    end: 'top 20%',
    onEnter: () => animateCurtain('open'),
    onLeaveBack: () => animateCurtain('close')
  });
});
```

#### Scenario: curtain fires between every adjacent section
Given the user scrolls through the page
When the user crosses from Hero to Services
Then the curtain animates open and closed
And when crossing from Services to BoutiqueEdge
Then the curtain fires again
And this pattern continues for all 5 section transitions

### Requirement: CURTAIN_ANIMATION_DURATION
The curtain animation uses `duration: 600ms` with `ease-out` timing for the open and close phases.

The curtain open animation: `clip-path: circle(0%)` → `clip-path: circle(150%)` over 600ms.
The curtain close animation: `clip-path: circle(150%)` → `clip-path: circle(0%)` over 600ms, delayed 100ms after the open completes.

#### Scenario: curtain animation completes in 600ms
Given the user crosses a section boundary
When the curtain trigger fires
Then the curtain expands from 0% to 150% radius over exactly 600ms
And after 100ms delay, the curtain contracts back to 0% over 600ms
And the total transition time is approximately 1.3s

### Requirement: CURTAIN_SINGLETON_GUARD
The curtain overlay div SHALL be created once and reused. A singleton guard in `scroll.ts` ensures no duplicate curtain elements are created on HMR or multiple page loads:

```javascript
if (document.querySelector('.curtain-liquid')) return;
```

#### Scenario: no duplicate curtain on HMR
Given the page has already created a `.curtain-liquid` element
When the `scroll.ts` script runs again (e.g., HMR)
Then the script exits early due to the singleton guard
And no second curtain overlay is added to the DOM

### Requirement: CURTAIN_MOBILE_DISABLE
On mobile viewports (<769px), the curtain transition is disabled via `matchMedia` check. Mobile users see no curtain animation.

#### Scenario: curtain disabled on mobile
Given a viewport of 375px (mobile)
When the user scrolls between sections
Then no curtain overlay appears
And the matchMedia rule `(max-width: 768px)` disables the curtain ScrollTrigger

### Requirement: CURTAIN_REDUCED_MOTION_DISABLE
For users with `prefers-reduced-motion: reduce`, the curtain animation is disabled. The curtain element is still created but `clip-path` transitions are set to `none`.

#### Scenario: curtain respects reduced motion preference
Given a user has `prefers-reduced-motion: reduce` in their OS settings
When the page loads
Then the `.curtain-liquid` element is not displayed
Or the `transition` property is set to `none` on the curtain
And no animated transition fires between sections
# Spec: liquid-glass-system

## Purpose

The `.liquid-glass` CSS utility is the visual backbone of the godigital-landing-v3 redesign. It renders a premium glass card with a gradient border, backdrop blur, and transparent base that works as a reusable utility across Hero CTAs, Service cards, BoutiqueEdge pillars, and QualityAssurance cards. Browser feature detection provides graceful fallback for Safari.

Ref: Proposal §New infrastructure · §Capabilities (liquid-glass-system)

## Requirements

### Requirement: LIQUID_GLASS_BASE_STYLES
The system SHALL define a `.liquid-glass` CSS class in `src/styles/global.css` using these exact styles:

```css
.liquid-glass {
  background: rgba(8, 10, 16, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
}
```

The system SHALL also define a `::before` pseudo-element on `.liquid-glass` for the gradient border:

```css
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 40%,
    rgba(0, 102, 255, 0.2) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

#### Scenario: renders with gradient border on Chrome
Given the `.liquid-glass` class is applied to a div element
When the page renders in Chrome (version 120+)
Then the element has a backdrop blur of 20px
And the `::before` pseudo renders a gradient border at 135deg
And the mask-composite excludes the border from the content area

#### Scenario: transparent base ensures legibility over video backgrounds
Given a `.liquid-glass` element is rendered over the Hero video background
When the backdrop blur is active
Then the rgba(8, 10, 16, 0.55) base ensures text contrast ratio ≥ 4.5:1 against the blurred video content

### Requirement: LIQUID_GLASS_VARIANTS
The system SHALL define three modifier classes for `.liquid-glass`:

**`.liquid-glass--soft`**: reduced blur (12px instead of 20px), lighter border (rgba(255,255,255,0.06) instead of 0.15), used for subtle card contexts.

**`.liquid-glass--strong`**: increased blur (32px), heavier border (rgba(255,255,255,0.25)), used for prominent CTAs and hero elements.

**`.liquid-glass--accent`**: blue-tinted base (rgba(0, 102, 255, 0.08)), border emphasizes Electric Blue (#0066ff) at 30% opacity, used for active/selected states.

#### Scenario: soft variant renders subtle glass
Given an element with classes `liquid-glass liquid-glass--soft`
When rendered
Then backdrop blur is 12px
And border gradient uses rgba(255,255,255,0.06)
And no performance penalty from over-blurring

#### Scenario: accent variant used for active nav or CTA
Given an element with classes `liquid-glass liquid-glass--accent`
When rendered
Then background base includes rgba(0, 102, 255, 0.08)
And border gradient emphasizes Electric Blue at 30% opacity

### Requirement: LIQUID_GLASS_SAFARI_FALLBACK
The system SHALL detect `mask-composite` support and provide a `@supports not (mask-composite: exclude)` fallback.

The fallback SHALL use `border-image: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,102,255,0.2) 100%) 1` instead of the mask-composite approach, applied via an additional `.liquid-glass-fallback` class.

#### Scenario: falls back gracefully on Safari < 16
Given a user renders the page in Safari 15
When the browser does not support `mask-composite: exclude`
Then the `.liquid-glass::before` approach is replaced by `.liquid-glass-fallback` using `border-image`
And the visual effect remains recognizable without gradient border

### Requirement: LIQUID_GLASS_PERFORMANCE_HINTS
The system SHALL use `will-change: backdrop-filter` only during active animation.

When a `.liquid-glass` element is NOT currently animating, the `will-change` property SHALL NOT be set. When a parent element triggers an animation involving the glass card (e.g., entrance stagger), the `will-change` SHALL be set inline before the animation and removed after completion via `onComplete`.

#### Scenario: backdrop-filter cost managed on idle cards
Given 4 Service cards with `.liquid-glass` are visible and not animating
When the page is idle (no GSAP timeline running)
Then no `will-change: backdrop-filter` is set on any card
And the compositor is not forced to maintain a separate blur layer

### Requirement: LIQUID_GLASS_INTERACTIVE_STATES
The system SHALL define hover and focus states for `.liquid-glass` elements:

```css
.liquid-glass:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glass-hover);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.liquid-glass:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

#### Scenario: card lifts on hover
Given a `.liquid-glass` card is rendered
When the user hovers the mouse over the card
Then the card translates Y by -4px over 300ms
And the box-shadow increases to `shadow-glass-hover`

### Requirement: LIQUID_GLASS_ASTRO_COMPONENT
The system SHALL provide a reusable `<GlassCard>` Astro component at `src/components/GlassCard.astro` with this API:

```astro
---
interface Props {
  variant?: 'default' | 'soft' | 'strong' | 'accent';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean; // default: false
  class?: string;
}
const { variant = 'default', padding = 'md', interactive = false } = Astro.props;
---

<div class:list={['liquid-glass', `liquid-glass--${variant}`, `padding-${padding}`, { 'cursor-pointer': interactive }]}>
  <slot />
</div>
```

The padding classes SHALL map to: `sm` = 16px, `md` = 24px, `lg` = 32px.

#### Scenario: GlassCard renders with accent variant and large padding
Given `<GlassCard variant="accent" padding="lg">` is used in a template
When Astro renders the component
Then the output div has classes `liquid-glass liquid-glass--accent padding-lg`
And the slot content is rendered inside the div

#### Scenario: GlassCard with interactive=true adds cursor-pointer
Given `<GlassCard variant="default" interactive={true}>` is used
When Astro renders the component
Then the output div has classes `liquid-glass liquid-glass--default cursor-pointer`

## Design Token Additions

The following tokens SHALL be added to the `@theme` block in `global.css`:

```css
--blur-liquid: 20px;
--blur-liquid-soft: 12px;
--blur-liquid-strong: 32px;
--color-glass-tint: rgba(8, 10, 16, 0.55);
--color-glass-edge: rgba(255, 255, 255, 0.15);
--color-glass-accent: rgba(0, 102, 255, 0.08);
```
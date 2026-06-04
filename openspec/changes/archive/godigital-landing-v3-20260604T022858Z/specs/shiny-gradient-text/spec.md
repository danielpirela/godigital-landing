# Spec: shiny-gradient-text

## Purpose

The `.shiny-text` utility creates a metallic shimmer effect on headlines by combining a moving gradient background with `background-clip: text` and an SVG `feTurbulence` noise filter. Used for the Hero headline, CTASection watermark text, and QualityAssurance section heading. The animation respects `prefers-reduced-motion`.

Ref: Proposal §New infrastructure · §Capabilities (shiny-gradient-text)

## Requirements

### Requirement: SHINY_TEXT_CSS_CLASS
The system SHALL define a `.shiny-text` CSS class in `src/styles/global.css` with these exact styles:

```css
.shiny-text {
  background: linear-gradient(
    to right,
    #091020 0%,
    #0066ff 25%,
    #4DA3FF 50%,
    #0066ff 75%,
    #091020 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

#### Scenario: headline text renders with gradient clipped to text
Given a `<h1>` element with class `shiny-text`
When the page renders
Then the text color is `transparent`
And the gradient background is visible only where text exists
And the gradient spans from dark blue (#091020) through Electric Blue (#0066ff) to sky blue (#4DA3FF)

### Requirement: SHINY_TEXT_ANIMATION
The system SHALL define an `@keyframes shiny` animation and an `.animate-shiny` class:

```css
@keyframes shiny {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-shiny {
  animation: shiny 6s linear infinite;
}
```

The animation SHALL run for 6 seconds per cycle and repeat infinitely.

#### Scenario: text animates on load
Given a headline with classes `shiny-text animate-shiny`
When the page loads
Then the gradient position animates from -200% to 200% over 6 seconds
And the shimmer effect moves left-to-right continuously

#### Scenario: animation respects reduced motion
Given a user has `prefers-reduced-motion: reduce` set in their OS
When the page renders a `.shiny-text.animate-shiny` element
Then the `animation` property is set to `none` via a media query override
And the gradient remains visible as a static background

### Requirement: SHINY_TEXT_SVG_FILTER
The system SHALL define an SVG `<filter>` element with `id="shiny-noise"` in the Layout.astro `<body>` section, rendered once as a hidden SVG defs block:

```svg
<svg style="position:absolute;width:0;height:0" aria-hidden="true">
  <defs>
    <filter id="shiny-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        result="noiseOut"
      />
      <feColorMatrix
        type="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
        in="noiseOut"
        result="coloredNoise"
      />
    </filter>
  </defs>
</svg>
```

The filter SHALL be applied to `.shiny-text` via `filter: url(#shiny-noise)`.

#### Scenario: noise filter applies metallic shimmer
Given a `.shiny-text` element with `filter: url(#shiny-noise)` applied
When the gradient animates
Then the feTurbulence noise adds subtle grain to the metallic effect
And the feColorMatrix limits opacity to 35% so text remains legible

#### Scenario: noise filter renders crisply
Given the SVG filter is placed once in the Layout body
When multiple `.shiny-text` elements reference it
Then there is no duplicate SVG in the DOM
And the filter is applied consistently across all headline instances

### Requirement: SHINY_TEXT_HERO_HEADLINE
The Hero headline SHALL use Spanish copy with `.shiny-text` applied to the word "experiencias":

```html
<h1 class="hero-headline">
  Convertimos ideas en<br />
  <span class="shiny-text animate-shiny">experiencias</span>
  digitales
</h1>
```

The `animate-shiny` class starts the shimmer animation on load.

#### Scenario: headline renders with shiny gradient on 'experiencias'
Given the Hero section is rendered
When the page loads
Then the word "experiencias" displays the animated shimmer gradient
And the words "Convertimos ideas en" and "digitales" render in plain white
And the line break is preserved for visual rhythm

### Requirement: SHINY_TEXT_PLACEMENT_IN_LAYOUT
The SVG filter defs block SHALL be placed at the end of the `<body>` tag in `src/layouts/Layout.astro` using `position: absolute; width: 0; height: 0` to remove it from the layout flow while keeping it in the DOM for filter resolution.

#### Scenario: SVG filter does not affect page layout
Given the SVG defs block is placed at end of body with `position: absolute`
When the page renders
Then the SVG takes up no visible space
And the filter remains accessible to all `.shiny-text` elements in the document

### Requirement: SHINY_TEXT_ALTERNATIVE_NON_ANIMATED
For non-animated use (QualityAssurance heading, CTASection watermark), the system SHALL allow `.shiny-text` without `.animate-shiny`, rendering the gradient as a static metallic effect.

#### Scenario: QA heading uses static shiny gradient
Given the QualityAssurance section heading uses `.shiny-text` without `.animate-shiny`
When rendered
Then the heading displays the gradient metallic effect
And no animation runs (suitable for sections below the fold)
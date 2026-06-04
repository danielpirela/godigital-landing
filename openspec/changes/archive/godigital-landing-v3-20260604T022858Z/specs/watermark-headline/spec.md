# Spec: watermark-headline

## Purpose

The watermark headline is a giant filtered text element placed as a background behind the CTASection card. It uses Plus Jakarta Sans 800 at 9rem with a noise filter overlay and gradient fill on the second line. The watermark creates visual depth and brand reinforcement without interfering with the card's content. On mobile, it collapses gracefully.

Ref: Proposal §New infrastructure · §Capabilities (watermark-headline)

## Requirements

### Requirement: WATERMARK_STRUCTURE
The system SHALL define a `.c3-watermark-container` wrapper that holds the watermark content:

```html
<div class="c3-watermark-container" aria-hidden="true">
  <div class="c3-watermark-main">
    <span class="c3-watermark-line-1">Diseñamos.</span>
    <span class="c3-watermark-line-2">Construimos.</span>
  </div>
</div>
```

The container uses `position: relative; z-index: 2; max-width: 1100px; text-align: center; margin-top: 40px;` and is placed absolutely behind the CTACard with `position: absolute; inset: 0;` on the parent.

#### Scenario: watermark renders behind CTACard
Given the CTASection is rendered
When the page loads
Then the `.c3-watermark-container` is visible as a background element
And the CTACard content appears on top with `z-index: 10`

### Requirement: WATERMARK_TYPOGRAPHY
The `.c3-watermark-main` element SHALL use these exact styles:

```css
.c3-watermark-main {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 9rem;
  line-height: 0.9;
  letter-spacing: -0.05em;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
}
```

#### Scenario: watermark font renders at 9rem
Given the CTASection renders on a desktop viewport
When the watermark container is measured
Then the font-size is 9rem (approximately 144px)
And the line-height is 0.9 (tight)
And letter-spacing is -0.05em (tight tracking)

### Requirement: WATERMARK_LINE1_WHITE
The first line ("Diseñamos.") SHALL render in pure white (`#ffffff`) without any gradient:

```css
.c3-watermark-line-1 {
  color: #ffffff;
}
```

#### Scenario: Line 1 renders in solid white
Given the watermark is rendered
When observed in the browser
Then the text "Diseñamos." is pure white (#ffffff)
And no gradient or animation is applied to line 1

### Requirement: WATERMARK_LINE2_GRADIENT
The second line ("Construimos.") SHALL use a gradient fill via `background-clip: text`:

```css
.c3-watermark-line-2 {
  background: linear-gradient(
    to right,
    #091020,
    #0066ff 25%,
    #4DA3FF 65%,
    #0066ff
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

#### Scenario: Line 2 renders with gradient text
Given the watermark is rendered
When the second line is observed
Then the text "Construimos." displays the gradient from dark blue to Electric Blue
And the text color is transparent (gradient visible only where text exists)

### Requirement: WATERMARK_NOISE_FILTER
The `.c3-watermark-container` SHALL use a dedicated SVG filter `id="c3-noise"` defined in Layout.astro:

```svg
<filter id="c3-noise" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.5"
    numOctaves="3"
    result="noiseOut"
  />
  <feColorMatrix
    type="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.075 0"
    in="noiseOut"
    result="subtleNoise"
  />
  <feBlend
    mode="overlay"
    in="subtleNoise"
    in2="SourceGraphic"
  />
</filter>
```

The container applies `filter: url(#c3-noise)` and the filter's `feBlend mode="overlay"` blends the noise over the text at low opacity.

#### Scenario: watermark noise filter applies grain
Given the watermark container has `filter: url(#c3-noise)`
When the page renders
Then the feTurbulence noise is blended over the text
And the opacity is limited to 7.5% so the text remains legible
And the effect creates a subtle film-grain texture

### Requirement: WATERMARK_POSITIONING_IN_CTASECTION
The CTASection component SHALL use `position: relative` on its container. The `.c3-watermark-container` is placed inside with `position: absolute; inset: 0; pointer-events: none`. The CTACard itself uses `position: relative; z-index: 10` to appear above the watermark.

#### Scenario: CTACard appears above watermark
Given the CTASection container has `position: relative`
When the card and watermark are rendered
Then the watermark is behind the card (lower z-index)
And the card content is fully legible over the watermark
And the watermark text does not intercept mouse events (pointer-events: none)

### Requirement: WATERMARK_MOBILE_COLLAPSE
On viewports below 769px, the watermark SHALL collapse gracefully:

```css
@media (max-width: 768px) {
  .c3-watermark-main {
    font-size: 3.5rem;
  }
  .c3-watermark-container {
    filter: none; /* disable noise filter for perf */
    margin-top: 20px;
  }
}
```

#### Scenario: watermark responsive on mobile
Given a viewport of 375px (mobile)
When the CTASection renders
Then the font-size collapses to 3.5rem
And the noise filter is disabled
And the watermark still provides visual context without performance penalty

### Requirement: WATERMARK_SCOPING_FOR_MULTIPLE_USE
The watermark pattern is defined for CTASection. If used in other sections (e.g., QualityAssurance), the filter `id="c3-noise"` is reusable; the CSS class names `.c3-watermark-*` are scoped with the `c3-` prefix to avoid collisions with other section styles.

#### Scenario: watermark class names don't conflict with other sections
Given the watermark styles are defined with `.c3-` prefix
When another section (e.g., Process) uses generic class names
Then there is no style collision
And the `c3-noise` filter id can be reused by multiple sections
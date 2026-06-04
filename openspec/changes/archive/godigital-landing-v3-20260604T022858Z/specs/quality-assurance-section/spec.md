# Spec: quality-assurance-section

## Purpose

The QualityAssurance section is a new page section present in the PRD but missing from the v2 implementation. It renders between Process and CTASection and showcases GoDigital's commitment to quality with 4 glass cards representing quality pillars. Each card uses the `.liquid-glass` utility and includes a Lucide icon, title, and description. The section animates in with stagger on scroll.

Ref: Proposal §What Changes · §Capabilities (quality-assurance-section)

## Requirements

### Requirement: QUALITY_SECTION_PLACEMENT
The QualityAssurance section SHALL be placed between the Process section and CTASection in `src/pages/index.astro`.

The section SHALL have an `id="quality-assurance"` anchor and render in the order: Navbar → Hero → Services → BoutiqueEdge → Process → **QualityAssurance** → CTASection → Footer.

#### Scenario: section renders between Process and CTASection
Given the page is fully loaded
When the user scrolls from Process to CTASection
Then the QualityAssurance section appears between them
And the section has id="quality-assurance" for anchor navigation

### Requirement: QUALITY_SECTION_STYLING
The section SHALL use a subtle radial gradient background (dark center to slightly lighter obsidian edges):

```css
#quality-assurance {
  background: radial-gradient(
    ellipse at center,
    var(--color-surface-dim) 0%,
    var(--color-surface) 100%
  );
  padding: 120px 0;
}
```

The section uses `max-width: 1200px; margin: 0 auto; padding: 120px var(--gutter)` for layout.

#### Scenario: section has subtle radial gradient background
Given the QualityAssurance section is in the viewport
When rendered
Then the background shows a radial gradient from the section center
And the edges are slightly lighter than the center
And the gradient is subtle (not overpowering)

### Requirement: QUALITY_SECTION_HEADING
The section heading SHALL be "Calidad sin atajos" in Plus Jakarta Sans 800, using a gradient text effect:

```html
<h2 class="quality-heading">
  <span class="shiny-text">Calidad sin atajos</span>
</h2>
```

The font-size is `clamp(2.5rem, 5vw, 5rem)` (responsive from ~40px to ~80px). The heading is centered with `text-align: center; margin-bottom: 64px`.

#### Scenario: heading renders with gradient text
Given the QualityAssurance section is rendered
When the heading is visible
Then "Calidad sin atajos" displays the gradient metallic effect
And the font-size is responsive (larger on desktop, smaller on mobile)
And the heading is centered above the cards

### Requirement: QUALITY_PILLAR_CARDS
The section SHALL render 4 quality pillar cards using the `.liquid-glass` utility with these contents:

**Card 1 — "Revisión por pares"** (Peer Review)
- Icon: `Users` (Lucide)
- Description: "Cada entregable pasa por dos ojos antes de salir"

**Card 2 — "Tests automatizados"** (Automated Tests)
- Icon: `TestTube2` (Lucide)
- Description: "Cobertura >80% en lógica crítica"

**Card 3 — "Auditoría de performance"** (Performance Audit)
- Icon: `Gauge` (Lucide)
- Description: "Lighthouse 90+ en cada deploy"

**Card 4 — "Documentación viva"** (Living Documentation)
- Icon: `BookOpen` (Lucide)
- Description: "Tu equipo entiende lo que recibe"

Each card SHALL use `<GlassCard variant="default" padding="md">` from the liquid-glass-system spec, with the icon rendered as an inline SVG or Lucide React component.

#### Scenario: renders 4 pillars with icons and descriptions
Given the QualityAssurance section is rendered
When observed
Then 4 cards are visible with titles "Revisión por pares", "Tests automatizados", "Auditoría de performance", "Documentación viva"
And each card has its corresponding Lucide icon
And each card has a description in Inter 400 at 70% opacity

### Requirement: QUALITY_CARDS_LAYOUT
The 4 cards SHALL be arranged in a 2x2 grid on desktop:

```css
.quality-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}
```

On viewports below 769px, the grid SHALL collapse to a single column:

```css
@media (max-width: 768px) {
  .quality-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Scenario: responsive grid collapses to single column on mobile
Given a viewport of 375px (mobile)
When the QualityAssurance section renders
Then the 4 cards are in a single column
And on a viewport of 1200px (desktop), the cards are in a 2x2 grid

### Requirement: QUALITY_CARDS_INTERIOR
Each card's interior SHALL be structured as:

```html
<div class="quality-card">
  <div class="quality-card__icon">
    <!-- Lucide icon SVG -->
  </div>
  <h3 class="quality-card__title">Card Title</h3>
  <p class="quality-card__desc">Card description text</p>
</div>
```

With these interior styles:

```css
.quality-card__icon {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.quality-card__title {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--color-on-surface);
  margin-bottom: 8px;
}

.quality-card__desc {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 1rem;
  color: var(--color-on-surface-variant); /* 70% opacity via variant */
  line-height: 1.5;
}
```

#### Scenario: card interior renders with correct hierarchy
Given a quality pillar card is rendered
When the card is inspected
Then the icon is 48x48 in Electric Blue
And the title is Plus Jakarta Sans 600 at 1.25rem
And the description is Inter 400 at the variant color (70% opacity of on-surface)

### Requirement: QUALITY_CARDS_ANIMATION
The 4 cards SHALL animate in with a stagger fade-up on scroll into view:

The animation uses GSAP ScrollTrigger with `stagger: 0.15`, `ease: 'power3.out'`, `y: 40 → 0`, `opacity: 0 → 1`, and `duration: 0.8`.

The animation fires once (does not repeat on scroll back).

```javascript
// In quality.ts (new animation module)
const cards = document.querySelectorAll('.quality-card');
gsap.fromTo(cards,
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#quality-assurance',
      start: 'top 80%',
      once: true
    }
  }
);
```

#### Scenario: stagger animation fires once on scroll into view
Given the user scrolls to the QualityAssurance section
When the section top reaches 80% of viewport height
Then all 4 cards animate in with 150ms stagger between each
And the animation does not fire again when scrolling back up

### Requirement: QUALITY_SECTION_ASTRO_COMPONENT
The section SHALL be implemented as `src/components/QualityAssurance.astro` with a frontmatter data array for the 4 pillars:

```astro
---
const pillars = [
  { title: 'Revisión por pares', icon: 'Users', desc: 'Cada entregable pasa por dos ojos antes de salir' },
  { title: 'Tests automatizados', icon: 'TestTube2', desc: 'Cobertura >80% en lógica crítica' },
  { title: 'Auditoría de performance', icon: 'Gauge', desc: 'Lighthouse 90+ en cada deploy' },
  { title: 'Documentación viva', icon: 'BookOpen', desc: 'Tu equipo entiende lo que recibe' },
];
---
```

The component renders the grid, heading, and all 4 cards from the data array.

#### Scenario: QualityAssurance component renders from data array
Given the `QualityAssurance.astro` component is imported in `index.astro`
When the component renders
Then all 4 pillar cards are generated from the `pillars` data array
And the component is reusable if pillar content needs to change
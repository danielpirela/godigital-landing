# Spec: content-redistribution-v2

> **Modified**: 2026-06-04

## Purpose

The BoutiqueEdge section's 4 pillar copy is updated to GoDigital's warm boutique voice in Spanish, replacing v2's cold/corporate copy. The pillars use liquid-glass cards with Sparkles icons (Lucide) instead of green check icons. The QualityAssurance section is added to the page between Process and CTASection (new section). This spec supersedes the v2 `content-redistribution-v2` spec with the updated Spanish copy and liquid-glass treatment.

Ref: Proposal §What Changes · §Capabilities (content-redistribution-v2, modified)

## MODIFIED Requirements

> **Modified**: 2026-06-04

### Requirement: BOUTIQUE_EDGE_PILLAR_COPY_SPANISH
The BoutiqueEdge section SHALL render 4 pillars with updated Spanish copy that matches GoDigital's warm boutique tone:

**Pillar 1 — "Integridad profesional" → "Lo que prometemos, lo cumplimos"**
- Icon: `Sparkles` (Lucide) instead of green Check
- Title: "Lo que prometemos, lo cumplimos"
- Description: "Cada compromiso que asumimos tiene un nombre y una fecha de entrega."

**Pillar 2 — "Calidad de élite" → "Diseñadores y developers senior en cada proyecto"**
- Icon: `Sparkles`
- Title: "Diseñadores y developers senior en cada proyecto"
- Description: "No subcontratamos. Tu proyecto lo manejan personas con más de 5 años de experiencia."

**Pillar 3 — "Planificación estratégica" → "Roadmap claro, presupuesto sin sorpresas"**
- Icon: `Sparkles`
- Title: "Roadmap claro, presupuesto sin sorpresas"
- Description: "Antes de escribir una línea de código, sabes exactamente qué, cuándo y cuánto."

**Pillar 4 — "Soporte cercano" → "Una persona real responde tus mensajes"**
- Icon: `Sparkles`
- Title: "Una persona real responde tus mensajes"
- Description: "No chatbots. No colas de 48 horas. Una persona que conoce tu proyecto."

#### Scenario: pillars render in Spanish with boutique voice
Given the BoutiqueEdge section is rendered
When the 4 pillars are visible
Then all titles and descriptions are in Spanish
And the copy uses warm, human tone ("Lo que prometemos", "Una persona real")
And no corporate/cold phrasing remains ("Integridad profesional", "Calidad de élite")

### Requirement: BOUTIQUE_EDGE_SPARKLES_ICONS
Each pillar SHALL use the Lucide `Sparkles` icon instead of v2's green `Check` icon.

The icon is rendered as an inline SVG with `width: 24`, `height: 24`, and `color: var(--color-primary)` (Electric Blue) to give a "boutique sparkle" feel rather than a checklist feel.

```html
<div class="pillar-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
  </svg>
</div>
```

#### Scenario: Sparkles icons replace Check icons
Given the BoutiqueEdge section is rendered
When the pillar icons are inspected
Then each icon is a `Sparkles` icon from Lucide
And the icon color is Electric Blue (#0066ff)
And no green Check icons are present

### Requirement: BOUTIQUE_EDGE_LIQUID_GLASS_CARDS
The 4 pillars SHALL use `.liquid-glass` from the liquid-glass-system spec instead of v2's simple glass styling.

Each pillar card uses `.liquid-glass` class and the interior structure:

```html
<div class="boutique-pillar liquid-glass">
  <div class="pillar-icon">
    <!-- Sparkles SVG -->
  </div>
  <h3 class="pillar-title">Title text</h3>
  <p class="pillar-desc">Description text</p>
</div>
```

#### Scenario: pillars use liquid-glass treatment
Given the BoutiqueEdge section is rendered
When the 4 pillars are visible
Then each pillar uses the `.liquid-glass` class
And each has the gradient border via `::before` pseudo-element
And the backdrop blur creates the premium glassmorphism effect

### Requirement: BOUTIQUE_EDGE_CLIP_PATH_REVEAL
The BoutiqueEdge section SHALL preserve the GSAP clip-path reveal from left (`clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)`) for the pillar content on scroll into view.

The reveal is triggered by ScrollTrigger with `start: 'top 80%'` and `duration: 0.8` with `power3.out` easing.

#### Scenario: pillars reveal left-to-right on scroll
Given the user scrolls to the BoutiqueEdge section
When the section top reaches 80% of viewport height
Then each pillar's content reveals from left to right over 0.8s
And the reveal uses clip-path animation
And the Sparkles icon pops in with an elastic effect (scale 0 → 1.2 → 1)

### Requirement: CONTENT_REDISTRIBUTION_QUALITY_ASSURANCE_ADDED
The QualityAssurance section (from the quality-assurance-section spec) SHALL be added to the page between Process and CTASection.

The section order in `index.astro` is:

```
Hero → Services → BoutiqueEdge → Process → QualityAssurance → CTASection → Footer
```

The Navbar link list SHALL include "Calidad" pointing to `#quality-assurance`.

#### Scenario: QualityAssurance section appears in page order
Given the page is fully loaded
When the user scrolls from Process to CTASection
Then the QualityAssurance section is visible between them
And the Navbar has a "Calidad" link that scrolls to `#quality-assurance`
And all section transitions (including QualityAssurance → CTASection) trigger the curtain transition

### Requirement: BOUTIQUE_EDGE_LIGHT_MODE_OUT_OF_SCOPE
Light mode styling for BoutiqueEdge is out of scope for v3. The section renders only in dark mode. Future light mode changes will update the section's color tokens.

#### Scenario: section renders in dark mode only
Given the page is rendered in dark mode
When the BoutiqueEdge section is visible
Then all pillar backgrounds use the obsidian/glass dark palette
And no light-mode overrides are applied
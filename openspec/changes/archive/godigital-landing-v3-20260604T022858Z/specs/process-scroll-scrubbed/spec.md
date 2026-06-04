# Spec: process-scroll-scrubbed

> **Modified**: 2026-06-04

## Purpose

The Process section renders a vertical timeline with 5 steps (fixing v2's bug where only 4 were rendered) tied to scroll position. Each step's circle rotates as the user scrolls, and the step text reveals word-by-word as the circle passes 25% rotation. The steps are data-driven in Astro frontmatter. This spec supersedes the v2 `process-scroll-scrubbed` spec with the 5-step fix and word-by-word reveal.

Ref: Proposal §What Changes · §Capabilities (process-scroll-scrubbed, modified)

## MODIFIED Requirements

> **Modified**: 2026-06-04

### Requirement: PROCESS_5_STEPS_DATA
The Process section SHALL define a data array of exactly 5 steps in `Process.astro` frontmatter:

```typescript
const steps = [
  {
    number: 1,
    title: 'Descubrimiento',
    words: ['Escuchamos', 'tu idea,', 'entendemos', 'tus objetivos.']
  },
  {
    number: 2,
    title: 'Estrategia',
    words: ['Mapeamos', 'el camino', 'para', 'llegar ahí.']
  },
  {
    number: 3,
    title: 'Diseño',
    words: ['Traducimos', 'visión', 'en', 'experiencias.']
  },
  {
    number: 4,
    title: 'Desarrollo',
    words: ['Construimos', 'con precisión,', 'intentamos', 'por minuto.']
  },
  {
    number: 5,
    title: 'Iteramos',
    words: ['Tu feedback', 'mejora', 'el resultado', 'final.']
  }
];
```

#### Scenario: renders exactly 5 steps
Given the Process section is rendered
When the DOM is inspected
Then there are exactly 5 `.process-step` elements
And step 5 has title "Iteramos"
And all 5 steps are visible in the timeline

### Requirement: PROCESS_TIMELINE_STRUCTURE
The timeline structure uses a vertical line with circles for each step:

```html
<div class="process-timeline">
  <div class="timeline-line"></div>
  <!-- 5 steps -->
  <div class="process-step" data-step="1">
    <div class="step-circle">
      <span class="step-number">1</span>
    </div>
    <div class="step-content">
      <h3 class="step-title">Descubrimiento</h3>
      <p class="step-words">
        <span class="word">Escuchamos</span>
        <span class="word">tu idea,</span>
        <!-- ... -->
      </p>
    </div>
  </div>
  <!-- repeat for all 5 steps -->
</div>
```

The `.timeline-line` is a vertical line that scales from `scaleY: 0` to `scaleY: 1` as the user scrolls through the section.

#### Scenario: timeline structure renders for 5 steps
Given the Process section is rendered
When inspected
Then the `.timeline-line` vertical line is present
And all 5 `.process-step` elements are in the DOM
And each step has a `.step-circle` with its number

### Requirement: PROCESS_WORD_BY_WORD_REVEAL
Each step's text SHALL reveal word-by-word, tied to the circle's rotation position:

The word `.word` elements start with `opacity: 0.2` and transition to `opacity: 1` as the circle rotation passes 25% for each word.

The GSAP timeline scrubs the step's circle rotation from 0° to 360° as the user scrolls through the section. Each word's opacity is tied to the circle's rotation:

- Word 1: opacity 0.2 → 1 when circle rotation is at 0°–25%
- Word 2: opacity 0.2 → 1 when circle rotation is at 25%–50%
- Word 3: opacity 0.2 → 1 when circle rotation is at 50%–75%
- Word 4: opacity 0.2 → 1 when circle rotation is at 75%–100%

```javascript
// In process.ts
steps.forEach((step, i) => {
  const words = step.querySelectorAll('.word');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: step,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  });

  // Circle rotation tied to scroll
  tl.to(circle, { rotation: 360, ease: 'none' });

  // Word reveals tied to rotation thresholds
  words.forEach((word, wi) => {
    const startRotation = wi * 90; // 0, 90, 180, 270
    tl.to(word, { opacity: 1, ease: 'power2.out' }, startRotation);
  });
});
```

#### Scenario: word-by-word reveal fires as user scrolls
Given the user scrolls to a specific step in the Process section
When the circle for that step rotates from 0° to 360°
Then each word's opacity increases from 0.2 to 1 as the rotation passes each 25% threshold
And the reveal is smooth and tied to scroll position (not time-based)

### Requirement: PROCESS_CIRCLE_ROTATION_SCRUB
Each step's circle SHALL rotate 360° as the user scrolls through that step's section of the page.

The circle has `transform-origin: center` and the rotation is driven by GSAP ScrollTrigger `scrub: 1` for smooth 1:1 scroll-to-rotation mapping.

#### Scenario: circles rotate in sync with scroll
Given the user is scrolling through the Process section
When the user scrolls 100px
Then the active step's circle rotates approximately 36° (100px × 0.36°/px, calibrated to section height)
And the rotation is smooth with no jumping

### Requirement: PROCESS_SCROLL_SCRUBBE Timeline_SYNC
The timeline line (`scaleY: 0 → 1`) is driven by the combined scroll position through all 5 steps. The line fills as the user scrolls through the entire Process section.

#### Scenario: timeline line fills as user scrolls through all steps
Given the user starts at the top of the Process section
When the user scrolls to the bottom of the Process section
Then the `.timeline-line` element's `scaleY` animates from 0 to 1
And the line "draws" vertically as the user progresses through all 5 steps

### Requirement: PROCESS_MOBILE_FALLBACK
On mobile (<769px), the circle rotation and word-by-word reveal are disabled. Each step's words are shown at full opacity immediately. The vertical line still scales on scroll, but the circle rotation is CSS-only (no GSAP).

#### Scenario: mobile shows all words immediately without rotation
Given a viewport of 375px (mobile)
When the Process section renders
Then all words in all steps are at `opacity: 1` (no staggered reveal)
And the circle rotation animation does not run
And the timeline line still draws on scroll

### Requirement: PROCESS_SPANISH_COPY
All step titles and words SHALL be in Spanish to match GoDigital's brand voice.

The 5 titles in order: "Descubrimiento", "Estrategia", "Diseño", "Desarrollo", "Iteramos".

The 5th step "Iteramos" is key — it emphasizes GoDigital's iterative approach (we don't just deliver, we iterate based on feedback).

#### Scenario: 5th step 'Iteramos' is present and in Spanish
Given the Process section is rendered
When inspected
Then step 5's title reads "Iteramos"
And the words for step 5 are "Tu feedback mejora el resultado final." in Spanish
And the iterative philosophy is communicated through the step name and copy
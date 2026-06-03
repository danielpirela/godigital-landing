# Content Redistribution V2

## Purpose

Content Redistribution V2 captures all copy, content structure, and informational changes across the 6 sections per the v1→v2 content table in the proposal. Key changes: BoutiqueEdge grows from 3 to 4 pillars (adds "Soporte post-lanzamiento"), Hero gains a stat badge, Services reorders cards and adds subtitles, Process gets stronger verb copy, CTA adds scroll-scrubbed counters, Footer adds social placeholder rows. This capability defines the content contract without specifying visual design.

Ref: Proposal §Content Redistribution table · §Capabilities (content-redistribution-v2)

## Requirements

### Requirement: BOUTIQUEDGE_FOUR_PILLARS
The BoutiqueEdge section SHALL render exactly 4 pillars: Integridad, Calidez, Planificación, and Soporte post-lanzamiento.

The "Soporte post-lanzamiento" pillar SHALL describe "60 días de garantía post-lanzamiento" and use the mmx-generated icon `assets/generated/icons/soporte.png` with `data-mmx-generated="soporte-icon"`.

The other three pillars use mmx or Lucide icons: Integridad (shield-check, mmx: integridad-icon), Calidez (heart), Planificación (calendar).

#### Scenario: BoutiqueEdge shows 4 pillars
Given the BoutiqueEdge section renders
When the section is visible
Then exactly 4 pillar cards are displayed
And the fourth pillar reads "Soporte post-lanzamiento"
And its icon is the headphones support icon

### Requirement: HERO_STAT_BADGE
The Hero section SHALL display a stat badge reading "10+ proyectos entregados" as a pill-shaped badge with `class="stat-badge"`.

The badge content SHALL use a scroll-scrubbed counter (see cinematic-hero / HERO_STAT_BADGE_COUNTER).

The badge SHALL appear below the Hero tagline and above the CTA button.

#### Scenario: Stat badge renders with counter
Given the Hero section is visible
When the Hero enters the viewport
Then the badge displays "0+ proyectos entregados"
And the counter animates to "10+ proyectos entregados" over 1.5 seconds

### Requirement: SERVICES_CARD_REORDER
The Services section SHALL display 4 cards in this order: UX/UI (first), Web Dev (second), Mobile (third), SEO (fourth).

Each card SHALL include a subtitle:
- UX/UI: "Diseño centrado en el usuario"
- Web Dev: " stack moderno y escalable"
- Mobile: "Apps nativas e híbridas"
- SEO: "Visibilidad en buscadores"

#### Scenario: Services cards in correct order with subtitles
Given the Services section renders
When the 4 cards are visible
Then card 1 is UX/UI with subtitle "Diseño centrado en el usuario"
And card 2 is Web Dev with subtitle "stack moderno y escalable"
And card 3 is Mobile with subtitle "Apps nativas e híbridas"
And card 4 is SEO with subtitle "Visibilidad en buscadores"

### Requirement: PROCESS_STRONGER_VERB_COPY
The Process section SHALL use outcome-framing verbs in step descriptions. Each step description SHALL start with a present-tense action verb in Spanish (e.g., "Diseñamos", "Construimos", "Lanzamos", "Evaluamos", "Iterationamos").

The 5 steps SHALL be:
1. "Diagnosticamos tu situación digital"
2. "Diseñamos la arquitectura de tu solución"
3. "Construimos con estándares boutique"
4. "Lanzamos con validación continua"
5. "Iterationamos según datos reales"

#### Scenario: Process steps use action verbs
Given the Process section renders
When the step descriptions are examined
Then step 1 begins with "Diagnosti..."
And step 5 begins with "Iterame..."
And all 5 steps are present

### Requirement: CTA_SCROLL_SCRUBBED_COUNTER
The CTA section SHALL display 3 scroll-scrubbed counters: "10+ proyectos", "5 años", "100% boutique".

Each counter SHALL animate from 0 to its target value when the CTA section enters the viewport, using `gsap.to()` with an object proxy and `onUpdate` callback.

The counter values SHALL use `textContent` on `<span class="counter">` elements within the CTA.

#### Scenario: CTA counters animate on section enter
Given the CTA section is below the fold
When the user scrolls it into view
Then counter 1 animates to "10+"
And counter 2 animates to "5"
And counter 3 animates to "100"
And all counters show their unit suffix ("proyectos", "años", "% boutique")

### Requirement: FOOTER_SOCIAL_PLACEHOLDERS
The Footer SHALL render a social row with placeholder links for: LinkedIn, Twitter/X, Instagram, GitHub.

Each placeholder link SHALL have `href="#"` and `data-todo="social-url"` and an `aria-label` describing the platform (e.g., `aria-label="LinkedIn (pendiente)"`).

No real URLs shall be hardcoded until the user provides them.

#### Scenario: Footer social row has placeholder links
Given the Footer section renders
When the social row is examined
Then 4 `<a>` elements exist with `href="#"` and `data-todo="social-url"`
And each has an `aria-label` with "(pendiente)" suffix
And the icons are rendered (even if links are inactive)
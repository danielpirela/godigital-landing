# Change: godigital-landing-v3 — Aura-inspired glassmorphism redesign

## Why

v2 (`godigital-landing-v2`, archived 2026-06-03) was technically ambitious but aesthetically flat. The implementation shipped cinematic-hero specs, sticky pin choreography, mmx-generated assets, curtain wipes, and a scroll-scrubbed timeline — but the visual outcome felt generic and underbaked. The user's verdict was unambiguous: **"no me gustó para nada el diseño"** ("I didn't like the design at all").

The user anchored v3 to Aura (a dark, glassy, cinematic reference) and gave two directives:

1. *"El glassmorphism oscuro con video de fondo de Aura, pero con la paleta azul/obsidiana de GoDigital"* — keep Aura's dark glassmorphism + fullscreen video, recolor to GoDigital Electric Blue #0066ff / Deep Obsidian #111417.
2. *"Haz una mezcla hermosa a tu criterio"* — synthesize freely; do not slavishly copy Aura.

Aura is the right anchor for GoDigital's positioning: dark, premium, cinematic glass fits a *boutique* B2B consultancy better than v2's flat mesh aesthetic. But the synthesis must keep GoDigital's voice (warm, boutique, Spanish-language) and reject Aura's product-launch tone (Apple-logo download, inbox mockup, cold SaaS voice). v3 ≠ Aura clone. v3 = Aura's visual language + GoDigital's editorial identity.

## What Changes

### Sections affected

- **Navbar** — full rewrite to macOS-strip dark style (40px thin translucent black bar with traffic-light dots), glass search affordance, blue-accent underline on active
- **Hero** — full rewrite: fullscreen video bg with obsidian-mesh poster, shimmery gradient headline (background-clip + noise filter), liquid-glass CTA, macOS-style menu strip overlay, stat counter preserved
- **Services** — 4 cards → liquid-glass cards with gradient border (mask-composite), parallax depth, updated icons, restored `subtitle` field rendering
- **BoutiqueEdge** — 4 pillars → glass pillars with gradient borders, clip-path reveal preserved
- **Process** — vertical timeline → scroll-scrubbed, **all 5 steps rendered** (current bug: only 4/5), word-by-word reveal tied to circle rotation per spec
- **CTASection** — glass card → watermark giant "GO DIGITAL" text behind card, glass pricing-style card with 3 tiers
- **NEW: QualityAssurance** — section present in PRD but missing from implementation. Renders between Process and CTASection. Glass cards showing QA process (revisión, integridad, soporte) reusing existing `integridad.png` / `soporte.png` icons
- **Footer** — glass treatment, gradient line drawn on scroll, refined social icons (replace placeholders)

### New infrastructure

- `.liquid-glass` CSS utility — `mask-composite: exclude` gradient border + 4px blur + 0.01 white base
- SVG `feTurbulence` noise filters (root + per-section variants) for metallic shimmer on text and watermark grain
- `.shiny-text` gradient utility — `background-clip: text` with linear gradient (#091020 → #0066ff → #4DA3FF → #0066ff)
- macOS-style thin dark strip pattern (40px, black/40, 12px blur, optional traffic-light dots)
- Watermark headline pattern (Anton or Plus Jakarta Sans 800, 9rem, filter:url(#noise), low opacity, absolute behind card)
- Reusable `<GlassCard>` Astro component (variant: `liquid` | `flat` | `frost`)

### Preserved

- GSAP sub-module architecture in `src/scripts/animations/`
- `getMotionContext()` 4-rule mobile/reduced-motion guard
- `magnetic.ts` with `(hover: hover) and (pointer: fine)` a11y guard
- `godigital:scroll` CustomEvent decoupling
- `SectionProgress`, `AudioToggle` (stub)
- All assets in `/assets/` and `/assets/generated/`
- `ENABLE_V2_ANIM` rollback safety flag

## Capabilities

> Contract with sdd-spec. Each item becomes a delta or new spec under `openspec/changes/godigital-landing-v3/`.

### New capabilities

- `liquid-glass-system` — `.liquid-glass` utility class, mask-composite gradient border, browser feature detection + fallback
- `shiny-gradient-text` — gradient text utility + noise filter overlay system
- `macos-strip-navbar` — macOS-style thin dark strip navigation pattern
- `watermark-headline` — giant filtered background text pattern (used in CTA)
- `quality-assurance-section` — NEW section content + component

### Modified capabilities

- `cinematic-hero` — extend with shiny headline, macOS strip overlay, liquid-glass CTA
- `services-sticky-pin` — replace sticky pin with liquid-glass cards (subtitles rendered)
- `process-scroll-scrubbed` — word-by-word reveal + 5th step fix
- `curtain-transitions` — extend with liquid-glass cross-section transitions
- `content-redistribution-v2` — add QualityAssurance to section order

## Impact

- **LOC**: ~800-1200 across CSS + components + small scripts additions
- **Files touched**: ~12 (global.css, 9 components, index.astro, 1 new component QualityAssurance.astro)
- **New files**: 1 (QualityAssurance.astro), 1 new section in scripts/animations
- **Breaking**: yes — visual identity fully replaced
- **Asset reuse**: existing video (`bg-animation.mp4` or `hero-loop.mp4`), all icons, all glass PNGs, all logos. **No new mmx generations** unless user asks

## Approach

Chained PRs (per orchestrator's `chained-pr` skill, LOC > 400):

1. **PR1 — Foundation** (~200 LOC): `.liquid-glass` utility + SVG `feTurbulence` noise filters + `.shiny-text` gradient utility + `@theme` token updates for glass tints. No visual change yet — unblocks the visual language.
2. **PR2 — Visual anchor** (~400 LOC): Hero + Navbar together. These define the page's first impression and the macOS strip. Both must ship together to be coherent.
3. **PR3 — Section rewrites** (~400 LOC): Services + BoutiqueEdge (glass card system) + Process (5 steps + word-by-word) + QualityAssurance (new). Reuses PR1's glass system heavily.
4. **PR4 — Finish** (~200 LOC): CTASection (watermark + pricing card) + Footer (glass treatment) + cross-section transitions + a11y pass + Lighthouse pass.

Why this order: foundation unblocks the visual language; Hero+Navbar set the aesthetic anchor; middle sections build on the glass system; polish PR ensures consistency and perf. This keeps each PR reviewable (<800 LOC) and avoids mid-stack half-migrated sections.

## Design Direction (Aura-meets-GoDigital synthesis)

- **Background**: keep obsidian #0c0c0c-ish (NOT pure black), subtle radial gradient mesh
- **Primary gradient text**: `linear-gradient(to right, #091020, #0066ff 25%, #4DA3FF 65%, #0066ff)` + SVG noise filter for metallic shimmer
- **Accent**: Electric Blue #0066ff replaces Aura's cyan throughout
- **Glass cards**: 0.01 white base + 4px blur + gradient border (45°→0% mask) via `mask-composite: exclude`
- **macOS strip**: 40px height, black/40 + 12px blur, traffic-light dots optional
- **Watermark**: Anton or Plus Jakarta Sans 800, 9rem, `filter:url(#noise)`, low opacity
- **No emoji, no playful elements** — GoDigital is B2B boutique
- **Honest typography**: Plus Jakarta Sans (headings) + Inter (body) — NOT Inter for everything like Aura
- **Reject Aura's inbox mockup** — replace with a "boutique web studio" credibility moment (project showcase, client logos, or code/design preview)
- **Reject Aura's Apple-logo download button** — replace with **"Hablemos"** (Spanish: "Let's talk") CTA that fits the GoDigital voice
- **Light mode stays as a future option** but v3 ships dark-first; **no light-mode rewrite** in this change

## Risks

- **LOC > 400** → chained PRs mandatory (orchestrator decision)
- **`mask-composite: exclude` has partial Safari support** → feature-detect via `@supports`, fall back to `border-image`
- **Video bg LCP on mobile** → keep desktop-only video with strong obsidian-mesh poster; mobile uses static fallback
- **`backdrop-filter` blur on iOS Safari** → preserve `-webkit-backdrop-filter` prefix on all glass utilities
- **Curtain overlay accumulation on HMR** → keep single-instance guard in `scroll.ts`
- **The "Aura × GoDigital" mix must NOT feel like a copy** — keep GoDigital's boutique warm voice (Spanish copy, B2B boutique), not Aura's cold-product voice
- **QualityAssurance new section** — adding a new anchor in Navbar + section order in `index.astro`; small risk of broken nav-active state
- **Process 5th step** — current template slice may have off-by-one; need spec verification before implementation

## Out of Scope

- **Light mode (Fluid Tech)** — future change
- **New pages** (about, contact form page) — current single-page focus
- **i18n / multi-language** — Spanish copy only
- **New design system extraction** — reuse existing CSS tokens
- **Audio / ambient sound** — already disabled in v2, leave stub
- **iPhone/device mockup** — never built, never asked again
- **mmx pipeline re-trigger** — reuse existing assets, no new generations unless user asks

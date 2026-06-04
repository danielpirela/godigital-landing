# Tasks: godigital-landing-v3

> Implementation plan for the Aura-inspired dark glassmorphism redesign.
> 4 chained PRs, ~1250 LOC total. Read `proposal.md` and `design.md` first.

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1250 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR1 (Foundation) → PR2 (Visual Anchor) → PR3 (Section Rewrites) → PR4 (Finish) |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Design system + glass utilities (no visual change) | PR1 | Foundation layer — verify with astro check |
| 2 | Navbar macOS strip + Hero shiny text (aesthetic anchor) | PR2 | Visual anchor — user judges first |
| 3 | Services + BoutiqueEdge + Process fix + QualityAssurance (all glass) | PR3 | Core sections — verify all 5 steps render |
| 4 | CTASection watermark + Footer glass + curtain + glass.ts full | PR4 | Polish layer — Lighthouse pass |

---

## PR1 — Foundation (~200 LOC, 3 new + 2 modified)

**Goal**: Ship the design system layer (CSS tokens, glass utility, shiny text, macOS strip, watermark, curtain-radial, SVG filters, GlassCard component) WITHOUT any visible component change. Every section looks identical to v2 after this PR.

### Tasks

- [ ] **1.1** Add v3 `@theme` tokens to `src/styles/global.css` inside the existing `@theme {}` block: `--color-glass-accent-bg`, `--color-glass-accent-border`, `--color-glass-soft-bg`, `--color-glass-soft-border`, `--color-glass-strong-bg`, `--gradient-shiny`, `--gradient-shiny-size`, `--font-watermark`, `--watermark-size-desktop`, `--watermark-size-mobile`, `--watermark-line-height`, `--watermark-tracking`, `--macos-strip-height`, `--macos-strip-bg`, `--macos-strip-blur`, `--macos-strip-color`, `--macos-strip-color-muted`, `--macos-strip-font`, `--macos-strip-font-size`, `--macos-dot-size`, `--macos-dot-red`, `--macos-dot-yellow`, `--macos-dot-green`. Per design.md §2.1.
  - Files: `src/styles/global.css`

- [ ] **1.2** Append `.liquid-glass`, `.liquid-glass::before`, `.liquid-glass--soft`, `.liquid-glass--strong`, `.liquid-glass--accent`, and `@supports not ((-webkit-mask-composite: xor) or (mask-composite: exclude))` fallback with `border: 1px solid` to `src/styles/global.css`. Per design.md §2.2. The `::before` uses `padding: 1.4px` and the gradient runs top-to-bottom (180deg) with `mask-composite: exclude`.
  - Files: `src/styles/global.css`

- [ ] **1.3** Append `.shiny-text`, `.animate-shiny`, `@keyframes shiny`, and `@media (prefers-reduced-motion: reduce)` rule to `src/styles/global.css`. Per design.md §2.3. The keyframe runs 6s linear from `-200%` to `200%` center. The `.shiny-text` uses `background-size: var(--gradient-shiny-size)` and `filter: url(#shiny-noise)`.
  - Files: `src/styles/global.css`

- [ ] **1.4** Append `.c3-watermark-container`, `.c3-watermark-main`, `.c3-watermark-line-1` (white), `.c3-watermark-line-2` (gradient via `background-clip: text`), and the `max-width: 1024px` mobile override (font-size collapses to `--watermark-size-mobile`, filter disabled, gradient replaced with flat `#4DA3FF`) to `src/styles/global.css`. Per design.md §2.4.
  - Files: `src/styles/global.css`

- [ ] **1.5** Append `.macos-strip`, `.macos-strip__dots`, `.macos-strip__dot--red/yellow/green`, `.macos-strip__wordmark`, `.macos-strip__meta`, `.macos-strip.is-visible`, and the `max-width: 768px` mobile-hide rule to `src/styles/global.css`. Per design.md §2.5. The `.is-visible` state restores opacity and transform.
  - Files: `src/styles/global.css`

- [ ] **1.6** Append `.curtain-radial` and `.curtain-radial.is-active` to `src/styles/global.css`. Per design.md §5.3. The curtain is `position: fixed; inset: 0` with `background: radial-gradient(circle at 50% 50%, rgba(0,102,255,0.4) 0%, rgba(0,102,255,0.1) 30%, transparent 60%)`, `z-index: 90`, `mix-blend-mode: screen`, `opacity: 0` default, `opacity: 1` when `.is-active`.
  - Files: `src/styles/global.css`

- [ ] **1.7** Add the inline `<svg width="0" height="0" style="position: absolute" aria-hidden="true">` with `<defs>` containing `#shiny-noise` (fractalNoise baseFrequency 0.9, numOctaves 2, feColorMatrix alpha 0.35, multiply blend) and `#c3-noise` (fractalNoise baseFrequency 0.5, feComponentTransfer slope 0.075, overlay blend) as the first child of `<body>` in `src/layouts/Layout.astro`. Per design.md §3.
  - Files: `src/layouts/Layout.astro`

- [ ] **1.8** Create `src/components/GlassCard.astro` with Props interface (`variant?: 'default'|'soft'|'strong'|'accent'`, `padding?: 'none'|'sm'|'md'|'lg'`, `interactive?: boolean`, `as?: 'div'|'article'|'section'`, `class?: string`, `id?: string`), renders the tag with `data-liquid-glass` attribute, padding classes map to `0/16px/24px/40px`, interactive adds `liquid-glass--interactive` class. Per design.md §4.
  - Files: `src/components/GlassCard.astro` (new)

- [ ] **1.9** Create `src/scripts/animations/glass.ts` as a STUB that exports `initGlass()` doing only `console.info('[godigital] glass module ready')`. Real implementation in PR4.
  - Files: `src/scripts/animations/glass.ts` (new)

- [ ] **1.10** Modify `src/scripts/animations/index.ts` to import `{ initGlass }` from `./glass` and call `initGlass()` after `initMagnetic()`. The stub log is fine for PR1.
  - Files: `src/scripts/animations/index.ts`

### Verify (PR1)
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] Dev server boots, all sections render identical to v2 (no visible regression)
- [ ] `document.querySelectorAll('[data-liquid-glass]')` returns 0 (no component uses it yet) — expected
- [ ] `.liquid-glass` class exists in compiled CSS
- [ ] `#shiny-noise` and `#c3-noise` SVG filters are in the rendered DOM (check Layout.astro source)
- [ ] `.macos-strip`, `.c3-watermark-*`, `.curtain-radial` classes all exist in compiled CSS

---

## PR2 — Visual Anchor (~350 LOC, 0 new + 3 modified)

**Goal**: Ship the macOS-strip Navbar and the rewritten Hero. This is the aesthetic anchor the user will judge first. The shiny "experiencias" text, the liquid-glass CTAs, the 3-metric stat, and the macOS strip are the proof that the design language works.

### Tasks

- [ ] **2.1** Full rewrite of `src/components/Navbar.astro`: Add a `<div class="macos-strip" data-macos-strip>` as the first child inside the existing `<nav>` container with `position: absolute; top: 0`. The strip contains: left zone with 3 traffic-light dots (`.macos-strip__dot--red/yellow/green`), center zone with "GoDigital" wordmark, right zone with `<time class="strip-time">` that shows `Buenos Aires, HH:MM` in Argentine Spanish (es-AR locale). Per design.md §6.1. Strip uses `z-index: 30`, `height: var(--macos-strip-height)`, `backdrop-filter: blur(var(--macos-strip-blur))`. Mobile hidden via `.md:hidden` (existing pattern, 768px breakpoint).
  - Files: `src/components/Navbar.astro`

- [ ] **2.2** Modify `src/components/Navbar.astro` to add a `<script>` block (inline at end of component) that sets `--strip-time` CSS var on the strip and updates it every 60s using `Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })`. The strip's right zone shows `${formattedTime} · Buenos Aires`. On mount: set immediately, then every 60000ms. Per design.md §6.1 and macos-strip-navbar spec.
  - Files: `src/components/Navbar.astro`

- [ ] **2.3** Modify `src/components/Navbar.astro` to bump the existing desktop navbar padding from `pt-6` to `pt-10` (and any equivalent in the existing component) so the navbar content clears the 40px macOS strip. Mobile keeps the original padding. Per design.md §6.1.
  - Files: `src/components/Navbar.astro`

- [ ] **2.4** Full rewrite of `src/components/Hero.astro`. New structure: `.macos-strip` slot (absolutely positioned, top 0, full-width), `<video>` with desktop-only `<source media="(min-width: 769px)" src="assets/generated/hero-loop.mp4" type="video/mp4">`, poster `assets/generated/bg/obsidian-mesh.png`, `autoplay muted loop playsinline`, hero overlay div, 2 ambient orbs (`.ambient-orb--1` and `--2`, not 3), hero content with `<h1 class="hero__headline">` containing three spans: "Convertimos ideas en", `<span class="shiny-text animate-shiny" data-hero-shimmer>experiencias</span>`, "digitales". Sub paragraph: "Una consultora boutique que diseña, desarrolla y mantiene productos web con criterio." CTAs row: primary "Ver proyectos" with `.liquid-glass.liquid-glass--accent magnetic-btn`, ghost "Hablemos →" with `.liquid-glass.hero-cta-outline magnetic-btn`. 3-metric stat row with "5+ años", "30+ proyectos", "98% satisfacción" separated by vertical dividers. Per design.md §6.2 and cinematic-hero spec.
  - Files: `src/components/Hero.astro`

- [ ] **2.5** Add `data-hero-shimmer` to the `.shiny-text` span, `data-hero-headline` to the h1, `data-hero-sub` to the sub paragraph, `data-hero-ctas` to the CTA row div, `data-hero-stats` to the stats row ul, `data-hero-video` to the video element so `hero.ts` can target these precisely. Per design.md §6.2.
  - Files: `src/components/Hero.astro`

- [ ] **2.6** Modify `src/scripts/animations/hero.ts` to add two new animations on the hero load timeline: `macos-strip-in` (target `.macos-strip`, `opacity: 0→1, translateY: -10→0`, 0.5s ease-out, delay 0.3s) and `hero-shimmer` (target `[data-hero-shimmer]`, `opacity: 0→1`, 0.4s, delay 0.4s — the CSS keyframe handles the gradient movement). Update the existing timeline to sequence: macos-strip-in (0.3s) → headline fade-in (0.4s) → shimmer → sub fade-in (0.5s) → CTAs fade-in (0.6s) → stats fade-in (0.7s) → ambient orbs parallax start. Per design.md §6.2.
  - Files: `src/scripts/animations/hero.ts`

- [ ] **2.7** Add GSAP `clip-path` reveal to the hero headline: `fromTo(clipPath: 'inset(0 100% 0 0)', 'inset(0 0% 0 0)')` with `duration: 1.2` and `ease: 'expo.out'` on the h1 element. This preserves v2's entrance effect. Per cinematic-hero spec requirement HERO_CLIP_PATH_TAGLINE_REVEAL.
  - Files: `src/scripts/animations/hero.ts`

### Verify (PR2)
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] Dev server: Navbar shows macOS strip with 3 desaturated dots, "GoDigital" centered, live time/date updating every minute
- [ ] Dev server: Hero headline shows "experiencias" with moving gradient + noise grain; "Convertimos ideas en" and "digitales" are plain white
- [ ] Dev server: Hero CTAs render as liquid-glass with visible gradient border; "Ver proyectos" is blue-tinted, "Hablemos" is outline
- [ ] Dev server: 3-metric stat row below CTAs, separated by vertical dividers
- [ ] Dev server: 2 ambient orbs visible (not 3) with parallax on scroll
- [ ] Dev server: macOS strip slides in on load (GSAP timeline)
- [ ] Mobile (375px): macOS strip hidden, navbar keeps original mobile menu
- [ ] `prefers-reduced-motion: reduce`: shiny animation disabled (text shows static gradient)
- [ ] Services, BoutiqueEdge, Process, CTASection, Footer look identical to v2 (no regression)

---

## PR3 — Section Rewrites (~450 LOC, 2 new + 7 modified)

**Goal**: Replace Services + BoutiqueEdge + Process with liquid-glass versions, fix the v2 Process 5-step bug, and ship the new QualityAssurance section.

### Tasks

- [x] **3.1** Modify `src/components/Services.astro`: Wrap each of the 4 service cards in `<GlassCard variant="default" padding="lg" interactive as="article">`. Use depth variants per services-sticky-pin spec: card 1 default, card 2 soft, card 3 strong, card 4 accent. Add the subtitle field rendering that v2 missed: below the card title, render `<p class="service-subtitle" style="font-size: 14px; opacity: 0.6; color: var(--color-on-surface-variant);">${service.subtitle}</p>`. Icons use existing `assets/generated/icons/{ux-ui,web,mobile,seo}.png`. Per design.md §6.3 and services-sticky-pin spec.
  - Files: `src/components/Services.astro`

- [x] **3.2** Modify `src/scripts/animations/services.ts` to REPLACE the sticky-pin + multi-vector entrance with a simple stagger fade-up using the `glass.ts` pattern: each card `gsap.fromTo({ opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1 })`, `duration: 0.8`, `stagger: 0.15`, `ease: 'power3.out'`, `ScrollTrigger({ trigger: card, start: 'top 85%', once: true })`. Remove any `pin: true` ScrollTrigger config. Per design.md §6.3 and services-sticky-pin spec requirement SERVICES_STICKY_PIN_DESKTOP_ONLY.
  - Files: `src/scripts/animations/services.ts`

- [x] **3.3** Modify `src/components/BoutiqueEdge.astro`: (a) Replace the green check circle with inline `<svg class="pillar-icon" ...>` using the Sparkles icon from content-redistribution-v2 spec (Lucide path d). (b) Rewrite the 4 pillars' title + body copy in warm boutique Spanish per content-redistribution-v2 spec: Pillar 1 "Lo que prometemos, lo cumplimos" / "Cada compromiso que asumimos tiene un nombre y una fecha de entrega." Pillar 2 "Diseñadores y developers senior en cada proyecto" / "No subcontratamos. Tu proyecto lo manejan personas con más de 5 años de experiencia." Pillar 3 "Roadmap claro, presupuesto sin sorpresas" / "Antes de escribir una línea de código, sabes exactamente qué, cuándo y cuánto." Pillar 4 "Una persona real responde tus mensajes" / "No chatbots. No colas de 48 horas. Una persona que conoce tu proyecto." (c) Wrap each pillar in `<GlassCard variant="soft" padding="md">`. (d) Keep 4-column grid on `lg:`, 2-col on `md:`, 1-col on mobile. Per design.md §6.4.
  - Files: `src/components/BoutiqueEdge.astro`

- [x] **3.4** Modify `src/scripts/animations/boutique.ts` (if it exists) or add to `BoutiqueEdge.astro`'s inline `<script>`: preserve the clip-path reveal (`inset(0 100% 0 0)` → `inset(0 0% 0 0)`, `duration: 0.8`, `ease: 'power3.out'`). Use `Sparkles` icon pop-in: scale 0 → 1.2 → 1 with elastic ease. Per content-redistribution-v2 spec requirement BOUTIQUE_EDGE_CLIP_PATH_REVEAL.
  - Files: `src/components/BoutiqueEdge.astro`

- [x] **3.5** Modify `src/components/Process.astro`: Replace the template-slice bug with an explicit 5-step data array in frontmatter. Each step: `{ number, title, words[] }`. Steps: 1: Descubrimiento / ["Escuchamos", "tu idea,", "entendemos", "tus objetivos."]; 2: Estrategia / ["Mapeamos", "el camino", "para", "llegar ahí."]; 3: Diseño / ["Traducimos", "visión", "en", "experiencias."]; 4: Desarrollo / ["Construimos", "con precisión,", "intentamos", "por minuto."]; 5: Iteramos / ["Tu feedback", "mejora", "el resultado", "final."]. Render each description word wrapped in `<span class="process-word" data-word-index="N">`. Each step container has `--word-progress: 0` CSS custom property. Per design.md §6.5 and process-scroll-scrubbed spec.
  - Files: `src/components/Process.astro`

- [x] **3.6** Modify `src/scripts/animations/process.ts` to: (a) preserve the existing timeline line `scaleY: 0→1` driven by a main ScrollTrigger on the section. (b) Add per-step ScrollTrigger that reads the line progress (0→1) and distributes it across words: for each word at index `i`, set `--word-progress` to `clamp((globalProgress * totalWords) - i, 0, 1)`. (c) Add CSS to `Process.astro` or `global.css` so `.process-word` uses `opacity: calc(0.2 + 0.8 * var(--word-progress, 0))`. The circle rotation per step is driven by the main scroll position. Per design.md §6.5 and process-scroll-scrubbed spec.
  - Files: `src/scripts/animations/process.ts`, `src/components/Process.astro` (add `<style>` for .process-word rule)

- [x] **3.7** Create `src/components/QualityAssurance.astro`. Section with `id="quality-assurance"`, `background: radial-gradient(circle at 50% 0%, rgba(0,102,255,0.06) 0%, transparent 60%)`, `padding: 120px var(--gutter)`. Heading "Calidad sin atajos" in Plus Jakarta Sans 800, `clamp(2.5rem, 5vw, 5rem)`, centered, with `<span class="shiny-text">` (static, NOT animated). Sub: "Cuatro pilares que sostienen cada entrega" in Inter 18px, opacity 0.6, centered, `margin-bottom: 64px`. 4 pillars in 2×2 grid on `md:`, 1-col on mobile. Each pillar is a `<GlassCard variant="default" padding="lg" interactive>` with icon (Users / TestTube2 / Gauge / BookOpen from lucide-react at 24px), title in Plus Jakarta Sans 600 20px, description in Inter 14px 70% opacity. Per design.md §6.6 and quality-assurance-section spec.
  - Files: `src/components/QualityAssurance.astro` (new)

- [x] **3.8** Create `src/scripts/animations/quality.ts` exporting `initQuality()`. Uses `gsap.fromTo` on each `.qa-pillar` (or `[data-liquid-glass]` cards in QA section) with `opacity: 0→1`, `y: 40→0`, `duration: 0.8`, `stagger: 0.15`, `ease: 'cubic-bezier(0.22, 1, 0.36, 1)'`, `ScrollTrigger({ trigger: '#quality-assurance', start: 'top 80%', once: true })`. Per design.md §5.4 table.
  - Files: `src/scripts/animations/quality.ts` (new)

- [x] **3.9** Modify `src/scripts/animations/index.ts` to import `{ initQuality }` from `./quality` and call `initQuality()` after `initCTA()`. Per design.md §5.1.
  - Files: `src/scripts/animations/index.ts`

- [x] **3.10** Modify `src/pages/index.astro` to: (a) add import `{ QualityAssurance }` from `../components/QualityAssurance.astro`; (b) insert `<QualityAssurance />` between `<Process />` and `<CTASection />` in the `<main>` block. Per design.md §6.6.
  - Files: `src/pages/index.astro`

- [x] **3.11** Modify `src/components/Navbar.astro` to add "Calidad" to the nav links list between the current items and "Contacto". Anchor: `#quality-assurance`. Per content-redistribution-v2 spec requirement CONTENT_REDISTRIBUTION_QUALITY_ASSURANCE_ADDED.
  - Files: `src/components/Navbar.astro`

### Verify (PR3)
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] Dev server: Services renders 4 cards in liquid-glass with visible gradient border, subtitle visible below each title, depth variants applied
- [ ] Dev server: BoutiqueEdge renders 4 pillars in warm boutique Spanish with Sparkles icons (not green checks), in liquid-glass soft cards
- [ ] Dev server: Process renders exactly 5 steps, "Iteramos" is the 5th, words fade from opacity 0.2→1 as user scrolls through the section
- [ ] Dev server: QualityAssurance is visible between Process and CTASection, 4 pillars in 2×2 grid on desktop, 1-col on mobile, heading "Calidad sin atajos" has static gradient
- [ ] Dev server: Navbar "Calidad" link scrolls to `#quality-assurance`
- [ ] `prefers-reduced-motion: reduce`: all animations stop, layout intact
- [ ] CTASection and Footer look identical to v2 (no regression)
- [ ] No console errors in dev server

---

## PR4 — Finish (~250 LOC, 0 new + 4 modified)

**Goal**: Ship the CTASection watermark, the Footer glass treatment, the multi-section curtain, and the full `glass.ts` implementation.

### Tasks

- [ ] **4.1** Modify `src/components/CTASection.astro` to add the watermark BEHIND the CTA card. Add `.c3-watermark-container` as a sibling before the CTA card with `position: relative; z-index: 2; pointer-events: none`. Inside: `.c3-watermark-main` with `.c3-watermark-line-1` "Diseñamos." (white, `#ffffff`) and `.c3-watermark-line-2` (gradient via `background-clip: text`, static). The CTA card sits at `position: relative; z-index: 3`. Per design.md §6.7 and watermark-headline spec.
  - Files: `src/components/CTASection.astro`

- [ ] **4.2** Modify `src/components/CTASection.astro` to replace the existing single CTA with a 3-tier glass pricing card: wrap in `<GlassCard variant="strong" padding="lg" as="section">`. Three tiers: "Consulta inicial" (free, 30 min, no button), "Proyecto típico" (placeholder price "$X.XXX ARS", small descriptive CTA), "A medida" (Hablemos button using `.liquid-glass.liquid-glass--accent`). Each tier is an inner card with heading (Inter 500 14px), price or CTA, and 4 bullet points. "Hablemos" on Pro tier is the primary CTA. Per design.md §6.7.
  - Files: `src/components/CTASection.astro`

- [ ] **4.3** Modify `src/scripts/animations/cta.ts` to add `watermark-parallax`: a ScrollTrigger on the watermark container that scrubs `translateY: 0→-40px` as the user scrolls past the section (`scrub: 1`). Also add a stagger entrance for the 3 tier cards: `gsap.fromTo` each with `opacity: 0→1`, `y: 20→0`, `stagger: 0.15`, `ease: 'power3.out'`, triggered when `#cta` top hits 75%. Per design.md §6.7.
  - Files: `src/scripts/animations/cta.ts`

- [ ] **4.4** Modify `src/components/Footer.astro`: (a) Wrap each of the 4 columns in `<GlassCard variant="soft" padding="md">`. (b) Add a top `gradient-line` 1px using `linear-gradient(90deg, transparent, var(--color-primary), transparent)`. (c) Replace social icons with lucide-react `Github`, `Linkedin`, `Mail` at 32px circles, hover background `var(--color-glass-bg-hover)`. (d) Update bottom row to "© 2026 GoDigital · Buenos Aires, Argentina · Hecho con criterio". Per design.md §6.8.
  - Files: `src/components/Footer.astro`

- [ ] **4.5** Modify `src/scripts/animations/scroll.ts` to: (a) add `ensureCurtain()` singleton guard at top of file: `let curtainEl: HTMLElement | null = null; function ensureCurtain(): HTMLElement { if (curtainEl && document.body.contains(curtainEl)) return curtainEl; ... createElement('div'), className = 'curtain-radial', setAttribute aria-hidden, append to body ... }`. (b) REPLACE the single Services→BoutiqueEdge curtain trigger with 5 triggers for all section pairs: hero→services (from `#hero` bottom 60% to `#servicios` top 40%), services→boutique, boutique→process, process→quality, quality→cta. Each trigger adds/removes `.is-active` on the curtain element. Per design.md §5.3 and curtain-transitions spec. Mobile disable via matchMedia check.
  - Files: `src/scripts/animations/scroll.ts`

- [ ] **4.6** Replace the stub in `src/scripts/animations/glass.ts` with the full implementation: query `document.querySelectorAll<HTMLElement>('[data-liquid-glass]')`, `gsap.fromTo` each with `opacity: 0→1, y: 30→0, scale: 0.97→1`, `duration: 0.8`, `ease: 'power3.out'`, `ScrollTrigger({ trigger: card, start: 'top 85%', once: true })`. Honor `getMotionContext()` null check. Per design.md §5.2.
  - Files: `src/scripts/animations/glass.ts`

- [ ] **4.7** Add `-webkit-backdrop-filter` prefix to all glass utilities in `global.css` that have `backdrop-filter` (already done for `.liquid-glass` in PR1; verify `.glass-card` variants also have the prefix for iOS Safari). Per risks noted in design.md §8.
  - Files: `src/styles/global.css`

### Verify (PR4)
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] Dev server: CTASection shows watermark "Diseñamos. / Construimos." BEHIND the 3-tier glass card with subtle parallax on scroll
- [ ] Dev server: 3 tiers render in Spanish with "Consulta inicial" (free), "Proyecto típico" (placeholder), "A medida" (Hablemos button)
- [ ] Dev server: Footer columns are in soft glass cards, top gradient line visible, social icons are lucide (Github, Linkedin, Mail) and hover correctly
- [ ] Dev server: Scroll between sections triggers the radial curtain (visible blue glow flash) at every transition (5 triggers total)
- [ ] Dev server: All glass cards animate in with fade-up + scale on scroll
- [ ] Lighthouse desktop (built site): performance ≥ 90, a11y ≥ 95
- [ ] Manual review in Chrome 120+, Firefox 120+, Safari 16.4+: no broken layout, no missing fonts, all glass cards have gradient border (or 1px border fallback in Safari < 16)
- [ ] `prefers-reduced-motion: reduce`: all animations stop, layout intact, curtain disabled
- [ ] Mobile (375px width): all sections stack correctly, macOS strip hidden, watermark collapses to 3.5rem, glass cards stack
- [ ] No console errors in any of the above

---

## Out of Scope (reaffirmed)
- Light mode (Fluid Tech) — future change
- i18n / multi-language — Spanish only (es-AR)
- New pages (`/about`, `/contact`, etc.) — single-page focus
- Audio / ambient sound — `AudioToggle.astro` stub stays as-is
- iPhone / device mockup — explicitly rejected
- mmx pipeline re-trigger — no new asset generations
- New design system extraction — primitives stay in `global.css` + `<GlassCard>`

## Risks (reaffirmed)
- `mask-composite: exclude` Safari < 16 partial → `@supports` fallback to `border: 1px solid rgba(255,255,255,0.15)` (accent: `rgba(0,102,255,0.4)`)
- Video bg LCP on mobile → desktop-only `<source media>` preserved from v2
- `backdrop-filter` on iOS Safari → `-webkit-backdrop-filter` prefix on all glass utilities (PR4 task 4.7)
- HMR curtain accumulation → singleton guard `ensureCurtain()` in `scroll.ts` (PR4 task 4.5)
- Process 5-step bug → explicit 5-element data array in PR3, not template slice
- sdd-design sub-agent failed twice → wrote design.md inline; apply phase must verify design.md exists and is current before starting

## Design Doc Discrepancy Notes (apply phase recovery)

If apply phase finds inconsistencies between design.md and specs, the design.md is authoritative per SDD contract (written as orchestrator fallback). Key conflicts already resolved:
1. `liquid-glass` background: design.md §2.2 uses `rgba(255,255,255,0.01)` (not spec's `rgba(8,10,16,0.55)`) — use design.md
2. `mask-composite` fallback: design.md §2.2 uses `border: 1px solid` (not spec's `border-image`) — use design.md
3. `GlassCard` padding: design.md §4 uses `none=0, sm=16px, md=24px, lg=40px` — spec says `sm=16px, md=24px, lg=32px`; use design.md (40px for lg)
4. Process step copy: design.md §6.5 uses different words than process-scroll-scrubbed spec; use design.md (authoritative)
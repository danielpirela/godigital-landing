# Design: godigital-landing-v3 — Aura-inspired glassmorphism redesign

> Master design document for the 10 specs in this change. One file, one architecture, four chained PRs.

---

## 1. Architecture Overview

v3 replaces the v2 cinematic-but-flat aesthetic with an **Aura-inspired dark glassmorphism system** recolored to GoDigital's Electric Blue + Deep Obsidian palette. The visual language is built on three reusable patterns that every section will compose: **liquid-glass cards** (`.liquid-glass` with gradient border via `mask-composite: exclude`), **shimmery gradient text** (`.shiny-text` with SVG noise filter), and the **macOS-strip navbar** (thin dark glass bar above Hero). A new `QualityAssurance` section fills the gap left by v2.

Section flow (top to bottom in `index.astro`):

```
┌─────────────────────────────────────────────────┐
│ Navbar (macOS strip + existing Navbar.astro)    │  ← sticky, z-50
├─────────────────────────────────────────────────┤
│ Hero                                            │  ← fullscreen video bg, shiny "experiencias"
│  ├─ macOS-strip (40px)                          │
│  ├─ ambient-orb ×2 (CSS radial-gradient)        │
│  ├─ Hero headline (PJS 800, gradient text)      │
│  ├─ CTA row (liquid-glass: Ver proyectos, ...) │
│  └─ 3-metric stat (5+ años, 30+ proyectos, ...)│
├─────────────────────────────────────────────────┤
│ Services (4 liquid-glass cards, 2×2 / 1-col)   │  ← curtain transition in
│  ├─ Subtitle restored (v2 bug fix)              │
│  └─ Multi-vector entrance (stagger)             │
├─────────────────────────────────────────────────┤
│ BoutiqueEdge (4 pillars, liquid-glass + Sparkles)│ ← curtain transition in
├─────────────────────────────────────────────────┤
│ Process (5-step timeline, scrubbed + word-by-word)│ ← curtain transition in
│  └─ "Iteramos" as 5th step (v2 bug fix)        │
├─────────────────────────────────────────────────┤
│ QualityAssurance (NEW) (4 pillars, liquid-glass)│  ← curtain transition in
│  ├─ Users / TestTube2 / Gauge / BookOpen icons  │
│  └─ Spanish "Calidad sin atajos"               │
├─────────────────────────────────────────────────┤
│ CTASection (watermark + glass pricing-style)    │  ← curtain transition in
│  ├─ watermark: "Diseñamos. / Construimos."     │
│  └─ 3-tier card (Hablemos CTA)                  │
├─────────────────────────────────────────────────┤
│ Footer (glass treatment, gradient line)         │
└─────────────────────────────────────────────────┘
```

**New files**:
- `src/components/GlassCard.astro` — reusable card primitive
- `src/components/QualityAssurance.astro` — new section
- `src/scripts/animations/glass.ts` — liquid-glass entrance stagger

**Modified files**:
- `src/styles/global.css` — add `@theme` tokens + new utility classes
- `src/layouts/Layout.astro` — inline SVG with `<defs>` for noise filters
- `src/components/Navbar.astro` — add macOS strip slot at top
- `src/components/Hero.astro` + `src/scripts/animations/hero.ts` — full rewrite
- `src/components/Services.astro` + `src/scripts/animations/services.ts` — liquid-glass
- `src/components/BoutiqueEdge.astro` — Spanish copy + Sparkles icon
- `src/components/Process.astro` + `src/scripts/animations/process.ts` — 5 steps, word-by-word
- `src/components/CTASection.astro` + `src/scripts/animations/cta.ts` — watermark + glass card
- `src/components/Footer.astro` — glass treatment
- `src/scripts/animations/scroll.ts` — curtain fires between ALL section pairs
- `src/scripts/animations/index.ts` — register new `glass.ts` module
- `src/pages/index.astro` — insert `<QualityAssurance />` between `<Process />` and `<CTASection />`

---

## 2. CSS Foundation (additions to `src/styles/global.css`)

### 2.1 New `@theme` tokens (add to existing `@theme {}` block)

```css
/* ── v3: Liquid Glass tints ── */
--color-glass-accent-bg: rgba(0, 102, 255, 0.04);
--color-glass-accent-border: rgba(0, 102, 255, 0.18);
--color-glass-soft-bg: rgba(255, 255, 255, 0.015);
--color-glass-soft-border: rgba(255, 255, 255, 0.06);
--color-glass-strong-bg: rgba(8, 10, 16, 0.7);

/* ── v3: Shiny gradient stops ── */
--gradient-shiny: linear-gradient(
  to right,
  #091020 0%,
  #0066ff 25%,
  #4DA3FF 50%,
  #0066ff 75%,
  #091020 100%
);
--gradient-shiny-size: 200% auto;

/* ── v3: Watermark text ── */
--font-watermark: 'Plus Jakarta Sans', system-ui, sans-serif;
--watermark-size-desktop: 9rem;
--watermark-size-mobile: 3.5rem;
--watermark-line-height: 0.9;
--watermark-tracking: -0.05em;

/* ── v3: macOS strip ── */
--macos-strip-height: 40px;
--macos-strip-bg: rgba(0, 0, 0, 0.4);
--macos-strip-blur: 12px;
--macos-strip-color: rgba(255, 255, 255, 0.85);
--macos-strip-color-muted: rgba(255, 255, 255, 0.5);
--macos-strip-font: 'Inter', system-ui, sans-serif;
--macos-strip-font-size: 11px;
--macos-dot-size: 12px;
--macos-dot-red: rgba(255, 95, 87, 0.6);
--macos-dot-yellow: rgba(254, 188, 46, 0.6);
--macos-dot-green: rgba(40, 200, 64, 0.6);
```

### 2.2 `.liquid-glass` utility (NEW — append after `.glass-card-depth-3`)

```css
/* ── v3: Liquid Glass — gradient border via mask-composite ── */
.liquid-glass {
  position: relative;
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass--soft {
  background: var(--color-glass-soft-bg);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06);
}

.liquid-glass--soft::before {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.25) 100%
  );
}

.liquid-glass--strong {
  background: var(--color-glass-strong-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.liquid-glass--accent {
  background: var(--color-glass-accent-bg);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(0, 102, 255, 0.12);
}

.liquid-glass--accent::before {
  background: linear-gradient(
    180deg,
    rgba(0, 102, 255, 0.55) 0%,
    rgba(0, 102, 255, 0.2) 50%,
    rgba(0, 102, 255, 0.55) 100%
  );
}

/* Safari fallback: when mask-composite is unsupported, use border-image */
@supports not ((-webkit-mask-composite: xor) or (mask-composite: exclude)) {
  .liquid-glass,
  .liquid-glass--soft,
  .liquid-glass--strong,
  .liquid-glass--accent {
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  .liquid-glass--accent {
    border-color: rgba(0, 102, 255, 0.4);
  }
}

.liquid-glass[hidden] { display: none; }
```

### 2.3 `.shiny-text` and `.animate-shiny` (NEW)

```css
/* ── v3: Shimmery gradient text ── */
.shiny-text {
  background: var(--gradient-shiny);
  background-size: var(--gradient-shiny-size);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  filter: url(#shiny-noise);
  display: inline-block;
}

.animate-shiny {
  animation: shiny 6s linear infinite;
}

@keyframes shiny {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-shiny { animation: none; }
}
```

### 2.4 `.c3-watermark-*` (NEW)

```css
/* ── v3: Watermark headline (giant filtered text behind cards) ── */
.c3-watermark-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  text-align: center;
  margin-top: 40px;
  z-index: 2;
  pointer-events: none;
}

.c3-watermark-main {
  font-family: var(--font-watermark);
  font-size: var(--watermark-size-desktop);
  font-weight: 800;
  line-height: var(--watermark-line-height);
  letter-spacing: var(--watermark-tracking);
  filter: url(#c3-noise);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c3-watermark-line-1 { color: #fff; }
.c3-watermark-line-2 {
  background: linear-gradient(
    to right,
    #091020 0%,
    #0066ff 25%,
    #4DA3FF 65%,
    #0066ff 100%
  );
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@media (max-width: 1024px) {
  .c3-watermark-main {
    font-size: var(--watermark-size-mobile);
    filter: none;
  }
  .c3-watermark-line-2 {
    background: none;
    -webkit-text-fill-color: #4DA3FF;
    color: #4DA3FF;
  }
}
```

### 2.5 `.macos-strip-*` (NEW)

```css
/* ── v3: macOS-style thin dark strip at top of Hero ── */
.macos-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--macos-strip-height);
  background: var(--macos-strip-bg);
  backdrop-filter: blur(var(--macos-strip-blur));
  -webkit-backdrop-filter: blur(var(--macos-strip-blur));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 30;
  font-family: var(--macos-strip-font);
  font-size: var(--macos-strip-font-size);
  color: var(--macos-strip-color);
  opacity: 0;
  transform: translateY(-10px);
  will-change: opacity, transform;
}

.macos-strip.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s var(--ease-cinematic), transform 0.5s var(--ease-cinematic);
}

.macos-strip__dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.macos-strip__dot {
  width: var(--macos-dot-size);
  height: var(--macos-dot-size);
  border-radius: 50%;
}
.macos-strip__dot--red    { background: var(--macos-dot-red); }
.macos-strip__dot--yellow { background: var(--macos-dot-yellow); }
.macos-strip__dot--green  { background: var(--macos-dot-green); }

.macos-strip__wordmark {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.macos-strip__meta {
  color: var(--macos-strip-color-muted);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .macos-strip { display: none; }
}
```

### 2.6 `.glass-card` keeps working (do NOT remove)

The existing `.glass-card` class is preserved for backward compatibility. New components use `.liquid-glass` directly. The `<GlassCard>` Astro component composes `.liquid-glass` so consumers don't need to know about the class.

---

## 3. SVG Filter System

A single inline `<svg>` is added to `src/layouts/Layout.astro`, placed inside `<body>` as the first child, hidden with `aria-hidden="true"` and `display: none` on the wrapping element. All filters live in one `<defs>` block so they're globally referenceable via `filter: url(#id)`.

```html
<!-- in Layout.astro, immediately after <body> -->
<svg width="0" height="0" style="position: absolute" aria-hidden="true">
  <defs>
    <!-- For Hero headline "experiencias" and similar shiny text -->
    <filter id="shiny-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0
                                            0 0 0 0 0
                                            0 0 0 0 0
                                            0 0 0 0.35 0" />
      <feComposite in2="SourceGraphic" operator="in" result="noise" />
      <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
    </filter>

    <!-- For watermark headline (c3-watermark-main) — overlay blend, subtle -->
    <filter id="c3-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.075" />
      </feComponentTransfer>
      <feComposite in2="SourceGraphic" operator="in" result="noise" />
      <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
    </filter>
  </defs>
</svg>
```

---

## 4. `<GlassCard>` Astro Component

**Path**: `src/components/GlassCard.astro`

```astro
---
/**
 * GlassCard.astro — Reusable liquid-glass card primitive.
 *
 * Composes the .liquid-glass utility (gradient border via mask-composite,
 * Safari fallback via @supports) and the `--glass-blur` token system.
 *
 * Usage:
 *   <GlassCard variant="default" padding="md" interactive>
 *     <h3>Title</h3>
 *     <p>Body</p>
 *   </GlassCard>
 */
type GlassVariant = 'default' | 'soft' | 'strong' | 'accent';
type GlassPadding = 'none' | 'sm' | 'md' | 'lg';
type GlassTag = 'div' | 'article' | 'section';

interface Props {
  variant?: GlassVariant;
  padding?: GlassPadding;
  interactive?: boolean;
  as?: GlassTag;
  class?: string;
  id?: string;
}

const {
  variant = 'default',
  padding = 'md',
  interactive = false,
  as: Tag = 'div',
  class: className = '',
  id,
} = Astro.props;

const variantClass = variant === 'default' ? '' : `liquid-glass--${variant}`;
const paddingClass = `glass-pad--${padding}`;
const classes = [
  'liquid-glass',
  variantClass,
  paddingClass,
  interactive ? 'liquid-glass--interactive' : '',
  className,
]
  .filter(Boolean)
  .join(' ');
---

<Tag class={classes} id={id} data-liquid-glass>
  <slot />
</Tag>

<style>
  .glass-pad--none { padding: 0; }
  .glass-pad--sm   { padding: 16px; }
  .glass-pad--md   { padding: 24px; }
  .glass-pad--lg   { padding: 40px; }

  .liquid-glass--interactive {
    transition: transform 0.3s var(--ease-cinematic), box-shadow 0.3s var(--ease-cinematic);
  }
  .liquid-glass--interactive:hover {
    transform: translateY(-4px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.12);
  }

  @media (prefers-reduced-motion: reduce) {
    .liquid-glass--interactive { transition: none; }
  }
</style>
```

---

## 5. Animation Architecture

### 5.1 Reused infrastructure (do NOT break)

- `src/scripts/animations/index.ts` — orchestrator. Add `import { initGlass } from './glass';` and call `initGlass()` after `initMagnetic()`.
- `src/scripts/animations/matchMedia.ts` — `getMotionContext()` 4-rule guard. Untouched.
- `src/scripts/animations/magnetic.ts` — `gsap.quickTo` + `(hover: hover) and (pointer: fine)` guard. Untouched.
- `src/scripts/animations/scroll.ts` — `godigital:scroll` CustomEvent. The curtain section is modified (see 5.4).
- All `*.ts` animation modules return early if `__ENABLE_V2_ANIM__` is false or `getMotionContext()` returns null.

### 5.2 New module: `src/scripts/animations/glass.ts`

```ts
/**
 * glass.ts — Liquid-glass card entrance animations.
 *
 * Stagger fade-up + slight scale on every element with [data-liquid-glass]
 * when it enters the viewport. Honors getMotionContext() and reduced-motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGlass(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-liquid-glass]');
  if (!cards.length) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}
```

### 5.3 Modifications to `src/scripts/animations/scroll.ts`

The existing curtain (`curtain-wipe` class) is replaced with a radial reveal. Add a singleton guard to prevent HMR duplicates.

```ts
// at the top of scroll.ts
let curtainEl: HTMLElement | null = null;
function ensureCurtain(): HTMLElement {
  if (curtainEl && document.body.contains(curtainEl)) return curtainEl;
  curtainEl = document.createElement('div');
  curtainEl.className = 'curtain-radial';
  curtainEl.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtainEl);
  return curtainEl;
}

// Replace the single Services→BoutiqueEdge trigger with N triggers:
const sectionPairs = [
  { from: '#hero', to: '#services' },
  { from: '#services', to: '#boutique-edge' },
  { from: '#boutique-edge', to: '#process' },
  { from: '#process', to: '#quality-assurance' },
  { from: '#quality-assurance', to: '#cta' },
];
sectionPairs.forEach(({ from, to }) => {
  ScrollTrigger.create({
    trigger: from,
    start: 'bottom 60%',
    endTrigger: to,
    end: 'top 40%',
    onEnter: () => ensureCurtain().classList.add('is-active'),
    onLeaveBack: () => ensureCurtain().classList.remove('is-active'),
    once: false,
  });
});
```

Append this CSS to `global.css`:

```css
/* v3: radial curtain (replaces curtain-wipe) */
.curtain-radial {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 102, 255, 0.4) 0%,
    rgba(0, 102, 255, 0.1) 30%,
    transparent 60%
  );
  z-index: 90;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-curtain) var(--ease-cinematic);
  mix-blend-mode: screen;
}
.curtain-radial.is-active { opacity: 1; }
```

### 5.4 New animations list (where each lives)

| Animation | File | Trigger | Notes |
|---|---|---|---|
| `hero-shimmer` | `hero.ts` (modified) | Hero load, 0.4s delay | opacity 0→1 on the `.shiny-text` span, then the CSS keyframe `shiny` takes over |
| `macos-strip-in` | `hero.ts` (modified) | Hero load, 0.3s delay | adds `.is-visible` to `.macos-strip` |
| `glass-card-stagger` | `glass.ts` (NEW) | viewport enter | 0.8s, 0.97→1 scale, ease `power3.out` |
| `quality-grid-stagger` | `quality.ts` (NEW) | `#quality-assurance` enter | 4 cards, 0.15s stagger, ease cubic-bezier(0.22, 1, 0.36, 1) |
| `process-word-tied` | `process.ts` (modified) | scroll-scrub | each word fades 0→1 when its circle rotation hits 25% |
| `watermark-parallax` | `cta.ts` (modified) | scroll-scrub | watermark translateY 0→-40px across its section |

---

## 6. Per-Section Visual Treatment

### 6.1 Navbar (modified)

The existing `Navbar.astro` keeps its 3-state morph. A new `macos-strip` is rendered as the FIRST child inside the `<nav>` container, with `position: absolute; top: 0; left: 0; right: 0`. The Navbar then sits below the strip with extra `top` padding on desktop (`@media (min-width: 769px)`) so the two don't overlap.

- Traffic-light dots: 3 × 12px circles, desaturated to 60% opacity (`var(--macos-dot-*)`)
- Centered "GoDigital" wordmark in Inter 600
- Right-side time/date: `${hours}:${minutes} · Buenos Aires` (Argentine Spanish locale), updated every minute
- Mobile: hidden via existing `.md:hidden` pattern
- The strip is sticky within the Navbar's sticky container

### 6.2 Hero (full rewrite)

Skeleton:
```astro
<section id="hero" class="hero">
  <div class="macos-strip">{/* ... */}</div>
  <video class="hero__video" ... autoplay loop muted playsinline poster="/assets/generated/obsidian-mesh.png" />
  <div class="hero__overlay" />
  <div class="ambient-orb ambient-orb--1" aria-hidden="true" />
  <div class="ambient-orb ambient-orb--2" aria-hidden="true" />
  <div class="hero__content">
    <h1 class="hero__headline">
      <span>Convertimos ideas en</span>
      <span class="shiny-text animate-shiny">experiencias</span>
      <span>digitales</span>
    </h1>
    <p class="hero__sub">Una consultora boutique que diseña, desarrolla y mantiene productos web con criterio.</p>
    <div class="hero__ctas">
      <a class="cta cta--primary liquid-glass liquid-glass--accent">Ver proyectos</a>
      <a class="cta cta--ghost">Hablemos →</a>
    </div>
    <ul class="hero__stats">
      <li><strong>5+</strong> años</li>
      <li><strong>30+</strong> proyectos</li>
      <li><strong>98%</strong> satisfacción</li>
    </ul>
  </div>
</section>
```

- Background video: `/assets/generated/hero-loop.mp4` (cleaner mmx version), desktop-only via existing `<source media>` pattern, poster `/assets/generated/obsidian-mesh.png`
- 2 ambient orbs (down from 3), positioned top-left and bottom-right, opacity 0.6, parallax scrub via existing `hero.ts` ScrollTrigger
- Headline: Plus Jakarta Sans 800, `clamp(2.5rem, 7vw, 5.5rem)`, gradient stops 0% `#091020` → 30% `#0066ff` → 70% `#4DA3FF` → 100% `#0066ff`, `background-clip: text`, `filter: url(#shiny-noise)`
- The word "experiencias" gets `.shiny-text .animate-shiny` (animated gradient + noise filter)
- Sub: Inter 400, 1.125rem, `color: var(--color-on-surface-variant)`, max-w 600px
- CTAs row: gap 16px, primary uses `.liquid-glass.liquid-glass--accent`, ghost is plain text with right-arrow that translates 4px on hover
- 3-metric stat: Inter 600 for the number, Inter 400 muted for the label, separated by a 1px vertical divider (`rgba(255,255,255,0.1)`)
- Animation timeline: `macos-strip-in` (0.3s) → headline fade-in (0.4s) → sub fade-in (0.5s) → CTAs fade-in (0.6s) → stats fade-in (0.7s) → ambient orbs start parallax

### 6.3 Services (liquid-glass)

- 4 cards: UX/UI, Web Dev, Mobile, SEO — data already in frontmatter
- Each card: `<GlassCard variant="default" padding="lg" interactive>`
- Subtitle restored (v2 bug fix): below title, Inter 14px, opacity 0.6, color `var(--color-on-surface-variant)`
- Icons: keep existing `assets/generated/icons/{ux-ui,web,mobile,seo}.png`
- Layout: 2×2 grid on `lg:`, 1 column on mobile, `gap: 24px`
- Sticky pin behavior REMOVED (Aura's cards don't pin — they just enter). Replace with simple ScrollTrigger fade-up stagger via `glass.ts`
- Hover: existing `.liquid-glass--interactive` lift + 0.5× scale on the icon (via CSS)

### 6.4 BoutiqueEdge (4 pillars, liquid-glass + Sparkles)

- 4 pillars: keep the data, rewrite the copy in warm boutique Spanish:
  1. **"Lo que prometemos, lo cumplimos"** — *"Plazos y presupuestos cerrados por escrito. Sin sorpresas."*
  2. **"Equipo senior en cada proyecto"** — *"Diseñadores y developers con 5+ años de experiencia, no juniors aprendiendo con tu producto."*
  3. **"Roadmap claro desde el día uno"** — *"Sabés qué se entrega, cuándo, y por qué. Reuniones semanales de avance."*
  4. **"Una persona real responde"** — *"Canal directo con el equipo. Sin tickets, sin chatbot, sin esperas."*
- Each pillar: `<GlassCard variant="soft" padding="md">` wrapping a lucide-react `<Sparkles size={20} />` (replace the green Check), the title in Plus Jakarta Sans 600, the description in Inter 400 opacity 0.7
- Layout: 4-column grid on `lg:`, 2-col on `md:`, 1-col on mobile
- Stagger entrance via `glass.ts`

### 6.5 Process (5 steps, word-by-word, scrubbed)

- Data array: 5 steps (data, not template slice — explicit fix for the v2 bug):
  1. **Descubrimiento** — *"Entendemos tu negocio, audiencia y objetivos. Workshops, entrevistas, auditoría técnica."*
  2. **Estrategia** — *"Definimos el alcance, el roadmap y los criterios de éxito. Todo por escrito."*
  3. **Diseño** — *"Wireframes, prototipos visuales, design system. Iteramos con tu feedback."*
  4. **Desarrollo** — *"Código limpio, tipado, testeado. Deploys semanales para que veas progreso."*
  5. **Iteramos** — *"Lanzamos, medimos, mejoramos. El producto vive y crece con tu negocio."*
- Each step: circle (40px) on the left, vertical line connecting them. Step number inside the circle
- The line: SVG with `pathLength={1}` and `stroke-dashoffset` scrubbed by ScrollTrigger (existing pattern)
- Word-by-word: each word in the description is wrapped in `<span class="process-word" data-step-word="N">` where N is the word index. CSS opacity goes 0.2→1 driven by a CSS custom property `--word-progress` set by GSAP based on the line scrub (0→1). Implementation: a single ScrollTrigger on the line computes progress, divides by total words, and for each word, sets `--word-progress` to `clamp((globalProgress * totalWords) - i, 0, 1)`. Each word's CSS uses `opacity: calc(0.2 + 0.8 * var(--word-progress, 0))`.
- The 5th step "Iteramos" is the v2 fix — explicit in the data array

### 6.6 QualityAssurance (NEW)

- Section between `#process` and `#cta` in `index.astro`
- Background: subtle radial gradient `radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.06) 0%, transparent 60%)`
- Heading: "Calidad sin atajos" in Plus Jakarta Sans 800, `clamp(2.5rem, 6vw, 4.5rem)`, gradient text using `.shiny-text` (NOT animated — just the static gradient + noise filter, no keyframe). Centered, max-w 900px
- Sub: "Cuatro pilares que sostienen cada entrega" in Inter 18px, opacity 0.6
- 4 pillars in a 2×2 grid on `md:`, 1 column on mobile:
  1. **"Revisión por pares"** (Users icon) — *"Cada entregable pasa por dos ojos antes de salir del taller."*
  2. **"Tests automatizados"** (TestTube2 icon) — *"Cobertura >80% en lógica crítica. CI/CD en cada push."*
  3. **"Auditoría de performance"** (Gauge icon) — *"Lighthouse 90+ en cada deploy. Core Web Vitals vigilados."*
  4. **"Documentación viva"** (BookOpen icon) — *"Tu equipo entiende lo que recibe. Runbooks actualizados."*
- Each pillar: `<GlassCard variant="default" padding="lg" interactive>`
- Stagger: `quality-grid-stagger` (4 cards, 0.15s stagger, ease `cubic-bezier(0.22, 1, 0.36, 1)`)
- File: `src/components/QualityAssurance.astro` with its own `src/scripts/animations/quality.ts`

### 6.7 CTASection (watermark + glass card)

- Background: `var(--color-surface-dim)` with a soft radial blue glow at top
- Watermark BEHIND the CTA card (not above):
  ```astro
  <div class="c3-watermark-container">
    <div class="c3-watermark-main">
      <span class="c3-watermark-line-1">Diseñamos.</span>
      <span class="c3-watermark-line-2">Construimos.</span>
    </div>
  </div>
  ```
- The CTA card sits ABOVE the watermark (z-index higher) using `<GlassCard variant="strong" padding="lg" as="section">`
- Card content: 3-tier pricing-style row (Free / Standard / Pro) — keep this for credibility, fits GoDigital's "boutique" positioning better than a single CTA
  - **Free**: "Consulta inicial" — *Primeros 30 minutos sin costo. Conocemos tu proyecto, te decimos si podemos ayudar.*
  - **Standard**: "Proyecto típico" — *$X.XXX ARS* (placeholder, the user fills in real numbers) — *Sitio web institucional o landing page, 4-6 semanas, sin mantenimiento.*
  - **Pro**: "A medida" — *Hablemos* (CTA) — *E-commerce, SaaS, plataformas a medida. Roadmap y presupuesto a tu medida.*
- Each tier: small heading, price (or "Hablemos" button), 4-bullet list
- The "Hablemos" button on Pro tier is the primary CTA: `.liquid-glass.liquid-glass--accent`
- Watermark parallax: `watermark-parallax` from `cta.ts` scrubs the watermark translateY from 0 to -40px

### 6.8 Footer (glass treatment)

- Background: `var(--color-surface-dim)` with a top `gradient-line` (1px) in `linear-gradient(90deg, transparent, var(--color-primary), transparent)`
- 4-column grid on `lg:` (Logo + tagline, Links, Social, Legal), 2-col on `md:`, 1-col on mobile
- Each column in a `<GlassCard variant="soft" padding="md">`
- Logo: existing `logo-light.svg`, clip-path reveal on scroll (preserved)
- Social icons: lucide-react (`Github`, `Linkedin`, `Mail`), 32px circles, hover background `var(--color-glass-bg-hover)`
- Bottom row: `© 2026 GoDigital · Buenos Aires, Argentina · Hecho con criterio`

---

## 7. Chained PR Plan (4 PRs)

### PR1 — Foundation (~200 LOC, files: 3 new + 1 modified)

**File list**:
- MODIFIED: `src/styles/global.css` — add all v3 @theme tokens + `.liquid-glass` family + `.shiny-text` + `.animate-shiny` + `@keyframes shiny` + `.c3-watermark-*` + `.macos-strip-*` + `.curtain-radial`
- MODIFIED: `src/layouts/Layout.astro` — add inline `<svg>` with `#shiny-noise` and `#c3-noise` filters
- NEW: `src/components/GlassCard.astro` — reusable card primitive
- NEW: `src/scripts/animations/glass.ts` — empty stub that exports `initGlass` (just `console.info` for now, real implementation in PR3)
- MODIFIED: `src/scripts/animations/index.ts` — register `glass` module (just the import + call)

**What this PR does NOT change**: no component visual changes. All sections look identical to v2. This PR is purely the design system layer.

**Verify**: dev server boots, `pnpm astro check` passes, no visual regression in any section.

### PR2 — Visual Anchor (~350 LOC, files: 3 modified)

**File list**:
- MODIFIED: `src/components/Navbar.astro` — add `.macos-strip` slot as first child, time/date updater
- MODIFIED: `src/components/Hero.astro` — full rewrite: Spanish headline with `.shiny-text`, 2 orbs, liquid-glass CTAs, 3-metric stat
- MODIFIED: `src/scripts/animations/hero.ts` — add `macos-strip-in` and `hero-shimmer` animations
- NEW: no new files

**What this PR does NOT change**: Services, BoutiqueEdge, Process, QualityAssurance, CTASection, Footer keep v2 styling. Only Navbar + Hero change.

**Verify**: dev server, manual review of Navbar + Hero, `pnpm astro check` passes. The shimmery text renders, the macOS strip is visible, CTAs are liquid-glass.

### PR3 — Section Rewrites (~450 LOC, files: 5 modified + 1 new)

**File list**:
- MODIFIED: `src/components/Services.astro` — switch cards to `<GlassCard variant="default" padding="lg" interactive>`, restore subtitle rendering
- MODIFIED: `src/scripts/animations/services.ts` — replace sticky-pin with simple fade-up stagger
- MODIFIED: `src/components/BoutiqueEdge.astro` — Spanish boutique copy, lucide Sparkles replaces green Check, glass pillars
- MODIFIED: `src/components/Process.astro` — 5 steps in data array (explicit fix), word-by-word CSS scrub
- MODIFIED: `src/scripts/animations/process.ts` — word progress calc + CSS var injection
- NEW: `src/components/QualityAssurance.astro` — full new section
- NEW: `src/scripts/animations/quality.ts` — `quality-grid-stagger`
- MODIFIED: `src/pages/index.astro` — insert `<QualityAssurance />` between `<Process />` and `<CTASection />`

**What this PR does NOT change**: Navbar (already in PR2), Hero (already in PR2), CTASection, Footer.

**Verify**: dev server, manual review of Services + BoutiqueEdge + Process + QualityAssurance, all 4 sections render Spanish copy, QualityAssurance is between Process and CTASection, Process has 5 steps, "Iteramos" is the 5th.

### PR4 — Finish (~250 LOC, files: 4 modified)

**File list**:
- MODIFIED: `src/components/CTASection.astro` — watermark "Diseñamos. / Construimos." behind the glass pricing-style card with 3 tiers
- MODIFIED: `src/scripts/animations/cta.ts` — `watermark-parallax` + 3-tier card stagger
- MODIFIED: `src/components/Footer.astro` — glass treatment, gradient line, social icons
- MODIFIED: `src/scripts/animations/scroll.ts` — curtain fires between ALL 5 section pairs, singleton guard
- MODIFIED: `src/scripts/animations/glass.ts` — full implementation (was stub in PR1)

**What this PR does NOT change**: Navbar, Hero, Services, BoutiqueEdge, Process, QualityAssurance. The Polish layer.

**Verify**: dev server, full page review, curtain fires between every section, watermark is visible behind CTA, footer is glass, `pnpm build` succeeds, `pnpm astro check` passes, Lighthouse desktop score ≥ 90.

**Total**: ~1250 LOC across 4 PRs.

---

## 8. Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| `mask-composite: exclude` Safari < 16 partial support | Medium | `@supports not (...)` falls back to `border: 1px solid` |
| Video bg LCP on mobile hurts Lighthouse | High (preserved) | Desktop-only `<source media>` with strong obsidian-mesh poster |
| `backdrop-filter` on iOS Safari | Low | Preserve `-webkit-backdrop-filter` prefix throughout |
| HMR curtain accumulation on dev | Low | Singleton guard in `scroll.ts` (`ensureCurtain()` checks `document.body.contains`) |
| Process 5-step bug from v2 | Medium (fixed) | Explicit 5-element data array in PR3, NOT a template slice |
| Shiny text CSS animation + noise filter on iOS | Low | Reduced-motion media query disables animation; noise filter is a single SVG, no animation cost |
| PR1 ships with no visible change (might be hard to review) | Low | PR1 includes a "demo page" route or a single Hero line styled with `.shiny-text` for review purposes (optional, can be removed in PR2) |
| Glass card `data-liquid-glass` selector not found if component is server-only | Low | `initGlass()` is called on `DOMContentLoaded` via the existing `initAnimations()` flow |

---

## 9. Testing Strategy

No test runner is configured for this project (per `sdd-init` report: `strict_tdd: false`). Manual review is the verification path.

**Required checks before each PR merges**:
1. `pnpm astro check` — TypeScript and Astro errors
2. `pnpm build` — production build succeeds
3. Dev server boot — `pnpm dev` serves the page without console errors
4. Visual review in browser (Chrome 120+ for primary, Safari 16.4+ to test the mask-composite fallback path)
5. Mobile view (Chrome DevTools responsive) — verify the macOS strip hides, glass cards stack, watermark collapses

**After PR4**:
- Lighthouse desktop on the built site: target ≥ 90 performance, ≥ 95 a11y
- Lighthouse mobile: target ≥ 80 performance
- a11y: keyboard tab through Navbar, all CTAs focusable, `prefers-reduced-motion` honored
- Browser matrix: Chrome 120+, Firefox 120+, Safari 16.4+ (mask-composite), Edge 120+

**No automated visual regression** (no Playwright/Cypress in the project). Visual regressions are caught by human review of the PR diff and the dev server.

---

## 10. Out of Scope

- **Light mode (Fluid Tech)** — explicitly NOT in this change. The brand supports it per `IDENTITY.md`, but the v3 dark-first ship is the priority. Future change.
- **i18n / multi-language** — Spanish only (es-AR). The copy throughout is in boutique Spanish.
- **New pages** — no `/about`, `/contact`, `/services/[slug]`. Single-page focus.
- **Audio / ambient sound** — `AudioToggle.astro` stub stays as-is.
- **iPhone / device mockup** — explicitly rejected in the v2 archive. Not built.
- **mmx pipeline re-trigger** — no new generations. We reuse `assets/generated/hero-loop.mp4` and all existing icons/glass PNGs.
- **New design system extraction** — the liquid-glass primitives stay in `global.css` + `<GlassCard>`. No `@design-system/godigital` package.
- **Email capture / form backend** — the "Hablemos" CTA is a `mailto:` for now.

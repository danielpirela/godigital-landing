# Design: godigital-landing-v2 — Rompedora Redesign

## 1. Architecture Overview

### Component Tree

```
src/pages/index.astro
├── Layout.astro (meta, fonts, body shell)
├── SectionProgress.astro (NEW — scroll progress bar, z-200)
├── AudioToggle.astro (NEW — ambient audio control, z-50)
├── Navbar.astro (3-state morph: transparent→glassy→compact)
├── Hero.astro (mmx video bg, 3 parallax orbs, clip-tagline, floating iPhone, stat counter)
├── Services.astro (sticky pin, 4 multi-vector cards, mmx icons)
├── BoutiqueEdge.astro (curtain entry, 4 pillars, mmx icons)
├── Process.astro (scroll-scrubbed timeline, rotating circles, word-reveal)
├── CTASection.astro (breathing orbs, floating iPhone, scroll-scrubbed counters)
└── Footer.astro (gradient line draw, logo stroke, social placeholders)

src/scripts/animations/
├── index.ts           # initAnimations(), matchMedia orchestration, public API
├── hero.ts            # Hero timeline, parallax orbs, stat counter
├── services.ts        # Sticky pin + multi-vector card entrance
├── process.ts         # Scroll-scrubbed timeline, word-by-word reveal
├── scroll.ts          # ScrollTrigger instances for section titles, BoutiqueEdge, CTASection
├── matchMedia.ts      # All matchMedia rules (desktop/mobile/reduced-motion/fine-pointer)
├── magnetic.ts        # Magnetic hover + cursor-attracted orbs
└── particles.ts       # Particle system factory (count controlled via CSS var)

src/lib/
└── mmx-assets.ts      # getMmxAsset(id), hasFallback(id), MANIFEST.json reader

src/styles/global.css  # @theme tokens + v2 additions (mmx, curtain, glass depth, cinematic)
```

### Data Flow: mmx → DOM

```
assets/generated/MANIFEST.json
        │
        ▼
src/lib/mmx-assets.ts ──getMmxAsset(id)──▶ component data-mmx-generated="<id>"
        │                                        │
        ▼                                        ▼
  is_ready, fallback_src                   <img>/<video> with correct src
```

### Script Module Split

| Module | Responsibility | Import path |
|---|---|---|
| `index.ts` | Orchestrates matchMedia, calls sub-modules, exports `initAnimations()` | `src/scripts/animations/index.ts` |
| `hero.ts` | Hero timeline, clip-path reveal, stat counter proxy, parallax orb setup | `src/scripts/animations/hero.ts` |
| `services.ts` | Services sticky pin + multi-vector entrance | `src/scripts/animations/services.ts` |
| `process.ts` | Timeline scrub, circle rotation, word-by-word reveal | `src/scripts/animations/process.ts` |
| `scroll.ts` | Section title reveals, BoutiqueEdge slide-in, CTA fade-up | `src/scripts/animations/scroll.ts` |
| `matchMedia.ts` | Four context rules (desktop/mobile/reduced/fine-pointer) | `src/scripts/animations/matchMedia.ts` |
| `magnetic.ts` | quickTo instances for buttons and orbs | `src/scripts/animations/magnetic.ts` |
| `particles.ts` | Particle spawner reading `--particle-count` CSS var | `src/scripts/animations/particles.ts` |

### Build vs Runtime

- **Build time (astro build)**: `astro.config.mjs` validates MANIFEST.json schema, confirms all 14 asset paths exist. TypeScript types generated for MANIFEST.json via `src/lib/mmx-assets.ts` ambient declaration.
- **Runtime (browser)**: `src/scripts/animations/index.ts` imported via `<script>` in `index.astro`. All GSAP setup wrapped in `document.addEventListener('DOMContentLoaded', ...)`. Video/audio elements initialized after DOM ready.

---

## 2. mmx Asset Pipeline

### MANIFEST.json Schema

```json
[
  {
    "id": "hero-loop",
    "model": "Hailuo-2.3",
    "prompt": "cinematic dark obsidian mesh...",
    "seed": 1704067200,
    "timestamp": "2026-06-03T14:30:00Z",
    "quota_cost": 1,
    "file_path": "assets/generated/hero-loop.mp4"
  }
]
```

14 entries total (proposal §Asset Batch Plan). Committed as PR0 alongside binary files.

### `src/lib/mmx-assets.ts` Helper API

```typescript
export interface MmxAsset {
  id: string;
  src: string;          // primary path, e.g. "assets/generated/hero-loop.mp4"
  fallback_src: string; // fallback path or 'CSS' for pure-CSS fallbacks
  model: string;
  is_ready: boolean;    // false triggers fallback chain in components
}

export function getMmxAsset(id: string): MmxAsset {
  // reads MANIFEST.json at runtime (cached after first read)
  // returns is_ready: false if file doesn't exist on disk
}

export function hasFallback(id: string): boolean {
  return getMmxAsset(id).fallback_src !== undefined;
}
```

Fallback chain per asset ID:
- `hero-loop` → `assets/generated/bg/obsidian-mesh.png` (CSS gradient poster)
- `iphone-screen` → `assets/iphone-15-pro-marco.png` (static PNG)
- `curtain-video` → `'CSS'` (no file, CSS clip-path wipe used)
- `ambient-music` → `'SILENT'` (no src, audio element muted forever)
- `ux-ui-icon` / `web-icon` / `mobile-icon` / `seo-icon` / `integridad-icon` / `soporte-icon` → Lucide SVG inline

### Build-Time Validation Hook (`astro.config.mjs`)

```javascript
import { readFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  hooks: {
    'astro:build:start': () => {
      const manifest = JSON.parse(readFileSync('assets/generated/MANIFEST.json', 'utf-8'));
      for (const asset of manifest) {
        if (!existsSync(asset.file_path)) {
          console.warn(`[mmx-pipeline] Asset ${asset.id} missing at ${asset.file_path} — fallback will be used`);
        }
      }
    }
  }
});
```

### Runtime Fallback Chain

Components check `getMmxAsset(id).is_ready` before setting the `src`. If `false`, they use fallback. Components NEVER throw on missing assets — they always render something.

### `data-mmx-generated` Contract

Every `<img>`, `<video>`, or `<audio>` element that wraps a mmx asset carries `data-mmx-generated="<asset-id>"`. This enables QA inspection and prevents accidental asset drift. The attribute is set by the Astro component that owns the element, not by `mmx-assets.ts`.

---

## 3. Animation System

### Module Split

`animations.ts` (329-line monolith) refactored into 8 files under `src/scripts/animations/`. Sub-modules export setup functions that receive the GSAP/ScrollTrigger instances they need. The top-level `index.ts` orchestrates calls based on matchMedia contexts.

### `gsap.matchMedia()` Rules (4 contexts, priority order)

```typescript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: reduce)', (ctx) => {
  // CSS-only: set all animated elements opacity:1, visibility:visible
  // Skip ALL GSAP — no ScrollTrigger instances created
  // AudioToggle not rendered (handled in Astro component via env flag)
});

mm.add('(max-width: 768px)', (ctx) => {
  // parallax orbs: disabled (static)
  // sticky pins: disabled for all sections
  // particles: --particle-count = 10 (CSS var set here)
  // orb blur: --orb-blur = 40px
  // entrances: fade-up only (no clip-path, no multi-vector)
});

mm.add('(hover: hover) and (pointer: fine)', (ctx) => {
  // magnetic buttons: enabled (gsap.quickTo)
  // cursor-attracted orbs: enabled
  // Hamburger → X rotation: enabled
});

mm.add('(min-width: 769px)', (ctx) => {
  // Full choreography
  // parallax orbs: 0.3×/0.5×/0.7× Y translation on scroll
  // sticky pins: Services section pinned
  // particles: --particle-count = 35
  // orb blur: --orb-blur = 80px
  // multi-vector card entrance: left/right/bottom/scale
  // clip-path reveals: enabled
});
```

### `revealTimeline(sectionId, childSpecs)` Factory

```typescript
interface RevealOpts {
  stagger?: number;   // default 0.1
  duration?: number;  // default 0.8
  ease?: string;       // default 'power3.out'
  start?: string;      // default 'top 80%'
  clip?: boolean;      // default false — enables clip-path reveal
}

function revealTimeline(sectionId: string, children: string[], opts: RevealOpts): GSAPTimeline {
  const tl = gsap.timeline({ scrollTrigger: { trigger: sectionId, start: opts.start } });
  children.forEach((selector, i) => {
    if (opts.clip) {
      tl.fromTo(selector,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: opts.duration, ease: opts.ease },
        i * opts.stagger
      );
    } else {
      tl.from(selector, { y: 40, opacity: 0, duration: opts.duration, ease: opts.ease }, i * opts.stagger);
    }
  });
  return tl;
}
```

### ScrollTrigger Pin Strategy for Services

```typescript
// services.ts
ScrollTrigger.create({
  trigger: '#services',
  start: 'top top',
  end: '+=600',  // pin for 600px of scroll
  pin: true,
  pinSpacing: true,
});
// Cards animate during the pin window via timeline nested inside pin
const tl = gsap.timeline({ scrollTrigger: { trigger: '#services', start: 'top top', end: '+=600' } });
tl.from('.service-card-1', { x: -80, opacity: 0 }, 0)
  .from('.service-card-2', { x: 80, opacity: 0 }, 0.15)
  .from('.service-card-3', { y: 60, opacity: 0 }, 0.30)
  .from('.service-card-4', { scale: 0.8, opacity: 0 }, 0.45);
```

On mobile (`max-width: 768px`): pin disabled, all cards fade-up with stagger.

---

## 4. Asset Loading

### Hero Video

```html
<video
  autoplay muted loop playsinline
  preload="metadata"
  poster="assets/generated/bg/obsidian-mesh.png"
  data-mmx-generated="hero-loop"
  class="absolute inset-0 w-full h-full object-cover"
  style="z-index: 0;"
>
  <source src="assets/generated/hero-loop.mp4" type="video/mp4" media="(min-width: 769px)" />
  <!-- No mobile source: poster-only on mobile, bandwidth safe -->
</video>
```

`preload="metadata"` ensures fast LCP via poster preload. No `<source>` for 720p variant needed per proposal (poster handles mobile visually).

### iPhone Screen Video

Same pattern: `<video autoplay muted loop playsinline preload="metadata">` using `assets/generated/iphone-screen.mp4`. Fallback: static `assets/iphone-15-pro-marco.png` rendered in `<img>` if `getMmxAsset('iphone-screen').is_ready === false`.

### Images

```html
<img
  src="assets/generated/icons/ux-ui.png"
  data-mmx-generated="ux-ui-icon"
  alt="Icono de UX/UI"
  loading="lazy"
  decoding="async"
  width="64"
  height="64"
  class="w-16 h-16 object-contain"
/>
```

Explicit `width`/`height` on all images: CLS < 0.1. `loading="lazy"` + `decoding="async"` for below-fold images.

### Curtain Video

```html
<video
  id="curtain-video"
  autoplay muted loop
  preload="none"
  data-mmx-generated="curtain-video"
  class="fixed inset-0 w-full h-full object-cover pointer-events-none"
  style="z-index: 100; display: none;"
  aria-hidden="true"
>
  <source src="assets/generated/curtain.mp4" type="video/mp4" />
</video>
```

`preload="none"`: curtain is transition-gated, not preloaded. Displayed only when CSS class `.curtain-active` is applied during section transitions.

### Audio

```html
<audio
  id="ambient-audio"
  loop
  preload="none"
  data-mmx-generated="ambient-music"
  aria-hidden="true"
></audio>
```

User-gated: `muted` attribute present by default, `play()` called only on AudioToggle click.

---

## 5. Design Tokens (v2 Additions)

### mmx Asset References

```css
--mmx-asset-hero-video: url('/assets/generated/hero-loop.mp4');
--mmx-asset-iphone-video: url('/assets/generated/iphone-screen.mp4');
--mmx-asset-curtain-video: url('/assets/generated/curtain.mp4');
--mmx-poster-blur: 8px;  /* CSS blur on poster while video buffers */
```

### Color & Visual

```css
--electric-blue-rgb: 0, 102, 255;
--color-orb-attract: rgba(0, 102, 255, 0.04);
--color-curtain: rgba(0, 102, 255, 0.95);
--glass-blur: 24px;      /* desktop */
--glass-blur-mobile: 12px; /* mobile, iOS perf */
```

### Glass Depth (Services cards)

```css
--shadow-glass-depth-1: 0 8px 32px rgba(0,0,0,0.25);
--shadow-glass-depth-2: 0 16px 48px rgba(0,0,0,0.35);
--shadow-glass-depth-3: 0 24px 64px rgba(0,0,0,0.45);
--glass-card-depth-1: glass-card, shadow-glass-depth-1;
--glass-card-depth-2: glass-card, shadow-glass-depth-2;
--glass-card-depth-3: glass-card, shadow-glass-depth-3;
```

### Cinematic Motion

```css
--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);  /* expo out, softer */
--duration-cinematic: 1.2s;
--ease-clip-reveal: cubic-bezier(0.76, 0, 0.24, 1); /* custom clip ease */
--section-vertical-rhythm: 120px;
```

### Curtain Wipe

```css
.curtain-wipe {
  position: fixed;
  inset: 0;
  background: var(--color-curtain);
  z-index: 100;
  pointer-events: none;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--duration-curtain, var(--ease-cinematic));
}
```

---

## 6. Component-Level Design

### Navbar.astro

**DOM**: `<nav class="navbar">` with logo, desktop links (hidden md:flex), hamburger (md:hidden), mobile menu overlay.

**GSAP targets**: `.navbar` — backgroundColor/borderBottom scrubbed on scroll (3-state: transparent→30% glass→85% glass). Hamburger spans: rotate 45°/-45°/scaleX 0 on toggle. Progress bar inside navbar top.

**Timeline**: `initNavbarAnimation()` runs on DOMContentLoaded. GSAP `scrub: 0.3` for smooth follow. Logo color shifts via CSS class `.navbar.scrolled` applied by ScrollTrigger.

**mmx assets**: None.

**Mobile**: Glass blur 12px (vs 24px desktop). Hamburger rotation preserved. No sticky behavior.

**A11y**: `aria-expanded` on hamburger. `aria-current="section"` on active link. Keyboard navigable. Focus trap in mobile menu.

---

### Hero.astro

**DOM**: Full-bleed `<section id="hero">` containing: `<video>` bg layer, 3 `.ambient-orb` parallax divs, `.hero-particles` container, logo, `.hero-tagline` h1, subtitle, CTA row, scroll indicator. iPhone floating mockup (inside CTA section per proposal, not Hero — moving to CTASection per spec).

**GSAP targets**: `.hero-logo` (scale 0.7→1, back.out 1.7), `.hero-tagline` (clipPath inset reveal), `.hero-subtitle` (y:20→0, opacity), `.hero-cta a` (stagger fade-in). Orbs: `gsap.to(orb, { y: -80, scrollTrigger: { scrub: 1 } })`. Stat badge counter via object proxy.

**Timeline**: Sequential — logo → tagline clip → subtitle → CTA → scroll bounce.

**mmx assets**: `data-mmx-generated="hero-loop"` on video, `data-mmx-generated="iphone-screen"` on iPhone screen video, poster `data-mmx-generated="obsidian-mesh"`.

**Mobile**: Video poster only (no video src for mobile per spec). Parallax orbs disabled. Clip-path reveal still runs. Reduced particle count (10).

**A11y**: `aria-label` on video element. Decorative video `aria-hidden="true"`. Real text content not canvas.

---

### Services.astro

**DOM**: `<section id="services">` containing `.services-title`, 4 `.service-card` with `data-depth` attribute, mmx icons in each card.

**GSAP targets**: `.service-card` — left/right/bottom/scale entrance vectors via `x`, `y`, `scale` from/to. Sticky pin container.

**Timeline**: Pinned timeline — title visible while 4 cards animate in sequence (0, 0.15, 0.30, 0.45s offsets).

**mmx assets**: `data-mmx-generated="ux-ui-icon"`, `data-mmx-generated="web-icon"`, `data-mmx-generated="mobile-icon"`, `data-mmx-generated="seo-icon"` on icon images. Fallback to Lucide inline SVG if `is_ready === false`.

**Mobile**: No pin. Cards fade-up (y: 40→0, stagger 0.15). Blur reduced to 40px. Depth glass preserved but animation simplified.

**A11y**: `role="list"` on card container. Icon `alt` text describing service type.

---

### BoutiqueEdge.astro

**DOM**: `<section id="boutique-edge">` with 4 `.edge-card` (Integridad, Calidez, Planificación, Soporte). Icon + title + description per card. Green check `.edge-check` pop animation on enter.

**GSAP targets**: `.edge-card` (x: -60→0, stagger 0.2). `.edge-check` (scale 0→1.2→1, elastic.out).

**Timeline**: `sectionReveal('#boutique-edge', ['.edge-card-1', ...], { stagger: 0.2, clip: true })` with curtain-preceded entry.

**mmx assets**: `data-mmx-generated="integridad-icon"`, `data-mmx-generated="soporte-icon"`. Others use Lucide (shield-check, heart, calendar).

**Mobile**: Card slide-in from bottom only. Check pop preserved.

**A11y**: `role="list"` with `aria-label` on section.

---

### Process.astro

**DOM**: `<section id="process">` with `.process-line` (scaleY 0→1), 5 `.process-step` (circle + number + text). SVG curves behind at z-index 0.

**GSAP targets**: `.process-line` (scaleY 0→1, scrub 1.5), `.process-step .step-circle` (rotation 0→360, scrub), `.process-step .word` (y:20→0 + opacity, staggered word reveal triggered at circle rotation 90°–180°).

**Timeline**: Scroll-scrubbed — progress tied directly to scroll position. No trigger-based discrete events.

**mmx assets**: `process-curve.svg` if `getMmxAsset('process-curve').is_ready`. Fallback: inline SVG bezier path.

**Mobile**: Line growth preserved. Circle rotation disabled. Word-by-word reveal preserved but triggered by Intersection Observer instead of scroll scrub.

**A11y**: Step numbers use `<span aria-hidden="true">` with `aria-label` on step descriptions.

---

### CTASection.astro

**DOM**: `<section id="cta">` with `.cta-orb` (breathing animation, scale 0.9↔1.1), iPhone floating mockup right, 3 counters (`<span class="counter">`), headline, CTA buttons.

**GSAP targets**: `.cta-orb` (continuous scale 0.9→1.1, yoyo, sine.inOut). Counters: `gsap.to({ val: 0 }, { val: target, onUpdate() { el.textContent = Math.round(val) + suffix } })`. Floating iPhone: `animation: float 6s ease-in-out infinite` via CSS (not GSAP).

**Timeline**: Counters animate when section enters viewport (`ScrollTrigger` one-shot, not scrubbed).

**mmx assets**: `data-mmx-generated="iphone-screen"` on iPhone screen area. `data-mmx-generated="electric-glow"` on CTA section background texture.

**Mobile**: Orbs breathing preserved. iPhone mockup hidden (CSS `hidden md:block`). Counters preserved.

**A11y**: Counter elements have `aria-live="polite"` for screen reader announcement on animation.

---

### Footer.astro

**DOM**: `<footer>` with gradient line (SVG `stroke-dashoffset` animation), logo stroke SVG, link rows, social row (4 placeholders with `data-todo="social-url"`).

**GSAP targets**: `.footer-gradient-line` (stroke-dashoffset 100%→0). `.footer-logo` (stroke animation via SVG). `.footer-link` (glow underline on hover via GSAP `to` on boxShadow).

**Timeline**: Line draws in when footer enters viewport. Logo strokes on load. Hover effects independent.

**mmx assets**: None.

**Mobile**: No changes.

**A11y**: Social links with `aria-label="LinkedIn (pendiente)"`, `href="#"` clearly marked as placeholders. Focus states visible.

---

## 7. Curtain Transition Decision

### Recommendation: CSS-only Primary, mmx Video Opt-in

**Decision**: Use CSS `clip-path` wipe as the primary curtain mechanism. The mmx-generated `curtain.mp4` is available as an opt-in via `ENABLE_MMX_CURTAIN=true` env flag.

**Rationale**:
1. **Performance**: `curtain.mp4` (estimated 5-15MB, 3s SEF) must load before the first transition fires. CSS wipe is 0 bytes, zero network cost.
2. **Reliability**: CSS transition is deterministic — fires instantly on `ScrollTrigger.onEnter`. Video depends on network + decode latency.
3. **Mobile**: iOS Safari handles video playback with autoplay muted inconsistently. CSS is always safe.
4. **A11y**: CSS curtain is `pointer-events: none` and purely decorative. Video curtain risks briefly covering content.
5. **Complexity**: Video curtain requires loading `curtain.mp4` on page load (potentially deferred), managing playback timing relative to ScrollTrigger callbacks. CSS has no timing complexity.
6. **Brand fit**: CSS `inset(0 100% 0 0) → inset(0 0% 0 0)` wipe at 0.6s with `power2.inOut` is visually clean and sufficiently "B BOLD" for the transition effect.

**Opt-in path**: Set `ENABLE_MMX_CURTAIN=true` in `.env` or `astro.config.mjs`. Code checks `import.meta.env.ENABLE_MMX_CURTAIN === 'true'` before rendering the `<video>` curtain element.

**Fallback for mmx video**: If `ENABLE_MMX_CURTAIN=true` but `getMmxAsset('curtain-video').is_ready === false`, CSS fallback activates automatically.

---

## 8. Inter-Section Transitions

| From → To | Transition |
|---|---|
| Navbar → Hero | None — smooth scroll, Navbar morphs as Hero scrolls |
| Hero → Services | Scroll-scrubbed parallax — orbs shift as section leaves |
| Services → BoutiqueEdge | **Curtain wipe** (CSS primary, mmx video opt-in) — wipe reveals BoutiqueEdge behind it |
| BoutiqueEdge → Process | No explicit transition — BoutiqueEdge fades out as Process fades in with scroll |
| Process → CTASection | Scroll-scrubbed counter tick — counters animate as CTA enters |
| CTASection → Footer | Gradient line draws in at top of Footer |

No full-page overlay transitions between every section — that would be over-animation per R5 mitigation.

---

## 9. Mobile Degradation

### Concrete `matchMedia` Rules

```typescript
// matchMedia.ts

// Rule 1: reduced-motion — highest priority
mm.add('(prefers-reduced-motion: reduce)', (ctx) => {
  gsap.globalTimeline.pause(); // kills all GSAP
  document.querySelectorAll('video[data-mmx-generated]').forEach(v => v.pause());
  // CSS handles all remaining states
}, 'reduce');

// Rule 2: mobile viewport
mm.add('(max-width: 768px)', (ctx) => {
  // CSS vars
  document.documentElement.style.setProperty('--particle-count', '10');
  document.documentElement.style.setProperty('--orb-blur', '40px');

  // Parallax orbs — static
  document.querySelectorAll('.ambient-orb').forEach(orb => {
    (orb as HTMLElement).style.transform = 'none';
    (orb as HTMLElement).style.willChange = 'auto';
  });

  // Sticky pins — disabled
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.pin) st.kill();
  });
}, 'mobile');

// Rule 3: fine pointer (desktop magnetic)
mm.add('(hover: hover) and (pointer: fine)', (ctx) => {
  // magnetic.ts and hamburger rotation enabled
}, 'fine');

// Rule 4: desktop full
mm.add('(min-width: 769px)', (ctx) => {
  document.documentElement.style.setProperty('--particle-count', '35');
  document.documentElement.style.setProperty('--orb-blur', '80px');
}, 'desktop');
```

### Summary Table

| Feature | Desktop (≥769px) | Mobile (<768px) |
|---|---|---|
| Parallax orbs | 0.3×/0.5×/0.7× Y | Off (static) |
| Sticky pins | Services pinned | Off |
| Particles | 35 | 10 |
| Orb blur | 80px | 40px |
| Magnetic hover | On | Off |
| Multi-vector entrance | Left/Right/Bottom/Scale | Fade-up only |
| Clip-path reveals | On | On (hero tagline only) |
| Word-by-word reveal | Scroll-scrubbed | Intersection Observer |
| iPhone video | Autoplay loop | Poster static |
| Curtain video | Opt-in via env | CSS fallback only |

---

## 10. A11y & Motion Safety

### `prefers-reduced-motion`

All GSAP setup runs inside a matchMedia guard. If `prefers-reduced-motion: reduce` is active, `gsap.matchMedia()` context kills all GSAP timelines and pauses all `<video data-mmx-generated>` elements. Content is immediately visible in final state.

### Magnetic — Keyboard/Touch Safety

Magnetic hover applies ONLY when `(hover: hover) and (pointer: fine)`. Touch devices never trigger magnetic. Focusable elements (`a`, `button`, `input`) inside `.magnetic-btn` are excluded from magnetic behavior via explicit CSS selector override: `.magnetic-btn a, .magnetic-btn button { transform: none !important; }`.

### Audio — User-Gated

Ambient audio never autoplays. `AudioToggle` renders only when `prefers-reduced-motion` is not active. First user interaction triggers `play()` — browser autoplay policy satisfied.

### Video — Decorative

All `<video>` elements (hero background, iPhone screen, curtain) have `aria-hidden="true"` since they are decorative. Real text is never inside a canvas/video.

### Focus Management

Navbar mobile menu: focus trap implemented (Tab cycles within menu). Hamburger: `aria-expanded` toggles. Active section: `aria-current="section"` on Navbar link.

---

## 11. Build & Dev Workflow

### `pnpm dev` Hot-Reload

Astro's Vite-based dev server watches `src/` and triggers HMR on edits. For `assets/generated/` changes: since assets are not in the Astro component graph (imported via string paths), a full page reload is needed after PR0 assets are added. Astro's dev server restart not required — just browser reload.

### `pnpm build`

Runs full static build. `astro.config.mjs` hooks execute MANIFEST.json validation. Output in `dist/`.

### `ENABLE_V2_ANIM` Safety Flag

```typescript
// src/scripts/animations/index.ts
const ENABLE_V2_ANIM = import.meta.env.ENABLE_V2_ANIM !== 'false'; // default true

export function initAnimations(): void {
  if (!ENABLE_V2_ANIM) {
    console.log('[anim] v2 animations disabled via ENABLE_V2_ANIM=false');
    return; // v1 animations remain active via separate script tag
  }
  // ... full v2 setup
}
```

```javascript
// astro.config.mjs
export default defineConfig({
  env: {
    ENABLE_V2_ANIM: { default: 'true' }
  }
});
```

Set `ENABLE_V2_ANIM=false` in `.env` for instant rollback to v1 without code changes.

### TypeScript Types for MANIFEST.json

```typescript
// src/lib/mmx-assets.ts
export interface MmxManifestEntry {
  id: string;
  model: string;
  prompt: string;
  seed: number;
  timestamp: string;
  quota_cost: number;
  file_path: string;
}

export type MmxAssetId =
  | 'hero-loop' | 'iphone-screen' | 'obsidian-mesh' | 'electric-glow'
  | 'boutique-texture' | 'ux-ui-icon' | 'web-icon' | 'mobile-icon'
  | 'seo-icon' | 'integridad-icon' | 'soporte-icon' | 'curtain-video'
  | 'ambient-music' | 'hero-vo';

declare const manifest: MmxManifestEntry[];
export { manifest };
```

---

## 12. Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| Lighthouse Perf | ≥ 90 mobile, ≥ 95 desktop | Tree-shake GSAP, no new deps, video poster preload |
| LCP | < 2.5s | Hero poster PNG preloaded via `<link rel="preload">`, video `preload="metadata"` |
| CLS | < 0.1 | Explicit `width`/`height` on all images and video elements |
| TTI | < 2.0s desktop | GSAP init post `requestIdleCallback`, ScrollTrigger.refresh after layout |
| FPS | 60fps desktop / 30fps mobile | `will-change: transform` on all animated elements, `force3D: true` on orbs, matchMedia degrades expensive animations |
| Bundle (JS) | < 80KB gzipped | GSAP tree-shaken via `gsap/ScrollTrigger` named import, no new deps |
| Bundle (CSS) | < 15KB gzipped | Tailwind v4 only, no extra CSS |

### LCP Optimization Detail

```html
<!-- In Layout.astro <head> -->
<link rel="preload" as="image" href="assets/generated/bg/obsidian-mesh.png" />
```

Hero video loads `preload="metadata"` — the `poster` image (obsidian-mesh.png) is already preloaded, so LCP fires from the preloaded poster while video loads in background.

---

## 13. Risks

| ID | Title | Likelihood | Mitigation |
|---|---|---|---|
| R-mmx-1 | mmx token expires before batch complete | High | Generate ALL 14 assets in single tmux session before 2026-06-04; commit PR0 by EOD 2026-06-03 |
| R-mmx-2 | mmx content misses brand on first try | Medium | Iterate with `--seed N`; vision-describe QA gate (≥7/10); fallback chain to CSS/SVG activates automatically |
| R-mmx-3 | Video files hurt LCP (5-20MB) | Medium | `preload="metadata"` only; poster preloaded; mobile gets poster only (no video src); curtain video opt-in |
| R-scroll-1 | ScrollTrigger FPS drops on mid-range mobile | High | matchMedia disables parallax + pins on `(max-width: 768px)`; particles 35→10; orb blur 80→40px |
| R-scroll-2 | Sticky pins conflict with iOS Safari address bar | Medium | Pins disabled `<768px`; test on real iOS before PR4 merge |
| R-scroll-3 | `backdrop-filter` flicker on iOS | Medium | Include `-webkit-backdrop-filter`; reduced blur on iOS (mobile matchMedia reduces to 12px) |
| R-anim-1 | GSAP bundle size increases | Low | Tree-shake via named imports (`gsap/ScrollTrigger`); no new deps |
| R-anim-2 | Over-animation dilutes premium brand | Medium | Hero high intensity; Services+Process medium; CTA medium; Footer restrained; 60% of animations off on mobile |
| R-a11y-1 | `prefers-reduced-motion` not respected everywhere | Medium | Centralize all GSAP in matchMedia guard; AudioToggle not rendered for reduced-motion |
| R-a11y-2 | Magnetic hover affects keyboard users | Low | Guard: `(hover: hover) and (pointer: fine)`; focusable elements explicitly excluded |
| R-perf-1 | iPhone PNG render blocking main thread | Low | `loading="lazy" decoding="async"`; explicit dimensions prevent layout shift |
| R-content-1 | Real social URLs not provided | Low | `href="#"` + `data-todo="social-url"` + `aria-label="Platform (pendiente)"`; clearly marked in UI |

---

## 14. Delivery Plan — 5 Chained PRs

### PR0: mmx Asset Batch (binary + manifest, no code review needed)

**Files**: `assets/generated/*` (~14 files, ~50MB), `assets/generated/MANIFEST.json`

**Process**: Run all 14 mmx CLI commands in tmux session → QA each via `mmx vision describe` → commit. LOC: 0 code.

**Blocking**: Must complete before PR1-4 can fully validate (though PR1 foundation doesn't depend on visual QA).

---

### PR1: Foundation — tokens, animation system, global CSS, SectionProgress, AudioToggle, safety flag, mmx-assets.ts

**Files changed**:
```
src/styles/global.css         (+211 lines — v2 tokens, glass depth, cinematic, mmx refs)
src/scripts/animations/index.ts  (new — initAnimations orchestrator)
src/scripts/animations/matchMedia.ts  (new — 4 context rules)
src/scripts/animations/particles.ts  (new — count from CSS var)
src/lib/mmx-assets.ts        (new — getMmxAsset(), MANIFEST.json reader)
src/components/SectionProgress.astro  (new — 55 lines, scroll progress bar)
src/components/AudioToggle.astro  (new — 35 lines, user-gated audio)
src/layouts/Layout.astro     (+32 lines — preloads, env flag)
src/pages/index.astro        (+26 lines — imports, safety flag wiring)
```

**LOC Δ**: ~+700 | **Risk**: Med (base layer — affects everything) | **Dependencies**: PR0 (for MANIFEST.json validation hook)

---

### PR2: Hero + Navbar — cinematic (mmx video bg, iPhone screen, clip-tagline, morph navbar, stat counter)

**Files changed**:
```
src/components/Hero.astro      (+153 lines — video bg, parallax orbs, clip-tagline, iPhone, stat)
src/components/Navbar.astro     (+92 lines — 3-state morph, progress bar, hamburger→X)
src/scripts/animations/hero.ts  (new — hero timeline, stat counter proxy)
src/scripts/animations/magnetic.ts  (new — cursor attraction)
```

**LOC Δ**: ~+245 | **Risk**: High (visual — needs eye validation) | **Dependencies**: PR1

---

### PR3: Services + BoutiqueEdge + Process — mmx icons, sticky pin, multi-vector entrance, scroll-scrubbed timeline, word-reveal, SVG curves

**Files changed**:
```
src/components/Services.astro      (+127 lines — sticky pin, 4 cards, mmx icons, depth glass)
src/components/BoutiqueEdge.astro  (+109 lines — curtain entry, 4 pillars, check pop)
src/components/Process.astro       (+167 lines — timeline scrub, circle rotation, word-reveal)
src/scripts/animations/services.ts  (new — pin + multi-vector)
src/scripts/animations/process.ts    (new — scrub timeline, circle rotation)
```

**LOC Δ**: ~+400 | **Risk**: Med | **Dependencies**: PR1

---

### PR4: CTASection + Footer + Curtain Wiring + Mobile Verify + Ambient Audio

**Files changed**:
```
src/components/CTASection.astro    (+137 lines — breathing orbs, floating iPhone, counters)
src/components/Footer.astro       (+70 lines — line draw, logo stroke, social placeholders)
src/scripts/animations/scroll.ts   (new — section title reveals, BoutiqueEdge, CTA)
src/styles/global.css             (curtain-wipe class, CSS transitions)
src/pages/index.astro             (ambient audio import wiring)
```

**LOC Δ**: ~+280 | **Risk**: Med | **Dependencies**: PR2 + PR3 (needs all sections present)

---

## 15. Open Design Questions

1. **Curtain video opt-in threshold**: Should `ENABLE_MMX_CURTAIN` default to `true` after PR0 assets are confirmed good quality, or stay `false` until manually enabled? Recommendation: default `false` (safer), explicitly enable after QA sign-off.

2. **iPhone floating mockup placement**: Spec says iPhone is in Hero (proposal §Hero). But the CTA section also has a floating iPhone per spec CTASection. Should there be one iPhone in Hero + one in CTA, or a single iPhone that appears in Hero then moves to CTA? Recommendation: two separate iPhone elements — Hero shows device with screen content, CTA shows device as social proof. Different content, distinct purpose.

3. **Ambient audio on repeat**: The mmx-generated 60s loop is designed seamless. Should `AudioToggle` show current track name ("Ambient · GoDigital") or remain icon-only? Recommendation: icon-only — avoids i18n string management and keeps the toggle minimal.

---

*Design locked. Next phase: sdd-tasks — break PR1-4 into implementable tasks with file-level ownership.*
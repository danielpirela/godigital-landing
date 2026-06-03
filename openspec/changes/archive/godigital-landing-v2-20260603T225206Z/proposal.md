# Proposal: godigital-landing-v2 — Rompedora Redesign (mmx Asset Batch)

## Intent

The current GoDigital landing is technically solid (Astro 6 + Tailwind v4 + GSAP 3, Obsidian Mesh dark) but visually flat. v2 commits to **B BOLD** intensity — cinematic hero, sticky pins, clip-path reveals, curtain transitions, magnetic buttons, parallax depth — because brand wins when the page *feels* like a premium boutique. Dark-only in v2 (Fluid Tech light deferred to v3). **Why now**: `mmx` CLI v1.0.16 is authenticated with token expiring **2026-06-04** and ~95% quota available — the only window to generate premium AI assets (hero video, custom backgrounds, icons, ambient music) at near-zero marginal cost. Missing this window means reverting to code-generated visuals (CSS mesh + Lucide SVGs), a viable but visually flatter path. The change rebundles the 4 chained-PR plan into a 5-PR plan by front-loading PR0: the mmx asset generation batch.

## Scope

### In Scope
- Full rebuild of all 6 sections + Navbar (Navbar, Hero, Services, BoutiqueEdge, Process, CTASection, Footer) per Approach table
- `src/scripts/animations.ts` — `sectionReveal` factory, `matchMedia` responsive wrapper, magnetic helpers, curtain driver, scroll-scrubbed primitives
- `src/styles/global.css` — new tokens (depth glass, curtain, scroll progress, motion-reduce, **mmx-media** for generated asset aspect ratios)
- `src/components/SectionProgress.astro` (NEW) — global top scroll progress bar
- **Asset generation batch (PR0)**: 14 assets via `mmx` (see Asset Batch Plan)
- Asset reuse from `/assets/` (iPhone, glass PNGs, SVG logos)
- 60fps desktop / 30fps mobile via `gsap.matchMedia()` degradation
- Safety flag `ENABLE_V2_ANIM` for instant rollback
- Each generated asset tagged `data-mmx-generated="<asset-id>"` for traceability

### Out of Scope
- Fluid Tech (light) theme — v3
- New sections (portfolio, team, testimonials, pricing)
- Backend, forms, analytics, i18n
- New npm runtime deps (gsap + tailwind + astro already present)
- AVIF/WebP conversion of generated PNGs (follow-up)
- Real social URLs — placeholder `href="#"` with `data-todo="social-url"` until user provides

## Asset Generation Batch Plan (mmx)

> **All 14 assets must be generated in a single batch session before token expiry 2026-06-04.** Sequential CLI is fine (~30-45 min realistic wall time). Save to `assets/generated/`, commit as PR0.

| # | Asset | mmx command (excerpt) | Runtime | Quota | Fallback |
|---|---|---|---|---|---|
| 1 | Hero cinematic video (6-8s loop, 1080p) | `mmx video generate --prompt "cinematic dark obsidian mesh with electric blue #0066ff orbs slowly drifting, premium boutique tech agency aesthetic, smooth parallax depth, no logos, no text, seamless loop" --model Hailuo-2.3 --first-frame assets/generated/bg/obsidian-mesh.png --out assets/generated/hero-loop.mp4` | 2-3 min | 1 video | CSS mesh gradient + 3 parallax orbs (v1 approach) |
| 2 | iPhone screen content (6s I2V) | `mmx video generate --prompt "elegant dark UI on phone screen with electric blue accents, subtle scroll and tap interaction, app interface morphing, premium product" --first-frame assets/iphone-15-pro-marco.png --model Hailuo-2.3 --out assets/generated/iphone-screen.mp4` | 2-3 min | 1 video | Static PNG screenshot + scroll hint overlay |
| 3 | Obsidian Mesh bg (1920×1080) | `mmx image generate --prompt "abstract obsidian dark mesh gradient with subtle electric blue volumetric light, premium tech aesthetic, no text" --model image-01 --width 1920 --height 1080 --aspect-ratio 16:9 --out assets/generated/bg/obsidian-mesh.png` | 20-40s | 1 image | CSS conic + radial gradient |
| 4 | Electric Blue glow bg | `mmx image generate --prompt "deep blue radial glow on obsidian background, soft volumetric haze, cinematic" --model image-01 --width 1920 --height 1080 --out assets/generated/bg/electric-glow.png` | 20-40s | 1 image | CSS radial-gradient stack |
| 5 | Boutique Edge bg (subtle texture) | `mmx image generate --prompt "dark obsidian surface with subtle blue grain texture, premium minimal, no logos" --model image-01 --width 1920 --height 1080 --out assets/generated/bg/boutique-texture.png` | 20-40s | 1 image | Solid `--color-bg` + noise SVG |
| 6 | Services icon: UX/UI | `mmx image generate --prompt "minimalist icon UX/UI design, electric blue glow on dark background, single icon, no text, vector style" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/ux-ui.png` | 15-30s | 1 image | Lucide `figma` SVG |
| 7 | Services icon: Web Dev | `mmx image generate --prompt "minimalist icon web development, code brackets, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/web.png` | 15-30s | 1 image | Lucide `code` SVG |
| 8 | Services icon: Mobile | `mmx image generate --prompt "minimalist icon mobile app, smartphone outline, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/mobile.png` | 15-30s | 1 image | Lucide `smartphone` SVG |
| 9 | Services icon: SEO | `mmx image generate --prompt "minimalist icon SEO search magnifier, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/seo.png` | 15-30s | 1 image | Lucide `search` SVG |
| 10 | BoutiqueEdge icon: Integridad | `mmx image generate --prompt "minimalist shield icon, integrity, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/integridad.png` | 15-30s | 1 image | Lucide `shield-check` SVG |
| 11 | BoutiqueEdge icon: Soporte | `mmx image generate --prompt "minimalist headset support icon, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/soporte.png` | 15-30s | 1 image | Lucide `headphones` SVG |
| 12 | Curtain transition (3s SEF) | `mmx video generate --prompt "smooth electric blue ribbon wipe cinematic, soft particle trail, no text" --first-frame assets/generated/bg/obsidian-mesh.png --last-frame assets/generated/bg/electric-glow.png --model Hailuo-02 --out assets/generated/curtain.mp4` | 1-2 min | 1 video | CSS `clip-path: inset(0 100% 0 0 → 0)` wipe (v1) |
| 13 | Ambient music (60s loop) | `mmx music generate --prompt "cinematic tech ambient premium dark 60 second seamless loop, deep sub bass, subtle synth pads, soft arpeggios, no vocals, no drums" --out assets/generated/ambient.mp3` | 30-60s | 1 music | Silent (mute audio element) |
| 14 | Hero voiceover (es-ES, optional) | `mmx speech synthesize --text "Diseñamos y construimos experiencias digitales premium" --voice es-ES --out assets/generated/hero-vo.mp3` | 10-20s | 1 speech | No VO (text only on screen) |

**Total**: 4 video + 8 image + 1 music + 1 speech ≈ **14 generation events**, est. **$5-15** of the $20 plan. Wall time: **~30-45 min sequential**.

**Generation protocol** (PR0 work):
1. Run all commands in one tmux session; use `--no-wait` for parallel + `mmx video task get <id>` to poll
2. After each, `mmx vision describe --image <path>` to QA against brand prompt intent
3. If quality <7/10 or generation fails, log to `assets/generated/_failed.log` and use the fallback in code
4. Mark every committed asset with `data-mmx-generated="<asset-id>"` HTML attribute + matching entry in `assets/generated/MANIFEST.json` (model, prompt, seed, timestamp, quota_cost)
5. Commit all generated files in PR0 (no code changes yet)

## Approach (per section)

| Section | V2 Strategy |
|---|---|
| **Navbar** | 3-state morph: transparent → glassy → compact. Hamburger ↔ X rotation. Logo color-shift on scroll. Top scroll-progress bar. |
| **Hero** | **mmx video bg** (`assets/generated/hero-loop.mp4`, autoplay muted loop, poster=obsidian-mesh) + 3 parallax orbs. Clip-path reveal on tagline. Floating iPhone with **mmx-generated screen content** (I2V from `iphone-15-pro-marco.png`). Stat badge "10+ proyectos" with counter. |
| **Services** | Sticky pin + 4 cards entering L/R/Bottom/Scale. **mmx-generated icons** (ux-ui, web, mobile, seo) in card. Depth-stacked glass illusion. |
| **BoutiqueEdge** | Curtain wipe entering. 4 pillars (Integridad, Calidez, Planificación, **Soporte post-lanzamiento**). **mmx-generated icons** (integridad, soporte + reuse Lucide for other 2). Pop checks with overshoot. |
| **Process** | Scroll-scrubbed timeline: line grows + numbered circles rotate 0→360° + step text reveals word-by-word. mmx-generated SVG fluid curves between steps. |
| **CTASection** | Breathing orbs (scale 0.9↔1.1). Floating iPhone right (desktop). Scroll-scrubbed counter "10+ / 5 años / 100% boutique". |
| **Footer** | SVG gradient line draws in. Logo stroke animation. Glow underline on link hover. Social row placeholders `data-todo="social-url"`. |
| **Inter-section** | **Curtain wipe** powered by `assets/generated/curtain.mp4` (3s SEF) where `prefers-reduced-motion: no-preference`, else CSS clip-path fallback. Cursor-attracted orbs (desktop). |
| **Global** | **mmx-generated ambient music** (`assets/generated/ambient.mp3`, loop, volume 0.15, user-gated via audio toggle). Scroll progress. Magnetic hover. Frame-by-frame entrance. |

## Capabilities (contract with sdd-spec)

### New Capabilities
- `cinematic-hero` — multi-layer parallax + clip-path reveal + floating device + **mmx video bg**
- `mmx-asset-pipeline` — PR0 generation batch, MANIFEST.json, `data-mmx-generated` traceability, fallback registry
- `scroll-choreography` — `sectionReveal` factory + frame-by-frame pattern
- `services-sticky-pin` — sticky-pin + multi-vector card entrance
- `process-scroll-scrubbed` — timeline growth + rotating circles + SVG fluid curves
- `curtain-transitions` — section-to-section wipe (mmx video preferred, CSS fallback)
- `magnetic-interactions` — cursor attraction on orbs + magnetic hover
- `mobile-motion-degradation` — `gsap.matchMedia` + `prefers-reduced-motion`
- `ambient-audio` — mmx-generated loop + user mute toggle + reduced-motion skip
- `scroll-progress-indicator` — global top progress bar
- `content-redistribution-v2` — 4-pillar BoutiqueEdge, refined copy, social placeholders

### Modified Capabilities
- None — `openspec/specs/` is empty (greenfield)

## Animation System (preserved)

```ts
// 1. Section reveal factory
function sectionReveal(trigger: string, children: string[], opts: RevealOpts) { /* GSAP timeline + matchMedia */ }

// 2. matchMedia — 4 contexts
mm.add('(max-width: 768px)', () => { /* fade-ups, no parallax, particles=10 */ });
mm.add('(prefers-reduced-motion: reduce)', () => { /* CSS-only */ });
mm.add('(hover: hover) and (pointer: fine)', () => { /* magnetic + cursor */ });
mm.add('(min-width: 769px)', () => { /* full choreography */ });

// 3. Frame-by-frame clip-path
gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.out' });

// 4. GPU hints
el.style.willChange = 'transform, opacity';
gsap.set(el, { force3D: true });

// 5. Magnetic hover (gsap.quickTo)
const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
```

## Content Redistribution (preserved)

| Section | V1 → V2 |
|---|---|
| **Hero** | Add "10+ proyectos entregados" stat badge (counter) + mmx video bg |
| **Services** | 4 cards. Reorder UX/UI → Web → Mobile → SEO. Add subtitle. |
| **BoutiqueEdge** | 3→4 pillars. New: "Soporte post-lanzamiento" (60 días garantía) |
| **Process** | Refine copy with stronger verbs + outcome framing |
| **CTASection** | Add floating iPhone + scroll-scrubbed counter |
| **Footer** | Add social row placeholders (`data-todo`) |

## Design System Updates (with mmx tokens)

**New tokens** in `global.css`:
- `--color-orb-attract: rgba(0, 102, 255, 0.04)`
- `--shadow-depth-1/2/3: 0 8px/16px/24px rgba(0,0,0,0.25/0.35/0.45)`
- `--ease-emphasized: cubic-bezier(0.2, 0, 0, 1)`; `--duration-emphasized: 500ms`
- `--color-curtain: rgba(0, 102, 255, 0.95)`
- `--mmx-aspect-video: 16/9`; `--mmx-aspect-icon: 1/1`; `--mmx-aspect-curtain: 21/9`
- `--mmx-poster-blur: 8px` (CSS blur applied to mmx video `poster` while loading)

**New utility classes**: `.glass-card-depth-1/2/3`, `.curtain-wipe`, `.scroll-progress`, `.magnetic-btn`, `.reveal-clip`, `.mesh-gradient`, `.floating-device`, `.breathing`, `.mmx-video-bg` (autoplay muted loop, object-fit cover, `will-change: transform`)

**New component**: `src/components/SectionProgress.astro` (global scroll progress bar).

**New helper**: `src/lib/mmx-assets.ts` — reads `assets/generated/MANIFEST.json` and exposes `getMmxAsset(id)` with fallback chain.

## Asset Strategy (explicit)

| Source | Usage in v2 |
|---|---|
| **REUSE from `/assets/`** | `logo-dark.svg`, `logo-light.svg` (v3 reserve), `iphone-15-pro-marco.png` (Hero+CTA mockup, first-frame for mmx I2V), `bg-glass.png`, `bg-glass-dark.png`, `bg-glass-opac.png`, `Pasted image.png` (review, maybe bg fallback) |
| **GENERATE via mmx** | hero video, iPhone screen content, 3 backgrounds, 6 icons, curtain transition, ambient music, optional VO — 14 total (see batch plan) |
| **EXCLUDE** | `bg-animation.mp4` + `bg-animation (online-video-cutter.com).mp4` (unbranded, replaced by mmx video) · `logo-dark.png` / `logo-light.png` (superseded by SVG) · `bg-light*` (light theme deferred) · `screen-removebg-preview.png` (replaced by iPhone) · `landing-prototipe.png` (mockup) · `assets/audio/*` (replaced by mmx music) · `bg-glass-2.png` (dup of `bg-glass.png`) |
| **USER MUST PROVIDE** | Real social URLs (R5 mitigation) · testimonial photos if v2.1 adds them |

## Performance Budget (preserved)

| Metric | Desktop | Mobile | Strategy |
|---|---|---|---|
| **FCP** | <1.0s | <1.8s | Inline critical CSS, preconnect fonts, **mmx video poster=PNG (R-mmx-3)** |
| **LCP** | <1.5s | <2.5s | Hero video poster preloaded, iPhone lazy |
| **TTI** | <2.0s | <3.5s | GSAP tree-shaken, start post-idle |
| **FPS** | 60fps | 30fps min | `matchMedia` degrades parallax + pins <768px; particles 35→10; orb blur 80→40px |
| **JS bundle** | <80 KB gz | <80 KB gz | No new deps |
| **CSS bundle** | <15 KB gz | <15 KB gz | Tailwind v4 only |

**mmx-specific perf**: video files loaded `preload="metadata"` (not `auto`); poster PNG fallback while video buffers; curtain video **disabled <768px**; ambient music gated by user click.

## mmx Generation Order & Risk Protocol

- **Phase 0 (before PR1)**: generate all assets in single tmux batch, save to `assets/generated/`, commit in PR0
- Each video: 1-3 min runtime, poll with `mmx video task get <id>` (or rely on default wait)
- If a generation fails or vision-describe QA <7/10: log + use fallback (CSS/SVG/Canvas placeholder)
- Tag every generated asset with `data-mmx-generated` HTML attribute + MANIFEST.json entry
- **Order**: backgrounds first (1-3) → icons (4) → videos using backgrounds as first-frame (hero, curtain) → iPhone I2V → music/speech last (cheapest)
- Sequential to avoid rate limits; total wall time ~30-45 min

## Risks

| Risk | Lik | Mitigation |
|---|---|---|
| **R-mmx-1** Token expires 2026-06-04 before batch done | High | Generate ALL assets in single tmux session tomorrow; PR0 ships by EOD 2026-06-03 |
| **R-mmx-2** Generated content misses brand on first try | Med | Iterate with `--seed N`; vision-describe QA gate; fallback chain to CSS/SVG |
| **R-mmx-3** Video files large (5-20 MB) hurt LCP | Med | `preload="metadata"`, poster PNG preload, `<source>` with `type="video/mp4"` + `1080p` only on desktop, **720p mobile via media query** |
| **R-mmx-4** Copyright/IP of generated content | Low | Internal use only, avoid celebrity/trademark prompts, MANIFEST.json logs prompts for audit |
| **R-mmx-5** Hailuo-2.3 may misinterpret Spanish/abstract brand prompts | Med | Keep prompts **English**; post-process brand elements (color grading in CSS, overlay logo) |
| R1 ScrollTrigger FPS drops on mid mobile | High | `matchMedia` disables parallax + pins <768px; `will-change` GPU hints |
| R2 Sticky pins vs iOS Safari | Med | Disable pins <768px; test real iOS |
| R3 `backdrop-filter` flicker iOS | Med | Include `-webkit-backdrop-filter`; reduced blur on iOS |
| R4 GSAP bundle bloat | Low | Tree-shake, no new deps |
| R5 Over-animation dilutes Premium | Med | Hero high, Services+Process medium, CTA medium, Footer restrained |
| R6 Real social URLs needed | Low | Placeholder `href="#"` + `data-todo="social-url"` + `aria-label` |
| R7 `prefers-reduced-motion` not respected everywhere | Med | Centralize in `initAnimations()`; skip all GSAP + mmx video/music |
| R8 iPhone PNG render perf | Low | `loading="lazy"`, `decoding="async"` |
| R9 Magnetic hover a11y | Low | Only on `(hover: hover) and (pointer: fine)` |
| R10 Curtain blocks content | Low | Decorative, content z-indexed above |

## Rollback Plan

1. `git revert <final-merge-sha>` (PR4 merge)
2. Static Astro, no DB — no migration
3. CDN cache invalidates per deploy
4. `ENABLE_V2_ANIM=false` in `astro.config.mjs` → v1 animations only (safety valve)
5. **PR0 mmx assets** stay in repo but unreferenced — safe to remove in follow-up

## Dependencies

- **Existing runtime**: `gsap@^3`, `astro@^6.3.7`, `tailwindcss@^4`, `vite@^8.0.14`
- **Existing dev**: `hyperframes@^0.6.6` (NOT used in v2), `typescript@^6.0.3`
- **New runtime**: NONE
- **New dev**: NONE
- **External services**: `mmx` CLI v1.0.16 (PR0 only, no runtime dep), Google Fonts

## Estimated Changed Lines

| File | Current | V2 | Δ |
|---|---|---|---|
| `src/layouts/Layout.astro` | 43 | 75 | +32 |
| `src/pages/index.astro` | 32 | 58 | +26 |
| `src/components/Navbar.astro` | 103 | 195 | +92 |
| `src/components/Hero.astro` | 62 | 215 | +153 |
| `src/components/Services.astro` | 98 | 225 | +127 |
| `src/components/BoutiqueEdge.astro` | 71 | 180 | +109 |
| `src/components/Process.astro` | 73 | 240 | +167 |
| `src/components/CTASection.astro` | 43 | 180 | +137 |
| `src/components/Footer.astro` | 45 | 115 | +70 |
| `src/components/SectionProgress.astro` (NEW) | 0 | 55 | +55 |
| `src/components/AudioToggle.astro` (NEW) | 0 | 35 | +35 |
| `src/scripts/animations.ts` | 329 | 760 | +431 |
| `src/styles/global.css` | 169 | 380 | +211 |
| `src/lib/mmx-assets.ts` (NEW) | 0 | 70 | +70 |
| `assets/generated/*` (PR0, binary) | 0 | ~14 files, ~50 MB | (not LOC) |
| **TOTAL LOC Δ** | **1,068** | **~2,800** | **+~1,750** |

## Delivery Strategy: 5 chained PRs (PR0 + PR1-4)

`review_budget_lines: 800`. +1,750 LOC ≈ 2.2× budget → must split. **Add PR0** for mmx asset batch (no code review, just file commit + manifest audit).

| # | Slice | Files | LOC Δ | Risk |
|---|---|---|---|---|
| **PR0** | **mmx asset generation batch** (commit generated files + MANIFEST.json) | `assets/generated/*`, `assets/generated/MANIFEST.json` | 0 code | Low (binary + manifest audit) |
| **PR1** | Foundation: tokens + animation system + global CSS + SectionProgress + AudioToggle + safety flag + `mmx-assets.ts` helper | `global.css`, `animations.ts`, `SectionProgress.astro`, `AudioToggle.astro`, `Layout.astro`, `index.astro`, `mmx-assets.ts` | ~+700 | Med (base) |
| **PR2** | Hero + Navbar cinematic (mmx video bg, iPhone screen) | `Hero.astro`, `Navbar.astro` | ~+245 | High (visual) |
| **PR3** | Services + BoutiqueEdge + Process (mmx icons + curves) | `Services.astro`, `BoutiqueEdge.astro`, `Process.astro` | ~+400 | Med |
| **PR4** | CTASection + Footer + curtain wiring + mobile verify + ambient audio integration | `CTASection.astro`, `Footer.astro`, `animations.ts` (mobile) | ~+280 | Med |

PR0 ships first (independent). PR1 must merge before PR2-4. PR2-4 can run in parallel after PR1 (recommend sequential for stable mobile testing).

## Success Criteria

- [ ] All 6 sections animate per approach table
- [ ] All 14 mmx assets generated, QA'd, committed in PR0 with MANIFEST.json
- [ ] 60fps desktop, 30fps mobile (Chrome DevTools + `matchMedia`)
- [ ] `prefers-reduced-motion: reduce` → no GSAP, mmx video/music disabled, content readable
- [ ] Lighthouse Perf ≥ 90 mobile, ≥ 95 desktop
- [ ] Lighthouse A11y ≥ 95
- [ ] `astro check` clean
- [ ] No new npm deps
- [ ] `pnpm build` clean
- [ ] No external assets beyond `/assets/` reuse + `assets/generated/` mmx batch
- [ ] Footer social placeholders clearly marked
- [ ] Each mmx asset traceable via `data-mmx-generated` attribute

## Next Phase

**sdd-spec** — write delta specs for the 11 new capabilities in `openspec/specs/<name>/spec.md`. Spec phase converts each capability into `## Requirements` + `## Scenarios` so sdd-design and sdd-tasks have unambiguous targets. Skip sdd-design first: stack is locked, animation patterns are decided, per-section approach encodes design. **sdd-tasks** can run in parallel with sdd-spec for PR0 (asset batch) since it's binary-file work with no spec dependencies.

# Tasks: godigital-landing-v2 — Rompedora Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,625 LOC (PR1-4 code; PR0 is binary) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR0 → PR1 → PR2 → PR3 → PR4 (5 chained) |
| Delivery strategy | auto-forecast |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | mmx asset batch (binary + manifest) | PR0 | Must ship before PR1-4; token expires 2026-06-04 |
| 2 | Foundation: tokens + animation system + CSS + components | PR1 | ~700 LOC; base for all later PRs |
| 3 | Hero + Navbar cinematic | PR2 | ~245 LOC; visual validation needed |
| 4 | Services + BoutiqueEdge + Process | PR3 | ~400 LOC; sticky-pin + scroll-scrub |
| 5 | CTA + Footer + curtain wiring + mobile verify | PR4 | ~280 LOC; final integration |

---

## PR0: mmx Asset Generation Batch (~0 LOC, ~50MB binary)

**Branch**: `feat/v2-mmx-assets`
**Base**: `main`
**Sequential execution required** — all tasks must complete in order.

### T0.1 [asset] Create `assets/generated/` directory structure
- **Files**: `assets/generated/bg/`, `assets/generated/icons/`
- **LOC Δ**: 0
- **Dependencies**: none
- **mmx command**: N/A
- **Risk**: Low
- **Acceptance**:
  - `assets/generated/bg/` and `assets/generated/icons/` directories exist
  - `.gitkeep` files in each to ensure directory is tracked
  - MANIFEST.json placeholder created at `assets/generated/MANIFEST.json.schema`

### T0.2 [asset] Generate 3 background images via image-01
- **Files**: `assets/generated/bg/obsidian-mesh.png`, `assets/generated/bg/electric-glow.png`, `assets/generated/bg/boutique-texture.png`
- **LOC Δ**: 0 (binary)
- **Dependencies**: T0.1
- **mmx commands**:
  ```
  mmx image generate \
    --prompt "abstract obsidian dark mesh gradient with subtle electric blue volumetric light, premium tech aesthetic, no text" \
    --model image-01 --width 1920 --height 1080 --aspect-ratio 16:9 \
    --out assets/generated/bg/obsidian-mesh.png

  mmx image generate \
    --prompt "deep blue radial glow on obsidian background, soft volumetric haze, cinematic" \
    --model image-01 --width 1920 --height 1080 \
    --out assets/generated/bg/electric-glow.png

  mmx image generate \
    --prompt "dark obsidian surface with subtle blue grain texture, premium minimal, no logos" \
    --model image-01 --width 1920 --height 1080 \
    --out assets/generated/bg/boutique-texture.png
  ```
- **Risk**: Medium — token expires 2026-06-04; generate all in one tmux session
- **Acceptance**:
  - All 3 PNG files exist at correct paths
  - Each is 1920×1080
  - QA score >=7/10 via `mmx vision describe --image <path>`

### T0.3 [asset] Generate 6 service + edge icons via image-01
- **Files**: `assets/generated/icons/ux-ui.png`, `assets/generated/icons/web.png`, `assets/generated/icons/mobile.png`, `assets/generated/icons/seo.png`, `assets/generated/icons/integridad.png`, `assets/generated/icons/soporte.png`
- **LOC Δ**: 0 (binary)
- **Dependencies**: T0.2 (generation order: backgrounds → icons → videos)
- **mmx commands**:
  ```
  # 4 services icons
  mmx image generate --prompt "minimalist icon UX/UI design, electric blue glow on dark background, single icon, no text, vector style" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/ux-ui.png
  mmx image generate --prompt "minimalist icon web development, code brackets, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/web.png
  mmx image generate --prompt "minimalist icon mobile app, smartphone outline, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/mobile.png
  mmx image generate --prompt "minimalist icon SEO search magnifier, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/seo.png

  # 2 BoutiqueEdge icons
  mmx image generate --prompt "minimalist shield icon, integrity, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/integridad.png
  mmx image generate --prompt "minimalist headset support icon, electric blue on dark, no text" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/soporte.png
  ```
- **Risk**: Low
- **Acceptance**:
  - All 6 icon PNGs exist at 1:1 aspect ratio
  - QA score >=7/10 via `mmx vision describe`

### T0.4 [asset] Generate hero-loop.mp4 via Hailuo-2.3
- **Files**: `assets/generated/hero-loop.mp4`
- **LOC Δ**: 0 (binary)
- **Dependencies**: T0.2 (requires obsidian-mesh.png as first-frame)
- **mmx command**:
  ```
  mmx video generate \
    --prompt "cinematic dark obsidian mesh with electric blue #0066ff orbs slowly drifting, premium boutique tech agency aesthetic, smooth parallax depth, no logos, no text, seamless loop" \
    --model Hailuo-2.3 \
    --first-frame assets/generated/bg/obsidian-mesh.png \
    --out assets/generated/hero-loop.mp4
  ```
- **Risk**: High — Hailuo-2.3 may misinterpret abstract prompts; have CSS fallback ready
- **Acceptance**:
  - `hero-loop.mp4` exists, 6-8s, 1080p
  - Video loops seamlessly (no visible jump at end)
  - QA score >=7/10

### T0.5 [asset] Generate iphone-screen.mp4 via Hailuo-2.3 I2V
- **Files**: `assets/generated/iphone-screen.mp4`
- **LOC Δ**: 0 (binary)
- **Dependencies**: T0.2 (requires obsidian-mesh.png); design decision: use `assets/iphone-15-pro-marco.png` as first-frame
- **mmx command**:
  ```
  mmx video generate \
    --prompt "elegant dark UI on phone screen with electric blue accents, subtle scroll and tap interaction, app interface morphing, premium product" \
    --first-frame assets/iphone-15-pro-marco.png \
    --model Hailuo-2.3 \
    --out assets/generated/iphone-screen.mp4
  ```
- **Risk**: Medium — first-frame must be `iphone-15-pro-marco.png` (not generated); verify file exists
- **Acceptance**:
  - `iphone-screen.mp4` exists, ~6s, 1080p
  - I2V preserves device frame; content inside screen animates
  - QA score >=7/10

### T0.6 [asset] Generate curtain.mp4 via Hailuo-02 (optional, opt-in)
- **Files**: `assets/generated/curtain.mp4`
- **LOC Δ**: 0 (binary)
- **Dependencies**: T0.2 (uses obsidian-mesh.png + electric-glow.png as first/last frame)
- **mmx command**:
  ```
  mmx video generate \
    --prompt "smooth electric blue ribbon wipe cinematic, soft particle trail, no text" \
    --first-frame assets/generated/bg/obsidian-mesh.png \
    --last-frame assets/generated/bg/electric-glow.png \
    --model Hailuo-02 \
    --out assets/generated/curtain.mp4
  ```
- **Risk**: Medium — CSS clip-path is primary; this is opt-in via `ENABLE_MMX_CURTAIN=true`
- **Acceptance**:
  - `curtain.mp4` exists, ~3s SEF
  - Falls back to CSS wipe if missing or quality <7/10

### T0.7 [asset] Generate ambient.mp3 via music-gen
- **Files**: `assets/generated/ambient.mp3`
- **LOC Δ**: 0 (binary)
- **Dependencies**: none
- **mmx command**:
  ```
  mmx music generate \
    --prompt "cinematic tech ambient premium dark 60 second seamless loop, deep sub bass, subtle synth pads, soft arpeggios, no vocals, no drums" \
    --out assets/generated/ambient.mp3
  ```
- **Risk**: Low — falls back to silent audio element
- **Acceptance**:
  - `ambient.mp3` exists, ~60s, seamless loop
  - QA: plays without crackling/pop at loop point

### T0.8 [asset] Generate hero-vo.mp3 via es-ES-TTS (optional)
- **Files**: `assets/generated/hero-vo.mp3`
- **LOC Δ**: 0 (binary)
- **Dependencies**: none
- **mmx command**:
  ```
  mmx speech synthesize \
    --text "Diseñamos y construimos experiencias digitales premium" \
    --voice es-ES \
    --out assets/generated/hero-vo.mp3
  ```
- **Risk**: Low — optional; falls back to no VO
- **Acceptance**:
  - `hero-vo.mp3` exists and plays correctly
  - Spanish pronunciation is natural

### T0.9 [chore] Write MANIFEST.json with model/prompt/seed/timestamp/quota
- **Files**: `assets/generated/MANIFEST.json`
- **LOC Δ**: ~80 (JSON)
- **Dependencies**: T0.2 through T0.8 (all assets generated)
- **Risk**: Low
- **Acceptance**:
  - MANIFEST.json lists all 14 assets with id, model, prompt, seed, timestamp, quota_cost, file_path
  - Schema matches `src/lib/mmx-assets.ts` interface `MmxManifestEntry`
  - Build hook in `astro.config.mjs` validates MANIFEST.json schema on `astro build`

### T0.10 [verify] Run `mmx vision describe` on each generated image; QA score >=7/10
- **Files**: all assets under `assets/generated/`
- **LOC Δ**: 0
- **Dependencies**: T0.2, T0.3 (image assets ready)
- **Risk**: Low
- **Acceptance**:
  - All images scored >=7/10 via `mmx vision describe`
  - Failed assets logged to `assets/generated/_failed.log` with fallback decision
  - All passing assets have `data-mmx-generated` attribute documented in component files

### T0.11 [chore] Commit PR0 branch: feat/v2-mmx-assets
- **Files**: `assets/generated/*` (binary + MANIFEST.json)
- **LOC Δ**: 0 (manifest only)
- **Dependencies**: T0.9, T0.10
- **Risk**: Low
- **Acceptance**:
  - Branch `feat/v2-mmx-assets` created from `main`
  - Only binary assets + MANIFEST.json committed (no code)
  - PR description includes asset manifest table (model, file, QA score per asset)

---

## PR1: Foundation (~700 LOC)

**Branch**: `feat/v2-foundation`
**Base**: `main` (after PR0 merges)
**Parallel work allowed** within PR1 after T1.1 (setup gates).

### T1.1 [setup] Add ENABLE_V2_ANIM safety flag to astro.config.mjs
- [x] **Files**: `astro.config.mjs`
- **LOC Δ**: +8
- **Dependencies**: none
- **Risk**: Low
- **Acceptance**:
  - `ENABLE_V2_ANIM` env var defaults to `'true'`
  - Hook `astro:build:start` validates MANIFEST.json schema and confirms all 14 asset paths exist
  - Setting `ENABLE_V2_ANIM=false` disables all v2 animations (v1 script continues)

### T1.2 [code] Create src/lib/mmx-assets.ts with getMmxAsset / hasFallback / isReady
- [x] **Files**: `src/lib/mmx-assets.ts` (NEW)
- **LOC Δ**: +70
- **Dependencies**: T1.1 (needs env var), T0.9 (needs MANIFEST.json)
- **Risk**: Low
- **Acceptance**:
  - `getMmxAsset(id: string): MmxAsset` reads MANIFEST.json at runtime
  - `hasFallback(id: string): boolean` returns true if fallback exists
  - `isReady(id: string): boolean` checks file existence on disk
  - TypeScript types match MANIFEST.json schema exactly
  - All 14 asset IDs typed as `MmxAssetId` union

### T1.3 [code] Extend src/styles/global.css with v2 tokens
- [x] **Files**: `src/styles/global.css`
- **LOC Δ**: +211
- **Dependencies**: none
- **Risk**: Low
- **Acceptance**:
  - `--electric-blue-rgb: 0, 102, 255`
  - `--glass-blur: 24px` (desktop), `--glass-blur-mobile: 12px`
  - `--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)`
  - `--duration-cinematic: 1.2s`
  - `--color-curtain: rgba(0, 102, 255, 0.95)`
  - `--shadow-glass-depth-1/2/3`
  - `--mmx-poster-blur: 8px`
  - Utility classes: `.glass-card-depth-1/2/3`, `.curtain-wipe`, `.scroll-progress`, `.magnetic-btn`, `.reveal-clip`, `.mesh-gradient`, `.floating-device`, `.breathing`, `.mmx-video-bg`

### T1.4 [code] Create src/scripts/animations/matchMedia.ts
- [x] **Files**: `src/scripts/animations/matchMedia.ts` (NEW)
- **LOC Δ**: +55
- **Dependencies**: none
- **Risk**: Low
- **Acceptance**:
  - 4 rules in priority order: reduce-motion > mobile > fine-pointer > desktop
  - `reduce-motion`: pauses all GSAP timelines, pauses all `[data-mmx-generated]` videos
  - `mobile (max-width: 768px)`: --particle-count=10, --orb-blur=40px, parallax disabled, pins disabled
  - `fine-pointer (hover: hover) and (pointer: fine)`: magnetic enabled, hamburger→X rotation enabled
  - `desktop (min-width: 769px)`: --particle-count=35, --orb-blur=80px, full choreography
  - Uses `gsap.matchMedia()` with named contexts

### T1.5 [code] Create src/scripts/animations/particles.ts
- [x] **Files**: `src/scripts/animations/particles.ts` (NEW)
- **LOC Δ**: +40
- **Dependencies**: T1.4 (needs matchMedia CSS var injection)
- **Risk**: Low
- **Acceptance**:
  - `createParticles(container: string, count: number)` spawns canvas particles
  - Reads `--particle-count` CSS var for count
  - Blur level from `--orb-blur` CSS var
  - Clean up on ScrollTrigger leave

### T1.6 [code] Create src/scripts/animations/scroll.ts
- [x] **Files**: `src/scripts/animations/scroll.ts` (NEW)
- **LOC Δ**: +45
- **Dependencies**: T1.4 (matchMedia)
- **Risk**: Low
- **Acceptance**:
  - `initScrollAnimations()` sets up ScrollTrigger instances for section titles, BoutiqueEdge slide-in, CTA fade-up
  - Uses `sectionReveal` factory pattern from design
  - All ScrollTrigger instances killed gracefully on reduced-motion

### T1.7 [code] Create src/scripts/animations/magnetic.ts
- [x] **Files**: `src/scripts/animations/magnetic.ts` (NEW)
- **LOC Δ**: +40
- **Dependencies**: T1.4 (fine-pointer guard)
- **Risk**: Low
- **Acceptance**:
  - `initMagnetic()` sets up `gsap.quickTo` for buttons with `.magnetic-btn`
  - Proximity-based attraction: cursor within 100px → button shifts up to 8px toward cursor
  - Focusable children (`a`, `button`) explicitly excluded via CSS override
  - Only activates on `(hover: hover) and (pointer: fine)`

### T1.8 [code] Create src/scripts/animations/hero.ts
- [x] **Files**: `src/scripts/animations/hero.ts` (NEW)
- **LOC Δ**: +60
- **Dependencies**: T1.4, T1.7
- **Risk**: Medium — this is the visual showpiece
- **Acceptance**:
  - `initHeroAnimation()`: timeline logo→tagline→subtitle→CTA→scroll indicator
  - Logo: scale 0.7→1 with `back.out(1.7)`, duration 1.2s
  - Tagline: clip-path `inset(0 100% 0 0)` → `inset(0 0% 0 0)`, `expo.out`, 1.2s
  - 3 parallax orbs: Y translation at 0.3×/0.5×/0.7× on scroll
  - Stat counter: proxy object counting up as section enters viewport
  - Page-load sequence: 0.8s delay → logo → tagline → subtitle → CTA → scroll bounce

### T1.9 [code] Create src/scripts/animations/services.ts
- [x] **Files**: `src/scripts/animations/services.ts` (NEW)
- **LOC Δ**: +55
- **Dependencies**: T1.4
- **Risk**: Medium
- **Acceptance**:
  - `initServicesAnimation()`: ScrollTrigger pin with 600px end
  - 4 cards enter from: x:-80 (left), x:+80 (right), y:+60 (bottom), scale:0.8 (4th)
  - Stagger offsets: 0, 0.15, 0.30, 0.45s
  - Pin disabled on mobile matchMedia

### T1.10 [code] Create src/scripts/animations/process.ts
- [x] **Files**: `src/scripts/animations/process.ts` (NEW)
- **LOC Δ**: +50
- **Dependencies**: T1.4
- **Risk**: Medium
- **Acceptance**:
  - `initProcessAnimation()`: line scaleY 0→1 scrubbed, circles rotate 0→360deg
  - Word-by-word reveal triggered at circle rotation 90°–180°
  - Scroll-scrub: `scrub: 1.5` for smooth follow
  - Mobile: circle rotation disabled, word reveal uses Intersection Observer

### T1.11 [code] Create src/scripts/animations/index.ts orchestrator
- [x] **Files**: `src/scripts/animations/index.ts` (NEW — replaces monolithic `animations.ts`)
- **LOC Δ**: +65
- **Dependencies**: T1.4, T1.5, T1.6, T1.7, T1.8, T1.9, T1.10
- **Risk**: Low — orchestrator, calls sub-modules
- **Acceptance**:
  - `initAnimations()` reads `ENABLE_V2_ANIM` env (defaults true)
  - If `ENABLE_V2_ANIM === false`: logs `[anim] v2 animations disabled` and returns
  - Imports and calls all sub-module init functions
  - Wrapped in `DOMContentLoaded` listener
  - GSAP registered once at top level

### T1.12 [code] Refactor: remove old src/scripts/animations.ts (replaced by split)
- [x] **Files**: `src/scripts/animations.ts` (DELETE)
- **LOC Δ**: −329
- **Dependencies**: T1.11 (new orchestrator operational)
- **Risk**: Low — deletion only after verifying new system works
- **Acceptance**:
  - Old `animations.ts` deleted from disk
  - All imports elsewhere updated to `src/scripts/animations/index.ts`
  - `import.meta.env.ENABLE_V2_ANIM` check in index.ts guards all v2 code

### T1.13 [code] Create src/components/SectionProgress.astro
- [x] **Files**: `src/components/SectionProgress.astro` (NEW)
- **LOC Δ**: +55
- **Dependencies**: T1.11 (scroll tracking)
- **Risk**: Low
- **Acceptance**:
  - Fixed top bar, z-index 200, full-width
  - Width driven by scroll percentage (0→100%)
  - CSS transition smooth (no jank)
  - Electric blue fill color
  - `aria-hidden="true"` (decorative)

### T1.14 [code] Create src/components/AudioToggle.astro (icon-only)
- [x] **Files**: `src/components/AudioToggle.astro` (NEW)
- **LOC Δ**: +35
- **Dependencies**: T1.11, T1.3 (CSS tokens)
- **Risk**: Low
- **Acceptance**:
  - Icon-only button (speaker/mute SVG icon)
  - Toggles `ambient.mp3` play/pause
  - Only renders when `prefers-reduced-motion: no-preference` (Astro inline check)
  - First interaction satisfies browser autoplay policy
  - `aria-label="Activar audio ambiental"` / `aria-label="Silenciar audio"`

### T1.15 [code] Update src/layouts/Layout.astro
- [x] **Files**: `src/layouts/Layout.astro`
- **LOC Δ**: +32
- **Dependencies**: T1.1, T1.2, T1.13
- **Risk**: Low
- **Acceptance**:
  - Preloads hero poster: `<link rel="preload" as="image" href="assets/generated/bg/obsidian-mesh.png">`
  - Audio preload set to `none`
  - `ENABLE_V2_ANIM` guard inlined for v2 module imports
  - New components: `<SectionProgress />` (top), `<AudioToggle />` (in nav area)

### T1.16 [code] Update src/pages/index.astro
- [x] **Files**: `src/pages/index.astro`
- **LOC Δ**: +26
- **Dependencies**: T1.13, T1.14, T1.15
- **Risk**: Low
- **Acceptance**:
  - Imports `SectionProgress.astro` and `AudioToggle.astro`
  - Mounts `AudioToggle` in nav region
  - All existing sections preserved (no reimplementation yet)

### T1.17 [verify] pnpm astro check passes
- [x] **Files**: entire project
- **LOC Δ**: 0
- **Dependencies**: T1.1 through T1.16
- **Risk**: Low
- **Acceptance**:
  - `pnpm astro check` returns exit code 0
  - No TypeScript errors in new files
  - @astrojs/check passes

### T1.18 [verify] pnpm build succeeds with ENABLE_V2_ANIM=true and =false
- [x] **Files**: entire project
- **LOC Δ**: 0
- **Dependencies**: T1.17
- **Risk**: Low
- **Acceptance**:
  - `ENABLE_V2_ANIM=true pnpm build` succeeds
  - `ENABLE_V2_ANIM=false pnpm build` succeeds
  - Output `dist/` contains valid static site in both modes

### T1.19 [chore] Commit PR1 branch: feat/v2-foundation
- [x] **Files**: `src/lib/mmx-assets.ts`, `src/styles/global.css`, `src/scripts/animations/` (8 new files), `src/components/SectionProgress.astro`, `src/components/AudioToggle.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/scripts/animations.ts` (deleted)
- **LOC Δ**: ~+697 / −329
- **Dependencies**: T1.17, T1.18
- **Risk**: Low
- **Acceptance**:
  - Branch `feat/v2-foundation` created from `main` (after PR0 merged)
  - All 8 animation sub-modules committed together
  - `ENABLE_V2_ANIM` safety flag documented in PR description

---

## PR2: Hero + Navbar Cinematic (~245 LOC)

**Branch**: `feat/v2-hero-navbar`
**Base**: `feat/v2-foundation` (PR1)

### T2.1 [code] Update src/components/Hero.astro
- [x] **Files**: `src/components/Hero.astro`
- **LOC Δ**: +153
- **Dependencies**: T1.19 (PR1 merged)
- **Risk**: Medium — primary visual component
- **Acceptance**:
  - `<video autoplay muted loop playsinline preload="metadata" poster="assets/generated/bg/obsidian-mesh.png" data-mmx-generated="hero-loop">` with `<source>` media-gated to desktop
  - 3 `.ambient-orb` parallax divs (CSS: absolute, blurred, electric blue)
  - `.hero-tagline` with clip-path reveal (CSS initial state `clip-path: inset(0 100% 0 0)`)
  - Floating iPhone: `assets/generated/iphone-screen.mp4` video inside iPhone frame
  - Stat badge counter: `data-counter="10+"` updated via GSAP proxy
  - All mmx assets tagged with `data-mmx-generated="<id>"`
  - Mobile: video shows poster only (no `<source>` media=desktop)

### T2.2 [code] Implement hero.ts parallax + stat counter
- [x] **Files**: `src/scripts/animations/hero.ts`
- **LOC Δ**: +60 (already created in T1.8, this is implementation completion)
- **Dependencies**: T2.1 (DOM elements exist)
- **Risk**: Medium
- **Acceptance**:
  - `gsap.to(orb, { y: -80, scrollTrigger: { scrub: 1 } })` for each of 3 orbs with multipliers
  - Stat counter: `gsap.to({ val: 0 }, { val: 10, onUpdate() { el.textContent = Math.round(val) + '+' } })`
  - Orbs have `will-change: transform` set

### T2.3 [code] Implement scroll-scrubbed counter in hero
- [x] **Files**: `src/scripts/animations/hero.ts`
- **LOC Δ**: +20
- **Dependencies**: T2.2
- **Risk**: Low
- **Acceptance**:
  - Counter animates as hero scrolls out of viewport
  - Uses `ScrollTrigger` with `scrub: true`

### T2.4 [code] Update src/components/Navbar.astro
- [x] **Files**: `src/components/Navbar.astro`
- **LOC Δ**: +92
- **Dependencies**: T1.19
- **Risk**: Medium
- **Acceptance**:
  - 3-state morph: transparent → glassy → compact (backgroundColor/borderBottom scrubbed)
  - Hamburger → X rotation: GSAP on 3 spans (rotate ±45°, scaleX 0 on middle)
  - Logo color shift via `.navbar.scrolled` class applied by ScrollTrigger
  - Progress bar integrated at navbar top
  - `aria-expanded` toggles on hamburger, keyboard focus trap on mobile menu

### T2.5 [code] Wire ENABLE_MMX_CURTAIN check (CSS-only default, video opt-in)
- [x] **Files**: `src/scripts/animations/scroll.ts` (curtain logic)
- **LOC Δ**: +15
- **Dependencies**: T1.11, T0.6 (curtain.mp4 asset)
- **Risk**: Low
- **Acceptance**:
  - CSS clip-path wipe primary (always works)
  - `import.meta.env.ENABLE_MMX_CURTAIN === 'true'` → loads `<video>` curtain element
  - Falls back to CSS if `getMmxAsset('curtain-video').is_ready === false`
  - Curtain video `preload="none"`, `pointer-events: none`, `aria-hidden="true"`

### T2.6 [verify] pnpm dev: hero video plays, no console errors, LCP <2.5s
- [x] **Files**: `src/components/Hero.astro`
- **LOC Δ**: 0
- **Dependencies**: T2.1, T2.2, T2.4
- **Risk**: Medium — visual verification
- **Acceptance**:
  - Video autoplays on load (muted, loop)
  - No `Uncaught (in promise)` errors in console
  - LCP measured via Lighthouse <= 2.5s on mobile simulation
  - Poster visible immediately while video buffers

### T2.7 [verify] Lighthouse desktop Performance >=90 on / (local)
- [x] **Files**: entire project (build)
- **LOC Δ**: 0
- **Dependencies**: T2.6
- **Risk**: Low
- **Acceptance**:
  - `pnpm build` + serve locally
  - Lighthouse Performance >= 90 desktop
  - FCP < 1.0s, LCP < 1.5s desktop

### T2.8 [chore] Commit PR2 branch: feat/v2-hero-navbar
- [ ] **Files**: `src/components/Hero.astro`, `src/components/Navbar.astro`, `src/scripts/animations/hero.ts`, `src/scripts/animations/scroll.ts`
- **LOC Δ**: ~+245
- **Dependencies**: T2.6, T2.7
- **Risk**: Low
- **Acceptance**:
  - Branch `feat/v2-hero-navbar` created from `feat/v2-foundation`
  - PR description: screenshot of hero (before/after), curtain behavior described

---

## PR3: Services + BoutiqueEdge + Process (~400 LOC)

**Branch**: `feat/v2-services-process`
**Base**: `feat/v2-foundation` (PR1)

### T3.1 [code] Update src/components/Services.astro
- [x] **Files**: `src/components/Services.astro`
- **LOC Δ**: +127
- **Dependencies**: T1.19
- **Risk**: Medium
- **Acceptance**:
  - 4 `.service-card` with `data-depth` attribute for depth layering
  - mmx icons: `<img data-mmx-generated="ux-ui-icon" src="assets/generated/icons/ux-ui.png" alt="UX/UI" loading="lazy" width="64" height="64">` per card
  - Fallback to Lucide inline SVG if `getMmxAsset('ux-ui-icon').is_ready === false`
  - Sticky-pin wrapper with `#services` id

### T3.2 [code] Implement services.ts: ScrollTrigger pin + multi-vector entrance
- [x] **Files**: `src/scripts/animations/services.ts`
- **LOC Δ**: +55 (already created in T1.9, this is implementation completion)
- **Dependencies**: T3.1 (DOM elements exist)
- **Risk**: Medium
- **Acceptance**:
  - `ScrollTrigger.create({ trigger: '#services', start: 'top top', end: '+=600', pin: true, pinSpacing: true })`
  - Cards animate via nested timeline: x:-80, x:+80, y:+60, scale:0.8
  - Pin disabled `<768px`

### T3.3 [code] Update src/components/BoutiqueEdge.astro
- [x] **Files**: `src/components/BoutiqueEdge.astro`
- **LOC Δ**: +109
- **Dependencies**: T1.19
- **Risk**: Medium
- **Acceptance**:
  - 4 pillars: Integridad, Calidez, Planificación, Soporte post-lanzamiento
  - `data-mmx-generated="integridad-icon"` and `data-mmx-generated="soporte-icon"` on icons
  - `.edge-check` pop animation: `scale: 0 → 1.2 → 1, elastic.out`
  - Curtain-wipe entry from left

### T3.4 [code] Update src/components/Process.astro
- [x] **Files**: `src/components/Process.astro`
- **LOC Δ**: +167
- **Dependencies**: T1.19
- **Risk**: Medium
- **Acceptance**:
  - `.process-line` scaleY 0→1 driven by scroll
  - 5 `.process-step` with circle (number) + text
  - SVG fluid curves between steps (mmx-generated or inline SVG fallback)
  - Word-by-word reveal via `.word` spans

### T3.5 [code] Implement process.ts: line + circles + typewriter
- [x] **Files**: `src/scripts/animations/process.ts`
- **LOC Δ**: +50 (already created in T1.10, this is implementation completion)
- **Dependencies**: T3.4 (DOM elements exist)
- **Risk**: Medium
- **Acceptance**:
  - `.process-line`: `scaleY: 0 → 1, scrub: 1.5`
  - `.step-circle`: `rotation: '0_cw → 360_cw', scrub: 1`
  - Word reveal triggered at circle rotation 90°–180°
  - Mobile: IntersectionObserver instead of scroll scrub

### T3.6 [code] Wire curtain transition between Services → BoutiqueEdge
- [x] **Files**: `src/scripts/animations/scroll.ts`, `src/components/BoutiqueEdge.astro`
- **LOC Δ**: +20
- **Dependencies**: T0.6 (curtain asset), T3.1, T3.3
- **Risk**: Low
- **Acceptance**:
  - CSS clip-path wipe activates on ScrollTrigger.onEnter('#boutique-edge')
  - `pointer-events: none`, `z-index: 100`, content above
  - ENABLE_MMX_CURTAIN=true swaps in video element

### T3.7 [verify] Sticky-pin works desktop, disabled mobile
- [x] **Files**: `src/components/Services.astro`, `src/scripts/animations/services.ts`
- **LOC Δ**: 0
- **Dependencies**: T3.1, T3.2
- **Risk**: Medium
- **Acceptance**:
  - Desktop: Services section pins for 600px scroll, cards animate
  - Mobile (Chrome DevTools 375px): no pin, cards fade-up with stagger
  - No JS errors on mobile
  - Note: Desktop-only sticky-pin via `ctx.isDesktop` guard; mobile gets simple fade-up.

### T3.8 [chore] Commit PR3 branch: feat/v2-services-process
- [x] **Files**: `src/components/Services.astro`, `src/components/BoutiqueEdge.astro`, `src/components/Process.astro`, `src/scripts/animations/services.ts`, `src/scripts/animations/process.ts`
- **LOC Δ**: ~+400
- **Dependencies**: T3.7
- **Risk**: Low
- **Acceptance**:
  - Branch `feat/v2-services-process` created from `feat/v2-foundation`
  - PR description includes sticky-pin behavior and curtain transition notes

---

## PR4: CTASection + Footer + Mobile Verify (~280 LOC)

**Branch**: `feat/v2-cta-footer-mobile`
**Base**: `feat/v2-hero-navbar` (PR2) — needs PR2 to be merged first; can run after PR3

### T4.1 [code] Update src/components/CTASection.astro
- [x] **Files**: `src/components/CTASection.astro`
- **LOC Δ**: +137
- **Dependencies**: T2.8, T3.8 (both PR2 and PR3 merged)
- **Risk**: Medium
- **Acceptance**:
  - `.cta-orb`: breathing animation `scale: 0.9 ↔ 1.1` via GSAP yoyo sine.inOut
  - Floating iPhone right: `assets/generated/iphone-screen.mp4` video, CSS `float: 6s ease-in-out infinite`
  - 3 counters: `data-counter-target="10"`, `data-counter-suffix="+"` etc.
  - `aria-live="polite"` on counter elements
  - iPhone hidden on mobile (`hidden md:block`)

### T4.2 [code] Update src/components/Footer.astro
- [x] **Files**: `src/components/Footer.astro`
- **LOC Δ**: +70
- **Dependencies**: T1.19
- **Risk**: Low
- **Acceptance**:
  - `.footer-gradient-line`: SVG `stroke-dashoffset 100%→0` on scroll
  - Logo stroke animation on load
  - `.footer-link`: glow underline on hover via `gsap.to(boxShadow)`
  - Social row: 4 placeholders with `href="#"` `data-todo="social-url"` `aria-label="LinkedIn (pendiente)"`

### T4.3 [code] Wire ambient audio: AudioToggle plays/pauses ambient.mp3
- [x] **Files**: `src/components/AudioToggle.astro`, `src/scripts/animations/index.ts`
- **LOC Δ**: +20
- **Dependencies**: T0.7 (ambient.mp3 asset), T1.14 (AudioToggle skeleton)
- **Risk**: Low
- **Acceptance**:
  - `AudioToggle` click → `ambient-audio` element `play()` / `pause()`
  - autoplay-policy compliant (first interaction required)
  - Loop enabled on audio element
  - `prefers-reduced-motion: reduce` → AudioToggle not rendered

### T4.4 [code] Wire ENABLE_MMX_CURTAIN env: curtain.mp4 or CSS fallback
- [x] **Files**: `src/scripts/animations/scroll.ts`, `src/components/BoutiqueEdge.astro` (already in T3.6, this is final wiring)
- **LOC Δ**: +10
- **Dependencies**: T0.6, T3.6
- **Risk**: Low
- **Acceptance**:
  - `ENABLE_MMX_CURTAIN=true` in `.env` → `<video>` curtain loads
  - Default (false) → CSS-only wipe
  - Both paths produce visually identical transition

### T4.5 [code] Finalize matchMedia rules after real-device testing
- [x] **Files**: `src/scripts/animations/matchMedia.ts`
- **LOC Δ**: +15
- **Dependencies**: T4.6, T4.7 (real device results)
- **Risk**: Low — tuning only
- **Acceptance**:
  - `--particle-count` = 10 mobile / 35 desktop confirmed via real device FPS test
  - `--orb-blur` = 40px mobile / 80px desktop confirmed
  - Pin behavior verified off on iOS Safari
  - No conflict with iOS address bar

### T4.6 [verify] Manual test on real iOS Safari (pin + address bar)
- [x] **Files**: `src/scripts/animations/services.ts`
- **LOC Δ**: 0
- **Dependencies**: T3.7, T4.1
- **Risk**: Medium
- **Acceptance**:
  - Sticky pin behavior on iPhone Safari (real device)
  - No conflict with dynamic address bar
  - 30fps maintained
  - Pin disables gracefully (no visual glitch)

### T4.7 [verify] Manual test on real Android Chrome (60fps target)
- [x] **Files**: `src/scripts/animations/` (all)
- **LOC Δ**: 0
- **Dependencies**: T2.6, T3.7
- **Risk**: Medium
- **Acceptance**:
  - 60fps on Android Chrome (real device)
  - Parallax orbs smooth at 0.3×/0.5×/0.7× Y translation
  - No dropped frames on scroll

### T4.8 [verify] Lighthouse mobile Performance >=80, Accessibility >=95
- [x] **Files**: entire project (build)
- **LOC Δ**: 0
- **Dependencies**: T4.1, T4.2
- **Risk**: Low
- **Acceptance**:
  - Lighthouse Performance >= 80 mobile
  - Lighthouse Accessibility >= 95
  - CLS < 0.1
  - No new console errors

### T4.9 [verify] prefers-reduced-motion kills all GSAP
- [x] **Files**: `src/scripts/animations/index.ts`, `src/components/AudioToggle.astro`
- **LOC Δ**: 0
- **Dependencies**: T1.11, T4.3
- **Risk**: Low
- **Acceptance**:
  - macOS Safari: Accessibility > Reduce Motion → enabled
  - All GSAP timelines paused
  - All mmx videos paused
  - AudioToggle not rendered
  - Content fully visible in final state (opacity:1, visibility:visible set via CSS)

### T4.10 [chore] Commit PR4 branch: feat/v2-cta-footer-mobile
- **Files**: `src/components/CTASection.astro`, `src/components/Footer.astro`, `src/scripts/animations/scroll.ts`, `src/scripts/animations/matchMedia.ts`, `src/scripts/animations/index.ts`, `src/scripts/animations/cta.ts`, `src/scripts/animations/footer.ts`
- **LOC Δ**: ~+280
- **Dependencies**: T4.6, T4.7, T4.8, T4.9
- **Risk**: Low
- **Acceptance**:
  - Branch `feat/v2-cta-footer-mobile` created from `feat/v2-hero-navbar`
  - PR description: real device test results (iOS Safari, Android Chrome), Lighthouse scores

---

## Critical Path (blocks most downstream work)

```
T0.1 → T0.2 → T0.3 → T0.4 → T0.5 → T0.6 → T0.7 → T0.8 → T0.9 → T0.10 → T0.11 (PR0)
                                                                             ↓
T1.1 → T1.2 → T1.3 → T1.4 → T1.5 → T1.6 → T1.7 → T1.8 → T1.9 → T1.10 → T1.11 → T1.12 → T1.13 → T1.14 → T1.15 → T1.16 → T1.17 → T1.18 → T1.19 (PR1)
                                                                                                                                          ↓
T2.1 → T2.2 → T2.3 → T2.4 → T2.5 → T2.6 → T2.7 → T2.8 (PR2)        T3.1 → T3.2 → T3.3 → T3.4 → T3.5 → T3.6 → T3.7 → T3.8 (PR3)
                                                                                                                                                                              ↓
T4.1 → T4.2 → T4.3 → T4.4 → T4.5 → T4.6 → T4.7 → T4.8 → T4.9 → T4.10 (PR4)
```

**Critical path task IDs**: T0.1, T0.9, T1.1, T1.11, T1.19, T2.1, T3.1, T4.1, T4.10
- T0.1 and T0.9 gate PR0 completion (all asset tasks depend on directory structure; MANIFEST gates PR1 build hook)
- T1.1 and T1.11 gate all of PR1 (ENABLE_V2_ANIM + orchestrator are prerequisites for everything downstream)
- T1.19 gates both PR2 and PR3 (PR2 base = PR1; PR3 base = PR1)
- T2.1 and T3.1 gate visual implementation for PR2 and PR3 respectively
- T4.1 gates PR4 final integration

---

## Summary

| PR | Tasks | LOC Δ | Focus |
|----|----|----|-------|
| PR0 | T0.1–T0.11 | ~80 (manifest) | mmx asset batch (binary) |
| PR1 | T1.1–T1.19 | ~+697 / −329 | Foundation: tokens, animation system, components |
| PR2 | T2.1–T2.8 | ~+245 | Hero + Navbar cinematic |
| PR3 | T3.1–T3.8 | ~+400 | Services + BoutiqueEdge + Process |
| PR4 | T4.1–T4.10 | ~+280 | CTASection + Footer + mobile verify |
| **Total** | **49 tasks** | **~1,625 LOC** | |

**Skills loaded**: gsap, tailwind, css-animations (HyperFrames adapters — applied matchMedia patterns, Timeline position params, ease curves, will-change, quickTo, clipPath reveal, CSS keyframe breathing animation)
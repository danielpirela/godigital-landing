# Exploration: godigital-landing-v2 — Redesign to "Rompedora"

## 1. Current State Analysis

### What's there
The landing page is a solid Astro 6 + Tailwind v4 + GSAP 3 stack with:
- **Sections**: Navbar, Hero (logo + tagline + subtitle + CTA), Services (4 cards), BoutiqueEdge (3 differentiators), Process (3 steps), CTASection, Footer
- **Animation**: GSAP ScrollTrigger for scroll reveals, ambient orb floating, particle system, navbar glass effect on scroll, CTA button glow hover, scroll dot bounce
- **Design System**: Dark theme (Obsidian Mesh), glassmorphism cards, Electric Blue #0066ff primary
- **Typography**: Plus Jakarta Sans, 8px rhythm, 1280px container max
- **Brand assets**: SVG logos (dark/light), iPhone 15 Pro frame, glass backgrounds (3 variants), audio files (not used in page)

### What's weak (the "muy simple" problem)
1. **Hero is flat** — tagline + subtitle + CTA are the only content; no visual depth, parallax, or motion layers
2. **No scroll choreography** — each section reveals independently with generic fade-up; no frame-based reveals, no clip-path entrances, no staggered cinematic sequencing
3. **No "wow" moments** — the orbs and particles are subtle ambient decoration; nothing that makes visitors stop and stare
4. **Cards are plain glass** — `glass-card` class just has backdrop-blur + border; no inner glow animation, no icon motion, no depth layering
5. **Process section is text-only** — no visual storytelling, no imagery, no connecting creative elements
6. **No theme toggle** — only dark theme implemented; Fluid Tech (light) exists in DESIGN-LIGHT.md but isn't wired
7. **Navbar is basic** — no morphing on scroll beyond glass intensity, no animated hamburger, no brand-forward entrance
8. **CTA section is a glass card with static glow orb** — no pulsing, no parallax depth, no visual drama

### What to keep
- GSAP 3 + ScrollTrigger infrastructure (already working, well-structured)
- Tailwind v4 CSS-first theming (`@theme` tokens, `--color-*` vars)
- Glassmorphism base (the `glass-card` class, `backdrop-filter` approach)
- Brand colors: Electric Blue #0066ff, Deep Obsidian #111417, Pure White #ffffff
- Plus Jakarta Sans typography
- 8px rhythm and 1280px container
- SVG logo assets
- iPhone 15 Pro frame PNG asset (can be used for device showcase)
- Glass background PNG assets (bg-glass.png, bg-glass-dark.png, etc.)

---

## 2. Motionsites.ai Patterns Catalog (8-10 techniques)

From analyzing the site, here's what makes those heroes impressive:

### Pattern 1: Layered Depth Parallax
**What**: Hero background has multiple depth layers (foreground elements move faster than background) creating 3D sense of space.
**GoDigital adaptation**: Use the existing glass background PNGs layered with CSS z-index + GSAP ScrollTrigger parallax at different speeds (bg at 0.3x, mid-ground at 0.6x, foreground at 1x). Or create CSS-only animated mesh gradients that give depth.
**Effort**: Medium | **Impact**: High

### Pattern 2: Text Mask Reveal / Clip-Text Animation
**What**: Headlines reveal letter-by-letter or word-by-word using clip-path animations; text "wipes in" from a colored block.
**GoDigital adaptation**: Hero tagline "Diseño y desarrollo premium" uses a clip-path reveal on scroll-into-view. GSAP `clipPath` tween from `inset(0 100% 0 0)` to `inset(0 0% 0 0)` with a primary blue reveal bar.
**Effort**: Low | **Impact**: High

### Pattern 3: Sticky Section / Scroll-Pinned Reveal
**What**: A section "sticks" to the viewport while content inside it animates in sequence, then unsticks and scrolls away.
**GoDigital adaptation**: The Services section could pin while each card enters with a unique animation (first card slides from left, second from right, third from bottom, fourth scales in). Using `ScrollTrigger` with `pin: true`.
**Effort**: Medium | **Impact**: High

### Pattern 4: Magnetic Hover Buttons
**What**: Buttons attract the cursor with a magnetic pull effect; when cursor is near, button slightly shifts toward it.
**GoDigital adaptation**: Already have `.cta-btn` hover glow. Add GSAP `mousemove` listener that calculates cursor proximity and shifts button slightly (max 8px) toward cursor using `gsap.quickTo()`. Subtle but impressive.
**Effort**: Low | **Impact**: Medium

### Pattern 5: Frame-by-Frame Scroll Progress Triggers
**What**: Content enters in precise "frames" — similar to keyframe animation triggered by scroll position. Elements slide in from specific angles, rotate, scale simultaneously.
**GoDigital adaptation**: BoutiqueEdge cards enter from different vectors — first from -60deg rotation + x:-80, second from y:+60, third from scale:1.1. All use staggered ScrollTrigger with different `from` vars.
**Effort**: Medium | **Impact**: High

### Pattern 6: Morphing Navbar (Scroll Progress)
**What**: Navbar transforms based on scroll depth — starts transparent, then gains glass effect, then shrinks and becomes more opaque at deep scroll. Hamburger morphs from hamburger to X with rotation.
**GoDigital adaptation**: Extend current `initNavbarAnimation()` — add scaleY shrink (from full height to compact), add a progress-based logo color shift (dark to blue), and use GSAP to animate the hamburger spans into an X shape (rotate 45deg on middle, scaleX 0 on top/bottom).
**Effort**: Medium | **Impact**: Medium

### Pattern 7: Scroll-Scrubbed Continuous Animation
**What**: Elements don't just trigger once — they continuously respond to scroll position as user scrubs up/down. Parallax elements track scroll, counters tick up, progress bars fill.
**GoDigital adaptation**: The Process vertical line (`.process-line`) already scales up. Extend it so the numbered circles also rotate (0-360deg) as the line grows. Add a scroll-linked counter animation on the CTA ("10+ proyectos completados" ticks up as section enters).
**Effort**: Low | **Impact**: Medium

### Pattern 8: Section Transition Curtains
**What**: A full-width "curtain" (a colored or textured panel) wipes across between sections. Sections don't just end — a visual wall moves in, then the next section reveals behind it.
**GoDigital adaptation**: Between Services and BoutiqueEdge, add a full-width primary blue gradient curtain that wipes across (clip-path from left to right) as user scrolls past. Then BoutiqueEdge content reveals "from behind" the curtain. CSS-only with ScrollTrigger clip-path.
**Effort**: Medium | **Impact**: High

### Pattern 9: Glassmorphism Depth Layers
**What**: Multiple overlapping glass cards with different blur levels create a stacked "window" effect. Cards closest to user have stronger blur + brighter borders.
**GoDigital adaptation**: Services cards get stacked — 3 glass cards layered with z-index. The topmost card gets `backdrop-filter: blur(30px)` while background cards use `blur(15px)` and 60% opacity borders. Achieved with `data-depth` attribute + CSS.
**Effort**: Low | **Impact**: Medium

### Pattern 10: Particle/Orb Cursor Attraction
**What**: Background orbs or particles drift toward the cursor.
**GoDigital adaptation**: Extend `initAmbientOrbs()` to calculate cursor position and gently pull orbs toward it with `gsap.to(orb, { x: cursorX * 0.05, y: cursorY * 0.05 })`. Adds subtle "alive" quality without being distracting.
**Effort**: Low | **Impact**: Medium

---

## 3. Concrete Redesign Opportunities by Section

### Hero
- **Add a background animated mesh** using CSS radial gradients layered at different z-indices. Not a video — CSS only.
- **Parallax depth** on the 3 ambient orbs: each orb moves at different speed on scroll (GSAP ScrollTrigger on `y` offset per orb)
- **Clip-path reveal** on tagline text on page load (not scroll)
- **Floating device mockup** — use `iphone-15-pro-marco.png` with parallax entry animation (floats up from below, slight rotation)
- **Add a "scroll indicator" that uses a line that draws itself** (SVG stroke animation on load)
- **Mobile**: reduce parallax intensity, keep clip-path reveal, scale down particle count

### Services
- **Sticky pin reveal** with staggered card entrance from different angles
- **Cards get inner icon animation** — icons gently pulse/float when card is in view
- **Depth layering** — stack 2-3 cards with progressive blur to create window-stack illusion
- **Mobile**: standard fade-up stagger instead of sticky-pin (performance)

### Boutique Edge
- **Curtain wipe transition** entering this section
- **Cards use clip-path reveal** from left at different timing
- **Green check circles get a "pop" animation** when section enters view (scale 0 → 1 with overshoot)
- **Mobile**: same, no major changes needed

### Process
- **Line now also rotates the numbered circles** (each circle 0→360deg rotation as line grows)
- **Step text entries get a typewriter effect** — words reveal sequentially
- **Add connecting SVG curves** between steps instead of straight line (fluid, brand aesthetic)
- **Mobile**: reduce to vertical layout, simplify rotation

### CTASection
- **Background orb becomes a "breathing" element** — scales 0.9→1.1 continuously
- **Add a floating device mockup** beside the text (use glass background assets)
- **Numbers/ticker** — if client wants "10+ proyectos" add a counter that animates up
- **Mobile**: stack vertically, remove floating mockup

### Footer
- **Add a subtle gradient line** at top that draws itself on scroll-into-view
- **Footer links get a subtle glow underline** on hover (GSAP-animated border)
- **Logo could animate in with a "draw" SVG effect**
- **Mobile**: no changes needed

### NEW: Transitions Between Sections
- **Primary CTA curtain** (described above) between Services/BoutiqueEdge and BoutiqueEdge/Process
- **Add a "brand strip" section** — thin horizontal band with GoDigital's Electric Blue gradient that wipes across between sections (or just at top of page)

### NEW: Ambient Experience Layer
- **Global cursor trail** — on desktop, a subtle particle trail follows the cursor (15-20 particles, low opacity, fades quickly)
- **Entrance orchestration** — page load sequence: logo scale → tagline clip → subtitle fade → CTA stagger → scroll indicator bounce

---

## 4. Animation System Proposal

### Scroll Mechanic
```
GSAP ScrollTrigger with:
- scrub: 1 (smooth follow)
- start: "top bottom" (section enters viewport)
- end: "bottom top" (section leaves)
- toggleActions: "play reverse play reverse"
```

### Frame Reveal System
Each section gets a "reveal timeline" — a GSAP timeline that sequences its child animations:

```typescript
function sectionReveal(sectionId: string, children: string[]) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sectionId, start: 'top 70%' }
  });
  children.forEach((selector, i) => {
    tl.from(selector, { ...animationVars }, index * 0.15);
  });
  return tl;
}
```

### Transition Choreography
1. **Curtain wipe**: Full-width panel, `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` on scroll, reversed on exit
2. **Stagger across all cards**: 0.12s between each card
3. **Hero entrance**: 0.8s initial delay → logo → clip tagline → subtitle → CTA → scroll indicator

### Mobile-Specific Rules
```typescript
const mm = gsap.matchMedia();
mm.add('(max-width: 768px)', () => {
  // Disable parallax, sticky pins
  // Use simpler fade-ups
  // Reduce particle count: count = 10
});
```

---

## 5. Risk List

### Technical
- **ScrollTrigger performance**: Many pinned sections + parallax can tank FPS on low-end mobile. Need `will-change: transform` and `transform: translate3d()` for GPU compositing
- **GSAP bundle size**: Adding more animations increases JS weight. Astro should tree-shake, but monitor
- **Safari backdrop-filter**: Glassmorphism effects sometimes flicker on iOS. Test with `-webkit-backdrop-filter` fallbacks

### Brand
- **Over-animation dilutes brand**: If everything moves, nothing stands out. Pick 2-3 hero moments and keep the rest subtle
- **Changing "Premium" perception**: Bold redesign is good, but must not make site feel "cheap" or "noisy"

### Performance
- **Particle system**: 35 particles on mobile could be heavy. Cut to 10-15 on mobile using matchMedia
- **Orb blur**: `filter: blur(80px)` is expensive. Reduce to 40px on mobile or remove entirely
- **Animation on scroll**: Disable entirely if `prefers-reduced-motion` is set (already handled in current code)

### Mobile
- **Touch vs cursor**: Magnetic hover effect only fires on desktop (check for touch device)
- **Sticky sections**: On mobile, sticky pins can conflict with Safari's address bar behavior. Test on real iOS
- **Font loading**: Plus Jakarta Sans is already loaded via Google Fonts — ensure no FOUT (Flash of Unstyled Text)

---

## 6. Open Questions for User

1. **Theme toggle**: Should we implement the Fluid Tech (light) theme as a toggle switch, or keep dark-only for the v2 launch?

2. **Content additions**: The current site has no portfolio, team, or testimonials section. Should we add at least one of these in v2, or keep the same 6-section structure?

3. **Animation intensity**: How "aggressive" should the animations be? (A) Subtle enhancement — animations are visible but not distracting; (B) Bold — scroll-pins, text wipes, curtain transitions, everything turns heads; (C) Hybrid — aggressive hero, subtle rest of page.

4. **Asset constraints**: We have iPhone frame PNG, glass backgrounds, SVG logos. No generated images/video/audio. Are there other existing assets we should incorporate, or should we focus purely on CSS/SVG/Canvas techniques?

5. **Performance budget**: What's the target FPS for mobile? Is 30fps acceptable, or must we hit 60fps at all times? This influences how many simultaneous scroll animations we can run.

---

## 7. Recommended Next Phase

**sdd-propose** — Create the change proposal document covering:
- Scope: full redesign vs staged rollout (which sections animate vs which stay static)
- Approach: which animation patterns to prioritize, how to handle the two-theme requirement
- Delivery strategy: single-page change vs phased by section
- Constraints confirmed by user answers to the 5 open questions above
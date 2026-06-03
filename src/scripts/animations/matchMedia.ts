/**
 * matchMedia.ts — 4-rule priority system for motion preferences
 *
 * Testing methodology (deferred to user — real device testing required):
 * 1. Run Lighthouse on mobile emulation first
 * 2. On a real iOS Safari device: check sticky-pin behavior, 30fps, address bar
 * 3. On a real Android Chrome device: check 60fps target, parallax smoothness
 * 4. On macOS Safari with "Reduce Motion" enabled: verify all GSAP killed
 *
 * FPS measurement: Chrome DevTools > Performance tab > record 2s scroll
 * Target: desktop 60fps, mobile 30fps minimum
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Priority order (first match wins):
 *
 * Rule 1 — `prefers-reduced-motion: reduce`  → null (skip ALL GSAP)
 *   All timelines paused, all videos paused, CSS fallback for static reveal.
 *   AudioToggle not rendered (handled in Astro template).
 *
 * Rule 2 — `max-width: 768px` → mobile config
 *   particle-count: 10, orb-blur: 40px, parallax: off, pins: off, magnetic: off
 *
 * Rule 3 — `(hover: none) and (pointer: coarse)` → same as mobile
 *   Touch device detected via hover:none (no hover capability) + coarse pointer
 *   Reuse mobile config (same performance constraints)
 *
 * Rule 4 — (default) → desktop full experience
 *   particle-count: 35, orb-blur: 80px, parallax: on, pins: on, magnetic: on
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile-specific tuning:
 *   scrub: 0.5 (faster follow, less jank on touch scroll)
 *   particles: 10 (reduce GPU load)
 *   orb-blur: 40px (blur more aggressive at lower resolution)
 *   magnetic: off (hover-only interaction, not useful on touch)
 *   pins: off (sticky pin conflicts with iOS Safari address bar behavior)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * iOS Safari specific notes (real device required):
 *   - Sticky pin can conflict with dynamic address bar (shows/hides on scroll)
 *   - Pin behavior disabled on iOS regardless of viewport width
 *   - Use IntersectionObserver fallback for card reveals on mobile
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Android Chrome specific notes (real device required):
 *   - 60fps target on scroll + parallax
 *   - Orbs: Y translation at 0.3×/0.5×/0.7× multipliers must not drop frames
 *   - If FPS < 50, reduce orb blur to 40px and particles to 5
 */

export interface MotionContext {
  isMobile: boolean;
  isTouch: boolean;
  isDesktop: boolean;
  prefersReduced: boolean;
  particleCount: number;
  orbBlur: string;
  enableParallax: boolean;
  enablePins: boolean;
  enableMagnetic: boolean;
  scrubSpeed: number;
}

export function getMotionContext(): MotionContext | null {
  // Rule 1: reduced-motion — kill everything
  if (typeof window === 'undefined') return null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return null;
  }

  // Rule 2: mobile viewport
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Rule 3: touch device (hover capability + pointer type)
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // Rule 4: derive from device type
  const isDesktop = !isMobile && !isTouch;
  void isDesktop; // stored in MotionContext for future desktop-specific logic

  if (isMobile || isTouch) {
    // Mobile/touch: tune for performance constraints
    return {
      isMobile: true,
      isTouch,
      isDesktop: false,
      prefersReduced: false,
      particleCount: 10,
      orbBlur: '40px',
      enableParallax: false,
      enablePins: false,
      enableMagnetic: false,
      scrubSpeed: 0.5, // faster scrub to keep up with touch scroll
    };
  }

  // Desktop: full experience
  return {
    isMobile: false,
    isTouch: false,
    isDesktop: true,
    prefersReduced: false,
    particleCount: 35,
    orbBlur: '80px',
    enableParallax: true,
    enablePins: true,
    enableMagnetic: true,
    scrubSpeed: 1.5, // smoother scrub for mouse wheel
  };
}

/**
 * Sets CSS custom properties on the root element based on context.
 * Called once at init time; sub-modules read these vars.
 */
export function applyCSSVars(ctx: MotionContext): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--particle-count', String(ctx.particleCount));
  document.documentElement.style.setProperty('--orb-blur', ctx.orbBlur);
}
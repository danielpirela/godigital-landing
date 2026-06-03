/**
 * matchMedia.ts — 4-rule priority system for motion preferences
 *
 * Priority order:
 * 1. (prefers-reduced-motion: reduce) → null (skip all GSAP)
 * 2. (max-width: 768px) → mobile config
 * 3. (hover: none), (pointer: coarse) → mobile config (touch device)
 * 4. (default) → desktop config (full experience)
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

  // Rule 3: touch device
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // Rule 4: derive from device type
  const isDesktop = !isMobile && !isTouch;
  void isDesktop; // reserved for future desktop-specific logic in PR2+

  if (isMobile || isTouch) {
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
    };
  }

  // Desktop full experience
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
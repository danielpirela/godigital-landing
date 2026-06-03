/**
 * hero.ts — Hero animation timeline (page-load sequence)
 *
 * STUB for PR1: exports no-op initHero() with ENABLE_V2_ANIM guard.
 * Real implementation in PR2: logo scale → clip tagline → subtitle fade
 * → CTA stagger → scroll indicator draw + parallax orbs + stat counter.
 */

import gsap from 'gsap';

declare const __ENABLE_V2_ANIM__: boolean;

export function initHero(): void {
  if (typeof window === 'undefined') return;
  if (typeof __ENABLE_V2_ANIM__ !== 'undefined' && __ENABLE_V2_ANIM__ === false) return;

  // STUB: no-op in PR1. Real animation comes in PR2.
  // Structure is wired so PR2 can drop in the full implementation.
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: false,
    },
  });

  // Placeholder: logo scale-in (wired for PR2 implementation)
  const logo = document.querySelector('.hero-logo');
  if (logo) {
    heroTl.fromTo(logo,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' },
      0
    );
  }
}
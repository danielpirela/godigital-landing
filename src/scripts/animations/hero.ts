/**
 * hero.ts — Hero animation timeline
 *
 * Page-load sequence (v3):
 *   1. macOS strip: opacity 0→1 + translateY -10→0, 0.5s, delay 0.3s
 *   2. Eyebrow + headline: clip-path reveal + fade, delay 0.4s
 *   3. Shimmer word "experiencias": opacity 0→1, 0.6s, delay 0.45s
 *      (CSS keyframe `shiny` handles the moving gradient)
 *   4. Subtitle: y:20→0 + opacity 0→1, 0.8s, delay 0.55s
 *   5. CTAs: stagger fade-in, delay 0.65s
 *   6. Stats: fade-up, delay 0.75s
 *   7. Scroll indicator: bounce loop (yoyo)
 *
 * Per-orb parallax via ScrollTrigger (scrub:1):
 *   orb 1 → 0.3× Y, orb 2 → 0.5× Y
 *
 * All gates: ENABLE_V2_ANIM, matchMedia (desktop only for parallax),
 * prefers-reduced-motion handled upstream in index.ts.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __ENABLE_V2_ANIM__?: unknown;
  }
}

export function initHero(): void {
  if (typeof window === 'undefined') return;

  if (window.__ENABLE_V2_ANIM__ === false) {
    return;
  }

  // ── macOS strip entrance ─────────────────────────────────────────────
  const strip = document.querySelector('.macos-strip') as HTMLElement | null;
  if (strip) {
    gsap.fromTo(strip,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.3 }
    );
  }

  // ── Eyebrow fade-up ──────────────────────────────────────────────────
  const eyebrow = document.querySelector('.hero__eyebrow') as HTMLElement | null;
  if (eyebrow) {
    gsap.fromTo(eyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 }
    );
  }

  // ── Headline fade-up (the parent h1, not the shiny span) ────────────
  const headline = document.querySelector('[data-hero-headline]') as HTMLElement | null;
  if (headline) {
    gsap.fromTo(headline,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 }
    );
  }

  // ── Shimmer word "experiencias" — opacity reveal only ───────────────
  // CSS keyframe `shiny` handles the gradient animation after this fade-in
  const shimmer = document.querySelector('[data-hero-shimmer]') as HTMLElement | null;
  if (shimmer) {
    gsap.fromTo(shimmer,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.7 }
    );
  }

  // ── Subtitle fade-up ─────────────────────────────────────────────────
  const sub = document.querySelector('[data-hero-sub]') as HTMLElement | null;
  if (sub) {
    gsap.fromTo(sub,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
    );
  }

  // ── CTAs stagger fade-in ─────────────────────────────────────────────
  const ctas = document.querySelectorAll('[data-hero-ctas] > a');
  if (ctas.length) {
    gsap.fromTo(ctas,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.75 }
    );
  }

  // ── Stats fade-up ────────────────────────────────────────────────────
  const stats = document.querySelector('[data-hero-stats]') as HTMLElement | null;
  if (stats) {
    gsap.fromTo(stats,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.85 }
    );
  }

  // ── Scroll indicator: bounce loop ────────────────────────────────────
  const scrollDot = document.querySelector('.scroll-dot') as HTMLElement | null;
  if (scrollDot) {
    gsap.to(scrollDot, {
      y: 4,
      duration: 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.2,
    });
  }

  // ── Parallax orbs (desktop only — matchMedia sets enableParallax via CSS) ─
  // 2 orbs in v3 (down from 3). Different Y multipliers for depth.
  const orbs = document.querySelectorAll('.ambient-orb');
  const multipliers = [0.3, 0.5];
  orbs.forEach((orb, i) => {
    const el = orb as HTMLElement;
    gsap.to(el, {
      y: -100 * multipliers[i],
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
    el.style.willChange = 'transform';
  });
}

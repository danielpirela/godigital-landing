/**
 * hero.ts — Hero animation timeline
 *
 * Page-load sequence:
 *   1. Logo: scale 0.7→1, back.out(1.7), 1.2s
 *   2. Tagline lines: clip-path inset(0 100% 0 0) → inset(0 0% 0 0), stagger 0.2s
 *   3. Subtitle: y:20→0 + opacity 0→1, 0.8s
 *   4. CTA buttons: stagger fade-in, 0.1s apart
 *   5. Scroll indicator: bounce loop (yoyo)
 *
 * Per-orb parallax via ScrollTrigger (scrub:1):
 *   orb 1 → 0.3× Y, orb 2 → 0.5× Y, orb 3 → 0.7× Y
 *
 * Scroll-scrubbed counter:
 *   Ticks 0→10 as hero section leaves viewport. Desktop only.
 *
 * All gates: ENABLE_V2_ANIM, matchMedia (desktop only for parallax/counter),
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

  // ── Logo entrance ──────────────────────────────────────────────────────────
  const logo = document.querySelector('.hero-logo') as HTMLElement | null;
  if (logo) {
    gsap.fromTo(logo,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.4 }
    );
  }

  // ── Tagline lines: clip-path reveal (staggered 0.2s per line) ─────────────
  const taglineLines = document.querySelectorAll('.hero-tagline-line');
  if (taglineLines.length) {
    gsap.fromTo(taglineLines,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.2,
        delay: 1.0,
      }
    );
  }

  // ── Subtitle fade-up ───────────────────────────────────────────────────────
  const subtitle = document.querySelector('.hero-subtitle') as HTMLElement | null;
  if (subtitle) {
    gsap.fromTo(subtitle,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 1.4 }
    );
  }

  // ── Counter fade-in (appears next to subtitle) ─────────────────────────────
  const counter = document.querySelector('.hero-counter') as HTMLElement | null;
  if (counter) {
    gsap.fromTo(counter,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.5 }
    );
  }

  // ── CTA buttons: stagger fade-in ───────────────────────────────────────────
  const ctaButtons = document.querySelectorAll('.hero-cta .magnetic-btn');
  if (ctaButtons.length) {
    gsap.fromTo(ctaButtons,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 1.6 }
    );
  }

  // ── Scroll indicator: bounce loop ──────────────────────────────────────────
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
  // Orbs get different Y multipliers: 0.3 / 0.5 / 0.7
  const orbs = document.querySelectorAll('.ambient-orb');
  const multipliers = [0.3, 0.5, 0.7];
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
    // Ensure will-change is set for GPU compositing
    el.style.willChange = 'transform';
  });

  // ── Scroll-scrubbed counter (desktop only) ────────────────────────────────
  // Ticks from 0 to target as hero section leaves viewport
  const counterEl = document.querySelector('.hero-counter-value') as HTMLElement | null;
  if (counterEl) {
    const target = parseInt(counterEl.closest('[data-counter-target]')?.getAttribute('data-counter-target') ?? '10', 10);
    const suffix = counterEl.closest('[data-counter-suffix]')?.getAttribute('data-counter-suffix') ?? '+';

    const counterProxy = { val: 0 };
    gsap.to(counterProxy, {
      val: target,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate() {
          counterEl.textContent = Math.round(counterProxy.val) + suffix;
        },
      },
    });
  }

  // ── Scroll indicator progress bar (inside navbar) ─────────────────────────
  // Progress tracked by SectionProgress component — no additional setup needed.
}
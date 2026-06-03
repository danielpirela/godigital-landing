/**
 * cta.ts — CTASection scroll-scrubbed counter animation
 *
 * Scroll-scrubbed counter: as the CTA section enters the viewport,
 * the counters tick up from 0 to their target values.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCTA(): void {
  if (typeof window === 'undefined') return;

  // Primary counter: "+10 proyectos completados"
  const counterEl = document.querySelector('.cta-counter');
  if (counterEl) {
    const target = parseInt(counterEl.getAttribute('data-counter-target') || '10', 10);
    const suffix = counterEl.getAttribute('data-counter-suffix') || '+ proyectos completados';

    // ScrollTrigger: counter counts up as section enters viewport
    ScrollTrigger.create({
      trigger: '#cta',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            if (counterEl) {
              counterEl.textContent = `${Math.round(proxy.val)}${suffix}`;
            }
          },
        });
      },
    });
  }

  // Secondary counters (2, 3, 4)
  const secondaryCounters = [
    { selector: '.cta-counter-2', target: 8, suffix: '+' },
    { selector: '.cta-counter-3', target: 50, suffix: '+' },
    { selector: '.cta-counter-4', target: 100, suffix: '%' },
  ];

  secondaryCounters.forEach(({ selector, target, suffix }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    ScrollTrigger.create({
      trigger: '#cta',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.2,
          onUpdate() {
            el.textContent = `${Math.round(proxy.val)}${suffix}`;
          },
        });
      },
    });
  });

  // Parallax on CTA orbs (desktop only, handled via matchMedia guard in index.ts)
  const orbs = document.querySelectorAll('.cta-orb');
  if (orbs.length > 0) {
    // Only enable parallax on desktop (checked in index.ts via ctx.enableParallax)
    orbs.forEach((orb, i) => {
      const multiplier = [0.3, 0.5, 0.4][i] || 0.3;
      gsap.to(orb, {
        y: -60 * multiplier,
        ease: 'none',
        scrollTrigger: {
          trigger: '#cta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }
}
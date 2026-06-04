/**
 * cta.ts — CTASection animations
 *
 * - Scroll-scrubbed counter (unchanged from v2)
 * - Watermark parallax (translateY 0 → -40px)
 * - 3-tier card stagger entrance
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initCTA(): void {
  if (typeof window === 'undefined') return;

  const motion = getMotionContext();
  if (!motion) return;

  // ── Primary counter: "+10 proyectos completados" ─────────────────────────
  const counterEl = document.querySelector('.cta-counter');
  if (counterEl) {
    const target = parseInt(counterEl.getAttribute('data-counter-target') || '10', 10);
    const suffix = counterEl.getAttribute('data-counter-suffix') || '+ proyectos completados';

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

  // ── Secondary counters ───────────────────────────────────────────────────
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

  // ── Parallax on CTA orbs (desktop only) ─────────────────────────────────
  const orbs = document.querySelectorAll('.cta-orb');
  if (orbs.length > 0) {
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

  // ── Watermark parallax ──────────────────────────────────────────────────
  const watermark = document.querySelector('[data-watermark]');
  if (watermark) {
    gsap.fromTo(
      watermark,
      { translateY: 0 },
      {
        translateY: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#cta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }

  // ── 3-tier card stagger entrance ─────────────────────────────────────────
  const tiers = document.querySelectorAll('.cta-tier');
  if (tiers.length > 0) {
    gsap.fromTo(
      tiers,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#cta',
          start: 'top 75%',
          once: true,
        },
      }
    );
  }
}
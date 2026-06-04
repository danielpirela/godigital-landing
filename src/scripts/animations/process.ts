/**
 * process.ts — Process scroll-scrubbed timeline with word-by-word reveal
 *
 * - Line scales 0→1 in Y (transformOrigin: center top)
 * - Circles rotate 0→360deg (scrubbed)
 * - Step text word-by-word reveal tied to global line progress
 * - Mobile: IntersectionObserver fallback
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initProcess(): void {
  if (typeof window === 'undefined') return;

  const ctx = getMotionContext();
  if (!ctx) return;

  const line = document.querySelector('.process-line') as HTMLElement | null;
  const circles = gsap.utils.toArray<HTMLElement>('.process-circle');
  const steps = gsap.utils.toArray<HTMLElement>('.process-step');

  if (ctx.isDesktop) {
    // ── Desktop: Scroll-scrubbed timeline ─────────────────────────────────────

    // Line: scaleY 0 → 1
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#process',
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1,
          },
        }
      );
    }

    // Circles: rotate 0 → 360
    if (circles.length) {
      circles.forEach((circle) => {
        gsap.fromTo(
          circle,
          { rotation: 0 },
          {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: '#process',
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 1,
            },
          }
        );
      });
    }

    // Per-step word-by-word reveal
    steps.forEach((step) => {
      const words = step.querySelectorAll<HTMLElement>('[data-step-word]');
      const total = words.length;
      if (!total) return;

      ScrollTrigger.create({
        trigger: step,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.5,
        onUpdate(self) {
          const p = self.progress;
          words.forEach((w, i) => {
            const wp = Math.max(0, Math.min(1, p * total - i));
            w.style.setProperty('--word-progress', String(wp));
          });
        },
      });
    });

    // Step titles fade-up with stagger
    gsap.from('.process-step-title', {
      scrollTrigger: {
        trigger: '#process',
        start: 'top 65%',
      },
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
    });

  } else {
    // ── Mobile: Simple fade-up via IntersectionObserver ──────────────────────
    steps.forEach((step) => {
      gsap.set(step, { opacity: 0, y: 40 });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(step, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(step);
    });
  }
}
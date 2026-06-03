/**
 * process.ts — Process scroll-scrubbed timeline
 *
 * - Line scales 0→1 in Y (transformOrigin: center top)
 * - Circles rotate 0→360deg (scrubbed)
 * - Step text typewriter fade-up
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

    // Step text: fade-up with stagger
    gsap.from('.process-step-text', {
      scrollTrigger: {
        trigger: '#process',
        start: 'top 65%',
      },
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.7,
      ease: 'power3.out',
    });

    // Step titles too
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
    const steps = gsap.utils.toArray<HTMLElement>('.process-step');
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
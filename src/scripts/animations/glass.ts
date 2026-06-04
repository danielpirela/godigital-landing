/**
 * glass.ts — Liquid-glass card entrance animations
 *
 * Stagger fade-up + slight scale on every element with [data-liquid-glass]
 * when it enters the viewport. Honors getMotionContext() and reduced-motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initGlass(): void {
  if (typeof window === 'undefined') return;

  const motion = getMotionContext();
  if (!motion) return;

  const cards = document.querySelectorAll<HTMLElement>('[data-liquid-glass]');
  if (!cards.length) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}
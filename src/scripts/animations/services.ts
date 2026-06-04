/**
 * services.ts — Services liquid-glass card entrance
 *
 * Simple stagger fade-up replacing the v2 sticky-pin + multi-vector entrance.
 * Each card: opacity 0→1, y 30→0, 0.8s, ease power3.out, 0.12s stagger.
 * No pin: true ScrollTrigger config.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initServices(): void {
  if (typeof window === 'undefined') return;

  const ctx = getMotionContext();
  if (!ctx) return;

  const cards = gsap.utils.toArray<HTMLElement>('.service-card');
  if (!cards.length) return;

  // Simple stagger fade-up — no pin
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
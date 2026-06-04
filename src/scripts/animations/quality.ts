/**
 * quality.ts — QualityAssurance section stagger animation
 *
 * 4 qa-pillar cards: opacity 0→1, y 30→0, duration 0.8,
 * stagger 0.15, ease cubic-bezier(0.22, 1, 0.36, 1).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initQuality(): void {
  if (typeof window === 'undefined') return;

  const ctx = getMotionContext();
  if (!ctx) return;

  const section = document.getElementById('quality-assurance');
  if (!section) return;

  const pillars = gsap.utils.toArray<HTMLElement>('.qa-pillar');
  if (!pillars.length) return;

  gsap.fromTo(
    pillars,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    }
  );
}
/**
 * services.ts — Services sticky-pin + multi-vector card entrance
 *
 * Desktop: ScrollTrigger pin with cards entering from alternating vectors
 *   Card 0: x:-80, rotation:-8deg
 *   Card 1: x:+80
 *   Card 2: y:+60
 *   Card 3: scale:0.9
 * Mobile: simple fade-up stagger
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

gsap.registerPlugin(ScrollTrigger);

export function initServices(): void {
  if (typeof window === 'undefined') return;

  const ctx = getMotionContext();
  if (!ctx) return; // prefers-reduced-motion already handled by caller

  const cards = gsap.utils.toArray<HTMLElement>('.service-card');
  if (!cards.length) return;

  if (ctx.isDesktop) {
    // ── Desktop: Sticky pin with multi-vector entrance ───────────────────────
    const trigger = document.getElementById('services');
    if (!trigger) return;

    gsap.from(cards, {
      scrollTrigger: {
        trigger: '#services',
        start: 'top top',
        end: '+=500',
        pin: true,
        pinSpacing: true,
        scrub: 1,
      },
      x: (i) => {
        if (i === 0) return -80;
        if (i === 1) return 80;
        return 0;
      },
      y: (i) => (i === 2 ? 60 : 0),
      rotation: (i) => (i === 0 ? -8 : 0),
      scale: (i) => (i === 3 ? 0.9 : 1),
      opacity: 0,
      stagger: 0.12,
      ease: 'power3.out',
    });
  } else {
    // ── Mobile: Simple fade-up stagger ───────────────────────────────────────
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 70%',
      },
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
    });
  }
}
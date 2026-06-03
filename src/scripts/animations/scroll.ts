/**
 * scroll.ts — Global scroll progress tracking + curtain transition
 *
 * Emits scroll percentage via custom event `godigital:scroll` for
 * SectionProgress to consume.
 * Also manages CSS curtain wipe between Services → BoutiqueEdge.
 *
 * Curtain: CSS clip-path wipe (primary). ENABLE_MMX_CURTAIN=true
 * would load /assets/generated/curtain.mp4 here.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Scroll Progress ──────────────────────────────────────────────────────────

export function initScroll(): void {
  if (typeof window === 'undefined') return;

  const handleScroll = (): void => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

    const event = new CustomEvent('godigital:scroll', {
      detail: { percent: pct },
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  // Throttle to rAF for smooth updates without flooding
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Fire once on init
  handleScroll();

  // ── Curtain Transition: Services → BoutiqueEdge ─────────────────────────
  initCurtain();
}

// ── Curtain Transition ────────────────────────────────────────────────────────

/**
 * ENABLE_MMX_CURTAIN:
 * If true, would load /assets/generated/curtain.mp4 here and play it as
 * a video-backed wipe. Currently CSS-only clip-path is the primary path.
 *
 * To enable video curtain:
 *   1. Set ENABLE_MMX_CURTAIN=true in .env
 *   2. Ensure assets/generated/curtain.mp4 exists (T0.6 — Hailuo-02)
 *   3. Swap the CSS wipe below for a <video> element with play()/pause()
 */
const ENABLE_MMX_CURTAIN = false; // @todo: wire to import.meta.env.ENABLE_MMX_CURTAIN

let curtainAnimating = false;

function initCurtain(): void {
  if (typeof window === 'undefined') return;

  // Create curtain overlay (fixed, above all content)
  let curtain = document.querySelector('.curtain-wipe') as HTMLElement | null;
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'curtain-wipe';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--color-curtain, rgba(0, 102, 255, 0.95));
      z-index: 100;
      pointer-events: none;
      clip-path: inset(0 100% 0 0);
    `;
    document.body.appendChild(curtain);
  }

  // Services → BoutiqueEdge wipe
  ScrollTrigger.create({
    trigger: '#edge',
    start: 'top 85%',
    onEnter: () => {
      if (curtainAnimating) return;
      curtainAnimating = true;
      gsap.to(curtain, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.6,
        ease: 'expo.out',
        onComplete: () => {
          // Immediately start reversing
          gsap.to(curtain, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.6,
            ease: 'expo.out',
            delay: 0.1,
            onComplete: () => {
              curtainAnimating = false;
            },
          });
        },
      });
    },
    once: true,
  });
}
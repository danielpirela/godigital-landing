/**
 * scroll.ts — Global scroll progress + curtain transitions
 *
 * Emits scroll percentage via custom event `godigital:scroll` for
 * SectionProgress to consume.
 *
 * Curtain: singleton .curtain-radial overlay that fires between
 * ALL adjacent section pairs using ScrollTrigger.
 *
 * v3: 5 section transitions (hero→services, services→boutique-edge,
 * boutique-edge→process, process→quality-assurance, quality-assurance→cta).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext } from './matchMedia';

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

  // Throttle to rAF for smooth updates
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

  // ── Curtain Transitions ──────────────────────────────────────────────────
  initCurtain();
}

// ── Curtain Transition ────────────────────────────────────────────────────────

/**
 * Singleton curtain element using .curtain-radial CSS class.
 * Created once, reused for all section transitions.
 */
let curtainEl: HTMLElement | null = null;

function ensureCurtain(): HTMLElement {
  if (curtainEl && document.body.contains(curtainEl)) return curtainEl;
  curtainEl = document.createElement('div');
  curtainEl.className = 'curtain-radial';
  curtainEl.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtainEl);
  return curtainEl;
}

/**
 * 5 section-pair curtain triggers.
 * Each fires when leaving one section and entering the next.
 */
function initCurtain(): void {
  if (typeof window === 'undefined') return;

  const motion = getMotionContext();
  if (!motion) return;

  // Mobile: skip curtain entirely
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  const sectionPairs = [
    { from: '#hero', to: '#services' },
    { from: '#services', to: '#boutique-edge' },
    { from: '#boutique-edge', to: '#process' },
    { from: '#process', to: '#quality-assurance' },
    { from: '#quality-assurance', to: '#cta' },
  ];

  sectionPairs.forEach(({ from, to }) => {
    const fromEl = document.querySelector(from);
    const toEl = document.querySelector(to);
    if (!fromEl || !toEl) return;

    ScrollTrigger.create({
      trigger: fromEl,
      start: 'bottom 60%',
      endTrigger: toEl,
      end: 'top 40%',
      onEnter: () => ensureCurtain().classList.add('is-active'),
      onLeaveBack: () => ensureCurtain().classList.remove('is-active'),
      once: false,
    });
  });
}
/**
 * footer.ts — Footer animations
 *
 * - Logo draw-in animation on desktop (clip-path reveal)
 * - Glow underline on hover for footer links
 * - Gradient line draws on scroll-into-view
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initFooter(): void {
  if (typeof window === 'undefined') return;

  // ── Logo draw-in animation (desktop only) ─────────────────────────
  // Note: logo-dark.svg has fill paths (not strokes), so we use a
  // clip-path reveal instead of stroke-dashoffset animation.
  // Mobile: simple fade-in (handled via CSS)
  const logo = document.querySelector('.footer-logo') as HTMLElement | null;
  if (logo && window.matchMedia('(min-width: 769px)').matches) {
    gsap.fromTo(
      logo,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 0.9,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.3,
      }
    );
  }

  // ── Gradient line draw on scroll-into-view ─────────────────────────
  const gradientLine = document.querySelector('.footer-gradient-fill') as HTMLElement | null;
  if (gradientLine) {
    if (window.matchMedia('(max-width: 768px)').matches) {
      // Mobile: simple fade-in, no draw
      gsap.fromTo(
        gradientLine,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    } else {
      // Desktop: scaleX draw animation
      gsap.fromTo(
        gradientLine,
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%',
            once: true,
          },
        }
      );
    }
  }

  // ── Glow underline on hover for footer links ───────────────────────
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach((link) => {
    // Create a glow underline effect using boxShadow
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        boxShadow: '0 2px 12px rgba(0, 102, 255, 0.4)',
        duration: 0.25,
        ease: 'power2.out',
        color: 'var(--color-on-surface)',
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        boxShadow: 'none',
        duration: 0.25,
        ease: 'power2.out',
        color: 'var(--color-on-surface-variant)',
      });
    });
  });
}
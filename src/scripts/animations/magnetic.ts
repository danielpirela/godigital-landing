/**
 * magnetic.ts — Magnetic hover effect for .magnetic elements
 *
 * Uses gsap.quickTo for smooth cursor tracking.
 * Only activates on (hover: hover) and (pointer: fine) devices.
 * data-magnetic-strength attribute controls intensity (default 0.3).
 */

import gsap from 'gsap';

export function initMagnetic(): void {
  if (typeof window === 'undefined') return;

  // Only activate on fine-pointer devices (desktop with mouse)
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const elements = document.querySelectorAll<HTMLElement>('.magnetic-btn, .magnetic');

  if (!elements.length) return;

  // quickTo for smooth, high-performance tracking
  const xTo = gsap.quickTo(elements, 'x', { duration: 0.3, ease: 'power3.out' });
  const yTo = gsap.quickTo(elements, 'y', { duration: 0.3, ease: 'power3.out' });

  const handleMove = (e: MouseEvent): void => {
    elements.forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || '0.3');
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Only attract when cursor is within 100px
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dist < 100) {
        xTo.call(el, deltaX * strength);
        yTo.call(el, deltaY * strength);
      } else {
        xTo.call(el, 0);
        yTo.call(el, 0);
      }
    });
  };

  const handleLeave = (): void => {
    elements.forEach((el) => {
      xTo.call(el, 0);
      yTo.call(el, 0);
    });
  };

  // Exclude focusable children (a, button, input, etc.)
  elements.forEach((el) => {
    const focusable = el.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    focusable.forEach((child) => {
      (child as HTMLElement).style.transform = 'none';
    });
  });

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseleave', handleLeave);
}
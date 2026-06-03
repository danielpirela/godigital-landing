/**
 * scroll.ts — Global scroll progress tracking
 *
 * Emits scroll percentage via custom event `godigital:scroll` for
 * SectionProgress to consume.
 * Uses a lightweight native scroll listener (lighter than ScrollTrigger
 * for pure progress tracking).
 */

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
}
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type MotionKind = 'sheet' | 'line' | 'stamp' | 'checkpoint';

interface MotionTarget extends HTMLElement {
  dataset: DOMStringMap & {
    motion?: MotionKind;
  };
}

function initMobileNavigation(): void {
  const details = document.querySelector<HTMLDetailsElement>('#mobile-nav');
  const summary = details?.querySelector<HTMLElement>('summary');
  if (!details || !summary) return;

  const focusableElements = (): HTMLElement[] =>
    Array.from(
      details.querySelectorAll<HTMLElement>(
        'summary, a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (element) => element.getClientRects().length > 0 && element.getAttribute('aria-disabled') !== 'true'
    );

  const close = (restoreFocus = false): void => {
    details.open = false;
    document.body.classList.remove('nav-open');
    summary.setAttribute('aria-label', 'Abrir navegación');
    if (restoreFocus) summary.focus();
  };

  const syncOpenState = (): void => {
    document.body.classList.toggle('nav-open', details.open);
    summary.setAttribute('aria-label', details.open ? 'Cerrar navegación' : 'Abrir navegación');
  };

  details.addEventListener('toggle', syncOpenState);

  details.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => close());
  });

  details.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!details.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = focusableElements();
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      summary.focus();
      return;
    }

    const activeIndex = focusable.findIndex((element) => element === document.activeElement);
    if (event.shiftKey && activeIndex <= 0) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeIndex === -1 || activeIndex === focusable.length - 1)) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('click', (event: MouseEvent) => {
    if (details.open && event.target instanceof Node && !details.contains(event.target)) close();
  });

  const desktopQuery = window.matchMedia('(min-width: 60rem)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) close();
  });

  if (desktopQuery.matches) close();
  else syncOpenState();
}

function keyframesFor(kind: MotionKind): Keyframe[] {
  switch (kind) {
    case 'line':
      return [
        { clipPath: 'inset(0 100% 0 0)', opacity: 0.72 },
        { clipPath: 'inset(0 0 0 0)', opacity: 1 },
      ];
    case 'stamp':
      return [
        { opacity: 0, transform: 'rotate(-9deg) scale(1.28)' },
        { opacity: 1, transform: 'rotate(-3deg) scale(1)' },
      ];
    case 'checkpoint':
      return [
        { clipPath: 'inset(0 0 100% 0)', opacity: 0.74 },
        { clipPath: 'inset(0 0 0 0)', opacity: 1 },
      ];
    case 'sheet':
    default:
      return [
        { clipPath: 'inset(0 0 12% 0)', opacity: 0.76, transform: 'translateY(18px)' },
        { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'translateY(0)' },
      ];
  }
}

function initDocumentMotion(): void {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

  const targets = Array.from(document.querySelectorAll<MotionTarget>('[data-motion]'));
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as MotionTarget;
        const kind = target.dataset.motion ?? 'sheet';
        target.animate(keyframesFor(kind), {
          duration: kind === 'stamp' ? 520 : 680,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'none',
        });
        observer.unobserve(target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}

export function initSite(): void {
  initMobileNavigation();
  initDocumentMotion();
}

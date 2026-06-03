import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────
   Hero Timeline
   ─────────────────────────────────────────── */
function initHeroAnimation(): void {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Logo: scale in with back.out
  tl.from('.hero-logo', {
    scale: 0.7,
    opacity: 0,
    duration: 1.2,
    ease: 'back.out(1.7)',
  })
    // Tagline: slide up
    .from(
      '.hero-tagline',
      {
        y: 60,
        opacity: 0,
        duration: 0.9,
      },
      '-=0.4',
    )
    // Subtitle: fade in
    .from(
      '.hero-subtitle',
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      '-=0.4',
    )
    // CTA buttons: staggered fade-in
    .from(
      '.hero-cta a',
      {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
      },
      '-=0.3',
    );

  // Scroll dot bounce
  gsap.to('.scroll-dot', {
    y: 6,
    opacity: 0.3,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/* ───────────────────────────────────────────
   Navbar Scroll Behavior
   ─────────────────────────────────────────── */
function initNavbarAnimation(): void {
  const navbar = document.querySelector('.navbar') as HTMLElement | null;
  if (!navbar) return;

  // Set initial glass state
  gsap.set(navbar, {
    backgroundColor: 'rgba(8, 10, 16, 0.3)',
    borderBottom: '1px solid rgba(255,255,255,0)',
  });

  // On scroll: intensify glass and add border
  gsap.to(navbar, {
    backgroundColor: 'rgba(6, 8, 13, 0.85)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    duration: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top -80px',
      end: 'top -120px',
      scrub: 0.3,
    },
  });
}

/* ───────────────────────────────────────────
   Services: staggered card entrance
   ─────────────────────────────────────────── */
function initServicesAnimation(): void {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  gsap.from(cards, {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    scale: 0.92,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  });
}

/* ───────────────────────────────────────────
   Boutique Edge: slide from left
   ─────────────────────────────────────────── */
function initEdgeAnimation(): void {
  const cards = document.querySelectorAll('.edge-card');
  if (!cards.length) return;

  gsap.from(cards, {
    scrollTrigger: {
      trigger: '#edge',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    x: -60,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power3.out',
  });
}

/* ───────────────────────────────────────────
   Process: line grows, steps slide in
   ─────────────────────────────────────────── */
function initProcessAnimation(): void {
  const line = document.querySelector('.process-line') as HTMLElement | null;
  const steps = document.querySelectorAll('.process-step');
  if (!line && !steps.length) return;

  // Set initial state for the line
  if (line) {
    gsap.set(line, { scaleY: 0, transformOrigin: 'center top' });
  }

  // Set initial state for steps
  if (steps.length) {
    gsap.set(steps, { opacity: 0, x: -50 });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#process',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  if (line) {
    tl.to(line, {
      scaleY: 1,
      duration: 1,
      ease: 'power3.inOut',
    });
  }

  if (steps.length) {
    tl.to(
      steps,
      {
        opacity: 1,
        x: 0,
        stagger: 0.25,
        duration: 0.7,
        ease: 'power3.out',
      },
      '-=0.3',
    );
  }
}

/* ───────────────────────────────────────────
   CTA Section: fade-up reveal
   ─────────────────────────────────────────── */
function initCTAAnimation(): void {
  const cta = document.querySelector('#cta > div');
  if (!cta) return;

  gsap.from(cta, {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });
}

/* ───────────────────────────────────────────
   Section titles: fade-up
   ─────────────────────────────────────────── */
function initSectionTitles(): void {
  const titles = document.querySelectorAll('[data-reveal="section-title"]');
  if (!titles.length) return;

  gsap.from(titles, {
    scrollTrigger: {
      trigger: titles,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
  });
}

/* ───────────────────────────────────────────
   Ambient Orbs: continuous floating
   ─────────────────────────────────────────── */
function initAmbientOrbs(): void {
  document.querySelectorAll('.ambient-orb').forEach((orb) => {
    // Random float direction per orb
    const xDrift = (Math.random() - 0.5) * 40;
    const yDrift = (Math.random() - 0.5) * 30;

    gsap.to(orb, {
      x: xDrift,
      y: yDrift,
      duration: 5 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

/* ───────────────────────────────────────────
   Particle System
   ─────────────────────────────────────────── */
function initParticles(): void {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 35;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = 1.5 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = `${0.15 + Math.random() * 0.35}`;
    container.appendChild(particle);

    // Drift upward gently, fade out, loop
    gsap.to(particle, {
      y: -80 - Math.random() * 120,
      x: (Math.random() - 0.5) * 60,
      opacity: 0,
      duration: 6 + Math.random() * 6,
      repeat: -1,
      delay: Math.random() * 6,
      ease: 'sine.out',
    });
  }
}

/* ───────────────────────────────────────────
   CTA Button Glow Pulse (GSAP hover)
   ─────────────────────────────────────────── */
function initCTAButtonGlow(): void {
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    const el = btn as HTMLElement;

    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        boxShadow:
          '0 0 60px rgba(0, 102, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        boxShadow:
          '0 0 40px rgba(0, 102, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}

/* ───────────────────────────────────────────
   Init — called from index.astro on DOMContentLoaded
   ─────────────────────────────────────────── */
export function initAnimations(): void {
  // Run every animation
  initHeroAnimation();
  initNavbarAnimation();
  initAmbientOrbs();
  initParticles();
  initCTAButtonGlow();

  // Scroll-triggered animations (skip if reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    // Small delay to let layout settle
    requestAnimationFrame(() => {
      initSectionTitles();
      initServicesAnimation();
      initEdgeAnimation();
      initProcessAnimation();
      initCTAAnimation();

      // Refresh ScrollTrigger after everything is registered
      ScrollTrigger.refresh();
    });
  }
}

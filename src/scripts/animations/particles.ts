/**
 * particles.ts — Canvas-free particle factory using GSAP
 *
 * Configurable count and blur from matchMedia context.
 * Drifts upward, fades out, loops, ease sine.out.
 * Returns a cleanup function for unmount.
 */

import gsap from 'gsap';

interface ParticleConfig {
  count: number;
  blur: string;
}

export function initParticles(config: ParticleConfig): () => void {
  const container = document.querySelector('.hero-particles');
  if (!container) {
    return () => {};
  }

  // Clear any existing particles
  container.innerHTML = '';

  const particles: HTMLElement[] = [];

  for (let i = 0; i < config.count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 1.5 + Math.random() * 3;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.opacity = `${0.15 + Math.random() * 0.35}`;
    p.style.filter = `blur(${config.blur})`;
    container.appendChild(p);
    particles.push(p);

    // Drift upward gently, fade out, loop
    gsap.to(p, {
      y: -80 - Math.random() * 120,
      x: (Math.random() - 0.5) * 60,
      opacity: 0,
      duration: 6 + Math.random() * 6,
      repeat: -1,
      delay: Math.random() * 6,
      ease: 'sine.out',
    });
  }

  // Return cleanup: kill all tweens and clear container
  return () => {
    for (const p of particles) {
      gsap.killTweensOf(p);
      p.remove();
    }
  };
}
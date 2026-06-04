/**
 * index.ts — Animation orchestrator
 *
 * Imports and calls all sub-module init functions based on
 * ENABLE_V2_ANIM safety flag and matchMedia context.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionContext, applyCSSVars } from './matchMedia';
import { initParticles } from './particles';
import { initScroll } from './scroll';
import { initMagnetic } from './magnetic';
import { initGlass } from './glass';
import { initHero } from './hero';
import { initServices } from './services';
import { initProcess } from './process';
import { initQuality } from './quality';
import { initCTA } from './cta';
import { initFooter } from './footer';

gsap.registerPlugin(ScrollTrigger);

declare const __ENABLE_V2_ANIM__: boolean;

export function initAnimations(): void {
  // Safety flag: ENABLE_V2_ANIM=false bypasses all v2 GSAP
  if (typeof __ENABLE_V2_ANIM__ !== 'undefined' && __ENABLE_V2_ANIM__ === false) {
    console.info('[godigital] ENABLE_V2_ANIM=false — v2 animations disabled, v1 baseline running');
    return;
  }

  // Reduced-motion: skip all GSAP
  const ctx = getMotionContext();
  if (!ctx) {
    console.info('[godigital] prefers-reduced-motion — v2 animations disabled');
    return;
  }

  // Apply CSS vars from context so sub-modules can read them
  applyCSSVars(ctx);

  // Core systems (order matters: scroll first, then particles, then specific)
  initScroll();
  initParticles({ count: ctx.particleCount, blur: ctx.orbBlur });
  initMagnetic();
  initGlass();

  // Section-specific
  initHero();
  initServices();
  initProcess();
  initQuality();
  initCTA();
  initFooter();

  // Refresh ScrollTrigger after all animations are registered
  if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
    (window as any).ScrollTrigger.refresh();
  }
}
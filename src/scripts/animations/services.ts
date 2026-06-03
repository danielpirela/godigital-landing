/**
 * services.ts — Services sticky-pin + multi-vector card entrance
 *
 * STUB for PR1: exports no-op initServices() with ENABLE_V2_ANIM guard.
 * Real implementation in PR3: ScrollTrigger pin + card entrance from
 * x:-80, x:+80, y:+60, scale:0.8 with stagger.
 */

declare const __ENABLE_V2_ANIM__: boolean;

export function initServices(): void {
  if (typeof window === 'undefined') return;
  if (typeof __ENABLE_V2_ANIM__ !== 'undefined' && __ENABLE_V2_ANIM__ === false) return;

  // STUB: no-op in PR1. Real implementation comes in PR3.
  // The module structure and guard are wired so PR3 drops in cleanly.
}
/**
 * process.ts — Process scroll-scrubbed timeline
 *
 * STUB for PR1: exports no-op initProcess() with ENABLE_V2_ANIM guard.
 * Real implementation in PR3: line scaleY 0→1 scrub, circles rotate 0→360deg,
 * word-by-word reveal triggered at circle rotation 90°–180°.
 */

declare const __ENABLE_V2_ANIM__: boolean;

export function initProcess(): void {
  if (typeof window === 'undefined') return;
  if (typeof __ENABLE_V2_ANIM__ !== 'undefined' && __ENABLE_V2_ANIM__ === false) return;

  // STUB: no-op in PR1. Real implementation comes in PR3.
  // The module structure and guard are wired so PR3 drops in cleanly.
}
/**
 * mmx-assets.ts — mmx asset helper with MANIFEST.json integration
 *
 * Provides getMmxAsset(), hasFallback(), and isReady() for all mmx-generated
 * assets committed under assets/generated/. Falls back gracefully when assets
 * are missing or not yet generated.
 */

import manifestData from '../../assets/generated/MANIFEST.json';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MmxManifestEntry {
  id: string;
  type: 'image' | 'video' | 'audio';
  path: string;
  model: string | null;
  source?: string;
  prompt?: string | null;
  seed?: number;
  width?: number;
  height?: number;
  duration_seconds?: number;
  size_bytes?: number;
  qa_status?: string;
  used_in?: string;
}

export type MmxAssetId =
  | 'bg-obsidian-mesh'
  | 'bg-electric-glow'
  | 'bg-boutique-texture'
  | 'icon-ux-ui'
  | 'icon-web'
  | 'icon-mobile'
  | 'icon-seo'
  | 'icon-integridad'
  | 'icon-soporte'
  | 'hero-loop';

// ── Manifest Cache ────────────────────────────────────────────────────────────

// Cast the raw JSON to our typed array
const manifest: MmxManifestEntry[] = (manifestData as any).assets ?? [];

// Build a lookup map for O(1) access
const assetById = new Map<string, MmxManifestEntry>();
for (const entry of manifest) {
  assetById.set(entry.id, entry);
}

// ── Fallback Chain ────────────────────────────────────────────────────────────

/**
 * Fallback chain per asset ID.
 * 'CSS' means use a CSS-only fallback (no file needed).
 * 'SILENT' means the audio element stays muted/paused indefinitely.
 */
const FALLBACK_CHAIN: Record<string, string> = {
  'bg-obsidian-mesh': 'CSS',
  'bg-electric-glow': 'CSS',
  'bg-boutique-texture': 'CSS',
  'icon-ux-ui': 'CSS',      // Lucide inline SVG fallback
  'icon-web': 'CSS',
  'icon-mobile': 'CSS',
  'icon-seo': 'CSS',
  'icon-integridad': 'CSS',
  'icon-soporte': 'CSS',
  'hero-loop': '/assets/generated/bg/obsidian-mesh.png',
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the asset entry for a given ID, or null if not in manifest.
 */
function getManifestEntry(id: string): MmxManifestEntry | null {
  return assetById.get(id) ?? null;
}

/**
 * Returns the public path for a given asset ID.
 * Throws if the asset ID is completely unknown (not in manifest, no fallback).
 */
export function getMmxAsset(id: string): string {
  const entry = getManifestEntry(id);
  if (entry) {
    return '/' + entry.path;
  }
  // Fallback chain lookup — CSS/SILENT/fallback path
  const fallback = FALLBACK_CHAIN[id];
  if (fallback) {
    return fallback;
  }
  throw new Error(`[mmx-assets] Unknown asset ID: "${id}". Add it to the fallback chain or MANIFEST.json.`);
}

/**
 * Returns true if a fallback exists for the given asset ID.
 * A fallback means we can render something even when the primary asset is missing.
 */
export function hasFallback(id: string): boolean {
  const entry = getManifestEntry(id);
  if (entry) return true;
  return id in FALLBACK_CHAIN;
}

/**
 * Returns true if the asset is marked as QA-passing in MANIFEST.json.
 * Note: this checks the manifest metadata, not filesystem existence.
 * Components should still handle 404s gracefully.
 */
export function isReady(id: string): boolean {
  const entry = getManifestEntry(id);
  if (!entry) return false;
  return entry.qa_status === 'pass' || entry.qa_status === 'user-approved';
}

/**
 * Returns the full manifest entry for an asset, or null.
 */
export function getAssetEntry(id: string): MmxManifestEntry | null {
  return getManifestEntry(id);
}

// ── Re-exports for convenience ────────────────────────────────────────────────

export type { MmxManifestEntry as MmxAsset };
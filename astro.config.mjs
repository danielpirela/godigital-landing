import { defineConfig } from 'astro/config';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENABLE_V2_ANIM = process.env.ENABLE_V2_ANIM !== 'false'; // default true

export default defineConfig({
  vite: {
    define: {
      __ENABLE_V2_ANIM__: JSON.stringify(ENABLE_V2_ANIM),
    },
  },
  hooks: {
    'astro:build:start': () => {
      // Validate MANIFEST.json schema and confirm asset paths exist
      const manifestPath = join(process.cwd(), 'assets/generated/MANIFEST.json');
      if (!existsSync(manifestPath)) {
        console.warn('[godigital] MANIFEST.json not found — skipping asset validation');
        return;
      }
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        const assets = manifest?.assets ?? [];
        for (const asset of assets) {
          const assetPath = join(process.cwd(), asset.path);
          if (!existsSync(assetPath)) {
            console.warn(`[godigital] Asset ${asset.id} missing at ${asset.path} — fallback will be used`);
          }
        }
        console.info(`[godigital] Asset validation: ${assets.length} assets checked`);
      } catch (err) {
        console.warn('[godigital] Could not parse MANIFEST.json:', err.message);
      }
    },
  },
});
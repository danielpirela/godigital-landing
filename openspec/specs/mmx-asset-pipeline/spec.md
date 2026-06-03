# mmx Asset Pipeline

## Purpose

The mmx asset pipeline enables build-time and runtime generation, storage, and consumption of AI-generated assets (images, video, music, speech) for the godigital-landing redesign. Every mmx-generated asset MUST be traceable via a `data-mmx-generated` HTML attribute and an entry in `assets/generated/MANIFEST.json`. The pipeline provides deterministic fallback chains so the page degrades gracefully when assets fail or are pending.

Ref: Proposal §Asset Generation Batch Plan · §mmx Generation Order & Risk Protocol

## Requirements

### Requirement: MMX_MANIFEST_STRUCTURE
The system SHALL maintain `assets/generated/MANIFEST.json` as a JSON array of objects, each containing `id`, `model`, `prompt`, `seed`, `timestamp`, `quota_cost`, and `file_path` fields.

The `id` field SHALL match the `data-mmx-generated` attribute value on the corresponding HTML element.

The MANIFEST.json SHALL be committed to the repository alongside generated assets in PR0.

#### Scenario: MANIFEST.json exists with valid entries
Given the `assets/generated/` directory contains generated files
When `src/lib/mmx-assets.ts` calls `getMmxAsset('hero-loop')`
Then the function reads MANIFEST.json and returns `{ file_path, model, prompt, id }`
And the returned `id` equals the HTML attribute `data-mmx-generated="hero-loop"`

### Requirement: MMX_DATA_ATTRIBUTE_TRACEABILITY
Every HTML element that renders a mmx-generated asset SHALL have a `data-mmx-generated="<asset-id>"` attribute exactly matching its MANIFEST.json entry `id`.

The asset IDs SHALL be: `hero-loop`, `iphone-screen`, `obsidian-mesh`, `electric-glow`, `boutique-texture`, `ux-ui-icon`, `web-icon`, `mobile-icon`, `seo-icon`, `integridad-icon`, `soporte-icon`, `curtain-video`, `ambient-music`, `hero-vo`.

#### Scenario: Traceable asset element
Given an `<img>` element renders `assets/generated/icons/ux-ui.png`
When an inspector examines the element
Then it contains `data-mmx-generated="ux-ui-icon"`
And the MANIFEST.json entry for `ux-ui-icon` has `file_path: "assets/generated/icons/ux-ui.png"`

### Requirement: MMX_FALLBACK_REGISTRY
The `src/lib/mmx-assets.ts` module SHALL export `getMmxAsset(id)` returning a `MmxAsset` object with `src`, `fallback_src`, `model`, `is_ready` boolean.

For each asset, the fallback chain SHALL be:
- `hero-loop` → `assets/generated/bg/obsidian-mesh.png`
- `iphone-screen` → `assets/iphone-15-pro-marco.png`
- `curtain-video` → CSS `clip-path` wipe (no file needed)
- `ambient-music` → silent `Audio` element (no source)
- All icons → Lucide SVG equivalents (defined in `src/lib/icon-fallbacks.ts`)

#### Scenario: Fallback triggered when asset missing
Given `getMmxAsset('hero-loop')` is called
When `assets/generated/hero-loop.mp4` does not exist
Then the function returns `is_ready: false` and `fallback_src` pointing to `assets/generated/bg/obsidian-mesh.png`
And the caller uses the fallback without throwing

### Requirement: MMX_ASSET_GENERATION_COMMANDS
All 14 mmx assets SHALL be generated using these exact CLI invocations in sequence:

Image assets (image-01 model):
```
mmx image generate --prompt "<prompt>" --model image-01 --width 1920 --height 1080 --out assets/generated/bg/obsidian-mesh.png
mmx image generate --prompt "<prompt>" --model image-01 --width 1920 --height 1080 --out assets/generated/bg/electric-glow.png
mmx image generate --prompt "<prompt>" --model image-01 --width 1920 --height 1080 --out assets/generated/bg/boutique-texture.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/ux-ui.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/web.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/mobile.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/seo.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/integridad.png
mmx image generate --prompt "<prompt>" --model image-01 --aspect-ratio 1:1 --out assets/generated/icons/soporte.png
```

Video assets (Hailuo-2.3 or Hailuo-02 model):
```
mmx video generate --model Hailuo-2.3 --first-frame assets/generated/bg/obsidian-mesh.png --out assets/generated/hero-loop.mp4
mmx video generate --model Hailuo-2.3 --first-frame assets/iphone-15-pro-marco.png --out assets/generated/iphone-screen.mp4
mmx video generate --model Hailuo-02 --first-frame assets/generated/bg/obsidian-mesh.png --last-frame assets/generated/bg/electric-glow.png --out assets/generated/curtain.mp4
```

Music and speech:
```
mmx music generate --prompt "cinematic tech ambient premium dark 60 second seamless loop, deep sub bass, subtle synth pads, soft arpeggios, no vocals, no drums" --out assets/generated/ambient.mp3
mmx speech synthesize --text "Diseñamos y construimos experiencias digitales premium" --voice es-ES --out assets/generated/hero-vo.mp3
```

#### Scenario: All assets generated successfully
Given mmx CLI is authenticated and quota is available
When all 14 generation commands complete without error
Then all output files exist at their specified paths
And `assets/generated/MANIFEST.json` contains 14 entries
And each entry has `id`, `model`, `prompt`, `seed`, `timestamp`

### Requirement: MMX_QUALITY_QA_GATE
After each mmx generation, the system SHALL run `mmx vision describe --image <path>` (for images) or `mmx vision describe --video <path>` (for videos) and parse the quality score.

If the parsed score is below 7/10, the asset SHALL be logged to `assets/generated/_failed.log` with reason and the fallback chain activated in code.

#### Scenario: Low-quality asset triggers fallback
Given `mmx image generate` produces `assets/generated/icons/ux-ui.png`
When `mmx vision describe` returns score 5/10
Then the entry is appended to `_failed.log` with timestamp and reason
And `getMmxAsset('ux-ui-icon').is_ready` returns `false`
And the Lucide `figma` SVG is used in the UI instead
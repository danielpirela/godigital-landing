# GoDigital — Project Rulebook

Authoritative rules for every agent session in this repo: brand, landing site, and video production.
Summaries only; the linked docs are the source of truth. Technical artifacts (code, specs, this file) are in English. **All user-facing copy (landing, videos, captions) is in Spanish for a Venezuelan / Latin American audience.**

## 1. Project overview

- **GoDigital** is a founder-led digital agency in Venezuela (Maracaibo, per the owner; not yet recorded in the source docs).
- **Serves:** Spanish-speaking entrepreneurs and small businesses that need practical technology without enterprise cost or complexity — often early-stage, budget-constrained, in Latin American operating contexts.
- **Offer:** practical digital systems for business operations; websites, identity, and digital positioning; transparent sourcing, setup, installation, and delivery.
- **Positioning:** founder-to-founder empathy plus end-to-end technical ownership — the same team clarifies the need, sources equipment, builds the software, installs it, and stays transparent about scope and cost.
- **Approved public proof:** exactly one anonymized case (inventory/sales/profit system, tablet + thermal printer sourced and installed, web tool for Venezuela's daily USD/Bs exchange rate). No client name, metrics, testimonials, screenshots, awards, or counts are approved. See `PRODUCT.md` → "Evidence on Hand".

## 2. Source-of-truth docs

| Doc | Governs |
|---|---|
| `PRODUCT.md` | **Highest authority** for audience, offer, positioning, contact channels, approved evidence, publishing restrictions, accessibility. |
| `DESIGN.md` | **The LANDING design system** ("GoDigital Delivery Dossier"): colors, type, layout, components, do/don't. Implemented in `src/styles/global.css`. |
| `IDENTITY.md` | Brand manual (Spanish): logo construction and logo colors. Older visual direction (glass / iOS-style). |
| `PRD.md` | Original landing PRD (v1/v2 era). Historical; superseded by `PRODUCT.md` + `DESIGN.md` where they conflict. |
| `DESIGN-LIGHT.md` / `DESIGN -DARK.md` | Legacy "Fluid Tech" / "Dark Tech" systems (Plus Jakarta Sans, glassmorphism). Not used by the current landing. |
| `CREATE-BG-GO-DIGITAL.md` | Legacy image-generation prompts for "Obsidian Mesh" backgrounds. |
| `videos/<folder>/DESIGN.md` | That video's own design reference. |

**HARD RULE:** root `DESIGN.md` is the landing design system. Never overwrite or "update" it with a video's design. Each video keeps its own `DESIGN.md` inside its folder.

## 3. Brand essentials

- **Name:** always `GoDigital` — one word, capital G and D. Never "Go Digital", "Godigital", "GO DIGITAL" in body copy.
- **Voice:** clear, warm, technically credible, transparent; never promotional or inflated. Start from the entrepreneur's real operating problem.
- **Language:** polished, neutral Spanish suitable for Venezuela and Latin America (`PRODUCT.md`). Correct accents and ñ are mandatory. See the voseo note in §8.
- **Claims:** no testimonials, results, percentages, customer counts, years, awards, benchmarks, or prices without human verification. Keep client identity private.

### Colors and type — which doc governs what

| Context | Colors | Type |
|---|---|---|
| **Logo artwork** (`IDENTITY.md`) | "Go" Electric Blue `#0066ff`; "Digital" Deep Obsidian `#111417` on light, Pure White `#ffffff` on dark | Custom geometric logotype (the "o" forms an infinity link) |
| **Landing + brand-consistent video** (`DESIGN.md`) | Cobalt Field `#1746d1`, Cobalt Deep `#0b2d7a`, Blueprint Deep `#08245f`, Drafting Paper Bright `#fffdf5`, Drafting Paper `#f2ecd8`, Paper Muted `#ddd4b9`, Graphite `#182027`, Graphite Soft `#4c5760`, Redline `#a82f2a` (annotation only). `#0066ff` / `#ffffff` reserved for the logo. | Archivo 400/600/800 (display, body); Azeret Mono 400/600 for evidence labels only |

`IDENTITY.md` (Plus Jakarta Sans + Inter) and the light/dark docs (Plus Jakarta Sans only) describe the older visual direction. For anything new, `DESIGN.md` governs everything except the logo itself.

### Logo assets

- Landing: `public/logo-base.svg`, `public/logo-light.svg`, `public/logo-dark.svg`.
- Source/raster: `assets/logo-base.svg`, `assets/logo-light.svg`, `assets/logo-light.png`, `assets/logo-dark.png`.
- Videos copy what they need into their own `assets/` (e.g. `videos/2026-07-29-godigital-viral/assets/logo-dark.svg`).
- The brush-paint logo animation is allowed only with a static reduced-motion fallback.

### Do / Don't (landing and on-brand video)

- **Do:** use real deliverables and verified case facts as visual material; let cobalt, paper, or graphite own whole regions; use red only to annotate, correct, or approve; keep content readable before motion runs.
- **Don't:** glassmorphism, neon glow, orbs, particles, generic tech-keynote styling, rounded card grids, fabricated screenshots or metrics, decorative monospace or blueprint grids.

## 4. Landing site

- **Stack:** Astro 6 (static, `astro.config.mjs` is default), Tailwind CSS 4 via `@tailwindcss/postcss`, GSAP 3, TypeScript. Package manager: **pnpm**.
- **Structure:**
  - `src/pages/index.astro` — single page; `src/layouts/Layout.astro` — `<html lang="es">`, Google Fonts (Archivo, Azeret Mono).
  - `src/components/` — `Navbar`, `Hero`, `Services`, `CaseStudy`, `Process`, `QualityAssurance`, `FounderNote`, `CTASection`, `Footer`.
  - `src/styles/global.css` — design tokens; `src/scripts/` — `site.ts` + `animations/`.
  - `src/lib/contact.ts` — **single source for contact links**; import from here, never hardcode.
  - `public/` — logos. `openspec/` — archived SDD change artifacts.
- **Commands:** `pnpm install`, `pnpm dev` (http://localhost:4321), `pnpm build`, `pnpm preview`, `pnpm astro check`.
- **Conventions:** no contact backend (WhatsApp primary, email secondary); works from 320px up; core content visible without JS; honor `prefers-reduced-motion`; keyboard navigation and visible focus states; readable contrast.

## 5. Video production (HARD RULES)

Load the skills first: `hyperframes`, `hyperframes-cli`, `hyperframes-workflow`, `hyperframes-media`, `gsap`, plus `video`, `copywriting`, `social-content` for scripts and captions (all under `.agents/skills/`).

1. **Never** create, edit, or render HyperFrames compositions in the repo root.
2. Every video lives in `videos/YYYY-MM-DD-<slug>/`, with:
   - `index.html` (composition), `DESIGN.md` (that video's design), `SCRIPT.md` (when there is narration or copy), `meta.json` (`id` = folder name, `name`, `createdAt`), `hyperframes.json`.
   - `assets/` and `fonts/` local to the folder, or referenced with correct relative paths (from `videos/<folder>/`, the repo root is `../../`).
   - Final MP4s in `<folder>/renders/`.
3. Render: `npx hyperframes render videos/YYYY-MM-DD-<slug>` (requires `ffmpeg`; on macOS `brew install ffmpeg`). Run `npx hyperframes lint` / `validate` / `inspect` before rendering.
4. Compositions must be deterministic: no `Date.now()`, `Math.random()`, or network fetches; timelines paused and registered on `window.__timelines`.
5. **Default format:** vertical 9:16, 1080×1920, 30 fps (every existing video uses 1080×1920) for Instagram Reels, TikTok, YouTube Shorts. Keep text inside vertical social safe areas.
6. **Reference project:** `videos/2026-07-29-godigital-viral/` (index, DESIGN, SCRIPT with "Factual Basis", meta, hyperframes.json, package.json, assets, renders, snapshots).

**Existing material:**
- `videos/` — current work: `2026-05-11-godigital` (index only), `2026-07-29-godigital-viral` (reference), `2026-09-30-godigital-viral-vertical`.
- `compositions/` and root `renders/` — **legacy** (`3-senales-web`, `costo-de-no-planificar`, `dynamic-island`, `the-difference`, `tiktok-markdown-vs-code`, `web-stack-reveal`). Do not add to them; new work goes in `videos/`.

### Pre-publish QA checklist

- [ ] Spanish spelling, accents, ñ, and ¿¡ punctuation are correct; register matches the approved voice (see §8).
- [ ] No cut-off, overflowing, or overlapping text in any frame; check snapshots at key timestamps.
- [ ] Brand colors and fonts match the video's `DESIGN.md`, and the logo is the official asset.
- [ ] CTA and handles are correct (see Brand channels).
- [ ] Every claim is backed by `PRODUCT.md` evidence (list it in `SCRIPT.md` → Factual Basis).
- [ ] Caption, SEO copy, and hashtags reviewed (use `social-content`, `copywriting`, `ai-seo`, `seo-audit` skills).
- [ ] Audio levels and narration timing checked; MP4 is in `<folder>/renders/`.

## 6. Brand channels and social publishing

| Channel | Link | Use |
|---|---|---|
| WhatsApp | `https://wa.me/message/UFU3OSZAUAYKK1` | Primary CTA |
| Instagram | `https://instagram.com/godigitalve` (@godigitalve) | Publishing |
| TikTok | `https://tiktok.com/@godigital45` (@godigital45) | Publishing |
| Email | `godigitalveweb@gmail.com` | Secondary contact |

(The landing uses the longer share URLs in `src/lib/contact.ts`; both point to the same accounts.)

- Content is published to **Instagram and TikTok**.
- **A human must approve before anything is published publicly.** Agents prepare renders, captions, and hashtags; they never post, schedule, or send.

## 7. Git conventions

- Conventional commits: `type(scope): summary`. Recent history uses `feat(no-ticket): ...`, `chore(no-ticket): ...`, and `#waiting-for-peer-review` for work awaiting review (e.g. `feat(no-ticket): #waiting-for-peer-review add GoDigital viral campaign video`). Older v-series used `feat(v3): ...` / `fix(v2): ...`.
- **No AI attribution and no `Co-Authored-By` lines** in commits.
- Commit only when asked.

## 8. Known inconsistencies (resolve with the owner)

- **Voseo vs. Venezuelan Spanish:** the landing (`CTASection.astro`, `Process.astro`) and the 2026-07-29 video use Rioplatense voseo ("Contanos", "necesitás", "trabajás"). Venezuelan Spanish uses tú ("Cuéntanos", "necesitas"). Don't spread voseo into new copy until the owner decides.
- **Visual direction:** `IDENTITY.md` and `PRD.md` call for glassmorphism / iOS-style; `DESIGN.md` explicitly bans it. `DESIGN.md` governs the landing.
- **Fonts:** Plus Jakarta Sans + Inter (`IDENTITY.md`), Plus Jakarta Sans only (light/dark docs), Archivo + Azeret Mono (`DESIGN.md`, live site).
- **Off-brand video:** `videos/2026-09-30-godigital-viral-vertical/DESIGN.md` uses a navy/gold palette with DM Sans, Space Grotesk, and JetBrains Mono, and has no `SCRIPT.md`.
- **Contact form:** `PRD.md` asks for an inquiry form; `PRODUCT.md` says there is no contact backend (WhatsApp-first).

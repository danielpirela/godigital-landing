# GoDigital — Design System

## Brand Identity

**Name:** GoDigital
**Voice:** Clear, warm, technically credible, transparent (never promotional)
**Audience:** Spanish-speaking entrepreneurs & small businesses in Latam (Venezuela focus)
**Tagline:** Sistemas digitales prácticos para emprendedores reales

## Color Palette

### Primary (Warm Technical - Trust + Energy)
```css
--bg: #0D1B2A;        /* Deep navy - technical credibility */
--bg-elevated: #1B2A4A; /* Slightly lighter for cards */
--fg: #F0F4F8;        /* Warm white - readability */
--fg-muted: #94A3B8;  /* Slate for secondary text */
--accent: #E9C46A;    /* Warm gold - energy, value, Venezuelan context */
--accent-strong: #F4A261; /* Deeper gold for hover/active */
--accent-soft: #F4D35E;  /* Light gold for highlights */
--success: #2A9D8F;   /* Teal - trust, growth */
--error: #E76F51;     /* Warm coral - attention */
```

### Gradients (Brand Moments)
```css
--gradient-brand: linear-gradient(135deg, #E9C46A 0%, #F4A261 100%);
--gradient-hero: radial-gradient(ellipse at center, #1B2A4A 0%, #0D1B2A 70%);
--gradient-card: linear-gradient(145deg, #1B2A4A 0%, #0D1B2A 100%);
```

## Typography

### Font Stack
- **Headlines:** "Space Grotesk" (variable, 400-700) — technical, modern, distinctive
- **Body:** "DM Sans" (variable, 300-500) — warm, readable, humanist
- **Data/Numbers:** "JetBrains Mono" (tabular-nums) — technical precision

### Scale (Video-Optimized)
| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Hero Headline | 110px | 700 | 1.05 | -0.02em |
| Section Headline | 72px | 600 | 1.1 | -0.01em |
| Body Large | 32px | 400 | 1.4 | 0 |
| Body | 24px | 400 | 1.5 | 0 |
| Caption | 18px | 400 | 1.4 | 0.01em |
| Micro | 14px | 500 | 1.3 | 0.05em |

### Video Typography Rules
- `font-variant-numeric: tabular-nums` on all numbers
- Min 24px for body, 18px for captions (rendered video readability)
- Max 2 lines on screen simultaneously for captions
- Highlight key words in `--accent` via `<mark>` or span

## Corner Radius

```css
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 9999px;
```
**Style:** Rounded but not pill — technical credibility with warmth

## Depth / Shadows

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.15);
--shadow-md: 0 8px 24px rgba(0,0,0,0.2);
--shadow-lg: 0 16px 48px rgba(0,0,0,0.25);
--shadow-glow: 0 0 60px rgba(233, 196, 106, 0.15);
--shadow-glow-strong: 0 0 100px rgba(233, 196, 106, 0.25);
```
**Depth Level:** Subtle — elevated cards with ambient glow on accent elements

## Spacing System

Base unit: 8px
```css
--space-1: 8px;   --space-5: 40px;  --space-9: 72px;
--space-2: 16px;  --space-6: 48px;  --space-10: 96px;
--space-3: 24px;  --space-7: 56px;  --space-12: 128px;
--space-4: 32px;  --space-8: 64px;
```

## Motion / Animation

### Easing Signatures
```css
--ease-brand: cubic-bezier(0.16, 1, 0.3, 1);       /* Smooth, confident */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Playful entrance */
--ease-sharp: cubic-bezier(0.4, 0, 0.2, 1);        /* Quick, decisive */
--ease-glide: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Gliding transitions */
```

### Duration Tokens
```css
--dur-fast: 0.25s;
--dur-normal: 0.45s;
--dur-slow: 0.7s;
--dur-hold: 1.2s;
```

### Entrance Choreography
- Stagger: 80-120ms between elements
- Combine: `y` + `opacity` + `scale` (never just one)
- First element enters at 0.15s (not t=0)
- Vary eases per element (min 3 different per scene)

## Background Atmosphere (Per Scene)

Every scene includes 2-4 persistent decoratives:
1. **Radial glow** — accent-tinted, breathing scale (3-4s cycle)
2. **Ghost text** — brand keywords at 4% opacity, slow drift (20s cycle)
3. **Grid pattern** — subtle technical grid, 2% opacity
4. **Accent line** — hairline rule with slow pulse

All decoratives animate continuously (breathing/drift) — never static.

## What NOT To Do (Anti-Patterns)

- ❌ Cyan/purple gradients — not our brand
- ❌ Pure #000 or #fff — tint toward navy/gold
- ❌ Identical card grids — vary layout per scene
- ❌ Left-edge accent stripes — use glow/depth instead
- ❌ Gradient text on headlines — solid `--fg` or `--accent` only
- ❌ Centered layouts with equal weight — lead the eye
- ❌ Banned fonts (Inter, Roboto, system-ui) — use Space Grotesk + DM Sans
- ❌ `repeat: -1` in GSAP — always finite repeats
- ❌ Exit animations before transitions — transition IS the exit
- ❌ Animating `display`/`visibility` — use `opacity` + transforms only
- ❌ Video for audio — always separate `<audio>` element

## Video Composition Rules (9:16)

- **Safe area:** 90% width, 85% height from center
- **Caption zone:** Bottom 25% reserved for captions/CTA
- **Hook zone:** Top 40% for visual hook + text overlay
- **Density:** Higher than web — every frame must communicate
- **Color presence:** Accent visible in every scene (glow, text, line)
- **Scale:** 70px+ headlines, 24px+ body, 18px+ captions

## Assets

- **Logo:** Custom brush-painted SVG (animation-ready)
- **Icons:** Lucide / custom — stroke weight 2px
- **Illustrations:** Minimal, technical, warm — not corporate stock
- **Photos:** Real Venezuelan entrepreneurs if used (never generic stock)

---

*This design.md is the single source of truth for all GoDigital video compositions. Every hex, font, radius, and easing must trace back here.*
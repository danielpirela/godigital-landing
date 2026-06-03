---
name: GoDigital Dark Tech
colors:
  surface: '#111417'
  surface-dim: '#111417'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e12'
  surface-container-low: '#191c20'
  surface-container: '#1d2024'
  surface-container-high: '#272a2e'
  surface-container-highest: '#323539'
  on-surface: '#e1e2e8'
  on-surface-variant: '#c2c6d8'
  inverse-surface: '#e1e2e8'
  inverse-on-surface: '#2e3135'
  outline: '#8c90a1'
  outline-variant: '#424656'
  surface-tint: '#b3c5ff'
  primary: '#b3c5ff'
  on-primary: '#002b75'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#0054d6'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c3c6cf'
  on-tertiary: '#2d3138'
  tertiary-container: '#6e727a'
  on-tertiary-container: '#f7f8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#dfe2ec'
  tertiary-fixed-dim: '#c3c6cf'
  on-tertiary-fixed: '#181c22'
  on-tertiary-fixed-variant: '#43474e'
  background: '#111417'
  on-background: '#e1e2e8'
  surface-variant: '#323539'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
This design system is engineered for a premium, high-tech audience that values precision and modern aesthetics. The brand personality is authoritative yet approachable, blending deep "charcoal" foundations with high-energy "electric" highlights. 

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes heavy structural whitespace (or "darkspace") to allow content to breathe, while employing subtle translucent overlays to create a sense of physical layering. The emotional response is one of "Technical Sophistication"—it should feel like a high-end software tool or a futuristic command center that is both powerful and easy to navigate. Fluid connection details, such as continuous lines or soft geometric transitions between components, reinforce the "Digital" aspect of the brand.

## Colors
The color palette is built on a high-contrast dark foundation.
- **Charcoal Gray (#1a1d21):** The primary canvas color. It is deep enough to provide excellent contrast for white text while remaining softer and more premium than pure black.
- **Electric Blue (#0066ff):** Used exclusively for the "Go" brand mark, primary action buttons, and active states. It serves as the "pulse" of the interface.
- **Crisp White (#ffffff):** Reserved for the "Digital" brand text, primary typography, and iconography to ensure maximum legibility and a clean finish.
- **Layering Grays:** Mid-tone grays (e.g., #2a2e35) are used for containers and dividers to establish visual hierarchy without breaking the dark-mode immersion.

## Typography
The system exclusively uses **Plus Jakarta Sans** to achieve a modern, "tech-rounded" look. The font's geometric yet friendly nature mirrors the brand's balance of precision and accessibility. 

- **Headlines:** Use Bold (700) or Semi-Bold (600) weights with slightly tightened letter-spacing to create a compact, high-impact look.
- **Body Text:** Use Regular (400) for optimal readability against the dark background. Ensure line height is generous (at least 1.5x) to prevent "halo" effects on high-brightness screens.
- **Labels:** Use Medium (500) or Semi-Bold (600) for small UI elements like chips or navigation items, often in uppercase for the smallest sizes to maintain clarity.

## Layout & Spacing
This design system utilizes a **12-column fixed-width grid** for desktop environments, centered within the viewport. For mobile, it transitions to a **4-column fluid grid**.

- **The 8px Rhythm:** All padding, margins, and component heights must be multiples of 8px. 
- **Fluid Connections:** Use large internal padding (minimum 24px) for cards to create a "gallery" feel. 
- **Safe Areas:** On mobile, margins should be kept at 16px to maximize horizontal space while maintaining a premium, uncrowded feel. On desktop, large 48px margins help frame the content as a focused "tech suite."

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Glassmorphism**, rather than traditional heavy shadows.

- **Level 0 (Background):** #1a1d21.
- **Level 1 (Surface):** #24272c (A subtle lift from the background).
- **Level 2 (Interactive/Floating):** #2a2e35 with a very subtle 10% opacity white inner-stroke to simulate a "glass" edge.
- **Glass Effects:** For modals or navigation bars, use a background blur (12px to 20px) combined with a 60% opaque version of the surface color.
- **Shadows:** When necessary for floating elements (like dropdowns), use "Ambient Glows"—highly diffused shadows with a slight blue tint (#0066ff at 5% opacity) instead of black.

## Shapes
The shape language is **Soft-Geometric**. By using "Rounded" (0.5rem base) settings, the system avoids the harshness of sharp corners while remaining more structured than a fully "pill-shaped" aesthetic.

- **Standard Components:** 8px (0.5rem) corner radius.
- **Large Containers/Cards:** 16px (1rem) corner radius.
- **Contextual Elements:** Interactive elements like search bars or primary tags may use "Pill" (full radius) to distinguish them from structural layout containers.

## Components
- **Buttons:** Primary buttons are Electric Blue with white text. They should have a subtle outer glow on hover. Secondary buttons use a white ghost-border (1px) with white text.
- **Input Fields:** Dark gray fills (#24272c) with 1px borders that transition from gray to Electric Blue on focus. Labels sit above the field in White (80% opacity).
- **Chips/Tags:** Use a "Surface" gray background with 50% opacity white text for neutral states. Active tags use a subtle Electric Blue tint.
- **Cards:** Cards should not have visible borders. Instead, use a slightly lighter gray than the background or a subtle glass-blur.
- **Lists:** Use 1px dividers in #2a2e35. List items should have a 4px Electric Blue vertical "indicator" bar on the left during the active/selected state.
- **Navigation:** The top-bar or side-rail should utilize the Glassmorphism effect, ensuring it feels like it "floats" over the content during scroll.
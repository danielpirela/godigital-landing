---
name: GoDigital Fluid Tech
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#4c5e86'
  on-secondary: '#ffffff'
  secondary-container: '#bccefd'
  on-secondary-container: '#46577f'
  tertiary: '#515b67'
  on-tertiary: '#ffffff'
  tertiary-container: '#697380'
  on-tertiary-container: '#f6f8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b4c6f4'
  on-secondary-fixed: '#041a3f'
  on-secondary-fixed-variant: '#34466d'
  tertiary-fixed: '#d9e3f2'
  tertiary-fixed-dim: '#bdc7d6'
  on-tertiary-fixed: '#131c27'
  on-tertiary-fixed-variant: '#3e4853'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
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
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  section-gap: 120px
---

## Brand & Style

This design system is built on the principles of **Soft Minimalism** and **Modern Tech-Forward design**. It bridges the gap between high-end professional agency services and approachable, innovative technology.

The aesthetic is defined by "The Continuous Path"—inspired by the logo's fluid connection between the 'o' and the 'D'. This manifests in the UI through exceptionally large corner radii, smooth transitions, and a spacious layout that feels breathable and premium. The mood is optimistic and high-quality, avoiding the coldness of traditional corporate design in favor of a soft-tech aesthetic that feels human-centric and accessible.

## Colors

The palette is anchored by **Electric Action Blue**, a high-vibrancy shade derived from the logo that signals innovation and movement. 

- **Primary Action**: Use the Electric Blue (#0066FF) for primary buttons, active states, and critical brand accents.
- **Deep Slate**: The secondary color (#0A1F44) is used for headings and primary body text to ensure maximum legibility and a grounded, professional feel.
- **Soft Neutrals**: A range of cool grays (#64748B) is used for secondary text, borders, and icons.
- **Surface Strategy**: The primary background is a "Crisp White" (#FFFFFF). Use the ultra-light blue-tinted gray (#F8FAFC) for container backgrounds to create subtle distinction without adding visual noise.

## Typography

This design system utilizes **Plus Jakarta Sans** for all levels of the hierarchy. Its geometric yet soft construction mirrors the ultra-rounded aesthetic of the logo perfectly.

- **Headlines**: Use heavy weights (Bold/ExtraBold) with tight letter-spacing for a modern, impactful look. Headlines should always use the Deep Slate color.
- **Body Text**: Maintain generous line heights to enhance the minimalist, airy feel of the layout.
- **Mobile Scaling**: For mobile devices, Display and Headline-LG sizes should scale down significantly to maintain screen real estate while preserving the bold typographic character.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model within a fixed-width container. 

- **Grid System**: Use a 12-column grid for desktop. For tablet, move to 8 columns, and 4 columns for mobile.
- **Rhythm**: A strict 8px base unit drives all spacing decisions. 
- **Whitespace**: This design system prioritizes significant vertical spacing between sections (Section Gap) to emphasize high-quality, editorial-style presentation. 
- **Alignment**: Align all text-heavy components to the grid, but allow decorative or background "fluid" elements to bleed to the edges of the viewport to create a sense of scale.

## Elevation & Depth

To maintain a clean, modern aesthetic, depth is created through **Tonal Layers** and **Ambient Shadows** rather than harsh borders.

- **Primary Elevation**: Most surfaces should remain flat on the white background.
- **Floating Depth**: For cards and modals, use "Shadow-Soft"—an extra-diffused shadow with a 15% opacity tint of the secondary slate color (not pure black). This creates a natural, organic lift.
- **Interactive Depth**: Buttons and cards should use a subtle upward "lift" on hover (increasing shadow blur and decreasing Y-offset) to signal interactivity.
- **Dividers**: Avoid heavy lines. Use 1px borders in the softest neutral or use background color changes to define sections.

## Shapes

The shape language is the core differentiator of this design system. It is defined by **High-Radius Geometry**.

- **Base Radius**: 0.5rem (8px) for small elements like checkboxes or utility tags.
- **Component Radius**: 1rem (16px) for standard buttons and input fields.
- **Container Radius**: 1.5rem (24px) for cards, featured sections, and image containers.
- **Pill Shapes**: All primary buttons and badges should utilize full pill-shaped rounding to echo the circular forms found in the "Go" of the logo.

## Components

### Buttons
- **Primary**: Pill-shaped, Electric Blue background, white text. No border.
- **Secondary**: Pill-shaped, Deep Slate text, 1.5px border in Slate or Electric Blue.
- **Interaction**: On hover, the primary button should shift slightly darker or expand via a subtle scale transform (1.02x).

### Cards
- Large corner radius (24px).
- Subtle "Ambient Shadow" on white backgrounds, or no shadow when placed on the light-gray surface.
- Padding should be generous (min 32px) to maintain the minimalist feel.

### Input Fields
- 16px corner radius.
- Background should be the soft surface color (#F8FAFC).
- On focus, the border transitions to Electric Blue with a subtle outer glow (bloom).

### Chips & Badges
- Fully rounded (pill).
- Use the Tertiary light-blue background with Electric Blue text for "info" states.
- High-contrast Slate background for "tagging" states.

### Lists
- Use generous vertical padding (16px+) between list items.
- Bullet points should be replaced with custom soft-geometric icons or small Electric Blue circles.
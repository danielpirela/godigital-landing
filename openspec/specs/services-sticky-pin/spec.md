# Services Sticky Pin

## Purpose

The Services section uses GSAP ScrollTrigger sticky-pin to lock the section while 4 service cards enter from different vectors (left, right, bottom, scale). mmx-generated icons (ux-ui, web, mobile, seo) appear inside each card. The sticky pin creates a "featured" feel where the section title remains visible while content dramatically enters. This is a medium-intensity animation distinct from Hero's high intensity.

Ref: Proposal §Approach (Services row) · §Capabilities (services-sticky-pin)

## Requirements

### Requirement: SERVICES_STICKY_PIN
The Services section container SHALL be pinned using `ScrollTrigger.create({ pin: true, start: 'top top', end: '+=500' })` when viewport width ≥ 769px.

During the pin, the section title "Servicios" remains visible while cards animate in.

The pin SHALL release after all 4 cards have completed their entrance animations.

#### Scenario: Section pins and releases correctly
Given the user scrolls to the Services section on desktop
When the section top reaches `top top` (viewport top)
Then the section becomes position:fixed for 500px of scroll
And the next section pushes up beneath the pinned content
And when all card animations complete, the pin releases

### Requirement: SERVICES_MULTI_VECTOR_CARD_ENTRANCE
The 4 service cards SHALL animate into view from different entrance vectors:

- Card 1 (UX/UI): `x: -80, opacity: 0` → `x: 0, opacity: 1` (from left)
- Card 2 (Web Dev): `x: 80, opacity: 0` → `x: 0, opacity: 1` (from right)
- Card 3 (Mobile): `y: 60, opacity: 0` → `y: 0, opacity: 1` (from bottom)
- Card 4 (SEO): `scale: 0.8, opacity: 0` → `scale: 1, opacity: 1` (scale in)

Each card SHALL have `stagger: 0.15` and `duration: 0.8` with `power3.out` easing.

#### Scenario: Cards enter from different vectors
Given the Services section is pinned
When the pin begins
Then card 1 slides in from the left over 0.8s
And card 2 slides in from the right with 150ms delay
And card 3 rises from below with 300ms delay
And card 4 scales in with 450ms delay

### Requirement: SERVICES_MMX_ICONS
Each service card SHALL display a mmx-generated icon via `<img>` with `data-mmx-generated` attribute:

- UX/UI card: `data-mmx-generated="ux-ui-icon"`, src `assets/generated/icons/ux-ui.png`
- Web Dev card: `data-mmx-generated="web-icon"`, src `assets/generated/icons/web.png`
- Mobile card: `data-mmx-generated="mobile-icon"`, src `assets/generated/icons/mobile.png`
- SEO card: `data-mmx-generated="seo-icon"`, src `assets/generated/icons/seo.png`

Fallback: Lucide SVG equivalents (figma, code, smartphone, search) when `getMmxAsset().is_ready === false`.

#### Scenario: Icon renders with mmx asset
Given the Services section is rendering
When `getMmxAsset('ux-ui-icon').is_ready` is true
Then the card shows `assets/generated/icons/ux-ui.png`
And `img[data-mmx-generated="ux-ui-icon"]` exists in the DOM

### Requirement: SERVICES_DEPTH_GLASS_CARDS
Service cards SHALL use depth-stacked glass styling via CSS classes `.glass-card-depth-1`, `.glass-card-depth-2`, `.glass-card-depth-3` with increasing `box-shadow` intensity.

The card order (left→right→bottom→scale) determines depth: left card = depth-1, right card = depth-2, bottom = depth-2, scale = depth-3.

#### Scenario: Cards have progressive depth
Given the 4 service cards are visible
When inspected in DOM order
Then the leftmost card has `.glass-card-depth-1`
And the rightmost has `.glass-card-depth-2`
And the scaled card has `.glass-card-depth-3`
And shadows are visually distinct at a glance
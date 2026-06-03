# Magnetic Interactions

## Purpose

Magnetic interactions create a premium "sticky" feel for buttons and decorative orbs. Buttons visually attract toward the cursor when within proximity (~100px), creating a playful, high-quality micro-interaction that reinforces the boutique brand. These interactions are desktop-only (fine pointer) and degrade gracefully on touch devices.

Ref: Proposal §Approach (Global row, inter-section row) · §magnetic-interactions capability

## Requirements

### Requirement: MAGNETIC_HOVER_BUTTON
Buttons with `class="magnetic-btn"` SHALL use `gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })` and `gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })` for cursor-attracted movement.

The magnetic attraction radius SHALL be 100px from button center. Within that radius, the button translates up to 15px toward the cursor position.

Magnetic effect SHALL only activate on `(hover: hover) and (pointer: fine)` devices.

#### Scenario: Button attracts toward cursor within radius
Given a button with `class="magnetic-btn"` on desktop
When the cursor moves within 100px of the button center
Then the button translates toward the cursor (max 15px)
When the cursor exits the radius, the button returns to origin
And the return animation uses 0.4s power3.out

### Requirement: CURSOR_ATTRACTED_ORBS
Decorative orbs with `class="cursor-orb"` SHALL translate toward the cursor position using `gsap.quickTo()` with `duration: 0.8` and `ease: 'power2.out'`.

The attraction radius SHALL be 150px and maximum translation SHALL be 30px.

The orb elements SHALL NOT affect page layout (position: absolute, pointer-events: none).

#### Scenario: Orb follows cursor at distance
Given a `.cursor-orb` element in the Hero
When the cursor is at page coordinates (x=500, y=300)
And the orb is at page center (x=640, y=360)
And the distance is 200px (within 150px radius + 30px threshold)
Then the orb translates toward the cursor position
And translation is capped at 30px regardless of closer proximity

### Requirement: MAGNETIC_A11Y_SAFE
Magnetic hover effects SHALL NOT be applied to elements that are focusable via keyboard (links, buttons, inputs).

The CSS selector `.magnetic-btn a`, `.magnetic-btn button`, `.magnetic-btn input` SHALL be excluded from magnetic behavior.

On mobile (touch), magnetic classes SHALL have no effect via the `(hover: hover) and (pointer: fine)` matchMedia guard.

#### Scenario: Keyboard user not affected by magnetic
Given a focusable link inside `.magnetic-btn` container
When the user tabs to the link
Then no magnetic attraction animation is applied
And the link remains at its original position
And the link is fully usable via keyboard navigation
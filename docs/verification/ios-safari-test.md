# iOS Safari Testing Checklist

**Device**: Real iPhone (any model with iOS 16+)
**Browser**: Safari
**Purpose**: Verify sticky-pin behavior, address bar interaction, and 30fps minimum

---

## Pre-test Setup

1. Open Safari on your iPhone
2. Navigate to `http://localhost:4321` (or your deployed URL)
3. Enable **Develop menu** on your Mac to use Safari Web Inspector:
   - Settings → Safari → Advanced → Web Inspector

---

## Test Steps

### 1. Sticky Pin Behavior

- [ ] Scroll to the **Services section**
- [ ] Verify cards do NOT stick (iOS Safari address bar interferes with sticky)
- [ ] Cards should fade-in with simple IntersectionObserver fallback
- [ ] No visual glitch when scrolling past Services section

**Expected**: Cards animate with fade-up (not pinned)

### 2. Address Bar Interaction

- [ ] Scroll down slowly from hero
- [ ] Observe address bar (it hides on scroll down, shows on scroll up)
- [ ] Verify content does not jump or reflow when address bar appears/disappears

**Expected**: Content adapts to viewport height changes smoothly

### 3. Parallax Orbs (Hero)

- [ ] On the Hero section, observe the 3 ambient orbs
- [ ] Scroll slowly — orbs should move at reduced parallax multiplier (0.3×/0.5×/0.7×)

**Expected**: Orbs move smoothly, no jarring animation

### 4. Breathing Animation (CTA)

- [ ] Scroll to the CTA section at the bottom
- [ ] Observe the breathing orbs (scale 0.9→1.1 over 4s)
- [ ] Check counter animation (ticks up from 0 to target)

**Expected**: Breathing smooth, counter animates once on enter

### 5. Performance Check

- [ ] Open Web Inspector > Performance tab
- [ ] Record 3 seconds of scrolling
- [ ] Verify FPS is 30fps or higher

**Target**: 30fps minimum on iOS Safari

---

## Common Issues

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Content jumps when address bar hides | No `100dvh` or `env(safe-area-inset-bottom)` | CSS uses `100dvh` for mobile heights |
| Sticky pin freezes | iOS Safari bug with `position: sticky` inside overflow container | Pin disabled on mobile via `enablePins: false` |
| Orbs stutter | Too many orbs (3+) with blur at 80px | Reduce blur to 40px on mobile |

---

## Pass Criteria

- [ ] Services section does NOT stick on iOS Safari
- [ ] Address bar shows/hides without content jump
- [ ] All orbs animate smoothly at 30fps+
- [ ] CTA counter animates correctly
- [ ] No console errors
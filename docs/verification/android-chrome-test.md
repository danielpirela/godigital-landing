# Android Chrome Testing Checklist

**Device**: Real Android phone (Android 12+)
**Browser**: Chrome
**Purpose**: Verify 60fps target, parallax smoothness, no dropped frames

---

## Pre-test Setup

1. Connect your Android phone to your Mac via USB
2. Enable **USB debugging** on the Android device:
   - Settings → About Phone → tap "Build Number" 7 times
   - Settings → Developer Options → USB debugging (enable)
3. Open Chrome on Android, navigate to your site
4. On your Mac, open Chrome DevTools > Remote Devices tab
5. Select your device and click **Inspect**

---

## Test Steps

### 1. 60fps Scroll Target

- [ ] Open DevTools > Performance tab
- [ ] Set recording options to "60fps" target
- [ ] Record 4 seconds of scrolling from top to bottom
- [ ] Check the FPS chart — should be consistently 55-60fps

**Target**: 60fps (minimum 50fps acceptable)

### 2. Parallax Orbs Smoothness

- [ ] Scroll to the Hero section
- [ ] Observe the 3 ambient orbs (left, right, bottom)
- [ ] Each should translate at 0.3×/0.5×/0.7× Y multiplier

**Expected**: No visible stutter or frame drops on parallax

### 3. Services Section Scroll

- [ ] Scroll to the Services section (4 cards)
- [ ] Each card should animate in (multi-vector entrance: x:-80, x:+80, y:+60, scale:0.8)

**Expected**: Cards animate smoothly, no dropped frames

### 4. BoutiqueEdge Curtain Wipe

- [ ] Scroll from Services to BoutiqueEdge section
- [ ] Observe the CSS clip-path wipe (blue curtain sweeps in/out)

**Expected**: Wipe is smooth, 0.6s expo.out

### 5. CTA Section Counters

- [ ] Scroll to CTA section
- [ ] Observe counter animation (+10 proyectos, +8 años, 50+, 100%+)

**Expected**: Counters tick up smoothly once when section enters viewport

### 6. Process Section Timeline

- [ ] Scroll to Process section
- [ ] Observe line scaleY 0→1, circles rotate 0→360°

**Expected**: Line draws smoothly, circles rotate in sync with scroll

---

## FPS Troubleshooting

| FPS Reading | Issue | Fix |
|-------------|-------|-----|
| < 30fps | Too many particles | Reduce `--particle-count` to 5 |
| 30-45fps | Orb blur too high | Reduce `--orb-blur` from 80px to 40px |
| 45-55fps | Scroll scrub too smooth | Reduce `scrubSpeed` to 1.0 |

---

## Pass Criteria

- [ ] 60fps scrolling (minimum 50fps)
- [ ] Parallax orbs smooth at 0.3×/0.5×/0.7× multipliers
- [ ] Services cards animate smoothly
- [ ] Curtain wipe is clean
- [ ] CTA counters animate correctly
- [ ] Process timeline is smooth
- [ ] No dropped frames on scroll
- [ ] No console errors
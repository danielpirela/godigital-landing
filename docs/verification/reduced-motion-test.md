# prefers-reduced-motion Testing Checklist

**Browser**: macOS Safari or any browser with "Reduce Motion" preference
**Purpose**: Verify all GSAP is killed, content fully visible, AudioToggle not rendered

---

## Pre-test Setup

### Enable "Reduce Motion" on macOS:

1. Open **System Preferences** → **Accessibility** → **Display**
2. Check **Reduce motion**
3. Refresh the page

### Enable "Reduce Motion" on iOS:

1. **Settings** → **Accessibility** → **Motion**
2. Enable **Reduce Motion**
3. Open Safari and refresh the page

---

## Test Steps

### 1. No GSAP Animations Fire

- [ ] Open DevTools console
- [ ] Refresh the page
- [ ] Verify console shows: `[godigital] prefers-reduced-motion — v2 animations disabled`

**Expected**: No GSAP timelines start, no ScrollTrigger animations fire

### 2. All Content Visible (No Invisible Elements)

- [ ] Scroll through the entire page
- [ ] All text, images, and sections are visible

**Expected**: Content is fully visible (not hidden by opacity:0 or clip-path reveal)

### 3. AudioToggle Not Rendered

- [ ] Inspect the DOM
- [ ] Verify the `<button id="audio-toggle">` is NOT present in the DOM

**Expected**: AudioToggle component is not rendered (handled via Astro inline check)

### 4. Videos Paused (if any mmx videos present)

- [ ] Any `<video>` elements should be paused at first frame
- [ ] No video autoplay

**Expected**: Videos are paused, poster images visible

### 5. CSS Fallback for Reveal

- [ ] Scroll to any section with a reveal animation (Hero, Services, etc.)
- [ ] All content should be visible immediately (no scroll-triggered reveal needed)

**Expected**: CSS sets `opacity: 1; visibility: visible` for all `.reveal` elements

---

## macOS Safari Specific Test

- [ ] Enable "Reduce Motion" in System Preferences
- [ ] Open Safari and navigate to the site
- [ ] Hero: tagline should be fully visible (not clip-path hidden)
- [ ] Navbar: no background-color scrub animation
- [ ] Counters: static values (not animated)
- [ ] Orbs: no parallax movement on scroll

---

## Pass Criteria

- [ ] Console confirms reduced-motion was detected
- [ ] No GSAP animations fire
- [ ] All content is visible without scroll-triggered reveals
- [ ] AudioToggle not rendered
- [ ] All videos paused
- [ ] No console errors
- [ ] Page is fully functional and readable
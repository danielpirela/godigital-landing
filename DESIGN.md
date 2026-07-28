---
name: GoDigital Delivery Dossier
description: An inspectable project-room system for founder-led digital delivery.
colors:
  cobalt-field: "#1746d1"
  cobalt-deep: "#0b2d7a"
  blueprint-deep: "#08245f"
  drafting-paper-bright: "#fffdf5"
  drafting-paper: "#f2ecd8"
  drafting-paper-muted: "#ddd4b9"
  graphite: "#182027"
  graphite-soft: "#4c5760"
  redline: "#a82f2a"
  blueprint-copy: "#dbe4ff"
  blueprint-note: "#b9cafb"
  dark-field-copy: "#cdd2d6"
  dark-field-copy-bright: "#e6e9eb"
  brand-electric-blue: "#0066ff"
  brand-white: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(3.3rem, 6.3vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 4.8vw, 4.8rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  evidence:
    fontFamily: "Azeret Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.09em"
rounded:
  sheet: "2px"
  control: "8px"
  status: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  section: "clamp(5.5rem, 10vw, 9.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.cobalt-field}"
    textColor: "{colors.drafting-paper-bright}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "13px 18px"
    height: "52px"
  button-paper:
    backgroundColor: "{colors.drafting-paper-bright}"
    textColor: "{colors.cobalt-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "13px 18px"
    height: "52px"
  status-label:
    backgroundColor: "{colors.cobalt-field}"
    textColor: "{colors.drafting-paper-bright}"
    typography: "{typography.evidence}"
    rounded: "{rounded.status}"
    padding: "6px 10px"
---

# Design System: GoDigital Delivery Dossier

## Overview

**Creative North Star: "The Delivery Dossier"**

GoDigital's visual world is a senior project room where promises are visible, decisions are annotated, and delivery evidence is understandable. It draws from cobalt blueprints, warm drafting paper, graphite notes, redlines, tabs, checklists, and redacted case documents without becoming a literal stationery theme.

The system replaces neon glassmorphism with editorial composition, working-document density, and human marks of care. It feels premium because it is precise and authored, not because it adds glow or chrome.

**Key Characteristics:**

- Evidence-led compositions rather than generic claims.
- Warm paper fields interrupted by committed cobalt regions.
- Varied editorial rhythm: dense dossiers, quiet statements, and direct actions.
- Technical notation paired with approachable Spanish copy.
- Motion that behaves like document work: drawing, checking, stamping, and changing state.

## Colors

The palette is a full material system: cobalt owns blueprint fields, drafting papers hold evidence, graphite carries reading, and redline marks human review.

### Primary

- **Cobalt Field:** Owns the hero, primary actions, and committed blueprint regions.
- **Cobalt Deep:** Carries text and controls that need stronger contrast on paper.
- **Blueprint Deep:** Supports dense technical maps and the final project-opening section.

### Secondary

- **Redline:** Marks annotation, correction, stamps, and review status. It is never a general accent.

### Neutral

- **Drafting Paper Bright:** The clearest evidence sheets and primary light foreground.
- **Drafting Paper:** The working canvas for ledgers, notes, and supporting documents.
- **Drafting Paper Muted:** Physical sheet offsets and low-priority material depth.
- **Graphite:** Primary text and the dark delivery-log field.
- **Graphite Soft:** Secondary body copy on paper while preserving readable contrast.
- **Blueprint Copy:** Secondary copy placed directly on cobalt or blueprint fields.
- **Blueprint Note:** Evidence labels and method outputs placed on dark fields.
- **Dark Field Copy:** Supporting copy on graphite fields.
- **Dark Field Copy Bright:** Navigation and high-priority links on graphite fields.
- **Brand Electric Blue and Brand White:** Reserved for the established GoDigital logo artwork.

**The Field Rule.** Color owns meaningful regions of the page; it is never scattered as decorative glow.

**The Redline Rule.** Red is reserved for annotation, correction, and emphasis, never general decoration.

## Typography

**Display Font:** Archivo with Arial Narrow and Arial fallbacks.

**Body Font:** Archivo with Arial fallback.

**Label/Mono Font:** Azeret Mono with native monospace fallbacks.

Archivo provides editorial authority and a Latin American connection while remaining practical for dense working documents. Azeret Mono is limited to case identifiers, statuses, labels, and technical annotations.

### Hierarchy

- **Display** (800, up to 6rem, 0.98 line height): first-view proposition and major founder statement.
- **Headline** (800, up to 4.8rem, 1 line height): section theses and important document conclusions.
- **Title** (800, fluid 1.35rem to 3rem): ledger entries, steps, and evidence headings.
- **Body** (400, 1rem, 1.65 line height): persuasive and explanatory copy, held near 60-65 characters where composition permits.
- **Evidence** (600, 0.7rem, 0.09em tracking): uppercase identifiers, outputs, state, and provenance only.

**The Evidence-Type Rule.** Monospace identifies evidence; it never carries persuasive paragraphs or decorative display text.

## Layout

The page uses an 80rem maximum frame with fluid gutters and an asymmetric editorial grid. The first viewport pairs a direct proposition with a tangible case sheet. Later sections alternate three-column editorial introductions, split dossier/map compositions, sticky ledgers, full cobalt statements, and dark decision logs.

Section spacing is fluid from 5.5rem to 9.5rem. Wide compositions collapse to one intentional reading order below 60rem. At 46rem, documents simplify, actions become full width, and dense flows stack. A final 22rem breakpoint protects the 320px floor.

Blueprint grids appear only beneath actual case, map, or project-opening material. They are not generic page texture.

## Elevation & Depth

Depth comes from paper overlap, tonal fields, clipped edges, and offset shadows. Documents use a hard material offset plus a soft ambient shadow, both down and to the right. Flat ledgers and registers use rules rather than shadows.

### Shadow Vocabulary

- **Document Lift** (`10px 12px 0` plus a soft `16px 22px 34px` shadow): supporting paper placed above the canvas.
- **Primary Dossier Lift** (`16px 18px 0` plus a soft `22px 30px 54px` shadow): the hero case file only.
- **Action Offset** (`5px 5px 0`): tactile primary controls; increases slightly on hover.

**The Flat-Until-Lifted Rule.** A surface earns a shadow only when it physically reads as a sheet placed above another sheet.

## Shapes

Structural surfaces are square or use a 2px paper edge. Controls use restrained 8px corners. Status labels alone use pills. Tabs, stamps, punched map nodes, rules, and redaction bars provide the recurring silhouettes.

Rotations remain below two degrees for working sheets and three degrees for stamps. They signal handling without turning the interface into a scrapbook.

## Components

### Buttons

- **Shape:** Restrained control corner (8px), minimum height 52px.
- **Primary:** Cobalt field with bright paper text and a graphite material offset.
- **Paper:** Bright paper with deep cobalt text for actions placed on blueprint fields.
- **Hover / Focus:** Move up-left by 2px, deepen the offset, and retain the global 3px redline focus ring.

### Chips

- **Style:** Reserved for verified compact status such as "Entregado"; cobalt field, bright paper text, and evidence typography.
- **State:** Static provenance, never a decorative category cloud.

### Cards / Containers

- **Corner Style:** Paper edge (2px) or square.
- **Background:** Bright or working drafting paper; blueprint only for technical maps.
- **Shadow Strategy:** Use Document Lift only when overlap is meaningful.
- **Border:** Registers and ledgers use a single graphite rule instead of a shadow.
- **Internal Padding:** Fluid 24px to 72px based on document hierarchy.

### Navigation

The sticky graphite masthead preserves the static GoDigital mark, exposes four verified anchors, and keeps the primary WhatsApp action visible on wide screens. Mobile uses a native `details` disclosure and a full-height paper index with WhatsApp primary, email secondary, and a clear close state.

### Contact Hierarchy

- **Primary:** WhatsApp at `https://wa.me/message/UFU3OSZAUAYKK1` in the navbar, hero, contact sheet, and footer.
- **Secondary:** Email at `godigitalveweb@gmail.com`, visible but subordinate to WhatsApp.
- **Verified presence:** Instagram at `https://www.instagram.com/godigitalve?igsh=cTF5OHdlMjFmb3px&utm_source=qr` and TikTok at `https://www.tiktok.com/@godigital45?_r=1&_t=ZS-98Pof6VsQem`, presented as compact text links in the footer rather than primary actions.

### Delivery Dossier

The signature component combines a case identifier, redacted identity, definition-list facts, verified checklist, client-status note, and restrained approval stamp. It presents only approved evidence and remains complete without motion.

## Do's and Don'ts

### Do:

- **Do** make real deliverables and verified case facts the primary visual material.
- **Do** vary section scale, alignment, and density while preserving a legible reading order.
- **Do** use annotations, rules, tabs, and stamps to explain status or provenance.
- **Do** keep core content visible before motion initializes.
- **Do** use document motion only for sheets, rules, checkpoints, and stamps.

### Don't:

- **Don't** use glassmorphism, glowing orbs, particles, magnetic interactions, or gratuitous parallax.
- **Don't** repeat centered eyebrow, headline, divider, and card-grid compositions.
- **Don't** fabricate screenshots, quantified outcomes, testimonials, or scale claims.
- **Don't** turn every container into a decorative project document.
- **Don't** use monospace or blueprint grids without evidence-bearing purpose.

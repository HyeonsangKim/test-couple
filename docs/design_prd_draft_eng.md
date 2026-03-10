<!-- markdownlint-disable MD013 -->

# Design System PRD v1

## Markdown-Only Source of Truth for the Couple Shared Map App

Document status: implementation draft  
Document principle: this document is written as a single source of truth that must be sufficient to implement the design system and page structure without Figma, external image references, or a separate visual guide. App icons, launcher icons, and brand mark systems are out of scope for this document.

---

## 1. Document Purpose

This document defines the visual language, design tokens, component specifications, page composition rules, state expression rules, and forbidden implementation patterns for the couple shared map app in numeric form.

Core goals:

1. Claude Code must be able to implement the desired UI direction from this document alone.
2. The product should feel emotional, refined, and fluid, while every decision remains measurable inside the document.
3. Even if the implementation reuses existing code structure, the final visual result must match this document.

## 1-1. Agent Working Principles

1. This document is the single source of truth for design.
2. If this document conflicts with `src/theme/tokens.ts`, this document wins.
3. Whether a component is new or existing, the final result must follow the tokens and composition rules in this document.
4. Do not invent a new visual direction for implementation convenience.
5. When something is ambiguous, prefer the simpler, quieter, and more premium direction.
6. Favor whitespace, layered surfaces, strong typographic hierarchy, and soft sheet-based structure over high-saturation decoration.
7. This document is written for mobile app screens only.

---

## 2. One-Line Product Definition

This app should not feel like a `map utility for record-keeping`. It should feel like a `premium lifestyle app for preserving places and memories shared by a couple`.

---

## 3. Intended Overall Feel

### 3-1. First Impression

1. Soft
2. Ordered
3. Premium without being exaggerated
4. Map and memories feel like content, not tools
5. Easy to tap, easy to read, and breathable

### 3-2. Emotional Keywords

1. Soft
2. Calm
3. Premium
4. Warm
5. Intimate
6. Layered
7. Editorial
8. Native

### 3-3. Forbidden Keywords

1. Technical
2. Busy
3. Cheap
4. Neon
5. Boxy
6. Dense
7. Admin-like

---

## 4. Design Direction Statements

### 4-1. Visual Direction

1. Use bright, warm neutral tones for the overall background.
2. Cards, sheets, and search bars should feel like one family of soft floating surfaces.
3. Strong accent color should appear only in key actions and should occupy roughly 10 to 15 percent of the screen.
4. Even dense information should still feel spacious because of large radii and generous whitespace.
5. Typography should carry the hierarchy; decoration should stay quiet.

### 4-2. Interaction Direction

1. Main transitions should feel like sheets rising, cards expanding, and objects pressing softly into the surface.
2. Prefer calm and stable transitions over fast and sharp ones.
3. Prefer bottom sheets over modals in most cases.
4. The map is contextual background. The actual browsing experience is driven by top search and bottom results.

### 4-3. Content Direction

1. Places should feel like memory units, not raw data objects.
2. Visits, photos, and notes should read like emotional content cards rather than utilitarian feature blocks.
3. Snapshot and archive surfaces should feel like quiet archival experiences, not operational tools.

### 4-4. Subtle Opaque Glassmorphism Direction

1. This is not a full glassmorphism app.
2. Glassmorphism is allowed only on a limited set of controls floating above maps, photos, or hero media.
3. The goal is not transparent cold glass. The goal is a milky, semi-opaque premium surface.
4. Transparency must never reduce text legibility.
5. Do not use glassmorphism on standard cards, settings lists, form bodies, or the default sheet body.
6. App icons, launcher icons, and branding marks must not use these glass rules.

---

## 5. Platform and Implementation Baseline

### 5-1. Device Baseline

1. Primary reference viewport: `390 x 844`
2. Minimum supported width: `360`
3. Maximum default design width: `430`
4. Safe area must always be respected.

### 5-2. Units

1. All numeric values in this document are written in `px`.
2. In React Native, use the same numeric values directly.
3. Use system fonts only.
4. Use SF Pro on iOS and the platform default system font on Android.

### 5-3. Accessibility

1. All touch targets must be at least `44 x 44`
2. Body text contrast must be at least `4.5:1`
3. Large text contrast must be at least `3:1`
4. Under Dynamic Type expansion, titles must remain stable up to `2 lines` and body text up to `3 lines`

---

## 6. Design System Structure

This design system is organized into eight layers:

1. Grid
2. Spacing
3. Radius
4. Color
5. Typography
6. Surface and Shadow
7. Motion
8. Component Recipes

---

## 7. Grid System

### 7-1. Base Grid

1. Base grid: `4`
2. Primary multiples: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`
3. Avoid arbitrary values such as `7`, `11`, `13`, or `19`

### 7-2. Screen Layout

1. Default horizontal page padding: `20`
2. Secondary dense form padding: `16`
3. Default section gap: `24`
4. Default card gap: `16`
5. Gap between header and first content block: `16`

---

## 8. Spacing Scale

| Token      | Value | Description                    |
| ---------- | ----: | ------------------------------ |
| `space.1`  |     4 | micro adjustment               |
| `space.2`  |     8 | minimum icon-text gap          |
| `space.3`  |    12 | secondary block spacing        |
| `space.4`  |    16 | card gap, minor inner padding  |
| `space.5`  |    20 | page padding, default card pad |
| `space.6`  |    24 | section gap                    |
| `space.7`  |    28 | large search or sheet spacing  |
| `space.8`  |    32 | hero separation                |
| `space.10` |    40 | large block separation         |
| `space.12` |    48 | onboarding or hero spacing     |

Rules:

1. Small spacing should usually be `8` or `12`
2. Default spacing should usually be `16` or `20`
3. Large section spacing should usually be `24` or `32`
4. Sheet bodies should default to `20` padding

---

## 9. Radius System

| Token          | Value | Usage                              |
| -------------- | ----: | ---------------------------------- |
| `radius.xs`    |     8 | small badges                       |
| `radius.sm`    |    12 | thumbnails, small status surfaces  |
| `radius.md`    |    16 | inputs, small cards                |
| `radius.lg`    |    20 | input sections, small cards        |
| `radius.xl`    |    24 | standard cards, list cards, detail |
| `radius.2xl`   |    28 | search bars, large pills           |
| `radius.sheet` |    32 | top corners of bottom sheets       |
| `radius.full`  |   999 | circles, pills                     |

Rules:

1. Search bars use `28`
2. Default card radius is `20` or `24`
3. Emotional detail cards and sheets should use `24` or larger
4. Circular buttons and filter chips use `full`

---

## 10. Color System

### 10-1. Overall Direction

1. Use warm off-white and soft gray as the base.
2. Use a near-black charcoal for text.
3. Use rose pink as the core accent, but in a restrained way.
4. Use mint green for map-related positive and status signals.
5. Archive or emotional record views may use a restrained blush gradient.

### 10-2. Palette

| Token                         | Hex                      | Usage                           |
| ----------------------------- | ------------------------ | ------------------------------- |
| `color.bg.canvas`             | `#F7F4F2`                | main app background             |
| `color.bg.elevated`           | `#FCFAF8`                | cards and sheets                |
| `color.bg.soft`               | `#F1ECE9`                | inactive inputs, soft regions   |
| `color.bg.strong`             | `#231F26`                | dark CTA, selected emphasis     |
| `color.overlay.dim`           | `rgba(17,14,19,0.18)`    | sheet and modal dim             |
| `color.text.primary`          | `#201B22`                | titles and body text            |
| `color.text.secondary`        | `#6E6772`                | secondary body text             |
| `color.text.tertiary`         | `#9D96A1`                | placeholders and inactive text  |
| `color.text.inverse`          | `#FFFFFF`                | text on dark surfaces           |
| `color.border.soft`           | `rgba(32,27,34,0.08)`    | dividers and soft borders       |
| `color.border.strong`         | `rgba(32,27,34,0.14)`    | selected borders                |
| `color.glass.fill`            | `rgba(252,250,248,0.82)` | subtle opaque glass fill        |
| `color.glass.fillStrong`      | `rgba(252,250,248,0.90)` | stronger glass fill for text    |
| `color.glass.stroke`          | `rgba(255,255,255,0.34)` | glass highlight stroke          |
| `color.accent.primary`        | `#E94B82`                | primary CTA                     |
| `color.accent.primaryPressed` | `#D63D73`                | pressed CTA                     |
| `color.accent.primarySoft`    | `#F8DCE7`                | soft emphasis background        |
| `color.accent.mint`           | `#27AE60`                | markers and success             |
| `color.accent.amber`          | `#D9A441`                | warning                         |
| `color.accent.info`           | `#4E8FD6`                | info                            |
| `color.gradient.blushStart`   | `#F6D7D0`                | blush gradient start            |
| `color.gradient.blushEnd`     | `#E7B8C8`                | blush gradient end              |

### 10-3. Usage Ratio

1. Background and surfaces: `70%`
2. Text and neutral support tones: `20%`
3. Accent color: `10%`

### 10-4. Color Rules

1. Each screen should have at most one strong accent color as the visual lead.
2. The primary CTA must always be the most saturated element on the screen.
3. Do not use pink and mint as simultaneous strong leads.
4. Dangerous actions should use `danger red` or `charcoal + explicit copy`, not hot pink.
5. Glass surfaces must always stay bright; do not use dark glass.

---

## 11. Typography System

### 11-1. Core Principles

1. Titles should be large, bold, and short.
2. Descriptive text should remain readable but visually quieter.
3. When the screen becomes information-dense, increase grouping and spacing instead of shrinking type.

### 11-2. Type Scale

| Token            | Size / Line Height | Weight | Usage                              |
| ---------------- | ------------------ | -----: | ---------------------------------- |
| `type.display.l` | `40 / 48`          |    700 | onboarding, emotional hero title   |
| `type.display.m` | `32 / 40`          |    700 | main detail title                  |
| `type.heading.l` | `28 / 36`          |    700 | large section title                |
| `type.heading.m` | `24 / 32`          |    700 | sheet title, page title            |
| `type.title.l`   | `20 / 28`          |    700 | card title                         |
| `type.title.m`   | `18 / 26`          |    600 | list titles, important labels      |
| `type.body.l`    | `17 / 24`          |    400 | primary body                       |
| `type.body.m`    | `15 / 22`          |    400 | secondary body                     |
| `type.body.s`    | `14 / 20`          |    400 | address and metadata               |
| `type.caption`   | `13 / 18`          |    500 | badges, dates, states              |
| `type.micro`     | `12 / 16`          |    500 | timer and micro labels             |
| `type.button.l`  | `17 / 22`          |    600 | primary button                     |
| `type.button.m`  | `15 / 20`          |    600 | secondary button                   |

### 11-3. Typography Rules

1. Hero titles: maximum `2 lines`
2. Card titles: maximum `2 lines`
3. Address and descriptions: maximum `2 lines`
4. Timers and state text: `micro` or `caption`
5. Supporting descriptions under major titles must use `secondary`

---

## 12. Surface, Border, and Shadow

### 12-1. Border

1. Standard divider: `1px rgba(32,27,34,0.08)`
2. Selected divider: `1px rgba(32,27,34,0.14)`
3. Do not use thick borders

### 12-2. Shadow Tokens

| Token          | Value                         |
| -------------- | ----------------------------- |
| `shadow.sm`    | `0 4 12 rgba(32,27,34,0.06)`  |
| `shadow.md`    | `0 8 24 rgba(32,27,34,0.08)`  |
| `shadow.lg`    | `0 12 32 rgba(32,27,34,0.10)` |
| `shadow.xl`    | `0 18 44 rgba(32,27,34,0.12)` |
| `shadow.glass` | `0 10 28 rgba(32,27,34,0.10)` |

### 12-3. Surface Rules

1. Default card surface is `color.bg.elevated`
2. Default sheet surface is `color.bg.elevated`
3. Floating elements above the map should use at least `shadow.md`
4. The main differentiation between card and background should come from `radius + surface contrast + soft shadow`
5. Strong blur and heavy shadow are forbidden

### 12-4. Opaque Glass Rules

1. Glass surfaces must use a bright milky fill with `82% ~ 90%` opacity
2. Glass surfaces must combine `thin highlight stroke + soft shadow`
3. iOS blur is allowed, but strength should stay around `8 ~ 12`
4. On unsupported environments, replace blur with a solid fallback based on `color.glass.fillStrong`
5. Text on glass must use only `text.primary` or `text.secondary`
6. Do not use glass effects on large reading cards

### 12-5. Allowed Glass Targets

1. Top search bar on the map screen
2. Floating icon buttons on the map screen such as filter, location, and back
3. Back, share, and favorite actions above hero media
4. Page indicator pills above images
5. Segmented controls and top chip strips above photos or maps

### 12-6. Forbidden Glass Targets

1. Standard list cards
2. Settings cards
3. Default sheet body content
4. Long-form reading cards
5. Destructive confirm modals
6. App icons, launcher icons, splash icons

---

## 13. Motion System

### 13-1. Duration

| Token             |  Value |
| ----------------- | -----: |
| `motion.fast`     |  120ms |
| `motion.normal`   |  180ms |
| `motion.emphasis` |  260ms |
| `motion.sheet`    |  320ms |
| `motion.page`     |  280ms |
| `motion.breathe`  | 1400ms |

### 13-2. Motion Rules

1. Button press scale: `0.98`
2. Card press scale: `0.995`
3. Bottom sheet entrance: `280 ~ 320ms`
4. Modal fade: `180 ~ 220ms`
5. Page transitions should be quick but not sharp

### 13-3. Easing

1. Default: `ease-out`
2. Sheets: `cubic-bezier(0.22, 1, 0.36, 1)`
3. Fast state changes: `ease-out`

---

## 14. Shared Component Specifications

## 14-1. Header

| Item                 | Spec           |
| -------------------- | -------------- |
| Height               | `56`           |
| Horizontal padding   | `20`           |
| Leading icon button  | `48 x 48`      |
| Trailing action zone | min `48`       |
| Title style          | `type.title.l` |

Rules:

1. Headers must remain visually balanced on both sides.
2. If the left side has a back button, the right side should reserve equal minimum width as either empty space or an action zone.

## 14-2. Floating Icon Button

| Item       | Spec                |
| ---------- | ------------------- |
| Size       | `48 x 48`           |
| Radius     | `24`                |
| Icon size  | `24`                |
| Shadow     | `shadow.md`         |
| Background | `color.bg.elevated` |

Glass variant:

1. `variant.glass` is allowed
2. Fill: `color.glass.fillStrong`
3. Stroke: `1px color.glass.stroke`
4. Shadow: `shadow.glass`
5. Allowed positions: above maps and hero media

## 14-3. Search Bar

| Item                  | Spec          |
| --------------------- | ------------- |
| Height                | `56`          |
| Radius                | `28`          |
| Horizontal padding    | `20`          |
| Left icon size        | `20`          |
| Right clear icon size | `20`          |
| Text style            | `type.body.l` |

Rules:

1. Search bars should almost always feel like they float above the surface.
2. Focus should be expressed by shadow and caret, not by heavy borders.
3. Placeholder uses `text.tertiary`
4. Search bars above the map default to the `opaque glass variant`
5. Search bars on dedicated search pages default to the `solid elevated variant`

## 14-4. Chip

| Item       | Spec           |
| ---------- | -------------- |
| Height     | `44`           |
| Radius     | `22`           |
| Padding X  | `16`           |
| Text style | `type.title.m` |

States:

1. Default: `bg.elevated`
2. Selected neutral: `bg.soft`
3. Selected accent: `accent.primarySoft`
4. Disabled opacity: `0.45`

Glass variant:

1. Allowed only on maps or photos
2. Fill: `color.glass.fill`
3. Stroke: `1px color.glass.stroke`
4. Shadow: `shadow.glass`

## 14-5. Primary Button

| Item       | Spec            |
| ---------- | --------------- |
| Height     | `56`            |
| Radius     | `28`            |
| Padding X  | `24`            |
| Text style | `type.button.l` |

Variants:

1. `fill-primary`: `accent.primary`
2. `fill-dark`: `bg.strong`
3. `soft-secondary`: `bg.soft`
4. `ghost-danger`: text-only danger tone

## 14-6. Card

| Item         | Spec          |
| ------------ | ------------- |
| Radius       | `24`          |
| Padding      | `20`          |
| Internal gap | `12`          |
| Background   | `bg.elevated` |
| Shadow       | `shadow.sm`   |

Rules:

1. A single card should have at most one primary action
2. Metadata should be grouped into structured blocks, not pushed into random bottom or right alignment

## 14-7. List Card

| Item             | Spec      |
| ---------------- | --------- |
| Min height       | `104`     |
| Radius           | `24`      |
| Padding          | `16`      |
| Thumbnail        | `72 x 72` |
| Thumbnail radius | `16`      |
| Gap              | `16`      |

## 14-8. Bottom Sheet

| Item                     | Spec              |
| ------------------------ | ----------------- |
| Top radius               | `32`              |
| Handle                   | `36 x 4`          |
| Top padding              | `12`              |
| Inner horizontal padding | `20`              |
| Default snap points      | `40% / 72% / 90%` |

Rules:

1. Map search results should default to a bottom-sheet experience
2. If multiple options are available, prefer a sheet over an alert
3. Do not place another floating card inside the sheet body

## 14-9. Modal

| Item              | Spec  |
| ----------------- | ----- |
| Horizontal margin | `20`  |
| Max width         | `360` |
| Radius            | `28`  |
| Padding           | `24`  |

## 14-10. Hero Image Area

| Item                   | Spec   |
| ---------------------- | ------ |
| Height                 | `360`  |
| Crop ratio target      | `4:3`  |
| Overlay button offset  | `20`   |
| Page indicator padding | `8 12` |
| Indicator radius       | `12`   |

## 14-11. Date Range Panel

| Item              | Spec             |
| ----------------- | ---------------- |
| Panel radius      | `28`             |
| Panel padding     | `20`             |
| Tab height        | `52`             |
| Date cell         | `44 x 44`        |
| Selected date     | `44 x 44 circle` |
| Range band radius | `16`             |

## 14-12. Banner / Notice

| Item       | Spec          |
| ---------- | ------------- |
| Radius     | `20`          |
| Padding    | `16`          |
| Icon size  | `20`          |
| Text style | `type.body.s` |

Rules:

1. Strong warning banners should use either a `danger tint` or `soft neutral + warning icon`
2. Do not stack multiple top banners

## 14-13. Text Field

| Item                 | Spec |
| -------------------- | ---- |
| Field height         | `56` |
| Large field height   | `64` |
| Radius               | `20` |
| Horizontal padding   | `16` |
| Vertical padding     | `16` |
| Prefix / suffix icon | `20` |
| Label to field gap   | `8`  |
| Helper to field gap  | `8`  |

Rules:

1. Default fields use `bg.soft + border.soft`
2. Standalone input pages should not add shadow directly to fields
3. When a field sits inside a card, its border contrast should stay quiet so it does not fight the card container
4. Placeholder uses `text.tertiary`, input value uses `text.primary`, helper text uses `text.secondary`
5. Error state uses `danger tint + helper text`, not thick red borders

## 14-14. Text Area / Message Composer

| Item                     | Spec  |
| ------------------------ | ----- |
| Form textarea min height | `132` |
| Form textarea max height | `196` |
| Composer min height      | `52`  |
| Composer max height      | `116` |
| Radius                   | `20`  |
| Padding                  | `16`  |
| Attachment icon          | `20`  |
| Internal gap             | `12`  |

Rules:

1. Use the `form textarea` variant for longer notes
2. Use the `composer` variant for short conversational input
3. Both variants default to `bg.soft`
4. Input height should grow with content and minimize layout jumps

## 14-15. Segmented Control

| Item              | Spec            |
| ----------------- | --------------- |
| Container height  | `52`            |
| Container radius  | `26`            |
| Container padding | `4`             |
| Thumb height      | `44`            |
| Thumb radius      | `22`            |
| Segment min width | `72`            |
| Text style        | `type.button.m` |

Rules:

1. Default segment count is `2~3`
2. Default variant uses `bg.soft container + elevated thumb`
3. The `opaque glass variant` is allowed above maps or photos
4. Selected state should be expressed through at least two of the following: thumb, text contrast, icon contrast

## 14-16. Settings Row

| Item               | Spec      |
| ------------------ | --------- |
| Default height     | `56`      |
| Comfortable height | `64`      |
| Horizontal padding | `16`      |
| Vertical padding   | `16`      |
| Leading icon frame | `32 x 32` |
| Inter-item gap     | `12`      |
| Chevron size       | `16`      |
| Value max width    | `40%`     |

Rules:

1. Default settings rows live inside one grouped card
2. Use `64` height only when a subtitle is present
3. Row internals should avoid accent colors except for state indicators
4. Destructive rows must be separated into their own danger section

## 14-17. Toggle Row

| Item               | Spec      |
| ------------------ | --------- |
| Row height         | `56`      |
| Comfortable height | `64`      |
| Horizontal padding | `16`      |
| Inter-item gap     | `12`      |
| Switch track       | `52 x 32` |
| Switch thumb       | `28`      |
| Helper gap         | `4`       |

Rules:

1. Toggle rows use a fixed `label block -> switch` structure
2. Helper text, if present, sits `4` below the label
3. The switch should feel native, but the off state must remain legible

## 14-18. Avatar

| Token       | Size | Usage                                 |
| ----------- | ---: | ------------------------------------- |
| `avatar.xs` | `32` | row leading, beside small status pill |
| `avatar.sm` | `40` | message or comment author             |
| `avatar.md` | `56` | profile block inside cards            |
| `avatar.lg` | `80` | profile card on My page               |
| `avatar.xl` | `96` | main avatar in profile edit           |

Rules:

1. Avatars always use `radius.full`
2. Missing avatars use `bg.soft + text.secondary` placeholder styling
3. On strong photo or hero backgrounds, avatars may use a `2px elevated stroke`

## 14-19. Badge / Status Pill

| Item               | Spec           |
| ------------------ | -------------- |
| Compact height     | `24`           |
| Default height     | `28`           |
| Horizontal padding | `12`           |
| Radius             | `full`         |
| Leading dot / icon | `8`            |
| Text style         | `type.caption` |

States:

1. Neutral: `bg.soft + text.secondary`
2. Saved / Active: `accent.primarySoft + text.primary`
3. Success: `mint tint + dark text`
4. Warning: `amber tint + dark text`
5. Danger: `soft red tint + dark text`
6. Read-only: `bg.soft + micro icon`

Rules:

1. Status pills must not read before the main title
2. A single card may use at most two differently colored status pills

## 14-20. Result Row

| Item                | Spec      |
| ------------------- | --------- |
| Compact row height  | `72`      |
| Media row height    | `88`      |
| Horizontal padding  | `20`      |
| Vertical padding    | `12`      |
| Leading thumbnail   | `56 x 56` |
| Thumbnail radius    | `16`      |
| Inter-item gap      | `16`      |
| Trailing affordance | `20`      |

Rules:

1. Map search results should use the `media row` by default
2. Only short recommendations or recent search items should use the `compact row`
3. The entire row is the tap target and the trailing affordance is only a supporting signal
4. Saved places and external results should keep the same row height and differ by badge or affordance only

## 14-21. Archive Row

| Item              | Spec      |
| ----------------- | --------- |
| Row min height    | `92`      |
| Radius            | `20`      |
| Padding           | `16`      |
| Leading thumbnail | `64 x 64` |
| Thumbnail radius  | `16`      |
| Inter-item gap    | `16`      |
| Metadata gap      | `8`       |

Rules:

1. Snapshot and archive rows should feel quieter and slightly more spacious than result rows
2. Even without a leading thumbnail, preserve the left rhythm
3. In read-only contexts, do not show chevrons or add affordances

## 14-22. Empty State Block

| Item                 | Spec     |
| -------------------- | -------- |
| Max width            | `280`    |
| Top / bottom padding | `64`     |
| Icon size            | `48`     |
| Title to body gap    | `8`      |
| Body to action gap   | `20`     |
| Text align           | `center` |

Rules:

1. Empty states should clarify the next action more than they explain the absence
2. Use `icon + title + body + action` instead of oversized illustrations
3. On full-screen empty states, the block should sit slightly above vertical center

## 14-23. Skeleton / Loading Placeholder

| Item                 | Spec          |
| -------------------- | ------------- |
| Line height          | `12`          |
| Large line height    | `16`          |
| Line radius          | `8`           |
| Card skeleton height | `104`         |
| Hero skeleton height | `320`         |
| Pulse duration       | `1400ms`      |
| Opacity range        | `0.55 ~ 0.92` |

Rules:

1. Prefer breathing opacity over shimmer
2. Skeletons should preserve the density and proportions of the final layout
3. Keep CTA position stable during loading to reduce layout jump

## 14-24. Bottom CTA Bar

| Item               | Spec             |
| ------------------ | ---------------- |
| Compact height     | `88`             |
| Prominent height   | `96`             |
| Horizontal padding | `20`             |
| Top padding        | `12`             |
| Bottom padding     | `16 + safe area` |
| Summary block gap  | `4`              |
| Button height      | `56`             |

Rules:

1. Use `88` for form save bars and `96` for prominent detail action bars
2. The left summary block may use at most two lines
3. Use `bg.elevated + top border.soft` by default; glass is forbidden here
4. Button width should remain within `44% ~ 52%` of the bar width

## 14-25. Photo Grid / Gallery

| Item              | Spec                |
| ----------------- | ------------------- |
| Grid columns      | `3`                 |
| Grid gap          | `8`                 |
| Tile radius       | `16`                |
| Tile aspect ratio | `1:1`               |
| Tray thumbnail    | `80 x 80`           |
| Tray gap          | `8`                 |
| Selected overlay  | `color.overlay.dim` |
| Count chip height | `28`                |

Rules:

1. Default gallery layout is a `3-column square grid`
2. On a `390` width viewport with `20` horizontal padding and `8` gap, tile width becomes `111`
3. Selection should be recognized by overlay and scale before the checkmark
4. If a hero image marker is needed, prefer a label pill over a crown or decorative icon

## 14-26. Tab Bar

| Item                  | Spec              |
| --------------------- | ----------------- |
| Bar content height    | `64`              |
| Horizontal padding    | `12`              |
| Top border            | `1px border.soft` |
| Icon size             | `24`              |
| Label style           | `type.micro`      |
| Item min width        | `68`              |
| Item vertical padding | `8`               |

Rules:

1. The tab bar should use a fixed `bg.elevated` surface by default
2. The active state should be expressed through icon and label contrast, not oversized pill fills
3. Default tab count is `3~4`
4. Map, List, and My tabs must share the same tab bar language even if the page structures differ

## 14-27. Action Sheet Row

| Item                | Spec          |
| ------------------- | ------------- |
| Default height      | `56`          |
| Comfortable height  | `64`          |
| Horizontal padding  | `16`          |
| Inter-item gap      | `12`          |
| Leading icon frame  | `32 x 32`     |
| Trailing affordance | `16`          |
| Text style          | `type.body.l` |

Rules:

1. Use the structure `icon -> label -> optional helper -> optional affordance`
2. Destructive items should either be separated or placed last
3. Do not mix row heights inside the same action sheet

## 14-28. Warning Block

| Item               | Spec          |
| ------------------ | ------------- |
| Radius             | `20`          |
| Padding            | `16`          |
| Icon size          | `20`          |
| Title to body gap  | `8`           |
| Body to action gap | `16`          |
| Text style         | `type.body.m` |

Rules:

1. For irreversible actions, prefer a warning block over a simple banner
2. Prefer `soft tint + strong title` over a large solid danger fill
3. Summary, impact scope, and the final confirmation intent should be resolved inside one block

## 14-29. Component Anatomy Contracts

### Search Bar Anatomy

1. `left icon -> text field -> clear or trailing action`
2. Left and right padding must match
3. Placeholder and input text must align on the same baseline

### Text Field Anatomy

1. `label(optional) -> field shell -> helper(optional)`
2. Inside the shell, use `prefix(optional) -> value -> suffix(optional)`
3. Preserve the next-block spacing even when helper text is absent

### List Card Anatomy

1. `thumbnail -> title block -> meta row -> trailing affordance(optional)`
2. The title block should preserve the order `title + address or description + status/meta`
3. Status pills must not read before the title

### Map Result Row Anatomy

1. `leading icon or thumbnail -> title/address block -> saved/add affordance`
2. Use the full row as the tap target
3. Section titles should be visually weaker than the rows below them

### Place Detail Hero Overlay Anatomy

1. `top-left back`
2. `top-right secondary actions`
3. `optional page indicator near lower-right`
4. Overlay actions must use glass or elevated floating variants

### Settings Row Anatomy

1. `leading icon -> label -> optional value -> chevron`
2. Row height must be at least `56`
3. Strong accent colors are not allowed inside the row body

### CTA Bar Anatomy

1. `left summary block -> right primary CTA`
2. The left block allows at most two lines and the button allows one line
3. The CTA bar must always remain the final visual priority on the page

### Warning Block Anatomy

1. `icon + title -> consequence copy -> action or confirm hint`
2. Warning copy should state the outcome first and the reason second
3. A single warning block may have only one visually strong CTA

---

## 15. Route Inventory and UX Blueprints

### 15-0. Route Inventory

| page_id                      | actual_route                     | archetype         | expression | current_fit    | revision_level |
| ---------------------------- | -------------------------------- | ----------------- | ---------- | -------------- | -------------- |
| `PG_LOGIN`                   | `/(auth)/login`                  | centered-auth     | `balanced` | `partial`      | `refine`       |
| `PG_WELCOME`                 | `/(auth)/welcome`                | centered-choice   | `balanced` | `partial`      | `reshape`      |
| `TB_MAP_HOME`                | `/(tabs)/map`                    | floating-map      | `high`     | `partial`      | `reshape`      |
| `TB_LIST_HOME`               | `/(tabs)/list`                   | list-feed         | `balanced` | `partial`      | `refine`       |
| `TB_MY_HOME`                 | `/(tabs)/my`                     | account-home      | `balanced` | `partial`      | `reshape`      |
| `PG_INVITE_CENTER`           | `/(main)/invite-center`          | stacked-cards     | `balanced` | `partial`      | `reshape`      |
| `PG_PLACE_DETAIL`            | `/(main)/place/[id]`             | hero-detail       | `high`     | `misaligned`   | `rebuild`      |
| `PG_VISIT_FORM`              | `/(main)/visit/form`             | task-form         | `quiet`    | `partial`      | `reshape`      |
| `PG_PLACE_ADD_SEARCH`        | `/(main)/place/add/search`       | search-results    | `quiet`    | `partial`      | `reshape`      |
| `PG_PLACE_ADD_PIN`           | `/(main)/place/add/pin`          | map-form          | `balanced` | `partial`      | `reshape`      |
| `PG_PLACE_ADD_PHOTO`         | `/(main)/place/add/photo`        | media-picker      | `balanced` | `partial`      | `refine`       |
| `PG_PLACE_CREATE_FROM_PHOTO` | `/(main)/place/add/photo/create` | form-stack        | `balanced` | `partial`      | `refine`       |
| `PG_RESTORE_DECISION`        | `/(main)/reconnect/restore`      | decision-page     | `balanced` | `missing-flow` | `rebuild`      |
| `PG_SNAPSHOT_DETAIL`         | `/snapshot/[id]`                 | archive-list      | `quiet`    | `partial`      | `refine`       |
| `PG_SETTINGS_PROFILE`        | `/(main)/settings/profile`       | settings-form     | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_NOTIFICATIONS`  | `/(main)/settings/notifications` | settings-list     | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_ANNIVERSARY`    | `/(main)/settings/anniversary`   | settings-form     | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_DISCONNECT`     | `/(main)/settings/disconnect`    | danger-decision   | `quiet`    | `partial`      | `reshape`      |

### 15-0-1. Review Conclusions

1. `TB_MAP_HOME`, `PG_PLACE_DETAIL`, and `PG_RESTORE_DECISION` are structurally far from the intended experience and require major rework.
2. `TB_LIST_HOME`, `PG_INVITE_CENTER`, `PG_VISIT_FORM`, and the `PG_SETTINGS_*` pages are better served by aligning them to shared layout and component contracts rather than fully redesigning them.
3. `PG_LOGIN`, `PG_WELCOME`, and `PG_SNAPSHOT_DETAIL` are directionally correct but still need cleaner hierarchy and more intentional expression.
4. `search focus` should be treated as an interaction pattern across pages, not as a standalone page.
5. All settings-related pages should be unified as `quiet utility pages`, favoring spacing, order, and footer action consistency over expressive styling.

### 15-0-2. Expression Levels

1. `high`: pages led by map, hero media, or emotionally strong content; layered surfaces and larger type are allowed
2. `balanced`: pages where content and action have equal importance; card and sheet language should dominate, but remain restrained
3. `quiet`: settings, forms, and support flows; stability and readability take priority over visual drama

### 15-0-3. Revision Levels

1. `rebuild`: information architecture must be redesigned
2. `reshape`: keep the current screen shell but rework block order and major patterns
3. `refine`: keep the current structure and tighten tokens, spacing, card anatomy, and CTA placement

### 15-0-4. Shared Page Rules

1. Every actual route must belong to exactly one archetype
2. Each page may have only one visually dominant primary CTA
3. Task pages use `footer CTA bar`, account/settings pages use `content-first + footer action`, and content pages use `hero or summary-first`
4. Glass is allowed only for map overlays, hero overlays, and search focus states
5. Search, filter, selection, and destructive actions must not invent a new visual language per page

## 15-1. Map Home

actual route: `/(tabs)/map`  
expression: `high`  
revision level: `reshape`

### 15-1-A. UX Goal

1. The map is background context; the real browsing experience is driven by the search row and the result sheet
2. The user must be able to move through `search`, `filter`, `select place`, and `add new place` without leaving the map context
3. The add flow should feel like part of the map experience, not an arbitrary detached modal

### 15-1-B. Required Blocks

1. top floating search row
2. map canvas with markers
3. floating secondary actions
4. result sheet
5. add action entry

### 15-1-C. Design / UX Rules

1. The top search row uses the `opaque glass variant`
2. Filter and location actions should share the same visual family as the search row
3. Saved places and external results should use the same result row language
4. Add actions should prefer an `action sheet` or `bottom sheet menu` over a generic modal
5. When a query exists, the result sheet should open immediately; when there is no query, the map context should dominate

### 15-1-D. Difference from Current Code

1. The current search row and filter button are solid surfaces, so the overlay character is weak
2. A location action is missing
3. The add flow is a detached modal instead of part of the map rhythm
4. The result sheet exists, but still reads as a utility sheet rather than a strong floating-map experience

## 15-2. List Home

actual route: `/(tabs)/list`  
expression: `balanced`  
revision level: `refine`

### 15-2-A. UX Goal

1. The list should feel like a feed of saved places, not a settings-style list
2. Search and filters are supporting tools; the list card rhythm is the real focus

### 15-2-B. Required Blocks

1. page header
2. search row
3. active filter chips
4. list cards
5. FAB

### 15-2-C. Design / UX Rules

1. Count text must sit below the title in visual priority
2. Active filter chips appear only when filters are active
3. List cards remain image-led content cards, not result rows
4. The FAB should share the same size, color, and shadow rules as the map tab FAB

### 15-2-D. Difference from Current Code

1. The structure is largely correct, but the place card is not yet fully locked to a shared anatomy contract
2. Hero image interpretation is still weak and metadata placement may drift slightly between cards

## 15-3. My Home

actual route: `/(tabs)/my`  
expression: `balanced`  
revision level: `reshape`

### 15-3-A. UX Goal

1. This page should feel like an account and relationship home, not a generic settings list
2. Dangerous actions must be separated from the menu card and read as a distinct danger block

### 15-3-B. Required Blocks

1. profile card
2. connection or summary card
3. grouped menu card
4. snapshot preview card
5. danger block

### 15-3-C. Design / UX Rules

1. Profile and summary cards are reading surfaces; the menu card is an interaction surface
2. Snapshot previews should look like archive preview rows, not ordinary menu rows
3. Logout and withdrawal must live inside a distinct danger surface, not simple text rows

### 15-3-D. Difference from Current Code

1. The overall structure exists, but the danger zone is visually too light
2. The snapshot entry still reads too much like a normal menu item

## 15-4. Invite / Connection Center

actual route: `/(main)/invite-center`  
expression: `balanced`  
revision level: `reshape`

### 15-4-A. UX Goal

1. Invite code generation and code entry must be clearly separated inside one relationship management page
2. Rejoining while already connected must always pass through a destructive warning

### 15-4-B. Required Blocks

1. connection status card
2. invite code card
3. join code card
4. destructive confirm modal

### 15-4-C. Design / UX Rules

1. Join code entry must use a real text field. `Alert.prompt`-based input is forbidden
2. Invite code blocks must use `solid elevated variant` only
3. The connection status card may feel positive, but should not use a heavy success-green fill
4. Copy, revoke, and join actions must have clear button hierarchy

### 15-4-D. Difference from Current Code

1. The structure exists, but the input UX is still temporary
2. The dashed code box does not fully match the premium card tone of the system

## 15-5. Place Detail

actual route: `/(main)/place/[id]`  
expression: `high`  
revision level: `rebuild`

### 15-5-A. UX Goal

1. This page should feel like a place content page, not a utility detail page
2. The user should read photos, state, visits, and shared notes as one continuous story
3. The note composer and the primary action must not compete for dominance

### 15-5-B. Required Blocks

1. hero media
2. floating hero actions
3. summary card
4. status and meta strip
5. visit section
6. photo section
7. thread section
8. delete request warning block
9. optional bottom action area

### 15-5-C. Design / UX Rules

1. Hero media height defaults to `360`
2. Back and secondary actions use glass floating buttons above the hero
3. Title, address, state, category, and key summary must be read first inside one summary card
4. If the thread composer is sticky at the bottom, do not add a separate fixed CTA bar
5. If adding a record is the primary action, use a fixed CTA bar and move the composer into the content section
6. Delete request UI should follow the `warning block` language before it falls back to a banner

### 15-5-D. Difference from Current Code

1. The current screen is a normal section stack under the hero, so it lacks the strength of a content page
2. There is no summary card and the information is scattered across the page body
3. The bottom note composer currently behaves like a sticky CTA and blurs priority

## 15-6. Visit Form

actual route: `/(main)/visit/form`  
expression: `quiet`  
revision level: `reshape`

### 15-6-A. UX Goal

1. The user should experience this page as a lightweight recording flow rather than a traditional form
2. Create and edit should share the same layout language, with delete visible only in edit mode

### 15-6-B. Required Blocks

1. header
2. place summary card
3. date block
4. photo block
5. footer save action
6. destructive confirm in edit mode

### 15-6-C. Design / UX Rules

1. Date and photo blocks should each become their own card section
2. The footer save action must stay fixed in a stable position
3. Edit mode must preserve the same block order as create mode

### 15-6-D. Difference from Current Code

1. The overall structure is close, but the date and photo blocks do not yet feel like clear card sections
2. The footer works, but is not yet aligned to the shared bottom CTA bar pattern

## 15-7. Place Search Add Page

actual route: `/(main)/place/add/search`  
expression: `quiet`  
revision level: `reshape`

### 15-7-A. UX Goal

1. This page must serve both as a `manual search page` and as a `map result handoff page`
2. If the user comes from a tapped external result on the map, the selection must remain visible and actionable immediately

### 15-7-B. Required Blocks

1. header
2. search bar
3. optional selected-result preview
4. result list
5. empty state

### 15-7-C. Design / UX Rules

1. Dedicated search pages must not use glass
2. Prefer keyboard search or live search over a separate `Search` button
3. Result rows must follow `Map Result Row Anatomy`
4. If a result is handed off from the map, show it first as a preview card at the top

### 15-7-D. Difference from Current Code

1. The current screen works only as a generic search page and does not preserve the selected handoff state from the map
2. The separate search button adds an unnecessary extra step

## 15-8. Add by Pin

actual route: `/(main)/place/add/pin`  
expression: `balanced`  
revision level: `reshape`

### 15-8-A. UX Goal

1. Map interaction and name entry must coexist clearly, with obvious hierarchy
2. The user should first place the location, then name it, then save it

### 15-8-B. Required Blocks

1. header
2. map region with draggable pin
3. input card
4. footer save action

### 15-8-C. Design / UX Rules

1. The map is the visual center of the page body
2. Hint text should remain secondary and attached under the map
3. Save should live in a footer action area, not directly under the input field

### 15-8-D. Difference from Current Code

1. Save is currently attached to the input area, which weakens the sense of final task completion
2. The visual hierarchy between map and input is still too flat

## 15-9. Add by Photo

actual route: `/(main)/place/add/photo`  
expression: `balanced`  
revision_level: `refine`

### 15-9-A. UX Goal

1. The user first selects photos, then decides whether to attach them to an existing place or create a new place
2. The footer CTA must stay in the same place even when the selection state changes

### 15-9-B. Required Blocks

1. photo tray
2. optional selected place preview
3. existing place selection area
4. footer primary CTA

### 15-9-C. Design / UX Rules

1. The photo tray is a supporting emotional element, but it should still be visibly present
2. Place selection rows should use the result row language, not the settings row language
3. Existing-place and new-place flows must be clearly distinguished through copy and CTA labels

## 15-10. Create New Place from Photo

actual route: `/(main)/place/add/photo/create`  
expression: `balanced`  
revision level: `refine`

### 15-10-A. UX Goal

1. This should feel like a short `form-stack`
2. The user must keep the selected photos visible while completing the name and location

### 15-10-B. Required Blocks

1. draft photo strip
2. place name input
3. map block
4. footer save action

### 15-10-C. Design / UX Rules

1. The photo strip stays first
2. The map is not passive preview; it is the final location decision block and must be visually substantial
3. Save remains fixed in the footer

## 15-11. Restore Decision

actual route: `/(main)/reconnect/restore`  
expression: `balanced`  
revision level: `rebuild`

### 15-11-A. UX Goal

1. This page must appear only right after reconnection between the same two people
2. The user must understand the difference between `Restore` and `Start New` at a glance

### 15-11-B. Required Blocks

1. header
2. snapshot summary card
3. consequence copy
4. restore button
5. new start button
6. irreversible warning copy

### 15-11-C. Design / UX Rules

1. Restore should be primary; start new should be secondary or danger-soft
2. This page should feel like a `decision page`, not a centered explainer
3. A pretty screen alone does not complete the UX if the actual flow is not wired

### 15-11-D. Difference from Current Code

1. There is no real restore behavior yet and the entry flow is not connected
2. The current screen reads more like a centered alert page than a true decision page

## 15-12. Snapshot Detail

actual route: `/snapshot/[id]`  
expression: `quiet`  
revision level: `refine`

### 15-12-A. UX Goal

1. Read-only status and archive mood must be obvious at first glance
2. The user should understand this as preserved history, not as an editable detail page

### 15-12-B. Required Blocks

1. read-only banner
2. summary block
3. archive rows or cards
4. empty state

### 15-12-C. Design / UX Rules

1. Reduce active accent usage and prefer muted surfaces
2. The layout should stay calm, but the banner and summary must still read first
3. Archive items must not use chevrons, plus buttons, or edit affordances

## 15-13. Login

actual route: `/(auth)/login`  
expression: `balanced`  
revision level: `refine`

### 15-13-A. UX Goal

1. The entry point should be understandable in one glance
2. Emotional presentation is allowed as long as it never interferes with the login action

### 15-13-B. Required Blocks

1. wordmark or symbol area
2. title
3. subtitle
4. single login CTA
5. footer text

### 15-13-C. Design / UX Rules

1. Keep centered alignment
2. Only one CTA should be visually dominant
3. Do not use glass

## 15-14. Welcome / Onboarding Choice

actual route: `/(auth)/welcome`  
expression: `balanced`  
revision level: `reshape`

### 15-14-A. UX Goal

1. The three starting paths must be clearly differentiated
2. If `Invite Partner` is the recommended path, its visual emphasis should show that

### 15-14-B. Required Blocks

1. hero area
2. title
3. option cards

### 15-14-C. Design / UX Rules

1. All option cards should share the same height group
2. The primary path should receive one stronger layer of emphasis through fill or icon contrast
3. The solo-later path should remain understandable but visually weakest

## 15-15. Profile Settings

actual route: `/(main)/settings/profile`  
expression: `quiet`  
revision level: `reshape`

### 15-15-A. UX Goal

1. This should feel like a calm utility form, not an expressive account hero page
2. Avatar editing and nickname editing should feel like parts of one task

### 15-15-B. Required Blocks

1. header
2. avatar block
3. input card
4. helper copy
5. footer save action

### 15-15-C. Design / UX Rules

1. The avatar block is a centered utility block, not a top hero
2. Save should prefer a footer action over an inline action
3. Permission denial or image selection failure should be expressible through helper or notice copy

## 15-16. Notification Settings

actual route: `/(main)/settings/notifications`  
expression: `quiet`  
revision level: `reshape`

### 15-16-A. UX Goal

1. A grouped toggle list is the core experience
2. The user must never confuse OS notification permission state with in-app toggle state

### 15-16-B. Required Blocks

1. header
2. optional permission notice
3. grouped toggle card
4. helper text

### 15-16-C. Design / UX Rules

1. Toggle rows should stay in the same height family
2. If a permission notice is needed, place it above the list as a warning or info block
3. Labels must read before the switches do

## 15-17. Anniversary Settings

actual route: `/(main)/settings/anniversary`  
expression: `quiet`  
revision level: `reshape`

### 15-17-A. UX Goal

1. This should be a calm settings page where preview and inputs are clearly separated
2. Because anniversary is a relationship feature, solo state may require a different guidance pattern

### 15-17-B. Required Blocks

1. preview card
2. date input
3. label input
4. footer save action
5. optional clear action

### 15-17-C. Design / UX Rules

1. The preview card may feel emotional, but must not become theatrical
2. Inputs and actions must follow the settings-form system
3. In solo or disconnected state, clearly choose one of: disabled form or helper notice

## 15-18. Disconnect

actual route: `/(main)/settings/disconnect`  
expression: `quiet`  
revision level: `reshape`

### 15-18-A. UX Goal

1. This should be a `danger-decision page`, not a centered warning poster
2. The user should read impact, snapshot result, and restore condition before pressing the final CTA

### 15-18-B. Required Blocks

1. header
2. warning block
3. impact summary
4. helper copy
5. footer destructive action
6. confirm modal

### 15-18-C. Design / UX Rules

1. Do not rely on a warning icon circle alone
2. The key explanation should be completed inside the warning block first
3. Disconnect CTA is better as a footer action than as an inline button under the content body

## 15-19. Search Focus Interaction Pattern

actual usage: `TB_MAP_HOME`, `PG_PLACE_ADD_SEARCH`

### 15-19-A. Definition

1. Search focus is not a standalone page. It is an interaction state that concentrates attention and interaction on search input
2. Above the map, use a `glass search row`. On dedicated search pages, use a `solid elevated search row`

### 15-19-B. Required Elements

1. focused search bar
2. cancel or clear action
3. result or recent area
4. keyboard-safe spacing

### 15-19-C. UX Rules

1. Glass is allowed only for map-based search focus states
2. On dedicated search pages, cancel and results should connect more directly
3. If a search result is handed off from another screen, the selected state must be preserved

---

## 16. State Expression Rules

### 16-1. Interactive States

| State    | Rule                                                    |
| -------- | ------------------------------------------------------- |
| Default  | Maintain ordered surfaces and clear hierarchy           |
| Pressed  | button scale `0.98`, card scale `0.995`, opacity `0.94` |
| Focused  | Use shadow and caret rather than heavy outlines         |
| Selected | Express with at least two of fill, contrast, or icon    |
| Disabled | opacity `0.45`, remove shadow                           |
| Loading  | Keep spinner and label together                         |
| Danger   | charcoal or danger tone with explicit copy              |

### 16-2. Empty State

1. Do not use oversized illustrations
2. Default icon size is `48`
3. Title uses `title.m`
4. Description uses `body.m`
5. Default vertical padding is `64`

### 16-3. Error State

1. Error copy must be short and direct
2. Input errors should be shown inline
3. Destructive errors should be escalated to a confirmation modal

---

## 17. Tone of Voice and Microcopy

1. Keep copy short and soft
2. Avoid overly formal phrasing
3. Button labels should be verb-led, such as `Save`, `Connect`, `Add`, `Restore`, `Delete`
4. Empty-state copy should guide action more than it explains absence
5. Warning copy must state outcomes clearly, without euphemism

---

## 18. Forbidden Implementation Patterns

1. Overusing almost-rectangular `8~12` radius surfaces
2. Cold border-heavy layouts
3. Shrinking all fonts to fit more information
4. Multiple CTAs with equal visual strength
5. Filling the whole screen with accent color
6. Flat white screens with no layering
7. Using different visual languages for search, filter, and date selection
8. Making the map screen feel like a navigation engineering tool

---

## 19. Claude Code Implementation Contract

Claude Code must follow these rules when implementing from this document.

1. Redefine `src/theme/tokens.ts` to match the token structure described here
2. Prioritize shared components for search bars, buttons, cards, sheets, and list items
3. Unify surfaces and typography so that map, list, detail, snapshot, and settings screens feel like one product
4. Do not inject ad hoc styles that break the system
5. Use brand accent color only for CTAs and core state signals
6. Emotional backgrounds or image layers are allowed only on photo, map, and record-related screens
7. Glassmorphism is allowed only for explicitly approved targets in this document
8. The default result must feel `quiet but unmistakably premium`

---

## 20. Token Implementation Example

```ts
export const tokens = {
  color: {
    bg: {
      canvas: "#F7F4F2",
      elevated: "#FCFAF8",
      soft: "#F1ECE9",
      strong: "#231F26",
    },
    overlay: {
      dim: "rgba(17,14,19,0.18)",
    },
    text: {
      primary: "#201B22",
      secondary: "#6E6772",
      tertiary: "#9D96A1",
      inverse: "#FFFFFF",
    },
    border: {
      soft: "rgba(32,27,34,0.08)",
      strong: "rgba(32,27,34,0.14)",
    },
    glass: {
      fill: "rgba(252,250,248,0.82)",
      fillStrong: "rgba(252,250,248,0.90)",
      stroke: "rgba(255,255,255,0.34)",
    },
    accent: {
      primary: "#E94B82",
      primaryPressed: "#D63D73",
      primarySoft: "#F8DCE7",
      mint: "#27AE60",
      amber: "#D9A441",
      info: "#4E8FD6",
    },
    gradient: {
      blushStart: "#F6D7D0",
      blushEnd: "#E7B8C8",
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
  },
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 28,
    sheet: 32,
    full: 999,
  },
  typography: {
    display: {
      l: { fontSize: 40, lineHeight: 48, fontWeight: "700" },
      m: { fontSize: 32, lineHeight: 40, fontWeight: "700" },
    },
    heading: {
      l: { fontSize: 28, lineHeight: 36, fontWeight: "700" },
      m: { fontSize: 24, lineHeight: 32, fontWeight: "700" },
    },
    title: {
      l: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
      m: { fontSize: 18, lineHeight: 26, fontWeight: "600" },
    },
    body: {
      l: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
      m: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
      s: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
    },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
    micro: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
    button: {
      l: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
      m: { fontSize: 15, lineHeight: 20, fontWeight: "600" },
    },
  },
  shadow: {
    sm: {
      shadowColor: "rgba(32,27,34,0.06)",
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
    },
    md: {
      shadowColor: "rgba(32,27,34,0.08)",
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 24,
    },
    lg: {
      shadowColor: "rgba(32,27,34,0.10)",
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 32,
    },
    xl: {
      shadowColor: "rgba(32,27,34,0.12)",
      shadowOffset: { width: 0, height: 18 },
      shadowRadius: 44,
    },
    glass: {
      shadowColor: "rgba(32,27,34,0.10)",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 28,
    },
  },
  motion: {
    fast: 120,
    normal: 180,
    emphasis: 260,
    sheet: 320,
    page: 280,
    breathe: 1400,
  },
  component: {
    header: {
      height: 56,
      horizontalPadding: 20,
      iconButton: 48,
    },
    searchBar: {
      height: 56,
      radius: 28,
      icon: 20,
      horizontalPadding: 20,
    },
    input: {
      height: 56,
      heightLarge: 64,
      radius: 20,
      horizontalPadding: 16,
      verticalPadding: 16,
    },
    textarea: {
      minHeight: 132,
      maxHeight: 196,
      composerMinHeight: 52,
      composerMaxHeight: 116,
      radius: 20,
    },
    chip: {
      height: 44,
      radius: 22,
    },
    segmentedControl: {
      height: 52,
      thumbHeight: 44,
      radius: 26,
    },
    settingsRow: {
      height: 56,
      heightComfortable: 64,
      iconFrame: 32,
    },
    toggleRow: {
      height: 56,
      heightComfortable: 64,
      switchTrackWidth: 52,
      switchTrackHeight: 32,
      switchThumb: 28,
    },
    button: {
      primaryHeight: 56,
      floatingIcon: 48,
      fab: 56,
    },
    card: {
      radius: 24,
      padding: 20,
      gap: 12,
    },
    resultRow: {
      compactHeight: 72,
      mediaHeight: 88,
      thumb: 56,
    },
    archiveRow: {
      minHeight: 92,
      thumb: 64,
    },
    avatar: {
      xs: 32,
      sm: 40,
      md: 56,
      lg: 80,
      xl: 96,
    },
    badge: {
      compactHeight: 24,
      defaultHeight: 28,
    },
    emptyState: {
      icon: 48,
      verticalPadding: 64,
      maxWidth: 280,
    },
    skeleton: {
      line: 12,
      lineLarge: 16,
      cardHeight: 104,
      heroHeight: 320,
    },
    gallery: {
      trayThumb: 80,
      gap: 8,
      radius: 16,
    },
    tabBar: {
      contentHeight: 64,
      icon: 24,
    },
    modal: {
      horizontalMargin: 20,
      maxWidth: 360,
      radius: 28,
      padding: 24,
    },
    sheet: {
      topRadius: 32,
      handleWidth: 36,
      handleHeight: 4,
    },
    actionSheetRow: {
      height: 56,
      heightComfortable: 64,
      iconFrame: 32,
    },
    ctaBar: {
      compactHeight: 88,
      prominentHeight: 96,
      buttonHeight: 56,
    },
    warningBlock: {
      radius: 20,
      padding: 16,
      icon: 20,
    },
  },
};
```

---

## 21. Design QA Checklist

1. Do all key surfaces follow the same radius philosophy?
2. Do search, filter, sheet, and card components share one visual language?
3. Does the screen still breathe because of sufficient whitespace?
4. Are titles large and clear enough to organize the first glance naturally?
5. Is accent color restrained?
6. Does the map remain contextual background while the sheet drives the experience?
7. Does the detail page feel like content rather than a tool?
8. Do snapshot and archive screens maintain a calm archival mood?
9. Does any screen accidentally read like a settings app or admin interface?
10. Is there always one CTA that is clearly strongest?

---

## 22. Final Summary

The core of this design system is `soft premium lifestyle UI`.  
The means are `large radii`, `bright warm surfaces`, `strong typographic hierarchy`, `restrained accent color`, `floating search and sheet structure`, and `soft motion`.  
Claude Code should be able to implement the product from this document alone, and the final result should feel more like an emotional shared-memory service than a functional utility app.

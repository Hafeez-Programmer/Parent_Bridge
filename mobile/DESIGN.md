---
name: "ParentBridge Mobile App (Parent Portal)"
description: "A clear, trustworthy, light-first design system for the ParentBridge Parent mobile application."
source: "Stitch Project — Mobile App Design System (projects/2130712013748422277)"
---

# ParentBridge Mobile Design System

## 1. Overview

ParentBridge connects parents with their children's daily school life—attendance, exam results, and school-wide or class-specific announcements. The mobile visual system uses the unified ParentBridge palette and typography: a crisp white card surface (`#FFFFFF`) over a soft cool-sky canvas (`#F8FAFF`), a vibrant **Cobalt Blue** (`#1D4ED8`) top app bar and active selection anchor, **Emerald Teal** (`#006A61`) primary action buttons and active bottom-nav tabs, and high-contrast semantic containers for instant status scanning.

---

## 2. Color Palette

### Semantic & Status Colors

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `success` | `#15803D` | Present status icon (`check_circle`), positive indicators |
| `on-success` | `#FFFFFF` | Text/icons on `success` |
| `success-container` | `#DCFCE7` | Present pill, Attendance KPI card, Present breakdown tile |
| `on-success-container` | `#14532D` | Text/icons inside `success-container` |
| `warning` | `#B45309` | Late / warning accents |
| `on-warning` | `#FFFFFF` | Text/icons on `warning` |
| `warning-container` | `#FEF3C7` | Late pill, Last Result KPI card, Late breakdown tile, help callout |
| `on-warning-container` | `#78350F` | Text/icons inside `warning-container` |
| `lavender-container` | `#F3E8FF` | Accent metric/status container |
| `on-lavender-container` | `#4C1D95` | Text/icons inside `lavender-container` |

### Light Theme Tokens (Default)

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `light-primary` | `#1D4ED8` | Sticky top app bar (`56px`), links, focus rings, numeric badge |
| `light-on-primary` | `#FFFFFF` | Top app bar title and action icons |
| `light-primary-container` | `#DBEAFE` | Child switcher card, monthly attendance hero card, total result card, secondary buttons |
| `light-on-primary-container` | `#1E3A8A` | Text/icons inside `light-primary-container` |
| `light-secondary` | `#006A61` | Primary CTA buttons (`Login`, `Link Child`, `Download`), active bottom-nav tab, unread dot |
| `light-on-secondary` | `#FFFFFF` | Text/icons on `light-secondary` |
| `light-secondary-container` | `#CCFBF1` | Secondary tinted container |
| `light-on-secondary-container` | `#115E59` | Text/icons inside `light-secondary-container` |
| `light-tertiary` | `#904D00` | Warm accent |
| `light-on-tertiary` | `#FFFFFF` | Text/icons on `light-tertiary` |
| `light-tertiary-container` | `#FFEDE3` | Warm container fill |
| `light-on-tertiary-container` | `#4D2600` | Text/icons inside `light-tertiary-container` |
| `light-error` | `#BA1A1A` | Absent / destructive focus ring |
| `light-on-error` | `#FFFFFF` | Text/icons on `light-error` |
| `light-error-container` | `#FFDAD6` | Absent pill, Absent breakdown tile, destructive button (`Logout`) |
| `light-on-error-container` | `#93000A` | Text/icons inside `light-error-container` |
| `light-background` | `#F8FAFF` | Root screen scaffold background |
| `light-on-background` | `#0B1C30` | Default body text on canvas |
| `light-surface` | `#FFFFFF` | Cards, form containers, bottom navigation bar, inputs |
| `light-surface-dim` | `#E2E8F0` | Dimmed surface |
| `light-surface-bright` | `#FFFFFF` | Bright surface |
| `light-surface-container-lowest` | `#FFFFFF` | Lowest container elevation |
| `light-surface-container-low` | `#EFF4FF` | Interactive card hover/press state |
| `light-surface-container` | `#E5EEFF` | Icon button hover/press state |
| `light-surface-container-high` | `#DCE9FF` | Primary-container interactive hover/press state |
| `light-surface-container-highest` | `#D3E4FE` | Highest tonal container |
| `light-on-surface` | `#0B1C30` | Primary text on cards and list items |
| `light-surface-variant` | `#E0E1F4` | Disabled button fill |
| `light-on-surface-variant` | `#434655` | Secondary text, subtitles, inactive bottom-nav items, field labels |
| `light-outline` | `#747686` | Input placeholders, hint text |
| `light-outline-variant` | `#CBD5E1` | `1px` hairline borders on cards, inputs, top/bottom bars |
| `light-inverse-surface` | `#213145` | Inverse surface (snackbars/tooltips) |
| `light-inverse-on-surface` | `#EAF1FF` | Text on inverse surface |
| `light-inverse-primary` | `#B7C4FF` | Primary accent on inverse surface |

### Dark Theme Tokens

| Token | Hex | Token | Hex |
| :--- | :--- | :--- | :--- |
| `dark-primary` | `#B7C4FF` | `dark-on-primary` | `#002682` |
| `dark-primary-container` | `#1D4ED8` | `dark-on-primary-container` | `#FFFFFF` |
| `dark-secondary` | `#6BD8CB` | `dark-on-secondary` | `#003732` |
| `dark-secondary-container` | `#006A61` | `dark-on-secondary-container` | `#FFFFFF` |
| `dark-tertiary` | `#FFB77D` | `dark-on-tertiary` | `#4D2600` |
| `dark-tertiary-container` | `#8D4B00` | `dark-on-tertiary-container` | `#FFEDE3` |
| `dark-error` | `#FFB4AB` | `dark-on-error` | `#690005` |
| `dark-error-container` | `#93000A` | `dark-on-error-container` | `#FFDAD6` |
| `dark-background` | `#031427` | `dark-on-background` | `#D3E4FE` |
| `dark-surface` | `#0B1C30` | `dark-on-surface` | `#D3E4FE` |
| `dark-surface-dim` | `#031427` | `dark-surface-bright` | `#2A3A4F` |
| `dark-surface-container-lowest` | `#000F21` | `dark-surface-container-low` | `#102034` |
| `dark-surface-container` | `#1B2B3F` | `dark-surface-container-high` | `#26364A` |
| `dark-surface-container-highest` | `#314257` | `dark-surface-variant` | `#434655` |
| `dark-on-surface-variant` | `#C4C5D7` | `dark-outline` | `#8E90A0` |
| `dark-outline-variant` | `#334155` | `dark-inverse-surface` | `#D3E4FE` |
| `dark-inverse-on-surface` | `#213145` | `dark-inverse-primary` | `#2151DA` |

---

## 3. Typography

### Font Families

- **Display & Headlines (`font-display`, `font-headline`):** `Red Hat Display` — Page headers, KPI percentages, hero numbers, and app bar titles.
- **UI & Body (`font-title`, `font-body`, `font-label`):** `Radio Canada Big` — List titles, body copy, form labels, buttons, and bottom-nav labels.
- **Monospace (`font-mono`):** `Spline Sans Mono` — 8-character school link codes (e.g., `K7P2M9QX`) and student roll numbers.
- **Icons:** `Material Symbols Outlined` (filled variant `FILL: 1` for active bottom-nav tabs and status checkmarks).

### Type Scale

| Token | Font Family | Size | Weight | Line Height | Letter Spacing | Mobile Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-md-mobile` | Red Hat Display | `28px` | `700` | `34px` | `-0.25px` | Monthly attendance hero % (`92%`) |
| `headline-lg` | Red Hat Display | `28px` | `700` | `34px` | `-0.25px` | KPI metric values (`92%`, `78%`), monogram (`PB`) |
| `headline-md` | Red Hat Display | `22px` | `700` | `28px` | `0px` | Auth screen title (`Parent Portal`), breakdown counts |
| `title-lg` | Red Hat Display | `18px` | `600` | `24px` | `0px` | Top app bar title (`Home`, `Attendance`), section headers |
| `title-md` | Radio Canada Big | `16px` | `600` | `22px` | `0px` | Card & list-row titles (`Ali Khan · Class 8-A`, subjects) |
| `body-lg` | Radio Canada Big | `15px` | `400` | `22px` | `0px` | Announcement detail body copy |
| `body-md` | Radio Canada Big | `14px` | `400` | `20px` | `0px` | Default body text, input text, subtitles |
| `label-lg` | Radio Canada Big | `14px` | `600` | `20px` | `0px` | Buttons, action links (`See all`), subject marks (`82/100`) |
| `label-md` | Radio Canada Big | `13px` | `500` | `18px` | `0.1px` | Form labels, filter dropdowns, KPI labels |
| `label-sm` | Radio Canada Big | `12px` | `500` | `16px` | `0.2px` | Status badges, bottom-nav labels, timestamps, hints |
| `mono-lg` | Spline Sans Mono | `28px` | `700` | `34px` | `1.5px` | Large link code display |
| `mono-md` | Spline Sans Mono | `14px` | `600` | `20px` | `0.5px` | Link code & roll number inputs |

**Numeric Formatting:** Use `tabular-nums` on all percentages, marks (`82/100`, `393/500`), roll numbers, and dates.

---

## 4. Layout Structure & Spacing (`390×884` Mobile Viewport)

### Spacing Scale (`4px` / `8px` base unit)

| Token | Value | Usage |
| :--- | :--- | :--- |
| `gutter-xs` | `4px` | Label-to-input gaps, icon-to-label in bottom nav |
| `gutter-sm` | `8px` | List item gaps, compact card gaps, 3-col breakdown gaps |
| `gutter-md` | `16px` | Standard screen body padding (`p-gutter-md`), card padding, 2-col KPI gaps |
| `gutter-lg` | `24px` | Auth/form screen padding (`px-gutter-lg`), form card padding |
| `gutter-xl` | `32px` | Auth vertical padding |

### Border Radius, Touch Targets & Elevation

- **Shapes:** `sm` (`4px`), `DEFAULT` (`8px` — buttons, inputs, selects), `md` (`12px` — cards, banners, form containers), `lg` (`16px`), `full` (`9999px` — status pills, unread dots, circular icon buttons, avatars).
- **Touch Targets:** Minimum `44px` height for buttons/selects/icon buttons (`w-11 h-11`), `48px` height for text inputs and full-width primary CTAs (`min-h-[48px]`), and `56px` height for bottom navigation tabs (`min-h-[56px]`).
- **Elevation:** Tonal surface contrast + `1px` `outline-variant` (`#CBD5E1`) borders + subtle `shadow-sm` on cards.
- **Motion:** `state-change`: `120ms ease-out`; `surface-enter`: `200ms cubic-bezier(0.2, 0, 0, 1)`.

### Mobile Screen Archetypes

#### A. Top App Bar (`56px` / `h-14`, Sticky)
- **Background:** `light-primary` (`#1D4ED8`) with `light-on-primary` (`#FFFFFF`) text/icons.
- **Variants:**
  - **Auth (`Login`):** Centered `ParentBridge` title.
  - **Tab Roots (`Home`, `Attendance`, `Results`, `Announcements`):** Left-aligned screen title + right-aligned `44×44` circular `settings` icon button.
  - **Detail / Sub-screens (`Link Child`, `Child Selector`, `Result Detail`, `Announcement Detail`, `Settings`):** Left `arrow_back` `44×44` icon button + screen title.

#### B. Bottom Navigation Bar (`56px`+ / Sticky Bottom)
- **Container:** `bg-light-surface border-t border-light-outline-variant grid grid-cols-4`.
- **4 Tabs:** `Home` (`home`), `Attend.` (`event_available`), `Results` (`assessment`), `News` (`campaign`).
- **States:** Active tab uses `light-secondary` (`#006A61`) with filled icon (`FILL: 1`); inactive tabs use `light-on-surface-variant` (`#434655`).

#### C. Screen-Specific Content Patterns
1. **Auth & Onboarding (`Login`, `Link Child`):** Centered monogram/intro header, `rounded-md` white form card (`p-gutter-lg`) with `48px` icon-prefixed or monospace inputs, full-width `light-secondary` CTA, and secondary links or `warning-container` help callout.
2. **Home Dashboard (`Home`):** Scrollable `p-gutter-md flex flex-col gap-gutter-md` stack:
   - Child switcher card (`light-primary-container`) with circular initial avatar and `swap_horiz` icon.
   - 2-column KPI grid (`grid-cols-2 gap-gutter-md`): Attendance (`success-container`) and Last result (`warning-container`).
   - Today's status banner (`light-surface` card with filled `check_circle` + status pill).
   - Latest announcements list (`card-interactive` rows with unread dot `w-2.5 h-2.5 bg-light-secondary` and `chevron_right`).
3. **Attendance (`Attendance`):** Monthly hero card (`light-primary-container`, `display-md-mobile` `92%`) → 3-column breakdown (`grid-cols-3 gap-gutter-sm`: Present `success-container`, Absent `light-error-container`, Late `warning-container`) → vertical list of recent days with status pills.
4. **Results (`Results`):** 2-column filter row (`Exam term`, `Subject filter`) → vertical list of subject mark cards (`Subject` + `tabular-nums` `82/100`) → Total Summary interactive card (`light-primary-container`).

---

## 5. Screen Inventory (`390×884` Mobile)

1. `1. Login`
2. `2. Home`
3. `3. Attendance`
4. `4. Results`
5. `5. Announcements`
6. `6. Link Child`
7. `7. Child Selector`
8. `8. Result Detail`
9. `9. Announcement Detail`
10. `10. Settings`

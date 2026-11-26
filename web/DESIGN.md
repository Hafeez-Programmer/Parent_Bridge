---
name: "ParentBridge Web Dashboard"
description: "A clear, trustworthy, light-first design system for the ParentBridge Admin and Teacher web dashboard."
source: "Stitch Project — Complete Web UI Suite (projects/6391730012776563516)"
---

# ParentBridge Design System

## 1. Overview

ParentBridge connects parents, teachers, and school administrators through reliable attendance tracking, exam results, and school-wide announcements. The visual system delivers a warm, modern, high-clarity EdTech SaaS experience: a crisp white workspace (`#FFFFFF`) over a soft cool-sky canvas (`#F8FAFF`), a vibrant cobalt-blue brand anchor (`#1D4ED8`), emerald-teal action triggers (`#006A61`), and subtle icon-paired metric cards.

---

## 2. Color Palette

The palette pairs **Cobalt Blue** (`primary`) for brand identity, active navigation states, and primary focus with **Emerald Teal** (`secondary`) for primary creation and save actions (`+ Add student`, `Save attendance`, `Publish`). Surfaces use bright white (`surface`) layered over a soft sky-tinted canvas (`background`) and a cool-blue navigation rail (`surface-container-low`).

### Semantic & Status Colors

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `success` | `#15803D` | Present / active / published status accents & icons |
| `on-success` | `#FFFFFF` | Text/icons on `success` |
| `success-container` | `#DCFCE7` | Success badges, metric icon tiles, link-code action card |
| `on-success-container` | `#14532D` | Text/icons inside `success-container` |
| `warning` | `#B45309` | Late / draft / pending warning accents |
| `on-warning` | `#FFFFFF` | Text/icons on `warning` |
| `warning-container` | `#FEF3C7` | Warning badges & pending metric icon tiles |
| `on-warning-container` | `#78350F` | Text/icons inside `warning-container` |
| `lavender-container` | `#F3E8FF` | Accent metric icon tiles (e.g., attendance %, exams to publish) |
| `on-lavender-container` | `#4C1D95` | Text/icons inside `lavender-container` |

### Light Theme Tokens (Default)

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `light-primary` | `#1D4ED8` | Brand anchor, active sidebar item, primary links, focus rings |
| `light-on-primary` | `#FFFFFF` | Text/icons on `light-primary` |
| `light-primary-container` | `#DBEAFE` | Portal badges, secondary action buttons, metric icon tiles |
| `light-on-primary-container` | `#1E3A8A` | Text/icons on `light-primary-container` |
| `light-secondary` | `#006A61` | Primary CTA buttons (`Save attendance`, `Add student`), active toggles |
| `light-on-secondary` | `#FFFFFF` | Text/icons on `light-secondary` |
| `light-secondary-container` | `#CCFBF1` | Teacher portal badge, secondary containers |
| `light-on-secondary-container` | `#115E59` | Text/icons on `light-secondary-container` |
| `light-tertiary` | `#904D00` | Warm accent icons (e.g., announcements) |
| `light-on-tertiary` | `#FFFFFF` | Text/icons on `light-tertiary` |
| `light-tertiary-container` | `#FFEDE3` | Warm accent container fill |
| `light-on-tertiary-container` | `#4D2600` | Text/icons on `light-tertiary-container` |
| `light-error` | `#BA1A1A` | Absent / destructive / validation error |
| `light-on-error` | `#FFFFFF` | Text/icons on `light-error` |
| `light-error-container` | `#FFDAD6` | Error/inactive/not-marked badge fill |
| `light-on-error-container` | `#93000A` | Text/icons inside `light-error-container` |
| `light-background` | `#F8FAFF` | Root page canvas |
| `light-on-background` | `#0B1C30` | Default body text on canvas |
| `light-surface` | `#FFFFFF` | Cards, top header bar, tables, form containers |
| `light-surface-dim` | `#E2E8F0` | Dimmed surface |
| `light-surface-bright` | `#FFFFFF` | Bright surface |
| `light-surface-container-lowest` | `#FFFFFF` | Lowest container elevation |
| `light-surface-container-low` | `#EFF4FF` | Left navigation sidebar, table headers, row hover state |
| `light-surface-container` | `#E5EEFF` | Sidebar item hover, filled metric cards |
| `light-surface-container-high` | `#DCE9FF` | Secondary button hover |
| `light-surface-container-highest` | `#D3E4FE` | Highest tonal container |
| `light-on-surface` | `#0B1C30` | Primary text on cards and tables |
| `light-surface-variant` | `#E0E1F4` | Disabled button fill |
| `light-on-surface-variant` | `#434655` | Secondary text, form labels, nav links, table headers |
| `light-outline` | `#747686` | Input placeholders, muted labels |
| `light-outline-variant` | `#CBD5E1` | `1px` hairline borders, table dividers, header/sidebar borders |
| `light-inverse-surface` | `#213145` | Inverse surface (tooltips/banners) |
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

- **Display & Headlines (`font-display`, `font-headline`):** `"Red Hat Display", sans-serif` — Geometric warmth and authority for page titles, KPI figures, and section headings.
- **UI & Body (`font-title`, `font-body`, `font-label`):** `"Radio Canada Big", sans-serif` — High-legibility sans-serif for controls, table cells, navigation items, and form labels.
- **Monospace (`font-mono`):** `"Spline Sans Mono", monospace` — Used for parent link codes, roll numbers, and tabular numeric identifiers.
- **Icons:** `Material Symbols Outlined` (`wght 100..700, FILL 0..1`).

```html
<link href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500;600;700&family=Red+Hat+Display:wght@600;700&family=Spline+Sans+Mono:wght@600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
```

### Type Scale

| Token | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-md` | Red Hat Display | `36px` | `700` | `42px` | `-0.5px` | Auth hero headline (desktop) |
| `display-md-mobile` | Red Hat Display | `28px` | `700` | `34px` | `-0.25px` | Display headline (mobile) |
| `headline-lg` | Red Hat Display | `28px` | `700` | `34px` | `-0.25px` | Page titles (`<h1>`), KPI metric values |
| `headline-md` | Red Hat Display | `22px` | `700` | `28px` | `0px` | Brand wordmark on login, modal/panel titles |
| `title-lg` | Red Hat Display | `18px` | `600` | `24px` | `0px` | Section headings (`<h2>`), top-bar brand title |
| `title-md` | Radio Canada Big | `16px` | `600` | `22px` | `0px` | Card titles, sub-headings |
| `body-lg` | Radio Canada Big | `15px` | `400` | `22px` | `0px` | Hero supporting copy |
| `body-md` | Radio Canada Big | `14px` | `400` | `20px` | `0px` | Default body text, table cells, inputs, inactive nav items |
| `label-lg` | Radio Canada Big | `14px` | `600` | `20px` | `0px` | Primary/secondary buttons, active nav items, action links |
| `label-md` | Radio Canada Big | `13px` | `500` | `18px` | `0.1px` | Form field labels, table column headers, KPI labels |
| `label-sm` | Radio Canada Big | `12px` | `500` | `16px` | `0.2px` | Status badges, portal pills, timestamps |
| `mono-lg` | Spline Sans Mono | `28px` | `700` | `34px` | `1.5px` | Generated parent link codes (e.g., `K7P2M9QX`) |
| `mono-md` | Spline Sans Mono | `14px` | `600` | `20px` | `0.5px` | Student roll numbers in tables and inputs |

**Numeric Formatting:** Apply `tabular-nums` (`font-variant-numeric: tabular-nums`) on all attendance percentages, marks, roll numbers, timestamps, and summary counts.

---

## 4. Layout Structure & Spacing

### Spacing Scale (`4px` / `8px` base unit)

| Token | Value | Usage |
| :--- | :--- | :--- |
| `gutter-xs` | `4px` | Label-to-input gaps, tight nav item stacks |
| `gutter-sm` | `8px` | Icon-to-text gaps, compact card internals |
| `gutter-md` | `16px` | Grid gaps, form field spacing, card padding (compact) |
| `gutter-lg` | `24px` | Main content padding (mobile/tablet), card padding, section gaps |
| `gutter-xl` | `32px` | Main content padding (`lg:`), major section vertical gaps |
| `section` | `32px` | Vertical rhythm between page sections |
| `page-margin` | `24px` | Outer page gutter |

### Border Radius & Elevation

- **Shapes:** `sm` (`4px`), `DEFAULT` (`8px` — buttons, inputs, nav items), `md` (`12px` — cards, tables, form panels), `lg` (`16px`), `full` (`9999px` — status pills, avatars, toggles).
- **Elevation:** Relies on **tonal surface contrast** and **`1px` hairline borders** (`outline-variant` `#CBD5E1`) with subtle `shadow-sm` on primary cards and tables.
- **Motion:**
  - `state-change`: `120ms ease-out` (button hovers, nav transitions, toggles).
  - `surface-enter`: `200ms cubic-bezier(0.2, 0, 0, 1)`.

### Page Layout Archetypes

#### A. Split Auth Layout (`Web Login`)
- **Structure:** Full-viewport 12-column grid (`grid-cols-1 lg:grid-cols-12 min-h-screen`).
- **Left Brand Panel (`lg:col-span-5`):** Hidden below `lg`, `bg-light-primary` (`#1D4ED8`), `p-gutter-xl`, vertical `justify-between` with brand logo, `display-md` value proposition, feature checklist with `check_circle` icons, and footer caption.
- **Right Auth Panel (`lg:col-span-7`):** Centered `max-w-md` white card (`bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl shadow-sm`) with mobile logo fallback, icon-prefixed email/password inputs, and full-width `light-secondary` submit button.

#### B. Persistent Dashboard App Shell (`Admin` & `Teacher` Portals)
- **Root:** `bg-light-background text-light-on-background min-h-screen flex flex-col`.
- **Top Header Bar:** Sticky (`sticky top-0 z-20`), `h-16` (`64px`), `bg-light-surface border-b border-light-outline-variant px-gutter-lg`.
  - **Left:** `36px` rounded `light-primary` school icon badge + `ParentBridge` title + role pill (`Admin Portal` in `primary-container`, or `Teacher Portal` in `secondary-container`).
  - **Right:** User avatar (`32px` `rounded-full` initials) + user label + outlined `Logout` link.
- **Body Wrapper (`flex flex-1 min-h-screen`):**
  - **Left Navigation Sidebar:** Fixed `w-60` (`240px`) on `md+` (`hidden md:block`), `bg-light-surface-container-low border-r border-light-outline-variant p-gutter-md`. Active nav item uses `bg-light-primary text-light-on-primary shadow-sm rounded`; inactive items use `text-light-on-surface-variant hover:bg-light-surface-container`.
  - **Main Content Area:** Fluid `flex-1 p-gutter-lg lg:p-gutter-xl flex flex-col gap-gutter-lg` (or `gap-gutter-xl`).

#### C. Common Main-Content Patterns
1. **Page Header:** `headline-lg` title (`<h1>`) + `body-md` subtitle in `light-on-surface-variant`, optionally paired with a right-aligned primary CTA button.
2. **KPI Metric Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (Admin) or `sm:grid-cols-3` (Teacher) with `gap-gutter-md`. Each card pairs a `label-md` title + `headline-lg tabular-nums` value on the left with a `40px` (`w-10 h-10`) tinted icon tile on the right.
3. **Form + Contextual Side Card (`Admin - Add Student`):** `grid-cols-1 lg:grid-cols-3 gap-gutter-lg` — `lg:col-span-2` white form card + `1`-col `card-action` (`bg-success-container border-success`) for generated parent link codes.
4. **Filter Bar + Data Table + Action Footer (`Teacher - Mark Attendance`):** Horizontal `flex-wrap` filter controls (class select, date input, secondary bulk action) above a full-width `rounded-md border border-light-outline-variant bg-light-surface` table, followed by a right-aligned `light-secondary` save button.

---

## 5. Screen Inventory (`1280×1088` Desktop, `1280×1024` Login)

| Portal | Screens |
| :--- | :--- |
| **Auth** | `Web Login` |
| **Admin** | `Overview`, `Users`, `Add / Edit User`, `Classes & Subjects`, `Students`, `Add Student`, `Announcements`, `Reports` |
| **Teacher** | `Dashboard`, `Mark Attendance`, `Attendance History`, `Exams & Results`, `Enter Results`, `Announcements`, `Reports` |

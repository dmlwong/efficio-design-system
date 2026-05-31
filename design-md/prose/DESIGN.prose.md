# Orbit Design System

> ⚠️ The YAML front matter at the top of `DESIGN.md` is **generated** by
> `scripts/build-design-md.ts`. Do not edit it by hand — edit the source
> tokens or this prose partial instead. Re-run with `npm run build:design-md`.

## Overview

Orbit is the design system behind Efficio's procurement intelligence platform.
Its visual language balances **enterprise data density** with **AI-native
moments of focus**. The product surfaces large volumes of supplier, contract,
and spend data — so the system is built to make the right information legible
at the right moment, without overwhelming the user.

The personality is **considered, precise, and quietly confident**. It is not
playful. It is not minimalist for its own sake. It earns trust by being exact:
every piece of data has a clear semantic home, every interactive element has a
deliberate state, and every AI-generated surface is visibly distinct from
human-authored content.

Target users are procurement leads, category managers, and sourcing analysts
working through dense workflows for sustained periods. The UI must support
extended focus, scan-heavy reading patterns, and comfortable density without
feeling cramped.

## Colors

The Orbit palette is built around a single decisive primary, a restrained
neutral ramp tuned for long screen sessions, and a clearly delineated AI
accent for any surface where Orbit AI has authored or recommended content.

- **Primary** — Orbit's core action color. Used for primary CTAs, active
  navigation, focus rings, and the single most important action per view.
  Reserved — never decorative.
- **Secondary** — Supports primary for less-critical interactive elements and
  structural emphasis.
- **Tertiary / AI Accent** — Marks AI-generated content, recommendations, and
  ClauseIQ surfaces. Visually distinct from primary so users can always tell
  at a glance whether a surface is human- or AI-authored.
- **Neutral ramp** — Tuned for B2B data interfaces. Borders sit at the lower
  end of the ramp, body text at the upper end, muted metadata in the middle.
- **Status colors** (success, warning, error, info) — Used only for state
  communication, never for decoration. Error always pairs with an icon and
  accessible text.

> Contrast: All text/background pairings must meet WCAG AA (4.5:1 for body,
> 3:1 for large text and non-text UI). The build script runs the linter
> automatically; CI fails if contrast regresses.

## Typography

Orbit uses a single sans-serif for narrative UI and a monospaced face for
data, identifiers, and clause references.

- **Display & Headlines** — Reserved for empty states, page-level titles, and
  major modal headers. Used sparingly — most Orbit screens lead with data,
  not titles.
- **Body** — The workhorse for descriptions, definitions, prose, and
  AI-generated explanations. `body-md` is the default for application UI;
  `body-lg` is reserved for marketing-adjacent or editorial surfaces.
- **Labels** — Used for buttons, form fields, table column headers, and
  metadata. Slightly heavier than body to anchor structural elements.
- **Mono** — Used for supplier codes, contract IDs, clause numbers, telemetry
  timestamps, and any identifier the user might copy-paste. Mono is a
  semantic signal, not a stylistic flourish.

> Limit any single screen to two type families and no more than three weights
> of each. Density comes from layout, not from typographic variety.

## Layout

Orbit uses a **12-column fixed-grid layout** at desktop and a **fluid stacked
layout** at smaller breakpoints. The system is desktop-first: most use cases
are sustained sessions on large monitors with multiple data panels open at
once.

Spacing follows the scale defined in the front matter. Components are grouped
using containment principles — related items live in cards with consistent
internal padding, and unrelated items are separated by full grid gutters
rather than ambiguous whitespace.

## Elevation & Depth

Orbit is a **mostly flat** system. Hierarchy is conveyed through **tonal
layering** (surface, surface-subtle, surface-sunken) and **borders** rather
than shadows. Shadows are reserved for genuinely floating elements:
dropdowns, popovers, tooltips, modals, and toast notifications.

Three elevation levels:

- **Level 0 (flat)** — Inline content, table rows, list items. No shadow.
- **Level 1 (raised)** — Cards, panels. Subtle border or 1-step tonal lift,
  no shadow.
- **Level 2 (overlay)** — Floating UI. Uses shadow + border together to
  detach cleanly from any background.

AI surfaces are not elevated by shadow — they are differentiated by accent
color and subtle background tint, so AI presence reads as semantic, not
spatial.

## Shapes

Orbit's shape language is **softly engineered**. Corners are rounded enough
to feel modern and approachable but never so much as to feel consumer or
playful.

- **Inputs, buttons, chips** — `rounded.md`, the default for interactive
  elements
- **Cards, panels, modals** — `rounded.lg`, slightly softer for containment
- **Pills, avatars, status dots** — `rounded.full`
- **Data tables and tightly nested elements** — `rounded.sm` or `rounded.none`
  — sharpness reads as precision in dense data contexts

Mix sharp and rounded only when the contrast is semantic (e.g., a rounded
action button inside a sharp-edged data table).

## Components

Component tokens are defined in the YAML front matter. The following are the
canonical primitives. Compound components (DataTable, FilterBar,
SupplierCard, ClauseIQ panel, etc.) compose these primitives and live in
Orbit's component library — they should not redefine token values.

- **Buttons** — Primary (one per view), Secondary (default action), Tertiary
  (low-emphasis text actions). Icon-only variants follow the same height
  tokens as their text-bearing counterparts.
- **Inputs** — Text, textarea, select, search. All share height, padding, and
  rounded tokens. Error and focus states are token-driven.
- **Cards** — The default container for grouping related content. Always
  uses `surface-raised` and `rounded.lg`.
- **Chips** — Selection, filter, and status variants. Always `rounded.full`.
- **Tables** — Dense, scannable. Row height tuned for procurement data
  density. Zebra striping uses `surface-subtle` rather than a separate token.
- **AI surfaces** — Any UI element generated, recommended, or authored by
  Orbit AI uses the AI accent tokens so the AI provenance is always visible.

## Do's and Don'ts

- Do use the primary color for the single most important action per view —
  never two primary buttons in the same region.
- Do mark every AI-authored surface with the AI accent token. Users must
  always be able to tell what came from a human and what came from a model.
- Do maintain WCAG AA contrast (4.5:1 body, 3:1 large text and UI) — the
  build script runs the linter automatically.
- Do prefer tonal layering and borders over shadows for hierarchy.
- Do use mono type for any identifier the user might copy-paste (supplier ID,
  contract number, clause reference).
- Don't introduce new color values inside components — reference tokens via
  `{colors.token}` only.
- Don't use status colors decoratively. Error red is reserved for actual
  errors.
- Don't mix more than two font weights of the same family on a single screen.
- Don't use elevation (shadow) to communicate AI presence — that's the
  accent's job.
- Don't redefine token values inside compound components — extend, compose,
  or escalate to a system-level token.

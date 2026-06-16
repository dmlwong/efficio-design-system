---
type: component-contract
status: in-review
owner: design-system
surfaces: [shared]
source: code
last_reviewed: 2026-06-15
maturity_score: 80
tags: [orbit, design-brain, component-contract]
---

# Component Contract: `badge-status`

## Purpose
Use badges for short inline status, count, or classification labels. Orbit's source
component is `Badge`; it is presentational and non-interactive.

## Source Links
- Component source:
  `/Users/derekwong/efficio-orbit/packages/orbit/src/indicators/Badge.tsx`
- Styles:
  `/Users/derekwong/efficio-orbit/packages/orbit/src/indicators/Badge.module.css`
- Tests:
  `/Users/derekwong/efficio-orbit/packages/orbit/src/indicators/Badge.test.tsx`
- Page-header usage:
  `/Users/derekwong/efficio-orbit/packages/orbit/src/navigation/PageHeader.tsx`

## Anatomy
Inline `span`, text label, background token, foreground token, optional accessible
label. The current badge has no icon slot and no count-specific variant; counts are
rendered by passing the count as `label`.

## Public API

| Prop | Type | Default | Required | Source |
| ---- | ---- | ------- | -------- | ------ |
| `label` | `string` | none | yes | code |
| `status` | `'Green' \| 'Red' \| 'Gray' \| 'Information' \| 'Warning' \| 'Success' \| 'Error' \| 'No Status'` | `'Green'` | no | code |
| `ariaLabel` | `string` | none | no | code |

## Variants
- `Green`
- `Red`
- `Gray`
- `Information`
- `Warning`
- `Success`
- `Error`
- `No Status`

The test suite explicitly covers `Information`, `Warning`, and `No Status`.

## States
Badge has no hover, focus, disabled, loading, or selected state because it is not
interactive. If a status action is needed, wrap the behavior in an appropriate
interactive component and keep the badge itself presentational.

## Density
Badge density is token-driven: `--orbit-space-xxs` vertical padding,
`--orbit-space-s` horizontal padding, `--orbit-text-xs`, and line-height `1`.
Do not shrink below the current text size in dense tables.

## Themes
Works in `efficio` and `orbit` through token values only. Status backgrounds and
foregrounds are CSS custom properties; do not replace them with literal colours.

## RBAC / Permissions
Do not expose restricted workflow state through a badge. If a user cannot see a
status, omit the badge or use approved neutral copy.

## Tokens Used
- `--orbit-badge-radius`
- `--orbit-space-xxs`
- `--orbit-space-s`
- `--orbit-text-xs`
- `--orbit-font-weight-regular`
- `--orbit-font-family-sans`
- `--orbit-color-bright-green`
- `--orbit-color-bright-orange`
- `--orbit-color-mid-gray`
- `--orbit-color-status-high-bg-success`
- `--orbit-color-status-high-bg-information`
- `--orbit-color-status-high-bg-warning`
- `--orbit-color-status-high-bg-error`
- `--orbit-color-status-high-bg-no-status`
- `--orbit-color-white`
- `--orbit-color-text-primary`

## Accessibility
Badge text must carry the meaning; never rely on colour alone. Use `ariaLabel` only
when the visible label is abbreviated or numeric and needs more context, such as
`ariaLabel="3 overdue items"`.

Green, red, gray, and success filled badges use `--orbit-color-text-primary` rather
than inverse white text where the rendered fills do not meet AA contrast with white.

## Motion
No motion is present in source and none should be added for ordinary badges.

## Content / Copy
Use stable product terms and short labels. Current implementation supports generic
status names, but product-specific workflow terms still need owner approval before
being treated as canonical.

## Do / Don't
- Do pass semantic status variants instead of hand-styling.
- Do keep labels short enough for table cells and tab headers.
- Do use `ariaLabel` for ambiguous numeric badges.
- Don't invent product status names without a source.
- Don't make badges clickable; use a button/link around the relevant action instead.

## Golden Example
`design-brain/examples/data-table-dense.md`

## Gap Report
- Product-specific status taxonomy is not fully canonical yet.
- No icon badge or count-specific component exists in source.

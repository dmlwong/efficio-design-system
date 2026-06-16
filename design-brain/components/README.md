---
type: component-index
status: in-review
owner: design-system
surfaces: [shared]
source: code
last_reviewed: 2026-06-14
maturity_score: 72
tags: [orbit, design-brain, components]
---

# components/ — Component Contracts

One Markdown file per system component: `components/<component-name>.md`, written from
`_TEMPLATE.md`. The contract is the single definition of "correct" for that component.

## How to use
- Building/refactoring a component → read its contract first (and the
  `component-contract` skill).
- No contract yet → write one from `_TEMPLATE.md` before coding.
- Changing a component's public API → update the contract first.

## Index
| Component | Surface(s) | Status |
| --------- | ---------- | ------ |
| `data-table` | shared | in-review — source-backed `Table` |
| `button` | shared | in-review — source-backed `Button` / `IconButton` |
| `input` | shared | in-review — source-backed `Input` |
| `select-combobox` | shared | in-review — source-backed `Dropdown` / `MultiSelectDropdown` |
| `dialog` | shared | in-review — source-backed `Overlay` |
| `drawer` | shared | draft — reusable source missing |
| `toast-notification` | shared | in-review — source-backed `Toast` |
| `tabs` | shared | in-review — source-backed `TabButton` / `PageHeader` |
| `badge-status` | shared | in-review — source-backed `Badge` |
| `card-panel` | shared | in-review — source-backed `Card` |

The first top-10 pass is now connected to `/Users/derekwong/efficio-orbit`. The main
remaining component gap is a reusable drawer; prototype drawer-like panels exist, but no
canonical `Drawer` component was found in `packages/orbit/src`.

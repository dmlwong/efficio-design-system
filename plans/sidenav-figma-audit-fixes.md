# SideNav — Figma audit fix plan

> **For the implementing agent (Codex / Claude / etc.):** This plan is fully self-contained. Read top to bottom, then apply changes in the order listed. Every diff is given as exact `old_string` → `new_string` pairs so you can apply them mechanically. Run the verification commands at the end before declaring done.

## 1. Source of truth

- **Figma file:** `XTJzVcF3yk0nBVFsBZaHoL` (`Sprint-75: ClauseIQ`)
- **Node ID:** `19252:85778` (frame `Orbit - Side Nav`, 232 × 944)
- **Figma URL:** https://www.figma.com/design/XTJzVcF3yk0nBVFsBZaHoL/Sprint-75--ClauseIQ?node-id=19252-85778
- **Theme assumption:** the Figma design's resolved variables correspond to **Orbit theme** (`[data-theme="orbit"]`). All color comparisons are made against [`packages/orbit/styles/tokens/themes/orbit.css`](../packages/orbit/styles/tokens/themes/orbit.css). The default (legacy) theme is intentionally left untouched in this plan.
- **Resolved Figma variable values for the design (for verification):**

  | Figma variable | Resolved value | Used for |
  |---|---|---|
  | `Sidebar/color-default` | `#041628` | sidenav background |
  | `Swatches/Purple Gray/900` | `#a3b1c4` | muted text (client name, "My Work" label, history subtitles, inactive sub-items) |
  | `Swatches/Purple Gray/1200` | `#475569` | scrollbar thumb |
  | `Swatches/Purple Gray/1300` | `#334155` | dividers |
  | `Swatches/Purple Gray/1400` | `#1e293b` | active sub-item background |
  | `Swatches/Science Blue/900` | `#5b8efd` | logo gradient (top) |
  | `Swatches/Science Blue/1100` | `#1252de` | logo gradient (bottom) |
  | `Primary/Background/color-default` | `#615fff` | profile avatar background |

## 2. Files touched

- `packages/orbit/styles/tokens/themes/orbit.css` — 1 token correction
- `packages/orbit/src/navigation/SideNav.module.css` — the bulk of the work (layout/spacing/sizing/radii)
- `packages/orbit/src/navigation/SideNav.test.tsx` — **no changes needed** (behavioral, not pixel-based)

## 3. Acceptance criteria

After all fixes are applied, the following must hold:

```bash
npm run typecheck:orbit       # passes
npm run test:components       # passes (existing tests are behavioral, no pixel assertions)
npm run build:orbit           # passes
```

Visual verification: render the SideNav with `data-theme="orbit"` applied to a parent and compare against Figma node `19252:85778`. The fixes below close every diff flagged in the audit, with the exception of items called out in **§ 6 Out of scope**.

## 4. Apply order

Apply in this exact order. Some later steps depend on earlier ones (e.g. introducing CSS custom properties before the rules that consume them).

1. Token fix (orbit theme divider)
2. SideNav.module.css — container, header, navList, sectionList, sectionRow
3. SideNav.module.css — `.row`/`.navRow`/`.subItem` radii and padding
4. SideNav.module.css — `.badge`
5. SideNav.module.css — `.workHeading` muted-by-default
6. SideNav.module.css — `.workItem`, `.profile`, `.profileContent`, `.avatar`
7. SideNav.module.css — `.appName` font-weight
8. Run verification

---

## 5. The fixes

Each fix lists: **rationale → file → exact old/new strings**. The `old_string` is verbatim from the current file; preserve indentation exactly.

### Fix 1 — Divider color in Orbit theme

**Rationale:** Figma resolves the divider variable to `#334155` (purple-gray/1300). Our orbit theme has `#1e293b` (which is purple-gray/1400, the *active row* color). Swap to the correct token value.

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

```diff
   --orbit-color-sidenav-bg: #041628;
-  --orbit-color-sidenav-active-bg: #1e293b;
-  --orbit-color-sidenav-divider: #1e293b;
+  --orbit-color-sidenav-active-bg: #1e293b;
+  --orbit-color-sidenav-divider: #334155;
   --orbit-color-sidenav-muted: #a3b1c4;
```

`old_string`:
```
  --orbit-color-sidenav-bg: #041628;
  --orbit-color-sidenav-active-bg: #1e293b;
  --orbit-color-sidenav-divider: #1e293b;
  --orbit-color-sidenav-muted: #a3b1c4;
```

`new_string`:
```
  --orbit-color-sidenav-bg: #041628;
  --orbit-color-sidenav-active-bg: #1e293b;
  --orbit-color-sidenav-divider: #334155;
  --orbit-color-sidenav-muted: #a3b1c4;
```

---

### Fix 2 — Container padding-top + header/list/section spacing

**Rationale:** Multiple defaults are off:
- `.sideNav { padding-top }`: code 24 → Figma 20
- `--sidenav-header-padding`: code `0 32 24` → Figma `0 21 20`
- `--sidenav-row-gap` (gap between nav rows): code 2 → Figma 8 (`--orbit-space-s`)

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.sideNav {
  --sidenav-width: 232px;
  --sidenav-logo-size: var(--orbit-space-xl);
  --sidenav-avatar-size: var(--orbit-space-l);
  --sidenav-row-height: var(--orbit-space-xl);
  --sidenav-row-gap: var(--orbit-space-xxs);
  --sidenav-row-font-size: var(--orbit-text-sm);
  --sidenav-row-line-height: var(--orbit-leading-relaxed);
  --sidenav-icon-slot: var(--orbit-space-l);
  --sidenav-header-gap: var(--orbit-space-s);
  --sidenav-header-padding: 0 var(--orbit-space-l) var(--orbit-space-m);
  --sidenav-list-padding: 0 var(--orbit-space-s);
  --sidenav-section-padding: 0 var(--orbit-space-base);
  --sidenav-profile-padding: 0 var(--orbit-space-l);
  --sidenav-work-title-size: var(--orbit-text-sm);
  --sidenav-work-subtitle-size: var(--orbit-text-xs);
  --sidenav-divider-width: calc(var(--sidenav-width) - var(--orbit-space-xl));

  position: sticky;
  top: 0;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-self: stretch;
  width: var(--sidenav-width);
  min-height: 100vh;
  max-height: 100vh;
  padding-top: var(--orbit-space-m);
  gap: var(--orbit-space-base);
  overflow: hidden;
  background-color: var(--orbit-color-sidenav-bg);
  color: var(--orbit-color-white);
  font-family: var(--orbit-font-family-sans);
}
```

`new_string`:
```
.sideNav {
  --sidenav-width: 232px;
  --sidenav-logo-size: var(--orbit-space-xl);
  --sidenav-avatar-size: var(--orbit-space-m); /* Figma: 24px (was --space-l 32) */
  --sidenav-row-height: var(--orbit-space-xl);
  --sidenav-row-gap: var(--orbit-space-s); /* Figma: 8px between nav rows (was xxs 2) */
  --sidenav-row-font-size: var(--orbit-text-sm);
  --sidenav-row-line-height: var(--orbit-leading-relaxed);
  --sidenav-icon-slot: var(--orbit-space-l);
  --sidenav-header-gap: var(--orbit-space-s);
  --sidenav-header-padding: 0 21px 20px; /* Figma exact values; not in spacing scale */
  --sidenav-list-padding: 0 var(--orbit-space-s);
  --sidenav-section-padding: 0 var(--orbit-space-base);
  --sidenav-profile-padding: 0 20px; /* Figma exact value */
  --sidenav-work-title-size: var(--orbit-text-sm);
  --sidenav-work-subtitle-size: var(--orbit-text-xs);
  --sidenav-divider-width: calc(var(--sidenav-width) - var(--orbit-space-xl));

  position: sticky;
  top: 0;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-self: stretch;
  width: var(--sidenav-width);
  min-height: 100vh;
  max-height: 100vh;
  padding-top: 20px; /* Figma: 20px (not in spacing scale) */
  gap: var(--orbit-space-base);
  overflow: hidden;
  background-color: var(--orbit-color-sidenav-bg);
  color: var(--orbit-color-white);
  font-family: var(--orbit-font-family-sans);
}
```

> **Note:** This single edit handles four audit items at once: padding-top (#2), header padding (#3), nav row gap (#8), avatar size (#15), profile padding (#13). The avatar token change cascades into Fix 6 below.

---

### Fix 3 — Section list gap

**Rationale:** Figma places ~16px between section blocks (Identify → Deliver → Sustain). Code uses 4px.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.sectionList {
  gap: var(--orbit-space-xs);
  width: 100%;
  padding: var(--sidenav-section-padding);
  box-sizing: border-box;
}
```

`new_string`:
```
.sectionList {
  gap: var(--orbit-space-base); /* Figma: 16px between section blocks (was xs 4) */
  width: 100%;
  padding: var(--sidenav-section-padding);
  box-sizing: border-box;
}
```

---

### Fix 4 — Section row padding

**Rationale:** Figma's section header has `padding-left: 4px` (`--xs`). Code uses `0 8`. Tighten to match.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.sectionRow {
  gap: var(--orbit-space-base);
  justify-content: space-between;
  padding: 0 var(--orbit-space-s);
}
```

`new_string`:
```
.sectionRow {
  gap: var(--orbit-space-base);
  justify-content: space-between;
  padding: 0 var(--orbit-space-xs); /* Figma: 4px left padding (was --space-s 8) */
}
```

---

### Fix 5 — Nav row radius + vertical padding, sub-item radius

**Rationale:** Three coupled changes:
- `.navRow` (Home / Data Tracker / Document Search) needs `border-radius: 8px` (`--orbit-radius-md`) on every row, not just `.active`. Figma shows 8px on all top-level nav rows.
- `.navRow` needs `padding-y: 4px` to match Figma's `py-1`.
- `.subItem` (inactive) currently has `border-radius: 4px`; Figma shows 8px on inactive, 4px only when active. The shared `.active` rule already overrides to 4 → so just bump `.subItem`'s default to 8.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

**Change A — `.navRow`:**

`old_string`:
```
.navRow {
  gap: var(--orbit-space-xxs);
  padding: 0 var(--orbit-space-s);
}
```

`new_string`:
```
.navRow {
  gap: var(--orbit-space-xs); /* Figma: 4px icon→label (was xxs 2) */
  padding: var(--orbit-space-xs) var(--orbit-space-s); /* Figma: py-4 px-8 */
  border-radius: var(--orbit-radius-md); /* Figma: 8px on all nav rows */
}
```

**Change B — `.subItem`:**

`old_string`:
```
.subItem {
  gap: var(--orbit-space-xxs);
  width: calc(100% - var(--orbit-space-base));
  margin-left: var(--orbit-space-base);
  padding: 0 var(--orbit-space-xxs);
  border-radius: var(--orbit-radius-sm);
}
```

`new_string`:
```
.subItem {
  gap: var(--orbit-space-xxs);
  width: calc(100% - 12px);
  margin-left: 12px; /* Figma: 12px outer pl (was --space-base 16) */
  padding: 0 var(--orbit-space-xs); /* Figma: 4px (was xxs 2) */
  border-radius: var(--orbit-radius-md); /* Figma: 8px on inactive sub-items; .active overrides to --radius-sm (4px) */
}
```

> **Important:** The shared `.active` rule already sets `border-radius: var(--orbit-radius-sm)` (4px), so active sub-items still get the smaller radius. The `.active` rule does NOT need to change. Verify by inspecting the cascade after applying.

---

### Fix 6 — Notification badge: white, 14×14, regular weight

**Rationale:** Figma renders the notification "1" pill as a **white** 14×14 circle with **black** text in **Inter Regular** (weight 400). Code currently has `bright-orange` background, 16×16, semibold (600). This is the most visible diff.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--orbit-space-base);
  height: var(--orbit-space-base);
  padding: 0 var(--orbit-space-xxs);
  border-radius: var(--orbit-radius-pill);
  background-color: var(--orbit-color-bright-orange);
  color: var(--orbit-color-black);
  font-size: var(--orbit-text-xs);
  font-weight: var(--orbit-font-weight-semibold);
}
```

`new_string`:
```
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 14px; /* Figma: 14×14 (was --space-base 16) */
  height: 14px;
  padding: 0 var(--orbit-space-xxs);
  border-radius: var(--orbit-radius-pill);
  background-color: var(--orbit-color-white); /* Figma: white (was bright-orange) */
  color: var(--orbit-color-black);
  font-size: var(--orbit-text-xs);
  font-weight: var(--orbit-font-weight-regular); /* Figma: 400 (was semibold 600) */
}
```

> The `.wide .badge` override below this rule already targets `.wide` mode and is unaffected — leave it alone.

---

### Fix 7 — "My Work" heading muted by default

**Rationale:** Figma renders the "My Work" label in the muted purple-gray color (`#a3b1c4`) regardless of nav width. Code currently only applies the muted color in `.wide` mode and uses white in default density.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.workHeading {
  min-width: 0;
  color: var(--orbit-color-white);
  font-size: var(--sidenav-row-font-size);
  line-height: var(--sidenav-row-line-height);
}

.wide .workHeading {
  color: var(--orbit-color-sidenav-muted);
}
```

`new_string`:
```
.workHeading {
  min-width: 0;
  color: var(--orbit-color-sidenav-muted); /* Figma: muted in both densities (was white in default) */
  font-size: var(--sidenav-row-font-size);
  line-height: var(--sidenav-row-line-height);
}
```

> The `.wide .workHeading` rule is removed — it became a no-op.

---

### Fix 8 — Work item left-padding

**Rationale:** Figma history items sit ~20px from the sidebar's left edge (16px outer padding + 4px inner). Code uses 32px (`--orbit-space-l`).

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.workItem {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--orbit-space-xxs);
  padding: 0 var(--orbit-space-base) 0 var(--orbit-space-l);
  border: 0;
  background: transparent;
  color: var(--orbit-color-white);
  font: inherit;
  text-align: left;
  text-decoration: none;
}
```

`new_string`:
```
.workItem {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--orbit-space-xxs);
  padding: 0 var(--orbit-space-base) 0 20px; /* Figma: 20px effective left padding (was --space-l 32) */
  border: 0;
  background: transparent;
  color: var(--orbit-color-white);
  font: inherit;
  text-align: left;
  text-decoration: none;
}
```

> The `.wide .workItem` rule directly below uses `--orbit-space-xl` and is intentionally left alone for wide mode.

---

### Fix 9 — Avatar font-size

**Rationale:** Figma renders the initials at **10px**. Code uses 12px (`--orbit-text-xs`). 10px is not in the typography scale; hard-code with a comment.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sidenav-avatar-size);
  height: var(--sidenav-avatar-size);
  flex: 0 0 var(--sidenav-avatar-size);
  border-radius: var(--orbit-radius-pill);
  background-color: var(--orbit-color-btn-primary-bg);
  color: var(--orbit-color-white);
  font-family: var(--orbit-font-family-sans);
  font-size: var(--orbit-text-xs);
}
```

`new_string`:
```
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sidenav-avatar-size);
  height: var(--sidenav-avatar-size);
  flex: 0 0 var(--sidenav-avatar-size);
  border-radius: var(--orbit-radius-pill);
  background-color: var(--orbit-color-btn-primary-bg);
  color: var(--orbit-color-white);
  font-family: var(--orbit-font-family-sans);
  font-size: 10px; /* Figma: 10px (not in type scale; was --orbit-text-xs 12) */
}
```

> `.wide .avatar` keeps `--orbit-text-base`. Leave alone.

---

### Fix 10 — App-name font weight

**Rationale:** Figma uses Inter Bold = **700**. Our `--orbit-font-weight-bold` is **800** (Extra Bold). Rather than mutate the global token (which would affect every other component), pin `.appName` to a literal `700`.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.appName {
  color: var(--orbit-color-white);
  font-size: var(--sidenav-row-font-size);
  font-weight: var(--orbit-font-weight-bold);
  line-height: var(--sidenav-row-line-height);
}
```

`new_string`:
```
.appName {
  color: var(--orbit-color-white);
  font-size: var(--sidenav-row-font-size);
  font-weight: 700; /* Figma: Inter Bold = 700; --orbit-font-weight-bold is 800 (Extra Bold) */
  line-height: var(--sidenav-row-line-height);
}
```

---

### Fix 11 — Profile bottom padding

**Rationale:** Figma's profile container has no bottom padding. Code adds 8px.

**File:** `packages/orbit/src/navigation/SideNav.module.css`

`old_string`:
```
.profile {
  display: flex;
  flex-direction: column;
  gap: var(--orbit-space-s);
  justify-content: flex-end;
  padding-bottom: var(--orbit-space-s);
}
```

`new_string`:
```
.profile {
  display: flex;
  flex-direction: column;
  gap: var(--orbit-space-s);
  justify-content: flex-end;
  padding-bottom: 0; /* Figma: 0 (was --orbit-space-s 8) */
}
```

> If removing bottom space causes the profile to feel cramped against the viewport edge in real usage, revisit — but for matching the Figma node exactly, 0 is the spec.

---

## 6. Out of scope

These items were flagged in the audit but intentionally **not** included in this plan because they require broader judgment calls:

1. **Cross-cutting `--orbit-font-weight-bold` value.** Currently 800. Used by `.appName` here (where Figma wants 700) and potentially other components elsewhere (e.g. Headings). Fix 10 pins SideNav locally; a separate review should decide whether the global token should drop to 700 (and what the previous "bold" callers expect).
2. **Adding a `--orbit-text-2xs: 10px` typography token.** Fix 9 hard-codes 10px in `.avatar`. If 10px shows up elsewhere in the design system in the future, promote it to a token.
3. **Default theme alignment.** This Figma design uses Orbit theme. The default (legacy) sidenav palette in `components.css` is unchanged. If product is dropping the legacy palette, that's a separate cleanup.
4. **Sub-item active icon weight (FA Solid vs Regular).** Figma uses FA Solid for active sub-items, Regular for inactive. Our SubItem accepts a single `icon` glyph string and doesn't switch FA weight. Adding `iconActive` / icon-weight handling is a component API change — out of scope for a CSS audit.
5. **Scrollbar thumb thickness.** Figma shows a 4×179 indicator at `#475569`; code uses 2px webkit thumb at `--orbit-color-text-secondary` (#666666 default). The webkit scrollbar styling is browser-rendered and rarely matches Figma 1:1. If tightening is needed, change in [SideNav.module.css:344-355](../packages/orbit/src/navigation/SideNav.module.css:344) to `width: 4px` and `background: var(--orbit-color-sidenav-muted)`.

## 7. Verification

After applying every fix above:

```bash
# from repo root
npm run typecheck:orbit
npm run test:components
npm run build:orbit
```

All three must pass. Then visually verify by running the prototypes app and inspecting the SideNav region:

```bash
npm run dev:prototypes
# open http://localhost:3000 (or whichever port Next chooses)
# ensure data-theme="orbit" is applied to <html> or a top-level wrapper
# compare against Figma node 19252:85778
```

If you have access to the Figma MCP, you can re-pull the screenshot for side-by-side:

```
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85778", maxDimension=2048)
```

## 8. Diff summary

| # | Region | Fix | Severity closed |
|:-:|---|---|:-:|
| 1 | Token | Divider color in orbit theme `#1e293b → #334155` | major |
| 2 | Container | `padding-top: 24 → 20` | minor |
| 3 | Header | `padding: 0 32 24 → 0 21 20` | major |
| 4 | Section list | `gap: 4 → 16` (xs → base) | major |
| 5 | Section row | `padding: 0 8 → 0 4` | minor |
| 6 | Nav row | `border-radius: none → 8`, `padding: 0 8 → 4 8`, `gap: 2 → 4` | major |
| 7 | Sub-item | `border-radius: 4 → 8` (active still 4 via `.active` cascade), `margin-left + width: 16 → 12`, `padding-x: 2 → 4` | minor |
| 8 | Notification badge | white bg, 14×14, font-weight 400 | **critical** |
| 9 | "My Work" heading | always muted color | major |
| 10 | Work item | `padding-left: 32 → 20` | major |
| 11 | Avatar | size `32 → 24`, font-size `12 → 10` | major |
| 12 | App name | font-weight `800 → 700` (literal, not token) | major |
| 13 | Profile | `padding-bottom: 8 → 0`, `padding-x: 32 → 20` | major |
| 14 | Nav list | `gap: 2 → 8` (handled in Fix 2) | major |

End of plan.

# Main Component Library — comprehensive Figma alignment plan

> **For the implementing agent (Codex / Claude / etc.):** This plan addresses ~40 distinct issues found in the comprehensive audit of `@efficio/orbit` against the Figma Main Component Library (file `5RUsy0uKtFarK7nO8Y3nLL`, "Theme - Orbit" canvas, node `7383:10444`).
>
> Read top to bottom. Apply phases in order — **Phase 1 token fixes ripple through every component, so they MUST land first** before the per-component visual fixes in later phases will look correct.
>
> Some items revert prior plans (notably the `card-border-default` change from the SideNav follow-up). Reverts are explicitly flagged.
>
> §11 verification must pass before declaring done.

## 1. Source of truth

- **File:** `5RUsy0uKtFarK7nO8Y3nLL` ("Sprint-75: Main Component Library", canvas "Theme - Orbit", node `7383:10444`)
- **All audits assume orbit theme** (`[data-theme="orbit"]` is what the design represents). Default-theme values are out of scope.
- **Figma variable resolution rule:** when Figma's emitted code shows both a bound variable AND an inline literal (e.g. `var(--Border/color-default, #e6e6e6)`), the **variable's resolved value is canonical**. The literal is often a stale fallback string. Verified for every value in this plan.
- **Internal Figma inconsistencies:** several variables in this file have stale inline fallback strings that disagree with their bound resolution. Section §10 lists these explicitly so Codex knows which side to trust.

## 2. Files touched (summary)

| Phase | Files |
|---|---|
| 1 — Tokens | `packages/orbit/styles/tokens/themes/orbit.css`, `packages/orbit/styles/tokens/components.css`, `packages/orbit/styles/tokens/typography.css`, `packages/orbit/src/indicators/Badge.module.css`, `packages/orbit/src/indicators/Badge.tsx`, `packages/orbit/src/inputs/TextArea.module.css` |
| 2 — New core components | `packages/orbit/src/inputs/Radio.tsx` (new), `packages/orbit/src/inputs/Radio.module.css` (new), `packages/orbit/src/indicators/StepCircle.tsx` (new), `packages/orbit/src/indicators/StepCircle.module.css` (new) |
| 3 — Existing component extensions | `packages/orbit/src/inputs/Dropdown.tsx`, `packages/orbit/src/inputs/Dropdown.module.css`, `packages/orbit/src/inputs/TextArea.tsx`, `packages/orbit/src/feedback/Tooltip.tsx`, `packages/orbit/src/feedback/Tooltip.module.css`, `packages/orbit/src/feedback/Toast.tsx`, `packages/orbit/src/layout/Avatar.tsx`, `packages/orbit/src/layout/Avatar.module.css`, `packages/orbit/src/indicators/Chip.tsx` |
| 4 — Optional new components | `packages/orbit/src/inputs/MultiSelectDropdown.tsx` (new), `packages/orbit/src/inputs/Description.tsx` (new — large), `packages/orbit/src/layout/FileItem.tsx` (new), `packages/orbit/src/indicators/Filter.tsx` (new) |
| 5 — Index barrels + tests | `packages/orbit/src/inputs/index.ts`, `packages/orbit/src/indicators/index.ts`, `packages/orbit/src/layout/index.ts`, `packages/orbit/src/index.ts`, `packages/orbit/src/Smoke.test.tsx`, plus per-component `*.test.tsx` files |

## 3. Acceptance criteria

```bash
npm run typecheck:orbit         # passes
npm run test:components         # all existing tests pass + new tests pass
npm run build:orbit             # passes
```

Visual verification: render the docs app and the prototypes app, walk through every page that uses an affected component, and confirm color/size parity against the Figma reference.

---

# PHASE 1 — Token reconciliation (CRITICAL — apply first)

These changes ripple. Apply them all in this phase before touching component CSS.

## 1.1 — Revert `card-border-default` to `#e2e8f0` (orbit theme only)

**Rationale:** The previous SideNav-follow-up plan (mistakenly) changed `--orbit-color-card-border-default` to reference `--orbit-color-border-accent` (`#a2a9c5`). The audit shows Figma's `Border/color-default` resolves to **`#e2e8f0`**. The `#a2a9c5` value was only an inline fallback string, not the bound variable. **Revert this.**

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

`old_string`:
```css
  /* --- Card --- */
  --orbit-color-card-border-default: var(--orbit-color-border-accent);
  --orbit-color-card-border-hover: var(--orbit-color-border-accent);
```

`new_string`:
```css
  /* --- Card --- */
  --orbit-color-card-border-default: #e2e8f0;
  --orbit-color-card-border-hover: #e2e8f0;
```

> Affects: every Card consumer in orbit theme. Cards will now render with a paler slate-200 border instead of the slightly darker slate-300. This matches Figma's design intent.

## 1.2 — Headings H2-H5 font weight 600 → 700

**Rationale:** Figma uses Bold (700) for H2-H5; only H1 uses Semi Bold (600). Code's `--orbit-text-h2-weight` through `h5-weight` all map to `--orbit-font-weight-semibold` = 600.

**File:** `packages/orbit/styles/tokens/typography.css`

`old_string`:
```css
  /* Heading 2: Inter Semi Bold 28px / 100% */
  --orbit-text-h2-size: var(--orbit-text-2xl);
  --orbit-text-h2-weight: var(--orbit-font-weight-semibold);
  --orbit-text-h2-leading: var(--orbit-leading-tight);

  /* Heading 3: Inter Semi Bold 26px / 100% */
  --orbit-text-h3-size: var(--orbit-text-xl);
  --orbit-text-h3-weight: var(--orbit-font-weight-semibold);
  --orbit-text-h3-leading: var(--orbit-leading-tight);

  /* Heading 4: Inter Semi Bold 20px / 100% */
  --orbit-text-h4-size: var(--orbit-text-lg);
  --orbit-text-h4-weight: var(--orbit-font-weight-semibold);
  --orbit-text-h4-leading: var(--orbit-leading-tight);

  /* Heading 5: Inter Semi Bold 16px / 100% */
  --orbit-text-h5-size: var(--orbit-text-base);
  --orbit-text-h5-weight: var(--orbit-font-weight-semibold);
  --orbit-text-h5-leading: var(--orbit-leading-tight);
```

`new_string`:
```css
  /* Heading 2: Inter Bold 28px / 100% (Figma uses 700, not 600) */
  --orbit-text-h2-size: var(--orbit-text-2xl);
  --orbit-text-h2-weight: 700;
  --orbit-text-h2-leading: var(--orbit-leading-tight);

  /* Heading 3: Inter Bold 26px / 100% */
  --orbit-text-h3-size: var(--orbit-text-xl);
  --orbit-text-h3-weight: 700;
  --orbit-text-h3-leading: var(--orbit-leading-tight);

  /* Heading 4: Inter Bold 20px / 100% */
  --orbit-text-h4-size: var(--orbit-text-lg);
  --orbit-text-h4-weight: 700;
  --orbit-text-h4-leading: var(--orbit-leading-tight);

  /* Heading 5: Inter Bold 16px / 100% */
  --orbit-text-h5-size: var(--orbit-text-base);
  --orbit-text-h5-weight: 700;
  --orbit-text-h5-leading: var(--orbit-leading-tight);
```

> Affects: all `<Headings size="Heading 2..5">` consumers. Headings will look heavier. This is what Figma wants.

## 1.3 — Status-high colors (Success + Information)

**Rationale:** Figma resolves `--Contrast/High/Background/color-success` to `#15803d` (badges) and `#00a962` (radial indicator); the closest cross-component anchor is `#00a962` (Jade) used for high-contrast surfaces. Code currently uses `#01968a` (teal — neither value). Information: code `#155dfc` vs Figma `#1252de`.

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

Find the status-high block and update success + information.

`old_string`:
```css
  /* --- Status — High Contrast (Toast + Indicators) --- */
  --orbit-color-status-high-bg-success: #01968a;
  --orbit-color-status-high-bg-information: #155dfc;
```

`new_string`:
```css
  /* --- Status — High Contrast (Toast + Indicators) --- */
  --orbit-color-status-high-bg-success: #00a962; /* Figma --Contrast/High/Background/color-success (Jade) */
  --orbit-color-status-high-bg-information: #1252de; /* Figma --Contrast/High/Background/color-information */
```

> Note: `--orbit-color-status-high-bg-success` is also in `components.css` (default theme) at `#00a962` already — only orbit-theme needs changing.

> Note: Figma's badge variant uses `#15803d` (forest green) for "Success" specifically — but that's also `--text-success`. The status-high token is for backgrounds; `#00a962` is the cross-component anchor.

## 1.4 — Button Tertiary FG (`#615fff` → `#475569`)

**Rationale:** Figma's `Tertiary/Foreground/color-default` resolves to `#475569` (slate-600). Code uses `#615fff` (primary purple). This is a real color drift — code's tertiary buttons currently look like primary text-buttons.

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

`old_string`:
```css
  /* --- Button — Tertiary --- */
  --orbit-color-btn-tertiary-fg: #615fff;
  --orbit-color-btn-tertiary-fg-disabled: #8594a9;
  --orbit-color-btn-tertiary-bg-disabled: #e2e8f0;
```

`new_string`:
```css
  /* --- Button — Tertiary --- */
  --orbit-color-btn-tertiary-fg: #475569; /* Figma --Tertiary/Foreground/color-default (slate-600) */
  --orbit-color-btn-tertiary-fg-disabled: #8594a9;
  --orbit-color-btn-tertiary-bg-disabled: #e2e8f0;
```

> ⚠️ This will affect: Tertiary `<Button>` text, `<LinkText variant="Primary">` (uses tertiary fg via existing token), `<TabButton>` chevron color, and various inline icon colors. **Verify the prototypes that use `var(--orbit-color-btn-tertiary-fg)` for purple-themed text — this change makes that text slate-grey.** If any consumer relied on the purple, introduce a separate `--orbit-color-text-link-purple: #615fff` token instead.

> ⚠️ **Test deliberately first** — this change visually affects: Edit/Cancel tertiary buttons in InitiativeSelectedCard, ParametersSelectedCard, and any other tertiary-styled action.

## 1.5 — Border error `#cd0030` → `#e00034` (input borders)

**Rationale:** Figma uses `#e00034` (Red Ribbon) consistently across all input error borders, whereas code uses `#cd0030`. Both are red but visibly different (Red Ribbon is more vermilion).

**Decision point:** This token is used both for `--orbit-color-text-error` (which is already `#cd0030` and matches Figma's `text-error` variable) and `--orbit-color-border-error`. **Keep text-error at `#cd0030`** (matches Figma `text-error`) but change `border-error` to `#e00034` (matches Figma `Border/color-error`).

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

Find the existing border-error declaration. **There is no orbit-theme override for border-error today** — it inherits from `semantics.css`. Add an explicit orbit-theme override.

After the existing border block (around the card section), add:

```css
  /* --- Border — error (Figma --Border/color-error) --- */
  --orbit-color-border-error: #e00034;
```

> Verify: ensure `semantics.css` keeps the default at `#e00034` (it currently has `#e00034` per the audit). If so, no override needed in orbit theme — but explicitly declaring it documents intent.

## 1.6 — TextArea height: fixed `120px` → min-height `48px`

**Rationale:** Figma's TextArea is `min-height: 48px` and grows with content. Code fixes it at 120px which forces an oversized empty state.

**File:** `packages/orbit/styles/tokens/components.css`

`old_string`:
```css
  /* --- TextArea --- */
  --orbit-textarea-height: 120px;
```

`new_string`:
```css
  /* --- TextArea --- */
  --orbit-textarea-min-height: 48px; /* Figma min-height; auto-grows via inline rows attr */
```

Then update **`packages/orbit/src/inputs/TextArea.module.css`**: replace any `height: var(--orbit-textarea-height)` with `min-height: var(--orbit-textarea-min-height)`. (Use Read first; the rule is around line 30-50 in the file.)

> Verify in `TextArea.tsx` — if the component currently sets a fixed `rows` attribute or `height`, change to use `rows={3}` (default) with `resize: vertical` so users can drag-resize.

## 1.7 — Badge: radius `16px` → `4px`, remove min-width

**Rationale:** Figma badges are slightly-rounded rectangles (4px corners), content-sized. Code makes them pills (16px) with `min-width: 19px`.

**File:** `packages/orbit/styles/tokens/components.css`

`old_string`:
```css
  /* --- Badge --- */
  --orbit-badge-min-width: 19px;
  --orbit-badge-radius: 16px;
```

`new_string`:
```css
  /* --- Badge --- */
  --orbit-badge-radius: 4px; /* Figma --xs (4px) — slightly rounded rectangle, not pill */
  /* min-width removed: Figma badges size by content with 2px vertical / 8px horizontal padding */
```

**File:** `packages/orbit/src/indicators/Badge.module.css`

Find the `.badge` rule. Remove the `min-width` line (or set to 0). Keep `padding: 0 var(--orbit-space-s)` (8px horizontal). The `border-radius: var(--orbit-badge-radius)` reference will pick up the new 4px automatically.

> If the SideNav consumer (`.badge` class inside SideNav) relies on the round shape, update [SideNav.module.css:210-222](../packages/orbit/src/navigation/SideNav.module.css:210) to override locally with `border-radius: var(--orbit-radius-pill)` since that's a notification-count pill, not a Badge proper.

## 1.8 — Badge color set: add Information + Warning

**Rationale:** Figma has 5 badge colors (Success/Information/Warning/Error/No-Status). Code has only Green/Red/Gray.

**File:** `packages/orbit/src/indicators/Badge.tsx`

Update the `BadgeProps` `status` union to include the missing colors:

```tsx
export interface BadgeProps {
  label: string;
  status?: 'Green' | 'Red' | 'Gray' | 'Information' | 'Warning' | 'Success' | 'Error' | 'No Status';
  ariaLabel?: string;
}
```

Update the `bgMap` and (new) `fgMap`:

```tsx
const bgMap: Record<string, string> = {
  Green: 'var(--orbit-color-bright-green)',
  Red: 'var(--orbit-color-bright-orange)',
  Gray: 'var(--orbit-color-mid-gray)',
  Success: 'var(--orbit-color-status-high-bg-success)',
  Information: 'var(--orbit-color-status-high-bg-information)',
  Warning: 'var(--orbit-color-status-high-bg-warning)',
  Error: 'var(--orbit-color-status-high-bg-error)',
  'No Status': 'var(--orbit-color-status-high-bg-no-status)',
};

const fgMap: Record<string, string> = {
  Green: 'var(--orbit-color-white)',
  Red: 'var(--orbit-color-white)',
  Gray: 'var(--orbit-color-white)',
  Success: 'var(--orbit-color-white)',
  Information: 'var(--orbit-color-white)',
  Warning: 'var(--orbit-color-text-primary)',
  Error: 'var(--orbit-color-white)',
  'No Status': 'var(--orbit-color-text-primary)',
};
```

Pass `--_fg` alongside `--_bg` via inline style:
```tsx
style={{ '--_bg': bgMap[status], '--_fg': fgMap[status] } as React.CSSProperties}
```

And in `Badge.module.css`, change `color: var(--orbit-color-black)` to `color: var(--_fg, var(--orbit-color-black))`.

---

# PHASE 2 — New core components (CRITICAL)

## 2.1 — Radio + RadioGroup

**Rationale:** Figma documents Radio (`7383:27720`) with 8 variants. Code has Checkbox + Toggle but no Radio.

**Spec (from Figma):**
- Indicator: 15×15 (use 16×16 for grid alignment with Checkbox; 15 is a Figma raster artifact)
- Border: 2px solid `--orbit-color-checkbox-unchecked-border` (#8594a9)
- Checked: bg `var(--orbit-color-checkbox-checked-bg)` (#615fff), inner dot 6px white
- Disabled bg: `var(--orbit-color-checkbox-disabled-bg)` (#e2e8f0)
- Error: 2px border `var(--orbit-color-border-error)` (#e00034)
- Label: Inter Regular 14/24, color `var(--orbit-color-text-primary)`
- Gap to label: 8px
- Label disabled color: `var(--orbit-color-text-disabled)` (#8594a9)

**API (mirror Checkbox):**

```tsx
// packages/orbit/src/inputs/Radio.tsx
'use client';
import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';

export interface RadioProps {
  checked: boolean;
  state?: 'Active' | 'Hover' | 'Disabled' | 'Error';
  alignment?: 'Left' | 'Right';
  label?: string;
  ariaLabel?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  state = 'Active',
  alignment = 'Left',
  label,
  ariaLabel = 'Radio',
  name,
  value,
  onChange,
}) => {
  const isDisabled = state === 'Disabled';
  const isError = state === 'Error';
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        styles.container,
        alignment === 'Right' && styles.containerRight,
        isDisabled && styles.containerDisabled,
      )}
    >
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => !isDisabled && onChange(value)}
        className={styles.hiddenInput}
        aria-label={label ? undefined : ariaLabel}
        aria-invalid={isError || undefined}
      />
      <span
        className={clsx(
          styles.dot,
          checked && styles.dotChecked,
          state === 'Hover' && styles.dotHover,
          isError && styles.dotError,
          isDisabled && styles.dotDisabled,
        )}
        aria-hidden="true"
      />
      {label && (
        <span className={clsx(styles.label, isDisabled && styles.labelDisabled)}>
          {label}
        </span>
      )}
    </label>
  );
};

// RadioGroup — controlled wrapper
export interface RadioGroupProps {
  value: string;
  name: string;
  ariaLabel?: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, name, ariaLabel, onChange, children }) => (
  <div role="radiogroup" aria-label={ariaLabel} className={styles.group}>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement<RadioProps>(child)) return child;
      return React.cloneElement(child, {
        name,
        checked: child.props.value === value,
        onChange,
      });
    })}
  </div>
);
```

**CSS** — model on `Checkbox.module.css`. Key rules:

```css
.container { display: inline-flex; align-items: center; gap: var(--orbit-space-s); cursor: pointer; }
.containerRight { flex-direction: row-reverse; }
.containerDisabled { cursor: not-allowed; }
.group { display: flex; flex-direction: column; gap: var(--orbit-space-s); }

.hiddenInput { position: absolute; opacity: 0; pointer-events: none; }

.dot {
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid var(--orbit-color-checkbox-unchecked-border);
  border-radius: 50%;
  background: var(--orbit-color-bg-default);
  flex-shrink: 0;
}
.dotChecked {
  border-color: var(--orbit-color-checkbox-checked-bg);
  background: var(--orbit-color-bg-default);
}
.dotChecked::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--orbit-color-checkbox-checked-bg);
}
.dotHover { box-shadow: 0 0 0 4px rgba(97,95,255,0.1); }
.dotError { border-color: var(--orbit-color-border-error); }
.dotDisabled { background: var(--orbit-color-checkbox-disabled-bg); border-color: var(--orbit-color-border-disabled); }

.label { font-family: var(--orbit-font-family-sans); font-size: var(--orbit-text-sm); line-height: var(--orbit-leading-relaxed); color: var(--orbit-color-text-primary); }
.labelDisabled { color: var(--orbit-color-text-disabled); }
```

**Tests:** Add `Radio.test.tsx` covering: renders with role=radio, controlled change, RadioGroup keyboard nav (Arrow keys move selection), error state has `aria-invalid`.

**Index:** Export from `packages/orbit/src/inputs/index.ts` and update `packages/orbit/src/Smoke.test.tsx`.

## 2.2 — StepCircle component

**Rationale:** Figma documents StepCircle (`7383:28897`) with 3 sizes × 4 states. No code equivalent. Used in any wizard/stepper UI.

**Spec (from Figma):**
- Sizes: Large 32×32, Medium 16×16, Small 8×8
- States:
  - **Checked** — bg `Jade #00a962` + white check icon (FA solid ``, 16px at Large)
  - **To Do** — open ring with stroke `#8594a9` on transparent bg
  - **Active** — To Do circle + Marker caret pointing to it (caret is a small triangle outside the circle)
  - **Numbered** — text-only "1", "2", "3" in `Sofia Pro Regular 16px` color `#475569` (heading-5)

**API:**

```tsx
// packages/orbit/src/indicators/StepCircle.tsx
'use client';
import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './StepCircle.module.css';

export interface StepCircleProps {
  status: 'Checked' | 'Active' | 'To Do' | 'Numbered' | 'Disabled';
  size?: 'Large' | 'Medium' | 'Small';
  /** When status === 'Numbered', the digit/label to render. */
  label?: string | number;
  ariaLabel?: string;
}

const sizeMap = { Large: styles.large, Medium: styles.medium, Small: styles.small };

export const StepCircle: React.FC<StepCircleProps> = ({
  status,
  size = 'Large',
  label,
  ariaLabel,
}) => {
  return (
    <span
      className={clsx(styles.circle, sizeMap[size], styles[status.toLowerCase().replace(' ', '-')])}
      role="img"
      aria-label={ariaLabel || `Step ${status}${label ? ` ${label}` : ''}`}
    >
      {status === 'Checked' && <FaIcon icon={FA.check} size={size === 'Large' ? 16 : 10} color="var(--orbit-color-white)" />}
      {status === 'Numbered' && <span className={styles.digit}>{label}</span>}
      {status === 'Active' && <span className={styles.marker} aria-hidden="true" />}
    </span>
  );
};
```

**CSS:**

```css
.circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}
.large { width: 32px; height: 32px; }
.medium { width: 16px; height: 16px; }
.small { width: 8px; height: 8px; }

.checked { background: #00a962; color: var(--orbit-color-white); }
.to-do { background: transparent; border: 2px solid var(--orbit-color-silver); }
.active { background: transparent; border: 2px solid var(--orbit-color-silver); }
.numbered { background: transparent; }
.disabled { background: var(--orbit-color-bg-disabled); }

.digit {
  font-family: var(--orbit-font-family-sans);
  font-size: var(--orbit-text-base);
  font-weight: var(--orbit-font-weight-regular);
  color: var(--orbit-color-btn-secondary-fg); /* slate-600 */
}

.marker {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid var(--orbit-color-silver);
}
```

**Tests:** `StepCircle.test.tsx` — renders correct size, exposes accessible role/label, marker visible on Active.

**Index:** Export from `packages/orbit/src/indicators/index.ts`.

---

# PHASE 3 — Existing component extensions

## 3.1 — Tooltip: 4 directions → 12 (add `align` prop)

**Rationale:** Figma has 12 tooltip variants (each direction × {start, center, end} anchor). Code has 4 directions only.

**File:** `packages/orbit/src/feedback/Tooltip.tsx`

Update props:
```tsx
export interface TooltipProps {
  direction?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  content: string;
}
```

Default `align="center"` (current behavior). Pass `align` into the tooltip element's class so CSS can position the arrow.

**CSS** — add `.alignStart`, `.alignEnd` modifiers per direction. Arrow position (per audit): 16px from start/end edge for non-center variants. Example:

```css
.tooltip.top.alignStart::before { left: 16px; }
.tooltip.top.alignCenter::before { left: 50%; transform: translateX(-50%); }
.tooltip.top.alignEnd::before { right: 16px; }
/* ...repeat for bottom/left/right with appropriate axis */
```

**Tests:** Verify all 12 combinations render the arrow at the right offset.

## 3.2 — Toast variant changes

**Rationale:** Code has `Mute` (Figma doesn't); Figma has `Success-options` action toast (with Discard/Save buttons).

**File:** `packages/orbit/src/feedback/Toast.tsx`

Update the `type` union: replace `Mute` with `NoStatus` if needed, or keep both for backward compat. Add an optional `actions` prop for action buttons.

```tsx
export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'Primary' | 'Secondary';
}

export interface ToastProps {
  type: 'Success' | 'Error' | 'Info' | 'Warning' | 'Mute'; // Mute kept for back-compat
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  actions?: ToastAction[]; // NEW: Discard/Save-style action toast
}
```

Render `actions` to the right of the message, before the dismiss icon. Style action buttons as small inline buttons matching Figma (Discard = white text; Save = `var(--orbit-color-btn-tertiary-fg)` on transparent).

**Tests:** Verify rendering + click handlers for actions.

## 3.3 — Dropdown: add `multiple` mode (Multi-select)

**Rationale:** Figma has Multi-select Dropdown (`7383:31667`); code has only single-select.

**Approach:** Either extend `Dropdown.tsx` with a `multiple` prop OR create new `MultiSelectDropdown.tsx`. **Recommendation: new file**, since the API + rendering differs significantly (chip array trigger, height auto-grow, different placeholder).

**Spec (from Figma):**
- Trigger: bg white, border 1px `#ccc`/`#8594a9`, radius 4px, padding `4px 4px 4px 8px`
- Height: 52px rest, 76px 1 line of chips, 115px+ 2 lines (auto-grow)
- Chips inline: bg `#e6e6e6`, border 1px `#ccc`, radius 16px, height 24px, padding `2px 8px`, gap 4px between chips, label 12px, trailing `xmark` icon 8px in `#666`
- Placeholder: `#999999` (note: different from single-select's `#475569`)
- Chevron: 16×16

**File:** `packages/orbit/src/inputs/MultiSelectDropdown.tsx` (new)

API:

```tsx
export interface MultiSelectDropdownOption {
  label: string;
  value: string;
}

export interface MultiSelectDropdownProps {
  options: MultiSelectDropdownOption[];
  value: string[]; // array of selected values
  onChange: (values: string[]) => void;
  label?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  placeholder?: string; // default "Please Select..."
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}
```

**Implementation hints:**
- Reuse the dropdown overlay logic from existing `Dropdown.tsx` (click-outside close, `aria-activedescendant`, etc.)
- For each selected value, render a Mini Chip with an `xmark` button that calls `onChange(values.filter(v => v !== value))`
- Trigger height grows via flexbox `flex-wrap` — no manual height calc

**Tests:** select multiple, deselect via chip xmark, keyboard nav (Space toggles), aria roles.

## 3.4 — Avatar: add Square style + Stack

**File:** `packages/orbit/src/layout/Avatar.tsx`

Update the `style` prop:
```tsx
style?: 'Text' | 'Image' | 'Icon' | 'Square';
```

Add a `Stack` sub-component for overlapping avatars:
```tsx
export interface AvatarStackProps {
  avatars: AvatarProps[];
  max?: number; // beyond this, show "+N more"
  size?: AvatarProps['size'];
}

export const AvatarStack: React.FC<AvatarStackProps> = ({ avatars, max = 3, size }) => {
  // render up to `max` avatars overlapping with a small left-offset
  // beyond `max`, render a final avatar with text "+N"
};
```

**CSS:** for `style="Square"`, set `border-radius: var(--orbit-radius-sm)` (4px) instead of pill. For Stack, use `margin-left: -8px` on every avatar after the first.

**Tests:** verify Square renders square corners, Stack overlaps correctly.

## 3.5 — Chip: add Default-height freedom

**Rationale:** Figma's Default chip is content-sized (~22-24px), code fixes at 32px. Either remove the fixed height OR add a `compact` mode.

**File:** `packages/orbit/src/indicators/Chip.tsx`

The `size` prop already has `Default | Mini | Small | Medium`. Verify each size in CSS:
- `Default`: remove fixed `height: var(--orbit-chip-height-default)` → use `min-height` or content-sized
- `Mini`: keep 24px

This is a CSS-only change. Inspect `Chip.module.css` and remove rigid `height` from the `.default` rule.

> **Note:** Code's `Outline` variant has no Figma counterpart (Figma has Information/Success/Warning/Error/Additional/No-Status/Disabled = 7). Keep Outline for now, but consider deprecating in the next pass if not used.

---

# PHASE 4 — Optional new components (major gaps)

## 4.1 — FileItem (selected file pill)

**Rationale:** Figma's File Component (`7383:31722`) is a *rendered file pill*, not a dropzone. Use after Dropzone to display already-uploaded files.

**Spec:** doc icon (32×32) + filename (Inter Regular 14/24 `#040921`) + optional trailing action button (32×32). Border 1px `#e6e6e6`, radius 4px, padding 8px, gap 4px. Hover: bg `#f6f4f5`.

**File:** `packages/orbit/src/layout/FileItem.tsx` (new)

```tsx
export interface FileItemProps {
  filename: string;
  documentType?: 'PDF' | 'DOC' | 'XLS' | 'ZIP' | 'IMG' | 'Unknown';
  trailing?: React.ReactNode;
  onClick?: () => void;
  fixedWidth?: number; // Figma "with-icon" variant uses 380px
}
```

Reuse `<DocumentGlyph>` for the icon.

## 4.2 — Filter pill (24px small)

**Rationale:** Figma's Filter (`7383:28570`) is a 24px-tall applied-filter chip with a built-in xmark. Code merges this concept into Chip.

**File:** `packages/orbit/src/indicators/Filter.tsx` (new)

```tsx
export interface FilterProps {
  label: string;
  onRemove?: () => void;
  state?: 'Default' | 'Hover';
}
```

Style: bg `#fafafa` (default) / `#f1f5f9` (hover), border 1px `#8594a9`, radius 16px, height 24px, padding `2px 8px`, gap 4px, label 12px, trailing xmark 8px in `#475569`.

> Alternative: extend existing Chip with a `removable: true` mode and `size: 'Small'`. Pick the cleaner architecture.

## 4.3 — MultiStateIconButton

**Rationale:** Figma has a combined "icon-only multi-state" pattern (`7383:12900`). Code has IconButton + MultiStateButton separately.

**Approach:** Extend `MultiStateGroup` to render `MultiStateButton` children that take an `iconOnly` prop. Or add a `MultiStateIconButton` sibling that mirrors `MultiStateButton` but renders only the icon.

**Spec:** Big variant 64×64 (32px outer + 16px padding); Medium 32×32 (16px outer + 8px padding). Selected/Hover/Default states match MultiStateButton.

> Lower priority — implement only if a prototype actually needs it.

## 4.4 — Description editor (rich text)

**Rationale:** Figma's Description box (`7383:31602`) is a Quill-style rich-text editor with toolbar + body + resize footer.

**Implementation:** Out-of-scope as a from-scratch build (would require Lexical, ProseMirror, or Quill integration). **Recommend deferring** unless a prototype actually needs rich text editing.

**If needed:** consider integrating `@lexical/react` or `react-quill` and wrap with orbit-themed styling.

---

# PHASE 5 — Table enhancements

## 5.1 — Page-number pagination

**Rationale:** Figma's Table includes page-number pagination (1, 2, 3, 4) with range label "1 to 10 of 37 items".

**File:** `packages/orbit/src/layout/Table.tsx`

Add pagination support to TableProps:

```tsx
export interface TableProps<T> {
  // ... existing
  pagination?: {
    pageSize: number;
    page: number;
    totalRows: number;
    onPageChange: (page: number) => void;
  };
}
```

Render below the `<table>` when `pagination` is provided. New `<TablePagination>` sub-component:
- Range label: `"{start} to {end} of {total} items"`, Inter Semi Bold 14/24 + Inter Regular 14/24 secondary `#475569`
- Numbered buttons: px 16 / py 8, border 1px `#8594a9`, radius 4, label Inter Medium 14/24
- Prev/Next chevrons: 16px icons in 32×32 buttons, border 1px `#8594a9`, radius 4 on outer corners

## 5.2 — Sortable header icons

**Rationale:** Figma's CellItem header includes sort + info-circle icons.

Update `TableColumn<T>`:
```tsx
export interface TableColumn<T> {
  // ... existing
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc';
  info?: string; // tooltip text for info-circle
  onSortChange?: (direction: 'asc' | 'desc') => void;
}
```

Render sort icon (`` arrow-up-down, `` up, `` down) and info-circle (``) when `sortable`/`info` provided.

---

# PHASE 6 — Banner Sofia Pro typography

**Rationale:** Figma's Banner (`7383:28287`) uses Sofia Pro Bold/Regular for title/description; code likely uses Inter.

**File:** `packages/orbit/src/feedback/Banner.module.css` (or wherever Banner styles live)

Find `.title` and `.description`. If they use `var(--orbit-font-family-sans)` (Inter), change to `var(--orbit-font-family-brand)` (Sofia Pro per `typography.css`).

> **Verify with design** that Sofia Pro is the intent — the Figma rendering shows it, but Sofia Pro is loaded only via license. Confirm before rolling out.

---

# PHASE 7 — Tests + barrels + smoke

## 7.1 — Update barrel exports

For every new component (Radio, RadioGroup, StepCircle, MultiSelectDropdown, FileItem, Filter, AvatarStack):

- Add to category `index.ts`
- Add to `packages/orbit/src/index.ts` if not already covered by `export *`

## 7.2 — Smoke test

**File:** `packages/orbit/src/Smoke.test.tsx`

Add render checks for all new components in the `<div>` smoke render. Pattern:

```tsx
<Radio name="x" value="a" checked={false} onChange={() => {}} label="Radio smoke" />
<StepCircle status="Checked" size="Large" />
<FileItem filename="file.pdf" documentType="PDF" />
<Filter label="Filter smoke" />
<AvatarStack avatars={[{ name: 'A' }, { name: 'B' }]} />
```

## 7.3 — Per-component tests

Each new component gets a `*.test.tsx` covering:
- Renders with required props
- Behavioral (controlled change for inputs, click for actions)
- Accessibility (correct role, aria-label)
- Keyboard (where applicable: arrow keys for RadioGroup, etc.)

---

# 8. Out of scope (explicit deferrals)

These items were flagged in the audit but deliberately not in this plan. Each requires more design input or is too large for an "alignment" pass.

1. **Description rich-text editor** — needs library selection (Lexical/ProseMirror/Quill) + design discussion on toolbar feature set.
2. **Brand logotypes (efficio, connectedPlatform, eflow, datavis, SpendLogo)** — these are SVG assets, not React components. Add to a separate `@efficio/orbit-assets` workflow or deliver as static SVGs.
3. **Country flags (~250 SVGs)** — code's CountryFlag uses regional indicator emoji which is sufficient for most cases. SVG-asset version is only needed for emoji-incompatible browsers.
4. **Decorative glyph sets** — design assets, not components.
5. **All ~1000 Font Awesome 6 icon variants** — handled by `FaIcon` already; no per-glyph audit needed.
6. **Animation/transition specs** — Figma doesn't expose CSS transitions.
7. **Internal Figma inconsistencies** (§10) — flag with the design team; Codex picks the resolved-variable side per default rule.
8. **Default-theme alignment** — orbit theme is the "Theme - Orbit" canvas; default theme is a separate audit.
9. **Compact density on Default Chip** — keep current 32px height for now; revisit if a prototype needs the tighter Figma form.
10. **Code-only conveniences (`Outline` chip variant, `Mute` toast type, `Icon` avatar style)** — keep for back-compat; deprecate in a later pass if unused.

---

# 9. Apply order (mandatory)

**Phase 1 must complete first** — token changes ripple. Sub-phases inside each phase are independent.

1. Phase 1.1 — `card-border-default` revert
2. Phase 1.2 — Heading weights H2-H5
3. Phase 1.3 — Status-high colors
4. Phase 1.4 — Tertiary FG ⚠️ (verify nothing relies on the purple before applying)
5. Phase 1.5 — Border-error explicit override
6. Phase 1.6 — TextArea height
7. Phase 1.7 — Badge radius/min-width
8. Phase 1.8 — Badge color set
9. Phase 2.1 — Radio + RadioGroup
10. Phase 2.2 — StepCircle
11. Phase 3.1 — Tooltip directions
12. Phase 3.2 — Toast variants
13. Phase 3.3 — MultiSelectDropdown
14. Phase 3.4 — Avatar Square + Stack
15. Phase 3.5 — Chip Default height freedom
16. Phase 4.1 — FileItem (optional)
17. Phase 4.2 — Filter pill (optional)
18. Phase 4.3 — MultiStateIconButton (defer unless needed)
19. Phase 4.4 — Description editor (DEFERRED)
20. Phase 5.1 — Table page-number pagination
21. Phase 5.2 — Sortable headers
22. Phase 6 — Banner Sofia Pro
23. Phase 7 — Tests + barrels

Run `npm run typecheck:orbit && npm run test:components` after each phase.

---

# 10. Internal Figma inconsistencies (flag for design team)

These are unresolved within the Figma file itself. Codex should default to the resolved variable; raise these with design before changing code:

| Property | Variable resolves to | Inline literal | Default action |
|---|---|---|---|
| `Border/color-focused` | `#4ade80` | `#00bd9e` | Trust variable; verify with design |
| `Toast Information bg` | `#7ea6fd` | `#0073cf` | Pick one; current code `#155dfc` is neither |
| `Toast Warning bg` | `#ffae2f` | `#f0ab00` | Trust variable |
| `Toast Error bg` | `#cd0030` | `#e00034` | Trust variable (matches text-error) |
| `Banner Info bg` | `#eaf0ff` | `#e5f1fa` | Trust variable |
| `Banner Warning fg` | `#f26d07` | `#f0ab00` | Trust variable |
| `Pagination border` | `#8594a9` | `#ccc` | Trust variable |
| `Multi-select placeholder` | (no var) | `#999999` | Inconsistent with single-select `#475569`; flag |
| `Date input icon color` | (no var) | `#040921` | Inconsistent with search/dropdown trailing icon `#475569`; flag |
| `Overlay scrim "Chambray"` | `#cd0030` | `#40548f` | **Figma variable bug — Chambray should be navy. Trust the literal.** |

---

# 11. Verification

```bash
# from repo root
npm run typecheck:orbit
npm run test:components
npm run build:orbit

# Visual: walk every component and verify against Figma reference
npm run dev:docs
# → open http://localhost:3000 (or whichever port Next picks)

# Phase-by-phase visual checks
# Phase 1: Cards have lighter slate-200 borders (not slate-300)
#          Headings H2-H5 are visibly heavier (700 not 600)
#          Tertiary buttons render in slate-grey (not purple)
#          Badges are slightly-rounded rectangles, content-sized
# Phase 2: Radio + StepCircle render in component catalog
# Phase 3: Tooltips support all 12 anchor positions
#          Toast supports action buttons (Discard/Save)
#          MultiSelect renders chip array in trigger
#          Avatar.Square renders 4px corners
# Phase 5: Table renders page numbers + sort icons
```

For Figma-MCP-equipped sessions, re-pull screenshots for any disputed component:
```
get_screenshot(fileKey="5RUsy0uKtFarK7nO8Y3nLL", nodeId="<node>", maxDimension=2048)
```

---

# 12. Severity rollup

| Phase | Items | Severity |
|---|:-:|:-:|
| Phase 1 — Tokens | 8 | 🔴 critical (cross-cutting) |
| Phase 2 — New core components | 2 | 🔴 critical |
| Phase 3 — Component extensions | 5 | 🟠 major |
| Phase 4 — Optional new components | 4 | 🟠 major |
| Phase 5 — Table enhancements | 2 | 🟡 minor |
| Phase 6 — Banner typography | 1 | 🟡 minor |
| Phase 7 — Tests + barrels | per component | (mandatory after each new component) |

**Total:** ~25 actionable items across 7 phases.

---

# 13. Things this plan deliberately doesn't change

To prevent feature creep, **do NOT touch the following without a separate plan**:

- **SideNav** — its alignment/styling lives in the ClauseIQ-area work; not in scope here.
- **PageHeader** — same.
- **Spinner** — no Figma reference; current implementation is fine.
- **ToolNextStepsCard** — composed component with prototype-specific styling; out of scope.
- **Default theme tokens** — only orbit theme is being aligned here.
- **Existing button hover states** — if a hover state isn't broken, leave it. This plan only adds Tertiary FG color drift fix.

End of plan.

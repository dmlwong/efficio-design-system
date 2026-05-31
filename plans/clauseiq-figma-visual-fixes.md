# ClauseIQ — Figma visual-fidelity follow-up plan

> **For the implementing agent (Codex / Claude / etc.):** This plan is fully self-contained. It addresses the visual-fidelity issues that survived the structural plan in [`clauseiq-figma-audit-fixes.md`](./clauseiq-figma-audit-fixes.md). Read top to bottom, apply in order, and run §6 verification before declaring done.

## 1. Source of truth

- **Figma file:** `XTJzVcF3yk0nBVFsBZaHoL` (`Sprint-75: ClauseIQ`)
- **Six frames** (one per flow state):

| State | Figma node |
|---|---|
| Welcome | `19252:84609` |
| Select Initiative | `19252:84763` |
| Contract Analysis Parameters | `19252:85267` |
| Upload Contract | `19252:85094` |
| Processing | `19252:85549` |
| Results | `19252:85632` |

- **Theme:** prototype is wrapped in `data-theme="orbit"` via `OrbitAppShell`. All token values below assume orbit theme unless noted.
- **What's already done:** the structural plan landed (state machine, parameter cards, button restructure, severity tones, header subtitle, status row dims, etc.). All 67 tests pass. **This plan only addresses what shows up wrong on screen at render time.**

## 2. Files touched

| File | Phase |
|---|:-:|
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx` | 1, 4, (5) |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css` | 2 |
| `packages/orbit/src/tool/ToolNextStepsCard.tsx` | 3 |
| `packages/orbit/src/tool/ToolNextStepsCard.module.css` | 3 |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx` | 4 |

## 3. Acceptance criteria

```bash
npm run typecheck:orbit         # passes
npm run test:components         # all 67 tests pass (no decrease)
npm run build:orbit             # passes
```

Visual: render http://localhost:4217/clauseiq, walk through every state, and compare each one to its Figma frame. The 4 critical visual issues below should be closed; the 2 minor items are noted as optional.

---

# PHASE 1 — Welcome heading size + weight (V1)

**Problem:** The "ClauseIQ" title in the Welcome card renders at **36px / weight 800** (Heading 1 token). Figma renders it at **26px / weight 600** (Heading 3 token, Inter Semi Bold). The current rendering is visibly larger and heavier than the design.

**Verified by:** `preview_inspect` returns `font-size: 36px, font-weight: 800` on the welcome `h1`. Figma's `get_variable_defs` for frame `19252:84609` lists `"heading-3":"26"` (with no `heading-1` token) — the design uses Heading 3 for this title.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

`old_string` (inside the `WelcomeCard` component, around line 122–128):
```tsx
function WelcomeCard({ started, onStart, cardRef }: { started: boolean; onStart: () => void; cardRef?: (node: HTMLDivElement | null) => void }) {
  return (
    <FlowCard mode="default" cardRef={cardRef}>
      <div className={styles.welcomeTitleRow}>
        <ClauseIQIconTile />
        <Headings size="Heading 1">ClauseIQ</Headings>
      </div>
```

`new_string`:
```tsx
function WelcomeCard({ started, onStart, cardRef }: { started: boolean; onStart: () => void; cardRef?: (node: HTMLDivElement | null) => void }) {
  return (
    <FlowCard mode="default" cardRef={cardRef}>
      <div className={styles.welcomeTitleRow}>
        <ClauseIQIconTile />
        <Headings size="Heading 3">ClauseIQ</Headings>
      </div>
```

> The `Headings` component supports `'Heading 3'` (renders `<h3>` at 26px / 600). No other change is needed.

---

# PHASE 2 — Icon tile gradient (V2)

**Problem:** The Welcome-card icon tile uses a "gradient" whose two stops resolve to the same color in orbit theme:
- `--orbit-color-card-border-highlight` = `#615fff`
- `--orbit-color-btn-tertiary-fg` = `#615fff`

The result is a flat purple square, not a gradient. Figma shows a clearly visible top-light → bottom-dark gradient.

**Verified by:** `preview_inspect` returns `background-image: linear-gradient(rgb(97, 95, 255), rgb(97, 95, 255))`.

**Fix:** swap to two distinct gradient stops. The cleanest reuse is the SideNav logo's gradient tokens — those were designed for exactly this kind of small branded icon tile and have appropriate light/dark stops in orbit theme (`#5b8efd` → `#1252de`).

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css`

`old_string` (around line 69–80):
```css
.iconTile {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: linear-gradient(to bottom, var(--orbit-color-card-border-highlight), var(--orbit-color-btn-tertiary-fg));
  flex: 0 0 48px;
  overflow: hidden;
}
```

`new_string`:
```css
.iconTile {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: linear-gradient(
    to bottom,
    var(--orbit-color-sidenav-gradient-from),
    var(--orbit-color-sidenav-gradient-to)
  );
  flex: 0 0 48px;
  overflow: hidden;
}
```

> `--orbit-color-sidenav-gradient-from/to` resolve to `#5b8efd` / `#1252de` in orbit theme (and `#147ed3` / `#2a75b1` in default theme — both real gradients in either case).

---

# PHASE 3 — ToolNextStepsCard divider + per-row chevron (V3)

**Problem:** Figma's "Next, you can…" card on the Results state has structural per-row variation that the current component can't express:

| Row | Figma | Current code |
|---|---|---|
| 1 — Analyse Contract on Another Initiative | chevron `opacity: 0` (hidden) + horizontal divider after | chevron-right visible |
| 2 — Update Milestone | **chevron-up visible** (suggests "expanded" state) | chevron-right visible |
| 3 — Complete Initiative | chevron `opacity: 0` (hidden) | chevron-right visible |

There's also a **divider line between row 1 and rows 2–3** that the code doesn't render.

**Fix shape:** extend `ToolNextStepAction` with three optional flags that any consumer can use; update `DEFAULT_ACTIONS` to use them so the out-of-the-box render matches Figma. This keeps the API broad enough to support other use cases.

### 3.1 — Extend the `ToolNextStepAction` type and `DEFAULT_ACTIONS`

**File:** `packages/orbit/src/tool/ToolNextStepsCard.tsx`

`old_string` (the type definition around line 8–16):
```ts
export interface ToolNextStepAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

`new_string`:
```ts
export interface ToolNextStepAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Render a horizontal divider line below this row. Used to visually group rows. */
  dividerAfter?: boolean;
  /** When true, the trailing chevron is hidden (visibility: hidden) — layout is preserved. */
  hideChevron?: boolean;
  /** When true, the trailing chevron points up instead of right (signals an "expanded" row). */
  expanded?: boolean;
}
```

Then update `DEFAULT_ACTIONS` (around line 24–43):

`old_string`:
```ts
const DEFAULT_ACTIONS: ToolNextStepAction[] = [
  {
    id: 'analyse-another-initiative',
    icon: '',
    title: 'Analyse Contract on Another Initiative',
    description: 'Start fresh with a new initiative.',
  },
  {
    id: 'update-milestone',
    icon: '',
    title: 'Update Milestone',
    description: 'Track your initiative progress.',
  },
  {
    id: 'complete-initiative',
    icon: '',
    title: 'Complete Initiative',
    description: 'Mark this initiative as complete.',
  },
];
```

`new_string`:
```ts
const DEFAULT_ACTIONS: ToolNextStepAction[] = [
  {
    id: 'analyse-another-initiative',
    icon: '',
    title: 'Analyse Contract on Another Initiative',
    description: 'Start fresh with a new initiative.',
    hideChevron: true,
    dividerAfter: true,
  },
  {
    id: 'update-milestone',
    icon: '',
    title: 'Update Milestone',
    description: 'Track your initiative progress.',
    expanded: true,
  },
  {
    id: 'complete-initiative',
    icon: '',
    title: 'Complete Initiative',
    description: 'Mark this initiative as complete.',
    hideChevron: true,
  },
];
```

### 3.2 — Update `ActionContent` and the rendering loop

**File:** `packages/orbit/src/tool/ToolNextStepsCard.tsx`

The `FA` import already includes `chevronRight`. Add a chevron-up unicode constant near the top of the file (just above `DEFAULT_ACTIONS`):

```ts
const CHEVRON_UP_GLYPH = ''; // FA Pro Regular: chevron-up
```

Then update `ActionContent` (around line 45–64) to take the row's chevron flags:

`old_string`:
```ts
function ActionContent({ action }: { action: ToolNextStepAction }) {
  return (
    <>
      <span className={styles.actionContent}>
        <span className={styles.iconBox} aria-hidden="true">
          <FaIcon icon={action.icon} size={18} color="var(--orbit-color-btn-tertiary-fg)" />
        </span>
        <span className={styles.copy}>
          <Text as="span" size="Paragraph" variant="Bold">
            {action.title}
          </Text>
          <Text as="span" size="Small" variant="Secondary">
            {action.description}
          </Text>
        </span>
      </span>
      <FaIcon icon={FA.chevronRight} size={14} color="var(--orbit-color-text-secondary)" />
    </>
  );
}
```

`new_string`:
```ts
function ActionContent({ action }: { action: ToolNextStepAction }) {
  const chevronGlyph = action.expanded ? CHEVRON_UP_GLYPH : FA.chevronRight;
  return (
    <>
      <span className={styles.actionContent}>
        <span className={styles.iconBox} aria-hidden="true">
          <FaIcon icon={action.icon} size={18} color="var(--orbit-color-btn-tertiary-fg)" />
        </span>
        <span className={styles.copy}>
          <Text as="span" size="Paragraph" variant="Bold">
            {action.title}
          </Text>
          <Text as="span" size="Small" variant="Secondary">
            {action.description}
          </Text>
        </span>
      </span>
      <span
        className={styles.chevron}
        style={action.hideChevron ? { visibility: 'hidden' } : undefined}
        aria-hidden={action.hideChevron || undefined}
      >
        <FaIcon icon={chevronGlyph} size={14} color="var(--orbit-color-text-secondary)" />
      </span>
    </>
  );
}
```

### 3.3 — Render the divider in the actions list

Find the `ToolNextStepsCard` rendering (around line 66–106). The current loop is:

`old_string`:
```tsx
        <div className={styles.actions}>
          {actions.map((action) => (
            action.href && !action.disabled ? (
              <a
                key={action.id}
                href={action.href}
                className={styles.action}
                aria-label={action.ariaLabel}
                onClick={() => onActionSelect?.(action.id)}
              >
                <ActionContent action={action} />
              </a>
            ) : (
              <button
                key={action.id}
                type="button"
                className={styles.action}
                disabled={action.disabled}
                aria-label={action.ariaLabel}
                onClick={() => {
                  if (!action.disabled) onActionSelect?.(action.id);
                }}
              >
                <ActionContent action={action} />
              </button>
            )
          ))}
        </div>
```

`new_string`:
```tsx
        <div className={styles.actions}>
          {actions.map((action) => {
            const node = action.href && !action.disabled ? (
              <a
                key={action.id}
                href={action.href}
                className={styles.action}
                aria-label={action.ariaLabel}
                onClick={() => onActionSelect?.(action.id)}
              >
                <ActionContent action={action} />
              </a>
            ) : (
              <button
                key={action.id}
                type="button"
                className={styles.action}
                disabled={action.disabled}
                aria-label={action.ariaLabel}
                onClick={() => {
                  if (!action.disabled) onActionSelect?.(action.id);
                }}
              >
                <ActionContent action={action} />
              </button>
            );
            return action.dividerAfter ? (
              <React.Fragment key={action.id}>
                {node}
                <hr aria-hidden="true" className={styles.divider} />
              </React.Fragment>
            ) : node;
          })}
        </div>
```

> `React` is already imported at the top of the file. If not, add `import React from 'react';`.

### 3.4 — Add divider + chevron styles

**File:** `packages/orbit/src/tool/ToolNextStepsCard.module.css`

Append at the bottom:

```css
.divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: 1px solid var(--orbit-color-card-border-default);
}

.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

> The existing `.action` row's flexbox layout will treat the `<hr>` as a full-width row inside `.actions` (which is column-oriented). No further layout adjustment needed.

---

# PHASE 4 — "Selected" affordance on locked Initiative + Parameters cards (V4)

**Problem:** On the Results state, Figma shows the locked Initiative-Selected card with a "Selected" chip-style label on the right where the Edit button would normally sit. Code currently renders nothing on the right when `mode === 'disabled'`.

The same pattern applies to `ParametersSelectedCard` for symmetry.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

### 4.1 — Initiative Selected card

`old_string` (the rendering inside `InitiativeSelectedCard`, around line 186–202):
```tsx
  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Initiative Selected</Headings>
      <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
        <div className={styles.row}>
          <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-primary)'} />
          <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{initiative.name}</Text>
        </div>
        {!disabled && (
          <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
            Edit
          </Button>
        )}
      </div>
    </FlowCard>
  );
}
```

`new_string`:
```tsx
  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Initiative Selected</Headings>
      <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
        <div className={styles.row}>
          <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-primary)'} />
          <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{initiative.name}</Text>
        </div>
        {disabled ? (
          <Chip variant="Outline" size="Mini" label="Selected" />
        ) : (
          <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
            Edit
          </Button>
        )}
      </div>
    </FlowCard>
  );
}
```

### 4.2 — Parameters Selected card

`old_string` (the rendering inside `ParametersSelectedCard`, around line 258–273):
```tsx
  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Contract Analysis Parameters</Headings>
      <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
        <div className={styles.row}>
          <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-success)'} />
          <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{parameter.label}</Text>
        </div>
        {!disabled && (
          <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
            Change {parameter.kind}
          </Button>
        )}
      </div>
    </FlowCard>
  );
}
```

`new_string`:
```tsx
  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Contract Analysis Parameters</Headings>
      <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
        <div className={styles.row}>
          <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-success)'} />
          <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{parameter.label}</Text>
        </div>
        {disabled ? (
          <Chip variant="Outline" size="Mini" label="Selected" />
        ) : (
          <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
            Change {parameter.kind}
          </Button>
        )}
      </div>
    </FlowCard>
  );
}
```

> `Chip` is already imported from `@efficio/orbit` at the top of the file. No new imports needed.

### 4.3 — Update the test that verifies "no Edit button" on Results

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx`

Find the assertion that checks no "edit" button appears on Results (around line 220). Currently:

```tsx
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
```

This should still pass (the `<Chip>` doesn't render as a button). But add an assertion that the "Selected" chip *is* present, in the same test (right after the existing line):

```tsx
    expect(screen.getAllByText(/^Selected$/i).length).toBeGreaterThanOrEqual(1);
```

Or, more specific (since both cards now render the chip):

```tsx
    expect(screen.getAllByText('Selected')).toHaveLength(2);
```

Pick whichever is more idiomatic in the existing test style.

---

# PHASE 5 (OPTIONAL) — Strict Figma parity for Results state (V6)

Figma frame 6 doesn't render the Parameters card on the Results state. The code currently keeps it visible (locked) for context. This is a judgment call — keeping it is more informative; removing it matches Figma exactly.

**Apply only if you want strict Figma parity.** Otherwise skip this phase.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

`old_string` (around line 558–565):
```tsx
          {state.selectedParameter && (state.step === 'upload-contract' || state.step === 'processing' || state.step === 'results') && (
            <ParametersSelectedCard
              parameter={state.selectedParameter}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_PARAMETER' })}
              cardRef={setCardRef('parameters-selected')}
            />
          )}
```

`new_string`:
```tsx
          {state.selectedParameter && (state.step === 'upload-contract' || state.step === 'processing') && (
            <ParametersSelectedCard
              parameter={state.selectedParameter}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_PARAMETER' })}
              cardRef={setCardRef('parameters-selected')}
            />
          )}
```

> If you apply this, also update the Phase 4 test assertion: `getAllByText('Selected')` should now have length **1** (only Initiative Selected card on Results), not 2. And the smoke test at [test.tsx:181-225](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx:181) that asserts `'Procurement_Playbook_Yorkshire_Water .pdf'` may need adjustment if it was asserting on Results (it isn't currently, but verify).

---

# 6. Apply order

Within each phase, the changes are independent. Across phases:

1. **Phase 1** — Welcome heading (1 prop change)
2. **Phase 2** — Icon tile gradient (1 CSS change)
3. **Phase 3** — ToolNextStepsCard API + behavior (4 sub-tasks: 3.1 → 3.2 → 3.3 → 3.4)
4. **Phase 4** — Selected affordance (3 sub-tasks: 4.1 → 4.2 → 4.3)
5. **(Optional)** **Phase 5** — Strict Results parity

Run `npm run typecheck:orbit && npm run test:components` after each phase.

---

# 7. Verification

```bash
# from repo root
npm run typecheck:orbit
npm run test:components
npm run build:orbit

# Visual: walk the flow and verify each fix
npm run dev:prototypes
# → http://localhost:4217/clauseiq

# Welcome (Figma frame 19252:84609)
#   ✓ "ClauseIQ" title is 26px / weight 600 (Phase 1)
#   ✓ Icon tile shows a real top-light → bottom-dark gradient (Phase 2)

# Click "Get Started" → "Search Initiatives" → first row → "Playbook"
# Drop a PDF, wait 10s for processing → land on Results

# Results (Figma frame 19252:85632)
#   ✓ Initiative Selected card shows a "Selected" chip on the right (Phase 4)
#   ✓ Parameters Selected card shows a "Selected" chip on the right (Phase 4) — unless Phase 5 was applied
#   ✓ "Next, you can…" card:
#       - row 1 chevron is hidden, divider line below row 1 (Phase 3)
#       - row 2 has a chevron-UP (Phase 3)
#       - row 3 chevron is hidden (Phase 3)
```

If you have Figma MCP access, re-pull the screenshot for any frame and overlay against the rendered prototype:

```
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85632", maxDimension=2048)
```

# 8. Diff summary

| # | Severity | Region | Fix complexity |
|:-:|:-:|---|---|
| V1 | 🔴 visible | Welcome card heading size/weight | 1 prop change |
| V2 | 🔴 visible | Welcome card icon tile gradient | 2-line CSS swap |
| V3 | 🔴 visible | NextStepsCard divider + per-row chevron | 4 sub-tasks across 2 files (lib API addition) |
| V4 | 🟠 visible | "Selected" chip on locked Initiative/Parameters cards | 2 ternary swaps + 1 test assertion |
| V5 | 🟡 minor | PageHeader 3px shorter than Figma | not in scope (cosmetic) |
| V6 | 🟡 judgment | Hide Parameters card on Results | optional Phase 5 |

End of plan.

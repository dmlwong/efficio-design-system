# ClauseIQ — Figma final-alignment plan

> **For the implementing agent (Codex / Claude / etc.):** This plan is fully self-contained. It addresses the visual-fidelity issues that survived the prior plans ([structural](./clauseiq-figma-audit-fixes.md), [visual](./clauseiq-figma-visual-fixes.md)). Read top to bottom, apply in order, then run §7 verification before declaring done.
>
> Some of these fixes **revert** parts of the previous "Visual" plan (specifically V4's "Selected" chip) — Figma actually shows the locked cards with no right-side affordance at all. The chip introduced by V4 was an over-correction.

## 1. Source of truth

- **Figma file:** `XTJzVcF3yk0nBVFsBZaHoL` (`Sprint-75: ClauseIQ`)
- **Six frames, one per flow state.** Behaviors per state, distilled directly from Figma frame metadata:

| State | Figma node | Card list (top→bottom) | Initiative Selected affordance | Parameters Selected affordance |
|---|---|---|---|---|
| Welcome | `19252:84609` | Welcome | (n/a — not shown) | (n/a) |
| Select Initiative | `19252:84763` | Welcome + Select Initiative | (n/a) | (n/a) |
| Select Parameters | `19252:85267` | Welcome + Initiative Selected + Parameters (active w/ 3 buckets) | **Edit** button | (n/a) |
| Upload Contract | `19252:85094` | Welcome + Initiative Selected + Parameters Selected + Upload Contract | **Edit** button | **Change Playbook** button |
| Processing | `19252:85549` | Welcome + Initiative Selected + Analysing | **none** (just check + name) | **NOT RENDERED** |
| Results | `19252:85632` | Welcome + Initiative Selected (compact heading-only, **58 px** tall) + Analysis Result + Next, you can… | **N/A — heading only** | **NOT RENDERED** |

- **Theme:** `data-theme="orbit"` is applied via `OrbitAppShell`.
- **What's already correct from prior plans:** state machine (6 steps), parameter selection, button restructure, severity tones, header subtitle, status row dims, "Welcome" heading size, icon tile gradient, NextStepsCard divider+chevron, etc.
- **What this plan does:** closes the cross-component **header alignment** bug, fixes the **conditional rendering** mistakes for Parameters card, **collapses** the Initiative Selected card on Results, and **removes** the wrongly-added "Selected" chip from locked cards.

## 2. Files touched

| File | Phase |
|---|:-:|
| `packages/orbit/src/navigation/SideNav.module.css` | 1 |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx` | 2, 3, 4 |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx` | 5 |

## 3. Acceptance criteria

```bash
npm run typecheck:orbit         # passes
npm run test:components         # all tests pass (count may decrease by 0–1 depending on test edits)
npm run build:orbit             # passes
```

Visual: render http://localhost:4217/clauseiq, walk through every state, and compare each one to its Figma frame. The 4 critical issues below should all be closed.

---

# PHASE 1 — Header bottom-edge alignment (H1)

**Problem:** The SideNav's app/client header bottom (`y=89`) sits 23 pixels below the PageHeader's bottom border (`y=66`). The two horizontal divider lines at the top of each pane should align (or at least be much closer). Inspecting the live render shows the SideNav header is **69 px tall**; Figma's design context for node `19252:85778` gives **53 px**.

**Root cause:** `.product` (the container holding "Efficio Orbit" + "Yorkshire Water" stacked vertically inside the SideNav header) has no height constraint, and both children use `line-height: var(--orbit-leading-relaxed)` (= 1.714, which works out to 24 px per child). Result: `.product` is 48 px tall in code (24+24).

In Figma's design context that container is constrained to `h-[32px]`, with each text child at `h-[14px]`. Constraining `.product` to 32 px and tightening the children's line-heights brings the SideNav header to 53 px (matching Figma's 32 + 20 padding-bottom + 1 px border).

**File:** `packages/orbit/src/navigation/SideNav.module.css`

### 1.1 — Constrain `.product` height

`old_string`:
```css
.product {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
```

`new_string`:
```css
.product {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  height: var(--orbit-space-xl); /* 32px — Figma constrains the title/client column to align with the 32×32 logo */
}
```

### 1.2 — Tighten `.appName` line-height

`old_string`:
```css
.appName {
  color: var(--orbit-color-white);
  font-size: var(--sidenav-row-font-size);
  font-weight: var(--orbit-sidenav-app-name-font-weight);
  line-height: var(--sidenav-row-line-height);
}
```

`new_string`:
```css
.appName {
  color: var(--orbit-color-white);
  font-size: var(--sidenav-row-font-size);
  font-weight: var(--orbit-sidenav-app-name-font-weight);
  line-height: 1; /* Figma renders at h-[14px]; relaxed leading (24) bloats the .product container */
}
```

### 1.3 — Tighten `.clientName` line-height

`old_string`:
```css
.clientName {
  display: flex;
  align-items: center;
  min-width: 0;
  color: var(--orbit-color-sidenav-muted);
  font-size: var(--sidenav-row-font-size);
  line-height: var(--sidenav-row-line-height);
}
```

`new_string`:
```css
.clientName {
  display: flex;
  align-items: center;
  min-width: 0;
  color: var(--orbit-color-sidenav-muted);
  font-size: var(--sidenav-row-font-size);
  line-height: 1; /* Figma renders at h-[14px] */
}
```

### Expected result after Phase 1

- `.product` height: 32 px
- SideNav header content: max(logo 32, .product 32) = 32
- SideNav header total: 32 + 20 px padding-bottom + 1 px border = **53 px**
- SideNav header bottom: 20 (sidenav padding-top) + 53 = **y=73**
- PageHeader bottom: still **y=66**
- Residual gap: **7 px** (matches Figma's design — the PageHeader is 69 px in Figma, sidenav header bottom at 73 px, ≈4 px design-intent offset)

> **If you want the two bottoms to be perfectly flush** (i.e., exactly the same y), bump PageHeader to 73 px by adjusting its padding in [`packages/orbit/src/navigation/PageHeader.module.css`](../packages/orbit/src/navigation/PageHeader.module.css). This affects every other prototype that uses PageHeader, so weigh the cross-cutting risk. **Out of scope for this plan unless explicitly requested.**

---

# PHASE 2 — Remove Parameters card from Processing AND Results states (H2)

**Problem:** Figma frames 5 (Processing) and 6 (Results) don't include the "Contract Analysis Parameters" card at all. Our code currently keeps it visible (locked) on both.

**Verified by:**
- Figma frame `19252:85549` (Processing) child list: Welcome card, Initiative Selected card, Analysing card. No Parameters card.
- Figma frame `19252:85632` (Results) child list: Welcome, Initiative Selected, Analysis Result, Next-you-can. No Parameters card.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

Find the `ParametersSelectedCard` rendering block (around line 562). Remove `'processing'` and `'results'` from the conditional.

`old_string`:
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
          {state.selectedParameter && state.step === 'upload-contract' && (
            <ParametersSelectedCard
              parameter={state.selectedParameter}
              mode="default"
              onEdit={() => dispatch({ type: 'EDIT_PARAMETER' })}
              cardRef={setCardRef('parameters-selected')}
            />
          )}
```

> Once the Parameters card only renders during `upload-contract`, the `disabled` mode it took during processing/results is dead. Hard-coding `mode="default"` is correct.

> The `ParametersSelectedCard` component itself can stay — it still gets used during `upload-contract`. Don't delete it.

---

# PHASE 3 — Compact Initiative Selected card on Results (H3)

**Problem:** On the Results state, Figma's Initiative Selected card is **58 px tall** — heading only, no selection row, no Edit, no chip. Our code renders the full ~108 px card with the row visible.

**Verified by:**
- Figma frame `19252:85632` metadata: `<instance id="19252:85706" name="Card" x="0" y="330" width="640" height="58.452186584472656" />`
- Direct screenshot of node `19252:85706`: shows literally just the heading "Initiative Selected" inside a white card with thin border. No row visible (the underlying button content is clipped by the 58 px container's `overflow-clip`).

**Fix shape:** introduce a `compact` prop on `InitiativeSelectedCard` that renders the heading and nothing else. Use it on the Results state.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

### 3.1 — Update `InitiativeSelectedCard` to support compact mode

Find the component definition (around line 173–204).

`old_string`:
```tsx
function InitiativeSelectedCard({
  initiative,
  mode,
  onEdit,
  cardRef,
}: {
  initiative: ClauseIQInitiative;
  mode: ClauseIQCardMode;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

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

`new_string`:
```tsx
function InitiativeSelectedCard({
  initiative,
  mode,
  compact = false,
  onEdit,
  cardRef,
}: {
  initiative: ClauseIQInitiative;
  mode: ClauseIQCardMode;
  /** Render heading-only (no selection row). Used on the Results state per Figma frame 19252:85706 (58px tall). */
  compact?: boolean;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Initiative Selected</Headings>
      {!compact && (
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
      )}
    </FlowCard>
  );
}
```

> Two changes vs the previous version: (a) added `compact` prop that hides the entire selection row, (b) **removed the "Selected" chip from the disabled branch** (see Phase 4 for rationale).

### 3.2 — Pass `compact` on Results state

Find the rendering site (around line 540–547):

`old_string`:
```tsx
          {state.selectedInitiative && state.step !== 'welcome' && (
            <InitiativeSelectedCard
              initiative={state.selectedInitiative}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_INITIATIVE' })}
              cardRef={setCardRef('initiative-selected')}
            />
          )}
```

`new_string`:
```tsx
          {state.selectedInitiative && state.step !== 'welcome' && (
            <InitiativeSelectedCard
              initiative={state.selectedInitiative}
              mode={initiativeLocked ? 'disabled' : 'default'}
              compact={state.step === 'results'}
              onEdit={() => dispatch({ type: 'EDIT_INITIATIVE' })}
              cardRef={setCardRef('initiative-selected')}
            />
          )}
```

---

# PHASE 4 — Remove the "Selected" chip from `ParametersSelectedCard` (H4)

**Problem:** The previous "visual" plan added a `<Chip variant="Outline" size="Mini" label="Selected" />` on the right side of locked Initiative-Selected and Parameters-Selected cards. **Figma shows no such affordance anywhere.** Locked rows just show the check icon + name on the left, with no right-side element.

For `InitiativeSelectedCard`, Phase 3.1 above already removed the chip when modifying that component. The same fix needs to be applied to `ParametersSelectedCard`.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

Find the `ParametersSelectedCard` component (around line 247–278).

`old_string`:
```tsx
function ParametersSelectedCard({
  parameter,
  mode,
  onEdit,
  cardRef,
}: {
  parameter: ClauseIQSelectedParameter;
  mode: ClauseIQCardMode;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

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

`new_string`:
```tsx
function ParametersSelectedCard({
  parameter,
  mode,
  onEdit,
  cardRef,
}: {
  parameter: ClauseIQSelectedParameter;
  mode: ClauseIQCardMode;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

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

> After Phase 2, `ParametersSelectedCard` only renders during `upload-contract`, where `mode === 'default'` and the user always sees the "Change Playbook" button. The `disabled` branch becomes effectively dead but is kept defensively in case the conditional changes in the future.

> If `Chip` is no longer used anywhere in this file, you can remove it from the orbit imports at the top — but check first by running typecheck.

---

# PHASE 5 — Update tests (H5)

The previous plan's V4 added an assertion `expect(screen.getAllByText('Selected')).toHaveLength(2);` at [test.tsx:221](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx:221). After Phase 4 there are zero "Selected" chips, so the assertion will fail.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx`

### 5.1 — Remove the obsolete "Selected" assertion

Find the assertion in the long flow test (around line 221).

`old_string`:
```tsx
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.getAllByText('Selected')).toHaveLength(2);
```

`new_string`:
```tsx
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    // No "Selected" chip on locked cards — Figma frames 5 & 6 show no right-side affordance.
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
```

### 5.2 — Add an assertion that Initiative Selected is heading-only on Results

In the same flow test, after the assertion at line 200 (`'Here is your Analysis Result'`), add:

```tsx
    // Figma frame 19252:85706 (Results state) — Initiative Selected card is heading-only.
    expect(screen.queryByText('Legal Tech Platform Upgrade')).not.toBeInTheDocument();
```

> The full `Legal Tech Platform Upgrade` initiative name should NOT appear on Results (it's now collapsed into a heading-only card). This catches a regression if `compact` is removed.

### 5.3 — Add an assertion that Parameters card is gone on Processing AND Results

In the same flow test, find the Processing assertion (around line 196):

```tsx
    expect(screen.getByRole('heading', { name: 'Analysing Your Contract' })).toBeInTheDocument();
    expect(screen.getByText('Finding clauses in your contract...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
```

Add immediately after that block:

```tsx
    // Figma frame 19252:85549 (Processing) — Parameters card is hidden.
    expect(screen.queryByRole('heading', { name: 'Contract Analysis Parameters' })).not.toBeInTheDocument();
```

And after the Results assertions block (around line 200–222), add:

```tsx
    // Figma frame 19252:85632 (Results) — Parameters card is also hidden.
    expect(screen.queryByRole('heading', { name: 'Contract Analysis Parameters' })).not.toBeInTheDocument();
```

> If your existing test already locates `Procurement_Playbook_Yorkshire_Water .pdf` to confirm the Parameters card on the upload state, those assertions still hold (Phase 2 keeps the card on `upload-contract`).

---

# 6. Apply order

Apply phases in numerical order. Inside each phase, the sub-tasks are sequential.

1. **Phase 1** — SideNav `.product` constraint + line-heights (3 CSS edits, library)
2. **Phase 2** — Remove Parameters card from Processing/Results (1 conditional edit)
3. **Phase 3** — Add `compact` prop to InitiativeSelectedCard, pass `compact` on Results (2 component edits)
4. **Phase 4** — Remove Chip from ParametersSelectedCard (1 component edit)
5. **Phase 5** — Update test assertions (3 test edits)

Run `npm run typecheck:orbit && npm run test:components` after each phase.

---

# 7. Verification

```bash
# from repo root
npm run typecheck:orbit
npm run test:components
npm run build:orbit

# Visual: walk the flow and verify alignment + state-by-state card lists
npm run dev:prototypes
# → http://localhost:4217/clauseiq

# Welcome (Figma 19252:84609)
#   ✓ Sidenav header divider line aligns close to PageHeader bottom border (both ~y=66-73 — Phase 1)

# Click "Get Started" → "Search Initiatives" → first row → "Playbook"
#   ✓ Now on upload-contract. Cards: Welcome, Initiative Selected, Parameters Selected, Upload Contract.

# Drop a PDF
#   ✓ Now on processing. Cards: Welcome, Initiative Selected (with row, no Edit, no chip), Analysing.
#   ✓ Parameters card NOT visible (Phase 2)
#   ✓ No "Selected" chip anywhere (Phase 4)

# Wait 10s
#   ✓ Now on results. Cards: Welcome, Initiative Selected (HEADING ONLY), Analysis Result, Next, you can…
#   ✓ Initiative Selected card is compact, no "Legal Tech Platform Upgrade" row visible (Phase 3)
#   ✓ Parameters card NOT visible (Phase 2)
#   ✓ Sidenav header bottom aligns close to PageHeader bottom (Phase 1)
```

If you have Figma MCP access, re-pull screenshots for direct comparison:
```
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85549", maxDimension=2048)  # Processing
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85632", maxDimension=2048)  # Results
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85706", maxDimension=1024)  # Compact Initiative Selected
```

---

# 8. Diff summary

| # | Severity | Region | Fix complexity |
|:-:|:-:|---|---|
| H1 | 🔴 alignment | SideNav header bottom 23 px below PageHeader bottom | 3 CSS edits in `SideNav.module.css` |
| H2 | 🔴 wrong card | Parameters card persists on Processing AND Results | 1 conditional edit |
| H3 | 🔴 wrong card | Initiative Selected card on Results should be heading-only (58 px) | new `compact` prop, 2 edits |
| H4 | 🔴 spurious affordance | "Selected" chip appears on locked cards but Figma shows no affordance | reverts V4; remove 2 chip JSX blocks |
| H5 | 🟡 test maintenance | Tests assert obsolete "Selected" chip presence | 3 test assertion edits |

# 9. Notes for future audits

This is the **third correction round** for ClauseIQ. The first two passes succeeded technically (tests pass, typecheck clean) but missed visible drift because:

1. **Per-component audits don't catch cross-component alignment bugs.** The header-misalignment (H1) is across two different CSS modules in two different packages — neither alone is wrong, but they don't fit together. Future audits should explicitly diff *visible bottom edges* of the SideNav header vs the PageHeader at the same render.

2. **Figma frame metadata is the ground truth, not the design context.** When metadata shows a card with `height=58.45`, that's the visible spec — even if `get_design_context` returns a fuller component definition with hidden/clipped content. Future audits should compare card *visible heights* against frame metadata, not just count children.

3. **"Optional" framing in plans hides critical issues.** V6 in the visual plan was marked optional; it's actually a strict spec. Mark spec-deltas as critical even if the workaround is reasonable behavior — let the user decide.

4. **Adding affordances "for completeness" can make the design look wrong.** V4 added "Selected" chips because the locked state felt visually empty without them. Figma intentionally renders that empty space. When in doubt, remove rather than add.

End of plan.

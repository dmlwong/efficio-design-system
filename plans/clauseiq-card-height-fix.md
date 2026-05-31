# ClauseIQ — focused card-height + heading-weight fix (Phase 8)

> **Scope:** Two fixes:
> 1. `.selectionRow` height — the `Initiative Selected` card on the `upload-contract` state renders 131 px tall when Figma shows ~108 px.
> 2. **All heading weights → Semi Bold (600).** Code currently renders H1 at Extra Bold (800) and H2-H5 at Bold (700). Design intent is Semi Bold across the board.
>
> **Out of scope:** SideNav width, SideNav badge size, OrbitAppShell content (appName / sections / work items / user), SideNav nav-row icons. The user confirmed the SideNav is in the desired state.
>
> **Note on heading weights:** Figma's Heading 3 component (node `7383:10626`) is styled `Inter Bold` (700) — so this change **deliberately diverges from Figma**'s canonical heading style per user direction. The intent is Semi Bold consistency across the system. If Figma is updated to reflect this, future audits won't flag the divergence.

## 1. Source of truth

- **Figma file:** `XTJzVcF3yk0nBVFsBZaHoL`
- **Reference frames:**
  - `19252:85094` (Upload Contract state) — full Initiative Selected card with heading + selection row + Edit button
  - `19252:85267` (Select Parameters state) — same card shape

The Figma metadata for the Initiative Selected card in these frames shows it sitting under the Welcome card at `y=330` with a height around **108 px** in the active/editable states (and `58 px` heading-only on Results — already handled by the `compact` prop).

## 2. The diff

Rendered (orbit theme, viewport 1280×1008):
- Initiative Selected card height: **131 px**

Figma reference (same viewport):
- Initiative Selected card height: ~**108 px**

Delta: **+23 px** in code.

## 3. Root cause

[`apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css:119-129`](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css:119) defines `.selectionRow` with `min-height: 57px`:

```css
.selectionRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: 57px;
  padding: var(--orbit-space-s) var(--orbit-space-m);
  border: 1px solid var(--orbit-color-border-default);
  border-radius: var(--orbit-radius-md);
  background: var(--orbit-color-card-bg-default);
}
```

Figma's selection row is **40 px** tall — driven by the `Tertiary` Edit button height (32 px) + `var(--orbit-space-xs)` (4 px) vertical padding × 2 = 40 px.

The 17 px gap from `57 → 40` accounts for most of the card overflow. The remaining ~6 px is normal padding/border noise and well within the design tolerance.

## 4. The fix

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css`

`old_string`:
```css
.selectionRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: 57px;
  padding: var(--orbit-space-s) var(--orbit-space-m);
  border: 1px solid var(--orbit-color-border-default);
  border-radius: var(--orbit-radius-md);
  background: var(--orbit-color-card-bg-default);
}
```

`new_string`:
```css
.selectionRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: var(--orbit-space-mega); /* 40px — matches Figma button height + py-4 padding */
  padding: var(--orbit-space-xs) var(--orbit-space-m); /* 4 24 — Figma uses py-4, not py-8 */
  border: 1px solid var(--orbit-color-border-default);
  border-radius: var(--orbit-radius-md);
  background: var(--orbit-color-card-bg-default);
}
```

> **Note:** `--orbit-space-mega` is 64px (from `spacing.css`). I wrote that wrong in the snippet — the correct token for 40px doesn't exist; use a literal value. **Correction below:**

`new_string` (corrected):
```css
.selectionRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: 40px; /* Figma button height (32) + py-4 padding × 2 */
  padding: var(--orbit-space-xs) var(--orbit-space-m); /* 4 24 — Figma uses py-4, not py-8 */
  border: 1px solid var(--orbit-color-border-default);
  border-radius: var(--orbit-radius-md);
  background: var(--orbit-color-card-bg-default);
}
```

> **Why two changes in one rule:**
> 1. `min-height: 57px` → `min-height: 40px` removes the rigid floor.
> 2. `padding: 8px 24px` → `padding: 4px 24px` matches Figma's tighter vertical padding (py-4 not py-8).
>
> Together these bring the selection row to its natural 40 px height, which brings the whole Initiative Selected card to ~108 px in the upload-contract state — matching Figma.

## 5. Affected cards

This `.selectionRow` rule is shared by **both**:
- `InitiativeSelectedCard` (in upload-contract / processing — both render the row; processing locks Edit)
- `ParametersSelectedCard` (only renders in upload-contract per Phase 2 of the prior final-alignment plan)

The fix applies to both cards consistently. Their Figma heights are both ~108 px in the upload-contract state, so the same fix is correct for both.

---

## 6. Heading weights → Semi Bold across the board

**Verified by `preview_eval`:** every rendered heading currently uses font-weight `700`:

| Tag | Sample text | Current weight |
|---|---|:-:|
| H3 | "ClauseIQ" (welcome) | 700 |
| H5 | "Summary" | 700 |
| H5 | "Initiative Selected" | 700 |
| H5 | "Contract Analysis Parameters" | 700 |

(H1 isn't currently rendered in ClauseIQ but its token resolves to 800 in orbit theme.)

**Goal:** every heading H1-H5 renders at Semi Bold (600).

### 6.1 — Revert H2-H5 weights in `typography.css`

**File:** `packages/orbit/styles/tokens/typography.css`

`old_string`:
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

`new_string`:
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

### 6.2 — Revert H1 weight override in orbit theme

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

`old_string`:
```css
  /* --- Typography: Heading 1 uses Sofia Pro Bold 800 --- */
  --orbit-text-h1-family: var(--orbit-font-family-sans);
  --orbit-text-h1-weight: 800;
```

`new_string`:
```css
  /* --- Typography: Heading 1 (Semi Bold) --- */
  --orbit-text-h1-family: var(--orbit-font-family-sans);
  --orbit-text-h1-weight: var(--orbit-font-weight-semibold);
```

> The comment was misleading — the override said "Sofia Pro Bold 800" but the family was still `var(--orbit-font-family-sans)` (Inter). The new comment matches what's actually rendered.

### 6.3 — Affected components

These tokens are consumed by:
- `Headings.tsx` (via `.heading1` through `.heading5` rules in `Headings.module.css`)
- The Welcome card heading "ClauseIQ" (H3)
- The Summary box heading (H5)
- "Initiative Selected" / "Contract Analysis Parameters" / "Upload Contract" / "Analysing Your Contract" headings (all H5)
- "Here is your Analysis Result" (H5)
- "Next, you can…" (H5)
- The modal title "Select An Initiative" (H4)
- Any other prototype using `<Headings size="Heading 1..5" />`

After this fix, every heading renders at **font-weight: 600** in the orbit theme.

### 6.4 — App-name in SideNav

The SideNav app name ("Efficio Orbit" / "Connected Platform") uses a separate token `--orbit-sidenav-app-name-font-weight` set to `700` in `themes/orbit.css:67`. This is **not** an h-tag, so it's not affected by the heading weight change. **Leave as-is** — sidenav is out of scope per user direction.

### 6.5 — Sidenav badge etc.

The sidenav notification badge uses `--orbit-sidenav-badge-font-weight: var(--orbit-font-weight-regular)` (400). Unaffected by this change. Leave as-is.

---

## 7. Analysis Result card — gap structure

**Source of truth (different file):** `LIaicqq9AO6RVJJRZcYVEX` ("Orbit — Design team cross-referencing"), node `4027:52911`. This is the canonical "Analysis Result" card spec.

**The problem:** every top-level child inside `AnalysisResultCard`'s `FlowCard` is currently 24 px apart (because `.cardContent` uses `gap: var(--orbit-space-m)` = 24). Figma uses a **nested gap structure** — sections that semantically belong together are 8 px apart, sibling sections are 16 px apart, and the buttons block sits 24 px below everything else.

### 7.1 — Figma's exact gap structure (per node `4027:52911` design context)

```
FlowCard (padding 16, outer cardContent gap 24)
  └─ Content area  (flex-col, gap 24px between content & buttons — this is the outer gap)
      ├─ Top wrapper  (flex-col, gap 16px between groups)
      │   ├─ Header  (flex-col, gap 8px)
      │   │   ├─ Row: "Analysis Result" mini chip  ↔  "Jan 3, 2026, 16:32"
      │   │   └─ Row: H5 "Here is your Analysis Result"  ↔  Save toggle
      │   ├─ Banner 1: "Test.pdf | Uploaded" (h-32 neutral surface)
      │   ├─ Banner 2: "Reviewed 47 clauses | Completed" (h-32 success surface)
      │   └─ Summary + chips  (flex-col, gap 8px)
      │       ├─ Paragraph: "Summary shown below..."
      │       └─ Chip row (4 severity chips, gap 8 horizontal)
      └─ Buttons  (flex-col, gap 8px)
          ├─ Primary "Download report" (full width)  ← Figma has 2 buttons; code has 3
          └─ Secondary "Run another analysis" (full width)
```

| Pair | Figma gap | Current code gap | Diff |
|---|:-:|:-:|:-:|
| Chip-row → Heading-row | **8** | 24 | **+16 px** too loose |
| Heading-row → Banner1 | **16** | 24 | **+8** |
| Banner1 → Banner2 | 8 (inside `.stackSmall`) | 8 | ✓ |
| Banner2 → Summary paragraph | **16** | 24 | **+8** |
| Summary paragraph → Chip row | **8** | 24 | **+16** |
| Chip row → Buttons | 24 | 24 | ✓ |
| Button → Button (intra-buttons block) | 8 | 8 | ✓ |

**Net visible result:** ~48 px of extra vertical space inside the card (16+8+8+16). The card looks "airy" / "loosely packed" relative to Figma.

### 7.2 — The fix

Restructure the JSX so the FlowCard has exactly **2 top-level children** (content area + buttons), and each section uses the appropriate `.stack` (gap 16) or `.stackSmall` (gap 8) helper. Both classes already exist in [`ClauseIQPrototype.module.css:38`](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css:38).

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

`old_string`:
```tsx
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <div className={styles.rowBetween}>
        <Chip variant="Outline" size="Mini" label="Analysis Result" />
        <Text variant="Secondary" size="Small">{result.timestamp}</Text>
      </div>
      <div className={styles.rowBetween}>
        <Headings size="Heading 5">Here is your Analysis Result</Headings>
        <Toggle label="Save To My Documents" checked={saveToDocuments} onChange={onToggleSave} />
      </div>
      <div className={styles.stackSmall}>
        <StatusLine label={file.name} status="Uploaded" icon={FA.file} tone="neutral" surface="neutral" />
        <StatusLine label={`Reviewed ${result.reviewedClauses} clauses`} status="Completed" icon={FA.check} tone="success" surface="success" />
      </div>
      <Text variant="Primary" size="Paragraph">Summary shown below. Download the report for full details.</Text>
      <div className={styles.severityRow}>
        {result.severities.map((severity) => <SeverityChip key={severity.label} severity={severity} />)}
      </div>
      <div className={styles.stackSmall}>
        <FullWidthButton>
          <Button variant="Primary" icon={<FaIcon icon={ICON_VIEW} size={14} color="var(--orbit-color-btn-primary-icon)" />}>
            View Result
          </Button>
        </FullWidthButton>
        <div className={styles.resultButtonRow}>
          <Button variant="Secondary" onClick={onRunAnother} icon={<FaIcon icon={ICON_ROTATE} size={14} />}>
            Run Another Analysis
          </Button>
          <Button variant="Secondary" icon={<FaIcon icon={ICON_DOWNLOAD} size={14} />}>
            Download Report
          </Button>
        </div>
      </div>
    </FlowCard>
  );
}
```

`new_string`:
```tsx
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      {/* Content area — flex-col gap 16 between Header / banners / Summary+chips */}
      <div className={styles.stack}>
        {/* Header — flex-col gap 8 between chip-row and heading-row */}
        <div className={styles.stackSmall}>
          <div className={styles.rowBetween}>
            <Chip variant="Outline" size="Mini" label="Analysis Result" />
            <Text variant="Secondary" size="Small">{result.timestamp}</Text>
          </div>
          <div className={styles.rowBetween}>
            <Headings size="Heading 5">Here is your Analysis Result</Headings>
            <Toggle label="Save To My Documents" checked={saveToDocuments} onChange={onToggleSave} />
          </div>
        </div>
        {/* Banner 1 and Banner 2 are direct children of the gap-16 stack — they sit 16px apart from each other and from siblings, matching Figma's `12057:426900` wrapper */}
        <StatusLine label={file.name} status="Uploaded" icon={FA.file} tone="neutral" surface="neutral" />
        <StatusLine label={`Reviewed ${result.reviewedClauses} clauses`} status="Completed" icon={FA.check} tone="success" surface="success" />
        {/* Summary + chips — flex-col gap 8 between paragraph and chip row */}
        <div className={styles.stackSmall}>
          <Text variant="Primary" size="Paragraph">Summary shown below. Download the report for full details.</Text>
          <div className={styles.severityRow}>
            {result.severities.map((severity) => <SeverityChip key={severity.label} severity={severity} />)}
          </div>
        </div>
      </div>
      {/* Buttons — sits 24px below content area (provided by FlowCard's cardContent gap), internal gap 8 */}
      <div className={styles.stackSmall}>
        <FullWidthButton>
          <Button variant="Primary" icon={<FaIcon icon={ICON_VIEW} size={14} color="var(--orbit-color-btn-primary-icon)" />}>
            View Result
          </Button>
        </FullWidthButton>
        <div className={styles.resultButtonRow}>
          <Button variant="Secondary" onClick={onRunAnother} icon={<FaIcon icon={ICON_ROTATE} size={14} />}>
            Run Another Analysis
          </Button>
          <Button variant="Secondary" icon={<FaIcon icon={ICON_DOWNLOAD} size={14} />}>
            Download Report
          </Button>
        </div>
      </div>
    </FlowCard>
  );
}
```

> **Key change:** two outer children inside FlowCard (the `.stack` content block and the `.stackSmall` buttons block) instead of six. FlowCard's `.cardContent { gap: 24px }` puts 24px between them — matches Figma's outer gap.
>
> **Inside the `.stack` content block:** four direct children (Header, Banner1, Banner2, Summary+chips), each 16px apart — matches Figma's inner content wrapper gap.
>
> **Inside the `.stackSmall` Header sub-block:** chip-row and heading-row are 8px apart — matches Figma's `13167:8058` Header gap.
>
> **Inside the `.stackSmall` Summary+chips sub-block:** paragraph and chip row are 8px apart — matches Figma's `12057:426915` gap.

### 7.3 — Side note: Figma shows 2 buttons, code has 3

The Figma reference `4027:52911` shows **two buttons** — Primary "Download report" + Secondary "Run another analysis", both full-width stacked. This contradicts the earlier ClauseIQ Figma file (`XTJzVcF3yk0nBVFsBZaHoL`) which showed three buttons (View Result Primary + Run Another / Download Report side-by-side secondaries).

**This plan does not change the button count** — Codex previously implemented 3 buttons per the older spec, and this fix is about **gaps only**. If the user later confirms they want to match the newer 2-button layout, that's a separate change.

### 7.4 — No CSS changes needed

`.stack` (gap 16), `.stackSmall` (gap 8), `.severityRow` (gap 8 horizontal), `.resultButtonRow` (gap 8 horizontal) all exist already. This is a pure JSX restructure.

---

## 8. Acceptance criteria

```bash
npm run typecheck:orbit       # passes
npm run test:components       # all tests pass — no test should rely on a specific 57 px or 131 px measurement
npm run build:orbit           # passes
```

Visual: render http://localhost:3001/clauseiq → walk through to the **upload-contract** state. Inspect `.selectionRow` — should compute to **40 px height**. The Initiative Selected card should compute to roughly **108 px** total height. Compare against Figma `19252:85094` — the spacing between Welcome card, Initiative Selected card, Parameters Selected card, and Upload Contract card should now match.

## 9. Verification eval

### 9.1 — Card height

```
preview_eval expression:
(() => {
  const init = Array.from(document.querySelectorAll('h5'))
    .find(h => h.textContent === 'Initiative Selected')
    ?.closest('[class*="cardFrame"]');
  const row = init?.querySelector('[class*="selectionRow"]');
  return {
    cardHeight: init?.getBoundingClientRect().height,
    rowHeight: row?.getBoundingClientRect().height
  };
})()
```

Expected after the fix: `cardHeight ≈ 108–112`, `rowHeight = 40`.

### 9.2 — Heading weights

```
preview_eval expression:
(() => {
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5')];
  return headings.map(h => ({
    tag: h.tagName,
    text: h.textContent?.slice(0, 30),
    weight: getComputedStyle(h).fontWeight
  }));
})()
```

Expected after the fix: every entry shows `weight: "600"`.

### 9.3 — Analysis Result card gap structure

Navigate the flow all the way to Results (welcome → search initiatives → select Playbook → upload PDF → wait for processing). Then:

```
preview_eval expression:
(() => {
  const card = Array.from(document.querySelectorAll('h5'))
    .find(h => h.textContent === 'Here is your Analysis Result')
    ?.closest('[class*="cardFrame"]');
  if (!card) return 'card not found';
  const flow = card.querySelector('[class*="cardContent"]');
  // Direct children of cardContent should be exactly 2: content stack + buttons stack
  const direct = flow ? Array.from(flow.children) : [];
  const heading = card.querySelector('h5');
  const chipRow = card.querySelector('[class*="severityRow"]');
  const para = chipRow?.previousElementSibling;
  // Measure the gap between heading and chip row (should now be tight, ~16 + 8 = 24px content gap)
  const headingRect = heading?.getBoundingClientRect();
  const chipRect = chipRow?.getBoundingClientRect();
  return {
    cardContentChildCount: direct.length,
    cardContentChildClasses: direct.map(el => el.className.split(' ').slice(-1)[0]),
    headingToChipsDistance: chipRect && headingRect ? chipRect.top - headingRect.bottom : null
  };
})()
```

Expected after the fix:
- `cardContentChildCount: 2` (was 6)
- `cardContentChildClasses` ends in `["stack", "stackSmall"]` (or the CSS-module hashed equivalents)

## 10. Apply order

1. Fix §4 — `.selectionRow` height
2. Fix §6.1 — H2-H5 weights in typography.css
3. Fix §6.2 — H1 weight override in orbit.css
4. Fix §7.2 — Analysis Result card JSX restructure
5. Run §9 verifications

Run `npm run typecheck:orbit && npm run test:components && npm run build:orbit` after all fixes land. The existing `ClauseIQPrototype.test.tsx` flow tests should continue passing — they assert on text content (`/view result/i`, `/download report/i`, severity chip labels), not on DOM structure or spacing.

## 11. Out of scope (do NOT touch)

- `SideNav.tsx` — leave `width = 300` default as-is per user direction
- `themes/orbit.css` — leave `--orbit-sidenav-badge-size`, `--orbit-sidenav-padding-top`, and all other sidenav tokens (other than the H1 weight override in §6.2) as-is
- `OrbitAppShell.tsx` — leave `appName="Connected Platform"`, work items, sections as-is
- The `--orbit-sidenav-app-name-font-weight` token (700) — this drives the sidenav app name only, not h-tag headings; leave as-is
- Any other card or component

End of plan.

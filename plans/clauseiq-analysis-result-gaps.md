# ClauseIQ — Analysis Result card gap structure fix

> **For the implementing agent (Codex / Claude / etc.):** This plan is fully self-contained. It fixes a single visible issue: the gaps inside the "Analysis Result" card on the ClauseIQ Results state don't match the Figma reference. The card looks "airy" / "loosely packed" because all 6 inner sections are using the same 24 px gap when Figma intends a nested 8 / 16 / 24 px hierarchy.
>
> No CSS changes are required — both helper classes (`.stack` for 16 px gap, `.stackSmall` for 8 px gap) already exist in `ClauseIQPrototype.module.css`. The fix is a pure JSX restructure.

## 1. Source of truth

- **Figma file:** `LIaicqq9AO6RVJJRZcYVEX` ("Orbit — Design team cross-referencing")
- **Figma node:** `4027:52911` — Analysis Result card, dimensions 640 × 352 px
- **Code file:** [`apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx) — the `AnalysisResultCard` function (around line 444)
- **Theme assumption:** orbit theme is applied via `OrbitAppShell` → `<div data-theme="orbit">`.

## 2. The problem

Inside `FlowCard` (which uses `.cardContent { gap: 24px }`), the current `AnalysisResultCard` renders **6 direct children** — every adjacent pair sits 24 px apart:

```
FlowCard
  ├─ rowBetween  (chip + timestamp)       — 24px gap
  ├─ rowBetween  (heading + toggle)       — 24px gap
  ├─ stackSmall  (banner 1 + banner 2)    — 24px gap
  ├─ Text        (summary paragraph)      — 24px gap
  ├─ severityRow (4 severity chips)       — 24px gap
  └─ stackSmall  (3 buttons)
```

Figma's reference uses a **nested** gap structure (per design context for node `4027:52911`):

```
FlowCard (outer cardContent gap 24)
  ├─ Content area  (flex-col, gap 16)
  │   ├─ Header  (flex-col, gap 8)
  │   │   ├─ Row: "Analysis Result" mini chip  ↔  timestamp
  │   │   └─ Row: H5 "Here is your Analysis Result"  ↔  Save toggle
  │   ├─ Banner 1: "Test.pdf | Uploaded"   (h-32 neutral surface)
  │   ├─ Banner 2: "Reviewed N clauses | Completed"   (h-32 success surface)
  │   └─ Summary + chips  (flex-col, gap 8)
  │       ├─ Paragraph: "Summary shown below..."
  │       └─ Chip row (4 severity chips, gap 8 horizontal)
  └─ Buttons  (flex-col, gap 8)
      ├─ Primary button (full width)
      └─ Secondary button(s)
```

### Diff table

| Pair | Figma gap | Current code gap | Excess |
|---|:-:|:-:|:-:|
| Chip-row → Heading-row | **8** | 24 | **+16 px** |
| Heading-row → Banner 1 | **16** | 24 | **+8 px** |
| Banner 1 → Banner 2 | 8 (inside `.stackSmall`) | 8 | ✓ |
| Banner 2 → Summary paragraph | **16** | 24 | **+8 px** |
| Summary paragraph → Chip row | **8** | 24 | **+16 px** |
| Chip row → Buttons | 24 (between content area and buttons block) | 24 | ✓ |
| Button → Button (intra-buttons block) | 8 | 8 | ✓ |

**Total visible excess:** ~48 px of unnecessary vertical space in the card.

## 3. The fix

Restructure the `AnalysisResultCard` JSX so the `FlowCard` has exactly **2 top-level children** (content area + buttons), with appropriate `.stack` (gap 16) and `.stackSmall` (gap 8) helpers nested inside.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

Find the `AnalysisResultCard` function (around line 444). The return statement currently looks like this.

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
      {/* Content area — gap 16 between Header / Banner1 / Banner2 / Summary+chips, per Figma node 4027:52911;5450:3759;12057:426900 */}
      <div className={styles.stack}>
        {/* Header — gap 8 between chip-row and heading-row, per Figma 13167:8058 */}
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
        {/* Banner 1 and Banner 2 are direct children of the gap-16 stack — they sit 16px from siblings and from each other (matching Figma's flat 4-child wrapper). */}
        <StatusLine label={file.name} status="Uploaded" icon={FA.file} tone="neutral" surface="neutral" />
        <StatusLine label={`Reviewed ${result.reviewedClauses} clauses`} status="Completed" icon={FA.check} tone="success" surface="success" />
        {/* Summary + chips — gap 8 between paragraph and chip row, per Figma 12057:426915 */}
        <div className={styles.stackSmall}>
          <Text variant="Primary" size="Paragraph">Summary shown below. Download the report for full details.</Text>
          <div className={styles.severityRow}>
            {result.severities.map((severity) => <SeverityChip key={severity.label} severity={severity} />)}
          </div>
        </div>
      </div>
      {/* Buttons — 24px below content area via FlowCard's cardContent gap; internal gap 8 */}
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

### Key structural points

- **`FlowCard` now has exactly 2 children** (was 6) — the `.stack` content block and the `.stackSmall` buttons block. `FlowCard`'s `.cardContent { gap: 24 }` produces the 24 px gap between them (matches Figma's outer gap).
- **Inside the `.stack` content block:** four direct children (Header sub-block, Banner 1, Banner 2, Summary+chips sub-block), each 16 px apart (matches Figma's `12057:426900` wrapper gap).
- **Inside the Header `.stackSmall`:** the chip-row and heading-row sit 8 px apart (matches Figma's `13167:8058` Header gap).
- **Inside the Summary+chips `.stackSmall`:** the paragraph and severity chip row sit 8 px apart (matches Figma's `12057:426915` gap).

## 4. No CSS changes needed

The classes used are already defined in [`ClauseIQPrototype.module.css`](../apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css):

| Class | Gap value | Used for |
|---|:-:|---|
| `.stack` | 16 px (`--orbit-space-base`) | gap-16 between content groups |
| `.stackSmall` | 8 px (`--orbit-space-s`) | gap-8 inside Header, Summary+chips, Buttons |
| `.severityRow` | 8 px horizontal | chip row layout |
| `.resultButtonRow` | 8 px horizontal | side-by-side secondary buttons |

This is a **pure JSX restructure**. No CSS module edits, no new tokens.

## 5. Acceptance criteria

```bash
npm run typecheck:orbit       # passes
npm run test:components       # all tests pass — the existing ClauseIQ flow tests assert on text content (View Result, Download Report, severity chip labels), not DOM nesting
npm run build:orbit           # passes
```

Visual: render http://localhost:3001/clauseiq → walk through to the **Results** state → compare the AnalysisResultCard against Figma node `4027:52911`. The chip-row should sit 8 px above the heading-row (was 24); the summary paragraph should sit 8 px above the chip row (was 24); the banners should sit 16 px below the heading-row (was 24) and 16 px above the summary paragraph (was 24).

## 6. Verification eval

After applying the fix, navigate the prototype to Results state (Get Started → Search Initiatives → first row → Playbook → upload PDF → wait 10s). Then run via `preview_eval`:

```js
(() => {
  const card = Array.from(document.querySelectorAll('h5'))
    .find(h => h.textContent === 'Here is your Analysis Result')
    ?.closest('[class*="cardFrame"]');
  if (!card) return 'card not found';
  const flow = card.querySelector('[class*="cardContent"]');
  const direct = flow ? Array.from(flow.children) : [];
  return {
    cardContentChildCount: direct.length,
    cardContentChildClasses: direct.map(el => el.className.split(' ').slice(-1)[0])
  };
})()
```

**Expected output after the fix:**
```json
{
  "cardContentChildCount": 2,
  "cardContentChildClasses": ["<hashed>__stack", "<hashed>__stackSmall"]
}
```

(The exact class names will be hashed CSS-module names — the important thing is `cardContentChildCount: 2` and the second class endsWith `stackSmall`.)

## 7. Side notes (not in scope of this plan)

1. **Figma frame `4027:52911` shows 2 buttons, not 3.** This Figma file (`LIaicqq9AO6RVJJRZcYVEX`) renders Primary "Download report" + Secondary "Run another analysis" stacked full-width — without the "View Result" Primary button on top. Code currently has 3 buttons per a different ClauseIQ Figma file (`XTJzVcF3yk0nBVFsBZaHoL`). **This plan deliberately does NOT change the button count.** If you want the 2-button layout, request a separate plan.
2. **Severity chip vertical padding** — Figma has `py-2` on 2 chips and `py-4` on the other 2 (a Figma-side oversight). Code uses `<Chip size="Mini">` uniformly. Leave as-is.
3. **Banner row heights, surfaces, and icon colors** are correct in code already — no change needed.

## 8. Apply order

1. Apply the §3 JSX edit.
2. Run `npm run typecheck:orbit && npm run test:components && npm run build:orbit`.
3. Run the §6 verification eval against the running prototype.
4. Visually compare against Figma node `4027:52911`.

End of plan.

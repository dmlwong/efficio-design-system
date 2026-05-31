# ClauseIQ — Figma audit fix plan

> **For the implementing agent (Codex / Claude / etc.):** This plan is fully self-contained. Read top to bottom, then apply changes in the order listed. Phase 1 is critical functionality; phases 2–3 are visual/styling. Run the verification commands in §6 before declaring done.

## 1. Source of truth

- **Figma file:** `XTJzVcF3yk0nBVFsBZaHoL` (`Sprint-75: ClauseIQ`)
- **Six frames** (one per flow state):

| State | Figma node | Frame name |
|---|---|---|
| Welcome | `19252:84609` | Desktop - 19 |
| Select Initiative | `19252:84763` | Desktop - 18 |
| **Contract Analysis Parameters** *(new)* | `19252:85267` | Desktop - 54 |
| Upload Contract | `19252:85094` | Desktop - 2 |
| Processing | `19252:85549` | Desktop - 3 |
| Results | `19252:85632` | Desktop - 4 |

- **Theme:** orbit theme is applied via `OrbitAppShell` → `<div data-theme="orbit">`. All colors below assume orbit theme tokens unless noted.

## 2. Files touched

| File | Phase 1 (Critical) | Phase 2 (Major) | Phase 3 (Minor) |
|---|:-:|:-:|:-:|
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx` | ✓ | ✓ | — |
| `apps/prototypes/components/feature/clauseiq/state.ts` | ✓ | — | — |
| `apps/prototypes/components/feature/clauseiq/types.ts` | ✓ | — | — |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css` | ✓ | ✓ | ✓ |
| `apps/prototypes/data/clauseiq-mock.ts` | ✓ | ✓ | — |
| `packages/orbit/src/tool/ToolNextStepsCard.tsx` | — | ✓ | — |
| `packages/orbit/styles/tokens/themes/orbit.css` | — | ✓ | — |
| `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx` | ✓ | — | — |

## 3. Acceptance criteria

After all fixes are applied:

```bash
npm run typecheck:orbit         # passes
npm run test:components         # all 53 (now ≥55) tests pass
npm run build:orbit             # passes
```

Visual verification: render the prototype at http://localhost:4217/clauseiq, walk through every step, and compare each state to its corresponding Figma frame. The flow must be:

`welcome → select-initiative → select-parameters → upload-contract → processing → results`

(Six steps, not five.)

---

# PHASE 1 — Critical (missing/wrong functionality)

## Fix C1 — Add the "Contract Analysis Parameters" step

**Problem:** The Figma flow has a step (frame `19252:85267`) between Initiative Selected and Upload Contract that doesn't exist in code. After selecting an initiative, the user must select a parameter "bucket" (Playbook / Category / Country) before they can upload.

**Behaviour:**
- After the user picks an initiative, the step advances to `'select-parameters'`. The Parameters card becomes active and shows 3 sub-cards (Playbook / Category / Country) each with an unselected radio + label + colored icon tile.
- Clicking any sub-card "selects" that bucket. For prototype simplicity, all three resolve to the same simulated playbook name `"Procurement_Playbook_Yorkshire_Water .pdf"`.
- After selection, the step advances to `'upload-contract'`. The Parameters card collapses to a status line showing the selected playbook with a "Change Playbook" tertiary button on the right (mirroring the existing `InitiativeSelectedCard` pattern with its "Edit" button).
- Clicking "Change Playbook" returns to `'select-parameters'` and clears the selected parameter.

### C1.1 — Add types

**File:** `apps/prototypes/components/feature/clauseiq/types.ts`

Append to the file:

```ts
export type ClauseIQParameterKind = 'Playbook' | 'Category' | 'Country';

export interface ClauseIQSelectedParameter {
  kind: ClauseIQParameterKind;
  /** Simulated chosen artifact name (e.g. a playbook filename). */
  label: string;
}
```

Then update the existing `ClauseIQState` interface — find the `step` field and add `'select-parameters'` to its union, and add a `selectedParameter` field:

`old_string` (search the existing definition):
```ts
  step: 'welcome' | 'select-initiative' | 'upload-contract' | 'processing' | 'results';
```

`new_string`:
```ts
  step: 'welcome' | 'select-initiative' | 'select-parameters' | 'upload-contract' | 'processing' | 'results';
  selectedParameter?: ClauseIQSelectedParameter;
```

### C1.2 — Update mock data

**File:** `apps/prototypes/data/clauseiq-mock.ts`

Add at the bottom of the file (before the final `export const CLAUSEIQ_FILE_LIMIT_MB = 100;`):

```ts
export interface ClauseIQParameterOption {
  kind: 'Playbook' | 'Category' | 'Country';
  label: string;
  icon: string; // FA Pro Regular unicode
  iconBg: string; // CSS color for icon tile background
  iconFg: string; // CSS color for icon glyph
}

/**
 * Three buckets shown in the Contract Analysis Parameters card.
 * For prototype simulation, picking any bucket resolves to CLAUSEIQ_DEFAULT_PLAYBOOK.
 */
export const CLAUSEIQ_PARAMETER_OPTIONS: ClauseIQParameterOption[] = [
  {
    kind: 'Playbook',
    label: 'Playbook',
    icon: '', // book
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
  },
  {
    kind: 'Category',
    label: 'Category',
    icon: '', // tag
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
  },
  {
    kind: 'Country',
    label: 'Country',
    icon: '', // location-dot
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
  },
];

export const CLAUSEIQ_DEFAULT_PLAYBOOK = 'Procurement_Playbook_Yorkshire_Water .pdf';
```

> The hot-pink swatch (`--orbit-color-swatch-hollywood-cerise-300` = `#f4dbeb`) already exists in [`packages/orbit/styles/tokens/colors.css`](../packages/orbit/styles/tokens/colors.css). No new tokens needed.

### C1.3 — Update reducer

**File:** `apps/prototypes/components/feature/clauseiq/state.ts`

Find `initialClauseIQState` and add the new field. `old_string` (use enough surrounding context to make it unique — read the actual file before editing):
```ts
export const initialClauseIQState: ClauseIQState = {
  step: 'welcome',
```

`new_string`:
```ts
export const initialClauseIQState: ClauseIQState = {
  step: 'welcome',
  selectedParameter: undefined,
```

In the same file, find the reducer's case for `'SELECT_INITIATIVE'`. Currently it advances to `'upload-contract'`. Change to advance to `'select-parameters'` instead.

`old_string` (the action case body — match exactly what's in the file):
```ts
    case 'SELECT_INITIATIVE':
      return {
        ...state,
        selectedInitiative: action.initiative,
        step: 'upload-contract',
        initiativeModalOpen: false,
      };
```

`new_string`:
```ts
    case 'SELECT_INITIATIVE':
      return {
        ...state,
        selectedInitiative: action.initiative,
        step: 'select-parameters',
        initiativeModalOpen: false,
      };
```

Then add two new action types and reducer cases. Find the type union for actions (looks like `type ClauseIQAction = ... | ...`) and add:

```ts
  | { type: 'SELECT_PARAMETER'; parameter: ClauseIQSelectedParameter }
  | { type: 'EDIT_PARAMETER' }
```

(Make sure to import `ClauseIQSelectedParameter` from `./types` at the top of the file if not already present.)

Then add these two cases to the reducer switch (place near the existing `SELECT_INITIATIVE` and `EDIT_INITIATIVE` cases for consistency):

```ts
    case 'SELECT_PARAMETER':
      return {
        ...state,
        selectedParameter: action.parameter,
        step: 'upload-contract',
      };
    case 'EDIT_PARAMETER':
      return {
        ...state,
        selectedParameter: undefined,
        step: 'select-parameters',
      };
```

Also update the existing `'EDIT_INITIATIVE'` case to clear the parameter when going back. Find it and modify:

`old_string`:
```ts
    case 'EDIT_INITIATIVE':
      return {
        ...state,
        selectedInitiative: undefined,
        step: 'select-initiative',
        initiativeModalOpen: true,
      };
```

`new_string`:
```ts
    case 'EDIT_INITIATIVE':
      return {
        ...state,
        selectedInitiative: undefined,
        selectedParameter: undefined,
        step: 'select-initiative',
        initiativeModalOpen: true,
      };
```

Also update `'RUN_ANOTHER_ANALYSIS'` (the reducer case that resets to a fresh flow) to clear the new field too:

`old_string` (find the existing case):
```ts
    case 'RUN_ANOTHER_ANALYSIS':
      return {
        ...initialClauseIQState,
        step: 'select-initiative',
        initiativeModalOpen: true,
      };
```

`new_string`:
```ts
    case 'RUN_ANOTHER_ANALYSIS':
      return {
        ...initialClauseIQState,
        selectedParameter: undefined,
        step: 'select-initiative',
        initiativeModalOpen: true,
      };
```

> If the existing reducer doesn't match these `old_string`s exactly, read the file first and adapt — the structural intent is what matters: (1) `SELECT_INITIATIVE` advances to `'select-parameters'` not `'upload-contract'`; (2) two new actions exist; (3) clearing initiative also clears parameter; (4) reset clears parameter.

### C1.4 — Add the new card components

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

At the top of the file, add the new mock data import. `old_string`:
```ts
import {
  CLAUSEIQ_FILE_LIMIT_MB,
  CLAUSEIQ_INITIATIVES,
  type ClauseIQAnalysisResult,
  type ClauseIQInitiative,
  type ClauseIQUploadedFile,
} from '@/data/clauseiq-mock';
```

`new_string`:
```ts
import {
  CLAUSEIQ_FILE_LIMIT_MB,
  CLAUSEIQ_INITIATIVES,
  CLAUSEIQ_PARAMETER_OPTIONS,
  CLAUSEIQ_DEFAULT_PLAYBOOK,
  type ClauseIQAnalysisResult,
  type ClauseIQInitiative,
  type ClauseIQParameterOption,
  type ClauseIQUploadedFile,
} from '@/data/clauseiq-mock';
```

Then add a new icon constant near the other `ICON_*` declarations (around line 38):

```ts
const ICON_CIRCLE = ''; // FA Regular: circle (unselected radio)
```

Now add two new components. Place them in the file *after* `InitiativeSelectedCard` (around line 196) and *before* `InitiativeSelectionModal` (around line 198). Insert this block verbatim:

```tsx
function ParametersSelectionCard({
  options,
  onSelect,
  cardRef,
}: {
  options: ClauseIQParameterOption[];
  onSelect: (option: ClauseIQParameterOption) => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <div className={styles.stackSmall}>
        <Headings size="Heading 5">Contract Analysis Parameters</Headings>
        <Text variant="Secondary" size="Paragraph">Choose a parameters to analyse this contract.</Text>
      </div>
      <div className={styles.parameterRow}>
        {options.map((option) => (
          <button
            key={option.kind}
            type="button"
            className={styles.parameterCard}
            onClick={() => onSelect(option)}
          >
            <span className={styles.parameterLeft}>
              <FaIcon icon={ICON_CIRCLE} size={14} color="var(--orbit-color-btn-secondary-icon)" />
              <Text variant="Primary" size="Paragraph">{option.label}</Text>
            </span>
            <span
              className={styles.parameterIconTile}
              style={{ '--_bg': option.iconBg } as React.CSSProperties}
              aria-hidden="true"
            >
              <FaIcon icon={option.icon} size={12} color={option.iconFg} />
            </span>
          </button>
        ))}
      </div>
    </FlowCard>
  );
}

function ParametersSelectedCard({
  parameter,
  mode,
  onEdit,
  cardRef,
}: {
  parameter: { kind: string; label: string };
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

> The `parameter.label` here is the playbook filename (`CLAUSEIQ_DEFAULT_PLAYBOOK`); the `parameter.kind` becomes the verb in "Change Playbook" / "Change Category" / "Change Country".

Now wire them into the flow JSX inside `ClauseIQPrototype` (the main exported component, around line 411). Find the existing render block and modify.

`old_string` (the JSX section that lists the conditional cards — match a few cards' worth so the substitution is unambiguous):
```tsx
          {state.selectedInitiative && state.step !== 'welcome' && (
            <InitiativeSelectedCard
              initiative={state.selectedInitiative}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_INITIATIVE' })}
              cardRef={setCardRef('initiative-selected')}
            />
          )}
          {state.step === 'upload-contract' && state.selectedInitiative && (
```

`new_string`:
```tsx
          {state.selectedInitiative && state.step !== 'welcome' && (
            <InitiativeSelectedCard
              initiative={state.selectedInitiative}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_INITIATIVE' })}
              cardRef={setCardRef('initiative-selected')}
            />
          )}
          {state.step === 'select-parameters' && (
            <ParametersSelectionCard
              options={CLAUSEIQ_PARAMETER_OPTIONS}
              onSelect={(option) => dispatch({
                type: 'SELECT_PARAMETER',
                parameter: { kind: option.kind, label: CLAUSEIQ_DEFAULT_PLAYBOOK },
              })}
              cardRef={setCardRef('select-parameters')}
            />
          )}
          {state.selectedParameter && (state.step === 'upload-contract' || state.step === 'processing' || state.step === 'results') && (
            <ParametersSelectedCard
              parameter={state.selectedParameter}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_PARAMETER' })}
              cardRef={setCardRef('parameters-selected')}
            />
          )}
          {state.step === 'upload-contract' && state.selectedInitiative && (
```

Also update `getActiveCardKey` (around line 55) to know about the new step:

`old_string`:
```ts
function getActiveCardKey(state: ClauseIQState): string {
  if (state.step === 'select-initiative' && !state.selectedInitiative) return 'select-initiative';
  if (state.step === 'upload-contract') return 'upload-contract';
  if (state.step === 'processing') return 'processing';
  if (state.step === 'results') return 'results';
  return 'welcome';
}
```

`new_string`:
```ts
function getActiveCardKey(state: ClauseIQState): string {
  if (state.step === 'select-initiative' && !state.selectedInitiative) return 'select-initiative';
  if (state.step === 'select-parameters') return 'select-parameters';
  if (state.step === 'upload-contract') return 'upload-contract';
  if (state.step === 'processing') return 'processing';
  if (state.step === 'results') return 'results';
  return 'welcome';
}
```

### C1.5 — Add styles for the new card

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css`

Append at the bottom (before the trailing `}` of any existing rule — make sure these are at top level):

```css
.parameterRow {
  display: flex;
  gap: var(--orbit-space-s);
  width: 100%;
}

.parameterCard {
  flex: 1 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-s);
  padding: var(--orbit-space-base);
  border: 1px solid var(--orbit-color-card-border-default);
  border-radius: var(--orbit-radius-md);
  background: var(--orbit-color-bg-default);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.parameterCard:hover {
  border-color: var(--orbit-color-card-border-highlight);
  background: var(--orbit-color-bg-hover);
}

.parameterCard:focus-visible {
  outline: 2px solid var(--orbit-color-focus-ring, currentColor);
  outline-offset: 2px;
}

.parameterLeft {
  display: inline-flex;
  align-items: center;
  gap: var(--orbit-space-xs);
}

.parameterIconTile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--orbit-space-m);
  height: var(--orbit-space-m);
  border-radius: var(--orbit-radius-sm);
  background-color: var(--_bg, var(--orbit-color-bg-accent));
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .parameterRow {
    flex-direction: column;
  }
}
```

### C1.6 — Update tests

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.test.tsx`

Find any test that walks `select-initiative → upload-contract` and adjust it to walk through `select-parameters` first. Look for `getByRole('button', { name: /upload contract/i })` or similar dropzone-asserting tests, and insert a "select parameter" click step before that assertion.

Add at least two new tests:

```tsx
it('renders Contract Analysis Parameters card after initiative selection', async () => {
  const user = userEvent.setup();
  render(<ClauseIQPrototype processingDelayMs={0} />);

  await user.click(screen.getByRole('button', { name: /get started/i }));
  await user.click(screen.getByRole('button', { name: /search initiatives/i }));
  await user.click(screen.getAllByRole('button', { name: /select initiative/i })[0]);

  expect(screen.getByRole('heading', { name: 'Contract Analysis Parameters' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^playbook$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^category$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^country$/i })).toBeInTheDocument();
});

it('after picking a parameter shows Upload Contract card and a Change Playbook link', async () => {
  const user = userEvent.setup();
  render(<ClauseIQPrototype processingDelayMs={0} />);

  await user.click(screen.getByRole('button', { name: /get started/i }));
  await user.click(screen.getByRole('button', { name: /search initiatives/i }));
  await user.click(screen.getAllByRole('button', { name: /select initiative/i })[0]);
  await user.click(screen.getByRole('button', { name: /^playbook$/i }));

  expect(screen.getByRole('heading', { name: 'Upload Contract' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /change playbook/i })).toBeInTheDocument();
});
```

Adjust the user.click `name` regexes if your existing tests use different role/label patterns.

---

## Fix C2 — Restructure Results buttons (3 buttons, View Result primary)

**Problem:** Code renders 2 buttons (Download primary, Run Another secondary). Figma shows 3 buttons: View Result (primary, full width) on top, then Run Another Analysis + Download Report (secondaries, side-by-side half-width) on bottom.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

Add a new icon constant near the existing `ICON_*` declarations:

```ts
const ICON_VIEW = ''; // magnifying-glass-chart
```

Find the buttons block inside `AnalysisResultCard` (around line 396):

`old_string`:
```tsx
      <div className={styles.stackSmall}>
        <FullWidthButton>
          <Button variant="Primary" icon={<FaIcon icon={ICON_DOWNLOAD} size={14} color="var(--orbit-color-white)" />}>
            Download report
          </Button>
        </FullWidthButton>
        <FullWidthButton>
          <Button variant="Secondary" onClick={onRunAnother} icon={<FaIcon icon={ICON_ROTATE} size={14} />}>
            Run another analysis
          </Button>
        </FullWidthButton>
      </div>
```

`new_string`:
```tsx
      <div className={styles.stackSmall}>
        <FullWidthButton>
          <Button variant="Primary" icon={<FaIcon icon={ICON_VIEW} size={14} color="var(--orbit-color-white)" />}>
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
```

Add the supporting style. **File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css` — append:

```css
.resultButtonRow {
  display: flex;
  gap: var(--orbit-space-s);
}

.resultButtonRow > button {
  flex: 1 1 0;
}
```

---

## Fix C3 — "Missing clauses" severity tone

**Problem:** Code marks "Missing clauses" with tone `'Error'` (red). Figma renders it as the No-Status / Outline variant (gray bg, gray border, black text).

**File:** `apps/prototypes/data/clauseiq-mock.ts`

`old_string`:
```ts
    { label: 'Missing clauses', count: 13, tone: 'Error' },
```

`new_string`:
```ts
    { label: 'Missing clauses', count: 13, tone: 'Outline' },
```

> The `Outline` variant exists on `Chip` ([packages/orbit/src/indicators/Chip.tsx:9](../packages/orbit/src/indicators/Chip.tsx:9)). It renders white bg + light border + neutral text — the closest match to Figma's no-status spec.

---

# PHASE 2 — Major (visible drift)

## Fix M1 — Page header subtitle changes on Results state

**Problem:** Subtitle is hard-coded; Figma uses a different copy on the Results state.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.tsx`

Find the PageHeader call inside `ClauseIQPrototype` (around line 440):

`old_string`:
```tsx
      <PageHeader
        title="ClauseIQ"
        subtitle="AI tool for detailed contract analyses"
        icon={FA.file}
        {...HeaderPresets.identify}
      />
```

`new_string`:
```tsx
      <PageHeader
        title="ClauseIQ"
        subtitle={state.step === 'results' ? 'ClauseIQ turns dense contracts into clear, structured insights.' : 'AI tool for detailed contract analyses'}
        icon={FA.file}
        {...HeaderPresets.identify}
      />
```

---

## Fix M2 — ToolNextStepsCard alignment

**Problem:** Default actions in `ToolNextStepsCard` have wrong icons and titles vs the Figma "Next, you can…" card on the Results state.

**File:** `packages/orbit/src/tool/ToolNextStepsCard.tsx`

Find `DEFAULT_ACTIONS` (around line 24):

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
    icon: '',
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
    icon: '', // sparkles — Figma uses 'sparkles',  is FA Pro 'sparkles'/stars
    title: 'Analyse Contract on Another Initiative',
    description: 'Start fresh with a new initiative.',
  },
  {
    id: 'update-milestone',
    icon: '', // clipboard
    title: 'Update Milestone',
    description: 'Track your initiative progress.',
  },
  {
    id: 'complete-initiative',
    icon: '', // badge-check
    title: 'Complete Initiative',
    description: 'Mark this initiative as complete.',
  },
];
```

> Quick FA Pro reference: `` = `clipboard`, `` = (FA reuse — verify via [fontawesome.com/search](https://fontawesome.com/search) that this glyph renders as `badge-check` in your Pro license; if not, use `` `user-circle` or whichever Pro glyph is `badge-check` in your subscription tier).

---

## Fix M3 — Card border color (default cards)

**Problem:** Figma uses `#a2a9c5` (`border-color-accent`) for non-highlighted cards. Orbit theme has `--orbit-color-card-border-default: #e2e8f0` — too pale.

**Decision:** Promote `--orbit-color-border-accent` (already defined in [`packages/orbit/styles/tokens/semantics.css:21`](../packages/orbit/styles/tokens/semantics.css:21) as `#a2a9c5`) to be the orbit theme's default card border. This affects every Card in default state under orbit theme.

**File:** `packages/orbit/styles/tokens/themes/orbit.css`

Find the card-border block (around line 23):

`old_string`:
```css
  /* --- Card --- */
  --orbit-color-card-border-default: #e2e8f0;
  --orbit-color-card-border-hover: #e2e8f0;
```

`new_string`:
```css
  /* --- Card --- */
  --orbit-color-card-border-default: #a2a9c5;
  --orbit-color-card-border-hover: #a2a9c5;
```

> This is a **theme-wide** change. Audit other prototypes with `data-theme="orbit"` (the form prototype, procurement-dashboard, best-practice routes) for unintended side effects. If any specific card needs the lighter `#e2e8f0` look, override locally with inline style.

---

## Fix M4 — Status banner height + radius

**Problem:** Figma status banners (Test.pdf / Reviewed N clauses) are 32px tall with 8px radius. Code uses 40px / 4px.

**File:** `apps/prototypes/components/feature/clauseiq/ClauseIQPrototype.module.css`

Find `.statusRow` (around line 191):

`old_string`:
```css
.statusRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: 40px;
  padding: var(--orbit-space-s) var(--orbit-space-base);
  border-radius: var(--orbit-radius-sm);
}
```

`new_string`:
```css
.statusRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-base);
  min-height: var(--orbit-space-l); /* 32px (was 40) */
  padding: 0 var(--orbit-space-s); /* 0 8px (was --space-s --space-base) */
  border-radius: var(--orbit-radius-md); /* 8px (was --radius-sm 4px) */
}
```

---

# PHASE 3 — Minor (token / spacing polish)

## Fix T1 — selectionRow border color

**Rationale:** The `InitiativeSelectedCard` renders an inner row (`.selectionRow`) with `border: 1px solid var(--orbit-color-card-border-default)`. After Fix M3 lands, this becomes `#a2a9c5`. Figma's selection row in the Results state actually keeps a lighter `#e6e6e6` border. To preserve that nuance:

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
  border: 1px solid var(--orbit-color-card-border-default);
  border-radius: var(--orbit-radius-sm);
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
  min-height: 57px;
  padding: var(--orbit-space-s) var(--orbit-space-m);
  border: 1px solid var(--orbit-color-border-default); /* keep #e6e6e6 even after card-border-default theme change */
  border-radius: var(--orbit-radius-md); /* 8px to match Figma (was --radius-sm 4px) */
  background: var(--orbit-color-card-bg-default);
}
```

---

## Fix T2 — Summary box border-radius

**Rationale:** Figma's "Summary" box inside the Welcome card uses `--orbit-radius-md` (8px) — already correct in code. **No change needed.**

---

## Fix T3 — Welcome card icon tile (optional aesthetic)

**Rationale:** Code synthesizes the icon tile via JSX; Figma uses an asset image. Visually close enough — flagged for designer review only. **No change required.**

---

# 4. Out of scope (deliberately not addressed)

These were flagged in the audit but require broader scope or designer follow-up:

1. **The initiative-selection modal** — Figma frame 3 shows the inline parameter sub-cards but doesn't show a parallel modal for parameters; we're keeping the modal for the existing initiative selection (frame 2 still uses it).
2. **Severity chip vertical-padding inconsistency** — Figma has `py-2` on 2 chips and `py-4` on the other 2; this looks like a Figma-side oversight. Keeping uniform `<Chip size="Mini">` in code.
3. **Toggle "Save To My Documents"** — already present and correctly positioned.
4. **`Initiative Selected` card height variation between states** — purely a layout artifact of having different inner content; no per-state component variant needed.
5. **Asset replacement for Welcome card icon** — see T3 above.
6. **CLAUSEIQ_INITIATIVES has 7 duplicate "Legal Tech Platform Upgrade" rows** — that's existing dummy data, not a Figma diff. Flag separately.

---

# 5. Apply order (recommended)

Within each phase, fixes are independent — apply in any order. **Across phases, do them in numerical order:**

1. C1.1 → C1.2 → C1.3 → C1.4 → C1.5 → C1.6 (the new step needs all six sub-tasks)
2. C2 (results buttons)
3. C3 (severity tone)
4. M1 (header subtitle)
5. M2 (next-steps icons)
6. M3 (card border in orbit theme)
7. M4 (status row dims)
8. T1 (selectionRow border)

Run the verification commands after each phase to catch regressions early.

---

# 6. Verification

```bash
# from repo root
npm run typecheck:orbit
npm run test:components
npm run build:orbit

# Visual: walk the flow
npm run dev:prototypes
# → http://localhost:4217/clauseiq (or whichever port Next chose)
# → Click "Get Started"
# → Click "Search Initiatives" → pick any row
# → Verify: Contract Analysis Parameters card appears (Fix C1)
# → Click "Playbook" → verify advance to Upload Contract with collapsed Parameters card
# → Click "Change Playbook" → verify return to Parameters selection
# → Pick "Country" → upload any PDF → wait 10s → verify Results
# → On Results: subtitle text changes (Fix M1)
# → On Results: 3 buttons appear with View Result primary, two secondaries below (Fix C2)
# → On Results: 4 chips with "Missing clauses" gray, "High deviation" red, etc. (Fix C3)
# → "Next, you can…" card icons match: sparkles / clipboard / badge-check (Fix M2)
```

If you have access to the Figma MCP, re-pull screenshots for any of the 6 frames and overlay against the rendered prototype:

```
get_screenshot(fileKey="XTJzVcF3yk0nBVFsBZaHoL", nodeId="19252:85267", maxDimension=2048)
```

# 7. Diff summary

| # | Severity | Region | Fix |
|:-:|:-:|---|---|
| C1 | 🔴 critical | Flow state machine | Add `select-parameters` step + Parameters card + status-line variant |
| C2 | 🔴 critical | Results buttons | 3-button layout (View Result primary, Run Another + Download as secondaries) |
| C3 | 🔴 critical | Severity tone | "Missing clauses" → `Outline` instead of `Error` |
| M1 | 🟠 major | Page header | Subtitle changes on Results state |
| M2 | 🟠 major | ToolNextStepsCard | Update default action icons to match Figma |
| M3 | 🟠 major | Orbit theme | `--orbit-color-card-border-default` `#e2e8f0 → #a2a9c5` |
| M4 | 🟠 major | Status row | height 40 → 32, radius 4 → 8, padding tightened |
| T1 | 🟡 minor | selectionRow | border preserves `#e6e6e6`, radius `4 → 8` |

End of plan.

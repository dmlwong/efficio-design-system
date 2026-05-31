# Orbit DESIGN.md pipeline (local)

Generates `DESIGN.md` from Orbit's code tokens, validates against Figma
variables, and concatenates hand-written prose. Runs entirely on your
machine — no CI dependency.

## What this gives you

- A single command (`npm run build:design-md`) that regenerates `DESIGN.md`
  from the canonical token sources.
- A pre-commit hook that runs the script automatically when tokens or prose
  change, so the generated file never goes stale.
- A Claude Code subagent for ad-hoc runs and prose revisions.

## Layout

```
.
├── DESIGN.md                              # generated — do not edit
├── design-md/
│   └── prose/
│       └── DESIGN.prose.md                # editorial layer (edit freely)
├── scripts/
│   └── build-design-md.ts                 # the generator
├── .husky/
│   └── pre-commit                         # auto-rebuild hook
└── .claude/
    └── agents/
        └── design-md-generator.md         # Claude Code subagent
```

## Setup

1. Drop the contents of this folder into the Orbit repo root.
2. Install dev dependencies:
   ```bash
   npm i -D tsx husky
   ```
3. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "build:design-md": "tsx scripts/build-design-md.ts",
       "prepare": "husky"
     }
   }
   ```
4. Initialise husky once:
   ```bash
   npm run prepare
   ```
5. Add Figma credentials to `.env.local`:
   ```
   FIGMA_PAT=<your existing Figma personal access token>
   FIGMA_ORBIT_FILE_KEY=<file key from the Figma URL>
   ```
6. First run:
   ```bash
   npm run build:design-md
   ```

If the first run fails on token detection, open `scripts/build-design-md.ts`
and edit the candidate paths in `detectTokenSource()` to match Orbit's
actual structure.

## Usage

```bash
# Default: regenerate DESIGN.md, validate against Figma, run linter
npm run build:design-md

# Skip Figma (offline, or if you want to reconcile drift later)
npm run build:design-md -- --skip-figma

# Check mode: fails if DESIGN.md is out of date or Figma drifts.
# Useful before pushing, or wire into the pre-commit hook if you'd rather
# the hook fail loudly than auto-regenerate.
npm run build:design-md -- --check
```

## How the pre-commit hook works

When you commit changes that touch:

- token files (`tokens/`, `design-tokens/`, `src/tokens/`, `tokens.css`,
  `tailwind.config.*`)
- prose (`design-md/prose/`)

…the hook runs `npm run build:design-md` and stages the resulting
`DESIGN.md`. If you want to commit without regenerating (rare), use
`git commit --no-verify`.

## Updating prose

Edit `design-md/prose/DESIGN.prose.md`. The pre-commit hook will regenerate
`DESIGN.md` automatically. If you'd rather see the result before committing,
run `npm run build:design-md` manually first.

## Ad-hoc runs via Claude Code

The `.claude/agents/design-md-generator.md` subagent wraps this pipeline for
conversational use. Invoke it when you want to discuss prose edits, drift
investigations, or Tailwind exports without leaving Claude Code. It will
not commit changes — only show diffs and let you review.

## Adding CI later

If you decide later that you want this on CI too, the script already
supports `--check` mode. The original GitHub Actions workflow can be added
back without changing anything in the script.

# Orbit generation pipeline (local)

Regenerates three artefacts from Orbit's source — all on your machine, no CI
dependency:

1. **`DESIGN.md`** — a token + prose design brief, from the token CSS and
   `design-md/prose/DESIGN.prose.md` (optionally validated against Figma).
2. **`orbit-manifest.md`** — a 54-component API manifest, extracted from
   `packages/orbit/src` with the TypeScript compiler API.
3. **`.claude/skills/`** — four Claude Code skills (below), generated from the
   tokens, the manifest, the static audit, and editable prose partials.

Everything generated is a pure function of source, so `--check` can prove it
hasn't drifted.

## The Claude skills

Project-level skills under `.claude/skills/` — Claude Code picks them up with no
restart, and auto-loads the relevant one from its description (progressive
disclosure: metadata → body → `references/` on demand). Orbit is **light-only**;
the base/CP palette is canonical and `data-theme="orbit"` is a brand re-skin.

| Skill | What it covers | Generated from |
| --- | --- | --- |
| `orbit-foundations` | Principles, voice, do's & don'ts | `design-md/prose/DESIGN.prose.md` |
| `orbit-tokens` | Colours, spacing, type, radius, elevation, theme | `packages/orbit/styles/tokens/*.css` |
| `orbit-components` | 54-component API (props, variants, tokens, composition) | `orbit-manifest.md` (→ `packages/orbit/src`) |
| `orbit-a11y` | Accessibility + quality contracts | `scripts/design-system-static-audit.mjs` + `design-md/prose/skills/a11y.notes.md` |

## Layout

```
.
├── DESIGN.md                          # generated — do not edit
├── orbit-manifest.md                  # generated — do not edit
├── design-md/prose/
│   ├── DESIGN.prose.md                # editorial source for DESIGN.md + orbit-foundations
│   └── skills/                        # editable prose partials
│       ├── a11y.notes.md              # contrast/keyboard prose for orbit-a11y
│       └── component-descriptions.md  # component descriptions for orbit-components
├── .claude/skills/                    # generated skills — do not edit
│   ├── orbit-foundations/  orbit-tokens/  orbit-components/  orbit-a11y/
└── scripts/
    ├── lib/load-tokens.ts             # shared token loader
    ├── lib/extract-components.ts      # shared component extractor (TS compiler API)
    ├── build-design-md.ts             # → DESIGN.md
    ├── build-manifest.ts              # → orbit-manifest.md
    └── build-skills.ts                # → .claude/skills/*
```

## Commands

```bash
# Regenerate everything (manifest → DESIGN.md → skills)
npm run build:design

# Individual generators
npm run build:manifest        # orbit-manifest.md from packages/orbit/src
npm run build:design-md       # DESIGN.md (add -- --skip-figma to skip Figma)
npm run build:skills          # .claude/skills/*

# Prove nothing has drifted (use in CI or a pre-commit hook)
npm run check:design
```

Figma validation in `build:design-md` reads `FIGMA_PAT` and `FIGMA_ORBIT_FILE_KEY`
from `.env.local` (or the shell) and is **skipped** if they are absent.

## Editing

Edit source, then run `npm run build:design`. Never edit generated files
(`DESIGN.md`, `orbit-manifest.md`, anything under `.claude/skills/`).

- **Token values** → `packages/orbit/styles/tokens/*.css`
- **Principles / voice / do's & don'ts** → `design-md/prose/DESIGN.prose.md`
- **Component descriptions** → `design-md/prose/skills/component-descriptions.md`
  (props/variants/tokens are extracted from source, not editable here)
- **Accessibility prose** → `design-md/prose/skills/a11y.notes.md`

## Keeping it fresh

There is **no Git hook installed by default.** Run `npm run build:design` after
changing tokens, components, or prose. To enforce freshness, wire
`npm run check:design` into CI or a pre-commit hook — it exits non-zero if any
generated artefact is out of date.

## Known gaps

- **`--orbit-radius-pill` / `rounded.full`** is referenced by several components
  (Avatar, Filter, StepCircle, SideNav, Radio, MultiSelectDropdown) but is **not
  defined** in the token source. The `orbit-tokens` skill documents this honestly;
  define the token in `packages/orbit/styles/tokens/elevation.css` to close it.
- Component **descriptions** are not derivable from source (components carry no
  JSDoc), so they live in the editable sidecar rather than being generated.

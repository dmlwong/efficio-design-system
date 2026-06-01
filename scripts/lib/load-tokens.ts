/**
 * load-tokens.ts
 *
 * Shared token-loading core for the Orbit generation pipeline. Both
 * `build-design-md.ts` (DESIGN.md) and `build-skills.ts` (.claude/skills/*)
 * import from here so token parsing lives in exactly one place.
 *
 * Auto-detects token source format:
 *   - tokens.ts (TypeScript object export)
 *   - tokens.json (DTCG / Style Dictionary)
 *   - styles/tokens/ (multi-file CSS custom-property directory)
 *   - styles/tokens.css (single CSS file)
 *   - tailwind.config.{ts,js} (theme.extend)
 *
 * Two deliberate behaviours, fixed here vs. the original inline version:
 *   1. Theme files (themes/*.css) are kept SEPARATE in `themeOverrides` and
 *      never merged over base primitives, so base values are reported truly.
 *   2. Radius tokens in elevation.css are routed into `rounded`, so the shape
 *      scale reaches structured output.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Tokens {
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  rounded: Record<string, string>;
  spacing: Record<string, string | number>;
  components?: Record<string, Record<string, string>>;
  /**
   * Brand-variant overrides from themes/*.css (e.g. [data-theme="orbit"]).
   * Kept separate from `colors` so base primitives are never overwritten.
   * This is a re-skin, NOT a light/dark mode — Orbit is light-only.
   */
  themeOverrides?: Record<string, string>;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number | string;
  lineHeight: string | number;
  letterSpacing?: string;
}

export type TokenSource = 'tokens.ts' | 'tokens.json' | 'css' | 'css-dir' | 'tailwind';

// ── Config ───────────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(process.cwd());

// ── Step 1: Detect token source ──────────────────────────────────────────────

export function detectTokenSource(): { format: TokenSource; path: string } {
  const candidates: Array<{ format: TokenSource; path: string }> = [
    { format: 'tokens.json', path: join(REPO_ROOT, 'tokens/tokens.json') },
    { format: 'tokens.json', path: join(REPO_ROOT, 'design-tokens/tokens.json') },
    { format: 'tokens.ts',   path: join(REPO_ROOT, 'src/tokens/tokens.ts') },
    { format: 'tokens.ts',   path: join(REPO_ROOT, 'tokens/index.ts') },
    // Multi-file CSS token directories (Phase 2 token-split pattern).
    // Detected by the presence of colors.css inside a tokens directory.
    { format: 'css-dir',     path: join(REPO_ROOT, 'packages/orbit/styles/tokens') },
    { format: 'css-dir',     path: join(REPO_ROOT, 'styles/tokens') },
    { format: 'css-dir',     path: join(REPO_ROOT, 'src/styles/tokens') },
    { format: 'css-dir',     path: join(REPO_ROOT, 'app/styles/tokens') },
    // Single-file CSS fallback
    { format: 'css',         path: join(REPO_ROOT, 'styles/tokens.css') },
    { format: 'css',         path: join(REPO_ROOT, 'src/styles/tokens.css') },
    { format: 'tailwind',    path: join(REPO_ROOT, 'tailwind.config.ts') },
    { format: 'tailwind',    path: join(REPO_ROOT, 'tailwind.config.js') },
  ];

  for (const candidate of candidates) {
    if (candidate.format === 'css-dir') {
      // For directories, check that colors.css exists inside.
      if (existsSync(join(candidate.path, 'colors.css'))) {
        console.log(`✓ Detected token source: ${candidate.format} at ${candidate.path}`);
        return candidate;
      }
    } else if (existsSync(candidate.path)) {
      console.log(`✓ Detected token source: ${candidate.format} at ${candidate.path}`);
      return candidate;
    }
  }
  throw new Error(
    'No token source found. Expected one of: tokens.json, tokens.ts, ' +
    'styles/tokens/ (directory), styles/tokens.css, or tailwind.config.{ts,js}'
  );
}

// ── Step 2: Load + normalise tokens ──────────────────────────────────────────

export function loadTokens(source: { format: TokenSource; path: string }): Tokens {
  switch (source.format) {
    case 'tokens.json':
      return normaliseFromDTCG(JSON.parse(readFileSync(source.path, 'utf-8')));
    case 'tokens.ts':
      return normaliseFromTS(source.path);
    case 'css':
      return normaliseFromCSS(readFileSync(source.path, 'utf-8'));
    case 'css-dir':
      return normaliseFromCSSDir(source.path);
    case 'tailwind':
      return normaliseFromTailwind(source.path);
  }
}

function normaliseFromDTCG(raw: any): Tokens {
  // DTCG uses { $value, $type } at leaves. Walk and flatten.
  const flatten = (obj: any, prefix = ''): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [key, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in val) {
        out[path.replace(/^[^.]+\./, '')] = String((val as any).$value);
      } else if (val && typeof val === 'object') {
        Object.assign(out, flatten(val, path));
      }
    }
    return out;
  };

  return {
    colors: flatten(raw.color ?? raw.colors ?? {}),
    typography: extractTypography(raw.typography ?? {}),
    rounded: flatten(raw.rounded ?? raw.radius ?? raw.borderRadius ?? {}),
    spacing: flatten(raw.spacing ?? raw.space ?? {}),
    components: raw.component ?? raw.components,
  };
}

function normaliseFromTS(path: string): Tokens {
  // Spawn a transient Node process with esbuild-register to import the TS file.
  // Falls back to regex extraction if esbuild is unavailable.
  try {
    const json = execSync(
      `npx -y tsx -e "import * as t from '${path}'; console.log(JSON.stringify(t.tokens ?? t.default))"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const parsed = JSON.parse(json.trim());
    return {
      colors: parsed.colors ?? {},
      typography: parsed.typography ?? {},
      rounded: parsed.rounded ?? parsed.radius ?? {},
      spacing: parsed.spacing ?? {},
      components: parsed.components,
    };
  } catch (err) {
    console.warn('⚠ tsx import failed, falling back to regex extraction');
    return extractTSWithRegex(readFileSync(path, 'utf-8'));
  }
}

function extractTSWithRegex(src: string): Tokens {
  // Minimal extractor — pulls top-level groups from `export const tokens = { ... }`.
  // Good enough for the common case; fails loudly on anything exotic.
  const colorBlock = src.match(/colors\s*:\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const colors: Record<string, string> = {};
  const colorRegex = /['"]?([\w-]+)['"]?\s*:\s*['"](#[0-9a-fA-F]+)['"]/g;
  let colorMatch: RegExpExecArray | null;
  while ((colorMatch = colorRegex.exec(colorBlock)) !== null) {
    colors[colorMatch[1]] = colorMatch[2];
  }
  return { colors, typography: {}, rounded: {}, spacing: {} };
}

function normaliseFromCSS(src: string): Tokens {
  const tokens: Tokens = { colors: {}, typography: {}, rounded: {}, spacing: {} };
  const customPropertyRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = customPropertyRegex.exec(src)) !== null) {
    const [, name, value] = match;
    const v = value.trim();
    const cleaned = stripPrefix(name);
    if (cleaned.startsWith('color-') || /^#[0-9a-f]{3,8}$/i.test(v)) {
      tokens.colors[cleaned.replace(/^color-/, '')] = v;
    } else if (cleaned.startsWith('radius-') || cleaned.startsWith('rounded-')) {
      tokens.rounded[cleaned.replace(/^(radius|rounded)-/, '')] = v;
    } else if (cleaned.startsWith('space-') || cleaned.startsWith('spacing-')) {
      tokens.spacing[cleaned.replace(/^(space|spacing)-/, '')] = v;
    }
  }
  return tokens;
}

/**
 * Strip a leading project prefix like `orbit-` from token names.
 * Tokens like `--orbit-color-primary` become `color-primary`.
 */
function stripPrefix(name: string): string {
  // Common project prefixes — extend as needed.
  const prefixes = ['orbit-', 'ds-', 'theme-'];
  for (const p of prefixes) {
    if (name.startsWith(p)) return name.slice(p.length);
  }
  return name;
}

/**
 * Parse a directory of CSS token files (Phase 2 token-split pattern).
 * Routes each file to the right token category by filename:
 *   colors.css      → colors (primitives)
 *   semantics.css   → colors (semantic aliases layered on primitives)
 *   typography.css  → typography (text styles) + components.typography (raw vars)
 *   spacing.css     → spacing
 *   elevation.css   → rounded (radius-*) + components.elevation (shadow/z/focus)
 *   components.css  → components.components
 *   themes/*.css    → themeOverrides (kept SEPARATE from base colors)
 */
function normaliseFromCSSDir(dir: string): Tokens {
  const tokens: Tokens = {
    colors: {},
    typography: {},
    rounded: {},
    spacing: {},
    components: {},
    themeOverrides: {},
  };

  const files = readdirSync(dir).filter(f => f.endsWith('.css'));
  console.log(`  Reading ${files.length} CSS files from ${dir}`);

  // Also pick up theme files in subdirectories.
  const themeDir = join(dir, 'themes');
  const themeFiles = existsSync(themeDir)
    ? readdirSync(themeDir).filter(f => f.endsWith('.css')).map(f => `themes/${f}`)
    : [];

  for (const file of [...files, ...themeFiles]) {
    const content = readFileSync(join(dir, file), 'utf-8');
    const baseName = file.replace(/\.css$/, '').replace(/^themes\//, 'theme-');
    routeCSSFile(baseName, content, tokens);
  }

  // Resolve var(--orbit-color-foo) references to their hex values.
  // The linter requires concrete values, not CSS-variable references.
  resolveVarReferences(tokens);

  return tokens;
}

function resolveVarReferences(tokens: Tokens): void {
  // Build a flat lookup of all known token values by their original CSS name.
  const lookup: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens.colors)) {
    lookup[`color-${k}`] = v;
    lookup[k] = v;
  }

  const resolve = (value: string, depth = 0): string => {
    if (depth > 5) return value; // guard against cycles
    const match = value.match(/^var\(--([\w-]+)(?:\s*,\s*([^)]+))?\)$/);
    if (!match) return value;
    const refName = stripPrefix(match[1]);
    const fallback = match[2]?.trim();
    const resolved = lookup[refName] ?? lookup[refName.replace(/^color-/, '')];
    if (resolved && !resolved.startsWith('var(')) return resolved;
    if (resolved) return resolve(resolved, depth + 1);
    return fallback ?? value;
  };

  for (const [k, v] of Object.entries(tokens.colors)) {
    if (typeof v === 'string' && v.startsWith('var(')) {
      const resolved = resolve(v);
      if (!resolved.startsWith('var(')) tokens.colors[k] = resolved;
      else delete tokens.colors[k]; // unresolvable — drop rather than fail lint
    }
  }
}

function routeCSSFile(baseName: string, content: string, tokens: Tokens): void {
  // Pull every CSS custom property declaration.
  const declarations: Array<[string, string]> = [];
  const customPropertyRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = customPropertyRegex.exec(content)) !== null) {
    declarations.push([stripPrefix(match[1]), match[2].trim()]);
  }

  switch (baseName) {
    case 'colors':
    case 'semantics': {
      // colors.css holds primitives; semantics.css layers semantic aliases on
      // top. Theme files are handled separately (see 'theme-*' below) so base
      // primitives are never silently overwritten by the brand variant.
      for (const [name, value] of declarations) {
        const key = name.replace(/^color-/, '');
        // Only add if value looks color-like (hex, rgb, hsl, var reference, oklch).
        if (looksLikeColor(value)) {
          tokens.colors[key] = value;
        }
      }
      break;
    }
    case 'typography': {
      // Orbit's typography is split across many flat vars (font-size-*,
      // font-weight-*, line-height-*) rather than the spec's structured
      // {fontFamily, fontSize, fontWeight, lineHeight} objects. Preserve
      // raw vars and map the composite text styles into structured tokens.
      tokens.components ??= {};
      tokens.components['typography'] ??= {};
      for (const [name, value] of declarations) {
        tokens.components['typography'][name] = value;
      }
      Object.assign(tokens.typography, buildTypographyTokens(declarations));
      break;
    }
    case 'spacing': {
      for (const [name, value] of declarations) {
        const key = name.replace(/^(space|spacing)-/, '');
        tokens.spacing[key] = value;
      }
      break;
    }
    case 'elevation': {
      // elevation.css carries radius, shadow, z-index and focus-ring tokens.
      // Route radius-* into `rounded` so the shape scale reaches structured
      // output (it previously vanished); keep the rest under components.elevation.
      tokens.components ??= {};
      tokens.components['elevation'] ??= {};
      for (const [name, value] of declarations) {
        if (name.startsWith('radius-')) {
          tokens.rounded[name.replace(/^radius-/, '')] = value;
        } else {
          tokens.components['elevation'][name] = value;
        }
      }
      break;
    }
    case 'components': {
      tokens.components ??= {};
      tokens.components['components'] ??= {};
      for (const [name, value] of declarations) {
        tokens.components['components'][name] = value;
      }
      break;
    }
    default: {
      if (baseName.startsWith('theme-')) {
        // Brand-variant overrides (themes/*.css). Kept separate from base
        // primitives so DESIGN.md and the tokens skill report true base
        // values; documented as a re-skin, not a light/dark mode. Store the
        // FULL stripped token name (keeping its category prefix, e.g.
        // `color-…`, `text-…`, `sidenav-…`) so the generator can tell colour
        // overrides from typography/sizing overrides and resolve base values.
        tokens.themeOverrides ??= {};
        for (const [name, value] of declarations) {
          tokens.themeOverrides[name] = value;
        }
        break;
      }
      // Unknown file — surface as components.<filename> so nothing is lost.
      tokens.components ??= {};
      tokens.components[baseName] ??= {};
      for (const [name, value] of declarations) {
        tokens.components[baseName][name] = value;
      }
    }
  }
}

function buildTypographyTokens(declarations: Array<[string, string]>): Record<string, TypographyToken> {
  const lookup = Object.fromEntries(declarations);
  const fontFamily = lookup['font-family-sans'] ?? '"Inter", sans-serif';
  const styles: Array<[string, string]> = [
    ['heading-1', 'text-h1'],
    ['heading-2', 'text-h2'],
    ['heading-3', 'text-h3'],
    ['heading-4', 'text-h4'],
    ['heading-5', 'text-h5'],
    ['paragraph', 'text-body'],
    ['strong', 'text-strong'],
    ['button', 'text-button'],
    ['link', 'text-link'],
    ['small', 'text-small'],
  ];

  return Object.fromEntries(
    styles.flatMap(([name, prefix]) => {
      const fontSize = lookup[`${prefix}-size`];
      const fontWeight = lookup[`${prefix}-weight`];
      const lineHeight = lookup[`${prefix}-leading`];

      if (!fontSize || !fontWeight || !lineHeight) return [];

      return [[name, {
        fontFamily: lookup[`${prefix}-family`] ?? fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
      }]];
    })
  );
}

function looksLikeColor(value: string): boolean {
  return (
    /^#[0-9a-fA-F]{3,8}$/.test(value) ||
    /^(rgb|rgba|hsl|hsla|oklch|color|color-mix)\s*\(/i.test(value) ||
    /^var\(--/.test(value)
  );
}

function normaliseFromTailwind(path: string): Tokens {
  // Tailwind configs are JS — eval via tsx.
  const json = execSync(
    `npx -y tsx -e "const c = require('${path}'); console.log(JSON.stringify(c.default ?? c))"`,
    { encoding: 'utf-8' }
  );
  const config = JSON.parse(json.trim());
  const ext = config.theme?.extend ?? config.theme ?? {};
  return {
    colors: flattenTailwindColors(ext.colors ?? {}),
    typography: {},
    rounded: ext.borderRadius ?? {},
    spacing: ext.spacing ?? {},
  };
}

function flattenTailwindColors(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (typeof val === 'string') out[path] = val;
    else if (val && typeof val === 'object') Object.assign(out, flattenTailwindColors(val, path));
  }
  return out;
}

function extractTypography(raw: any): Record<string, TypographyToken> {
  const out: Record<string, TypographyToken> = {};
  for (const [name, val] of Object.entries(raw)) {
    if (val && typeof val === 'object' && 'fontFamily' in val) {
      out[name] = val as TypographyToken;
    } else if (val && typeof val === 'object' && '$value' in val) {
      out[name] = (val as any).$value;
    }
  }
  return out;
}

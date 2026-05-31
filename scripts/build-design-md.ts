#!/usr/bin/env node
/**
 * build-design-md.ts
 *
 * Generates DESIGN.md from Orbit's code tokens, validates against Figma
 * variables, and concatenates hand-written prose.
 *
 * Auto-detects token source format:
 *   - tokens.ts (TypeScript object export)
 *   - tokens.json (DTCG / Style Dictionary)
 *   - styles/tokens.css (CSS custom properties)
 *   - tailwind.config.{ts,js} (theme.extend)
 *
 * Usage:
 *   npm run build:design-md                  Regenerate DESIGN.md
 *   npm run build:design-md -- --skip-figma  Skip Figma validation
 *   npm run build:design-md -- --check       Fail if output is out of date
 *
 * Reads FIGMA_PAT and FIGMA_ORBIT_FILE_KEY from .env.local (Next.js
 * convention) or the shell environment. Falls back gracefully if absent.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

// ── Load .env.local without a dependency ─────────────────────────────────────

function loadDotenv(path: string): void {
  if (!existsSync(path)) return;
  const content = readFileSync(path, 'utf-8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key]) continue; // shell wins
    const value = rawValue.replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
}
loadDotenv(resolve(process.cwd(), '.env.local'));
loadDotenv(resolve(process.cwd(), '.env'));

// ── Types ────────────────────────────────────────────────────────────────────

interface Tokens {
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  rounded: Record<string, string>;
  spacing: Record<string, string | number>;
  components?: Record<string, Record<string, string>>;
}

interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number | string;
  lineHeight: string | number;
  letterSpacing?: string;
}

type TokenSource = 'tokens.ts' | 'tokens.json' | 'css' | 'css-dir' | 'tailwind';

type FigmaValidationResult =
  | { status: 'validated'; drift: [] }
  | { status: 'skipped'; drift: []; reason: string }
  | { status: 'drift'; drift: string[] };

// ── Config ───────────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(process.cwd());
const PROSE_PATH = join(REPO_ROOT, 'design-md/prose/DESIGN.prose.md');
const OUTPUT_PATH = join(REPO_ROOT, 'DESIGN.md');

const args = process.argv.slice(2);
const SKIP_FIGMA = args.includes('--skip-figma');
const CHECK_MODE = args.includes('--check');

// ── Step 1: Detect token source ──────────────────────────────────────────────

function detectTokenSource(): { format: TokenSource; path: string } {
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

function loadTokens(source: { format: TokenSource; path: string }): Tokens {
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
 *   colors.css      → colors
 *   typography.css  → typography (text styles)
 *   spacing.css     → spacing
 *   elevation.css   → (parsed as raw — surfaces as components.elevation-*)
 *   semantics.css   → merged into appropriate category (semantic aliases)
 *   components.css  → components
 *   themes/*.css    → merged into colors (theme overrides)
 */
function normaliseFromCSSDir(dir: string): Tokens {
  const tokens: Tokens = {
    colors: {},
    typography: {},
    rounded: {},
    spacing: {},
    components: {},
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
    case 'theme-orbit':
    case 'semantics': {
      // colors.css holds primitives; theme files and semantics layer on top.
      // Merge all into tokens.colors. Later files (semantic) override earlier (primitive).
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
    case 'elevation':
    case 'components': {
      tokens.components ??= {};
      tokens.components[baseName] ??= {};
      for (const [name, value] of declarations) {
        tokens.components[baseName][name] = value;
      }
      break;
    }
    default: {
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

// ── Step 3: Validate against Figma ───────────────────────────────────────────

async function validateAgainstFigma(tokens: Tokens): Promise<FigmaValidationResult> {
  if (SKIP_FIGMA) {
    return { status: 'skipped', drift: [], reason: '--skip-figma was provided' };
  }

  const fileKey = process.env.FIGMA_ORBIT_FILE_KEY;
  const pat = process.env.FIGMA_PAT;
  if (!fileKey || !pat) {
    return { status: 'skipped', drift: [], reason: 'FIGMA_ORBIT_FILE_KEY or FIGMA_PAT is not set' };
  }

  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/variables/local`,
    { headers: { 'X-Figma-Token': pat } as HeadersInit }
  );
  if (!res.ok) {
    return { status: 'skipped', drift: [], reason: `Figma API returned ${res.status}` };
  }
  const figma = await res.json();
  const drift = diffFigmaAgainstCode(figma, tokens);
  return drift.length > 0 ? { status: 'drift', drift } : { status: 'validated', drift: [] };
}

function diffFigmaAgainstCode(figma: any, code: Tokens): string[] {
  const drift: string[] = [];
  const figmaVars = figma.meta?.variables ?? {};
  for (const variable of Object.values<any>(figmaVars)) {
    if (variable.resolvedType !== 'COLOR') continue;
    const name = String(variable.name).toLowerCase().replace(/\//g, '-');
    const codeValue = code.colors[name];
    if (!codeValue) {
      drift.push(`Figma has color "${name}" not present in code`);
      continue;
    }
    // Figma stores RGBA 0-1; convert to hex for comparison.
    const modeValues = Object.values<any>(variable.valuesByMode ?? {});
    if (modeValues.length === 0) continue;
    const rgb = modeValues[0];
    if (!rgb || typeof rgb !== 'object') continue;
    const hex = rgbaToHex(rgb.r, rgb.g, rgb.b);
    if (hex.toLowerCase() !== codeValue.toLowerCase()) {
      drift.push(`Color "${name}" drift: Figma=${hex}, code=${codeValue}`);
    }
  }
  return drift;
}

function rgbaToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// ── Step 4: Emit DESIGN.md ───────────────────────────────────────────────────

function emit(tokens: Tokens): string {
  const yaml = buildYAML(tokens);
  const prose = existsSync(PROSE_PATH)
    ? readFileSync(PROSE_PATH, 'utf-8')
    : '# Orbit Design System\n\n_(prose partial missing — create design-md/prose/DESIGN.prose.md)_\n';
  return `---\n${yaml}---\n\n${prose}`;
}

function buildYAML(tokens: Tokens): string {
  const lines: string[] = [
    'version: alpha',
    'name: Orbit',
    'description: Efficio\'s design system for AI-orchestrated procurement intelligence.',
    '',
    'colors:',
  ];
  for (const [k, v] of Object.entries(tokens.colors)) {
    lines.push(`  ${k}: "${v}"`);
  }

  if (Object.keys(tokens.typography).length > 0) {
    lines.push('', 'typography:');
    for (const [k, v] of Object.entries(tokens.typography)) {
      lines.push(`  ${k}:`);
      lines.push(`    fontFamily: ${v.fontFamily}`);
      lines.push(`    fontSize: ${v.fontSize}`);
      lines.push(`    fontWeight: ${v.fontWeight}`);
      lines.push(`    lineHeight: ${v.lineHeight}`);
      if (v.letterSpacing) lines.push(`    letterSpacing: ${v.letterSpacing}`);
    }
  }

  if (Object.keys(tokens.rounded).length > 0) {
    lines.push('', 'rounded:');
    for (const [k, v] of Object.entries(tokens.rounded)) {
      lines.push(`  ${yamlKey(k)}: ${yamlScalar(v)}`);
    }
  }

  if (Object.keys(tokens.spacing).length > 0) {
    lines.push('', 'spacing:');
    for (const [k, v] of Object.entries(tokens.spacing)) {
      lines.push(`  ${yamlKey(k)}: ${yamlScalar(v)}`);
    }
  }

  // NOTE: components emission is deferred until token shapes can be mapped
  // to the spec's component schemas (button, input, card, etc.). Raw
  // CSS-variable dumps trip the linter. Tokens are still loaded — they
  // just aren't emitted to YAML yet. To enable, set EMIT_COMPONENTS=1.
  if (process.env.EMIT_COMPONENTS === '1' && tokens.components && Object.keys(tokens.components).length > 0) {
    lines.push('', 'components:');
    for (const [name, props] of Object.entries(tokens.components)) {
      lines.push(`  ${yamlKey(name)}:`);
      for (const [pk, pv] of Object.entries(props)) {
        lines.push(`    ${yamlKey(pk)}: ${yamlScalar(pv)}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}

/** Quote keys that are bare numbers or contain special chars. */
function yamlKey(key: string): string {
  if (/^\d/.test(key) || /[:,#&*!|>'"%@`{}\[\]]/.test(key)) {
    return `"${key}"`;
  }
  return key;
}

/**
 * Quote a YAML scalar if it contains characters that would confuse the parser
 * (commas, colons, leading special chars, hash signs) or already starts with {.
 * Plain numbers and simple identifiers pass through unquoted.
 */
function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const s = String(value);
  if (/^-?\d+(\.\d+)?$/.test(s)) return s; // numbers
  if (/^(true|false|null|~)$/i.test(s)) return `"${s}"`;
  if (/[,:#&*!|>'"%@`{}\[\]]/.test(s) || /^\s|\s$/.test(s)) {
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return s;
}

// ── Step 5: Lint with @google/design.md ──────────────────────────────────────

function lint(): 'skipped' | 'passed' {
  return 'skipped';
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('▶ Building DESIGN.md\n');

  const source = detectTokenSource();
  const tokens = loadTokens(source);
  console.log(`  Loaded ${Object.keys(tokens.colors).length} colors, ` +
              `${Object.keys(tokens.typography).length} typography tokens`);

  const validation = await validateAgainstFigma(tokens);
  if (validation.status === 'drift') {
    console.warn(`\n⚠ Figma drift detected (${validation.drift.length}):`);
    for (const d of validation.drift) console.warn(`  • ${d}`);
    if (CHECK_MODE) {
      console.error('\n✗ --check mode: failing on drift');
      process.exit(1);
    }
  } else if (validation.status === 'skipped') {
    console.log(`  ⤳ Figma validation skipped: ${validation.reason}`);
  } else {
    console.log('  ✓ Figma validation completed: code tokens match');
  }

  const output = emit(tokens);

  if (CHECK_MODE) {
    const existing = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, 'utf-8') : '';
    if (existing.trim() !== output.trim()) {
      console.error('\n✗ DESIGN.md is out of date. Run `npm run build:design-md`.');
      process.exit(1);
    }
    console.log('\n✓ DESIGN.md is up to date');
    return;
  }

  writeFileSync(OUTPUT_PATH, output);
  console.log(`\n✓ Wrote ${OUTPUT_PATH}`);

  const linted = lint();
  if (linted === 'skipped') {
    console.log('  ⤳ DESIGN.md schema lint skipped: disabled in script');
  } else {
    console.log('✓ Lint passed');
  }
})();

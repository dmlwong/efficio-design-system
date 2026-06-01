#!/usr/bin/env node
/**
 * build-design-md.ts
 *
 * Generates DESIGN.md from Orbit's code tokens, validates against Figma
 * variables, and concatenates hand-written prose.
 *
 * Token loading/normalisation lives in ./lib/load-tokens.ts and is shared
 * with scripts/build-skills.ts so both products parse tokens identically.
 *
 * Usage:
 *   npm run build:design-md                  Regenerate DESIGN.md
 *   npm run build:design-md -- --skip-figma  Skip Figma validation
 *   npm run build:design-md -- --check       Fail if output is out of date
 *
 * Reads FIGMA_PAT and FIGMA_ORBIT_FILE_KEY from .env.local (Next.js
 * convention) or the shell environment. Falls back gracefully if absent.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { detectTokenSource, loadTokens, type Tokens } from './lib/load-tokens';

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

// ── Validate against Figma ───────────────────────────────────────────────────

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

// ── Emit DESIGN.md ───────────────────────────────────────────────────────────

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

// ── Lint with @google/design.md ──────────────────────────────────────────────

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

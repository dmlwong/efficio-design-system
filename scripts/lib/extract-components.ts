/**
 * extract-components.ts
 *
 * Shared component extraction for the Orbit pipeline. Walks packages/orbit/src
 * with the TypeScript compiler API and returns structured ComponentInfo for
 * every exported component. Consumed by:
 *   - build-manifest.ts  → renders orbit-manifest.md
 *   - build-skills.ts    → renders the orbit-components skill
 *
 * Both render identical per-component blocks via emitComponent(), so the manifest
 * and the skill never disagree.
 *
 * Props/variants/tokens/composes are extracted from source. Descriptions are not
 * in source (components carry no JSDoc), so they come from the editable sidecar
 * design-md/prose/skills/component-descriptions.md.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import ts from 'typescript';

const REPO_ROOT = resolve(process.cwd());
const SRC_DIR = join(REPO_ROOT, 'packages', 'orbit', 'src');
const DESCRIPTIONS = join(REPO_ROOT, 'design-md', 'prose', 'skills', 'component-descriptions.md');

export type TokenGroup = 'colour' | 'spacing' | 'typography' | 'radius' | 'shadow' | 'other';

export interface PropInfo {
  name: string;
  type: string;
  required: string;
  default: string;
}
export interface ComponentInfo {
  name: string;
  file: string;
  category: string;
  description: string;
  props: PropInfo[];
  variants: Array<{ prop: string; values: string[] }>;
  tokens: Record<TokenGroup, string[]>;
  composes: string[];
}

const TOKEN_ORDER: TokenGroup[] = ['colour', 'spacing', 'typography', 'radius', 'shadow', 'other'];

// ── File gathering ─────────────────────────────────────────────────────────

function gather(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...gather(full, exts));
    else if (exts.some(e => entry.endsWith(e)) && !/\.test\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

export function categoryOf(file: string): string {
  const m = file.replace(/\\/g, '/').match(/packages\/orbit\/src\/([^/]+)\//);
  return m ? m[1] : 'misc';
}

// ── Descriptions sidecar ──────────────────────────────────────────────────────

function loadDescriptions(): Record<string, string> {
  const map: Record<string, string> = {};
  if (!existsSync(DESCRIPTIONS)) return map;
  for (const line of readFileSync(DESCRIPTIONS, 'utf-8').split('\n')) {
    const m = line.match(/^- \*\*(.+?)\*\* — (.+)$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}

// ── Token classification ──────────────────────────────────────────────────────

function classify(varName: string): TokenGroup {
  const n = varName.replace(/^--orbit-/, '');
  if (n.startsWith('color-')) return 'colour';
  if (n.startsWith('radius-')) return 'radius';
  if (n.startsWith('shadow-')) return 'shadow';
  if (n.startsWith('z-')) return 'other';
  if (/^(font-|text-|leading-)/.test(n)) return 'typography';
  return 'spacing'; // space-* and component sizing tokens
}

function collectTokens(tsxFile: string): Record<TokenGroup, string[]> {
  const sources = [tsxFile];
  const cssSibling = tsxFile.replace(/\.tsx$/, '.module.css');
  if (existsSync(cssSibling)) sources.push(cssSibling);

  const groups: Record<TokenGroup, Set<string>> = {
    colour: new Set(), spacing: new Set(), typography: new Set(),
    radius: new Set(), shadow: new Set(), other: new Set(),
  };
  for (const file of sources) {
    const text = readFileSync(file, 'utf-8');
    for (const m of text.matchAll(/--orbit-[\w-]+/g)) groups[classify(m[0])].add(m[0]);
  }
  const out = {} as Record<TokenGroup, string[]>;
  for (const g of TOKEN_ORDER) out[g] = [...groups[g]].sort();
  return out;
}

// ── AST helpers ────────────────────────────────────────────────────────────────

function unwrapToFunction(decl: ts.Declaration): ts.SignatureDeclaration | undefined {
  if (ts.isFunctionDeclaration(decl) || ts.isArrowFunction(decl) || ts.isFunctionExpression(decl)) return decl;
  if (ts.isVariableDeclaration(decl) && decl.initializer) {
    let init: ts.Expression = decl.initializer;
    while (ts.isCallExpression(init) && init.arguments.length > 0) init = init.arguments[0];
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return init;
  }
  return undefined;
}

function extractDefaults(decl: ts.Declaration): Record<string, string> {
  const defaults: Record<string, string> = {};
  const fn = unwrapToFunction(decl);
  const param = fn?.parameters?.[0];
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      if (el.initializer && ts.isIdentifier(el.name)) defaults[el.name.text] = el.initializer.getText();
    }
  }
  return defaults;
}

function extractComposes(sf: ts.SourceFile): string[] {
  const imported = new Set<string>();
  sf.forEachChild(node => {
    if (
      ts.isImportDeclaration(node) &&
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const spec = node.moduleSpecifier.text;
      if (spec.startsWith('.') || spec === '@efficio/orbit') {
        for (const e of node.importClause.namedBindings.elements) {
          if (/^[A-Z]/.test(e.name.text)) imported.add(e.name.text);
        }
      }
    }
  });
  const text = sf.getFullText();
  return [...imported].filter(name => new RegExp(`<${name}[\\s/>]`).test(text)).sort();
}

// ── Extraction ────────────────────────────────────────────────────────────────

export function extractComponents(): ComponentInfo[] {
  const allSources = gather(SRC_DIR, ['.ts', '.tsx']);
  const tsxFiles = allSources.filter(f => f.endsWith('.tsx'));
  const program = ts.createProgram(allSources, {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: false,
    skipLibCheck: true,
    noEmit: true,
    esModuleInterop: true,
  });
  const checker = program.getTypeChecker();
  const descriptions = loadDescriptions();
  const components: ComponentInfo[] = [];

  for (const file of tsxFiles) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    const moduleSymbol = checker.getSymbolAtLocation(sf);
    if (!moduleSymbol) continue;
    const rel = relative(REPO_ROOT, file).replace(/\\/g, '/');
    const tokens = collectTokens(file);
    const composes = extractComposes(sf);

    for (const exp of checker.getExportsOfModule(moduleSymbol)) {
      if (!/^[A-Z]/.test(exp.name)) continue;
      if (components.some(c => c.name === exp.name)) continue;
      const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
      const decl = sym.valueDeclaration ?? sym.declarations?.[0];
      if (!decl) continue;
      const type = checker.getTypeOfSymbolAtLocation(sym, decl);
      const sigs = type.getCallSignatures();
      if (sigs.length === 0) continue; // not a component

      const propsParam = sigs[0].parameters[0];
      const props: PropInfo[] = [];
      const variants: Array<{ prop: string; values: string[] }> = [];
      const defaults = extractDefaults(decl);

      if (propsParam) {
        const pDecl = propsParam.valueDeclaration ?? propsParam.declarations?.[0] ?? decl;
        const propsType = checker.getTypeOfSymbolAtLocation(propsParam, pDecl);
        for (const p of propsType.getProperties()) {
          // Keep only props DECLARED in Orbit source — drop inherited DOM/ARIA
          // attributes that come from @types/react in node_modules.
          const declaredInSource = (p.declarations ?? []).some(d => {
            const fn = d.getSourceFile().fileName.replace(/\\/g, '/');
            return fn.includes('/packages/orbit/src/') && !fn.includes('/node_modules/');
          });
          if (!declaredInSource) continue;
          const optional = (p.flags & ts.SymbolFlags.Optional) !== 0;
          const pd = p.valueDeclaration ?? p.declarations?.[0] ?? decl;
          const pType = checker.getTypeOfSymbolAtLocation(p, pd);
          props.push({
            name: p.name,
            type: checker.typeToString(pType).replace(/"/g, "'"),
            required: optional ? 'No' : 'Yes',
            default: defaults[p.name] ?? '',
          });
          if (pType.isUnion() && pType.types.every(t => t.isStringLiteral())) {
            variants.push({ prop: p.name, values: pType.types.map(t => String((t as ts.StringLiteralType).value)) });
          }
        }
        props.sort((a, b) => a.name.localeCompare(b.name));
        variants.sort((a, b) => a.prop.localeCompare(b.prop));
      }

      components.push({
        name: exp.name,
        file: rel,
        category: categoryOf(rel),
        description: descriptions[exp.name] ?? '',
        props,
        variants,
        tokens,
        composes,
      });
    }
  }

  components.sort((a, b) => a.name.localeCompare(b.name));
  return components;
}

// ── Rendering (shared by manifest + skill) ──────────────────────────────────

function esc(s: string): string {
  return s.replace(/\|/g, '\\|');
}

export function emitComponent(c: ComponentInfo): string {
  const lines: string[] = [];
  lines.push(`## ${c.name}`);
  lines.push(`- **File:** \`${c.file}\``);
  lines.push(`- **Description:** ${c.description || '—'}`);

  lines.push('- **Props:**');
  if (c.props.length) {
    lines.push('| Name | Type | Required | Default | Description |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const p of c.props) {
      const def = p.default ? `\`${esc(p.default)}\`` : '—';
      lines.push(`| \`${p.name}\` | \`${esc(p.type)}\` | ${p.required} | ${def} | — |`);
    }
  } else {
    lines.push('- none');
  }

  lines.push('- **Variants:**');
  if (c.variants.length) {
    for (const v of c.variants) lines.push(`- \`${v.prop}\`: ${v.values.map(x => `\`${x}\``).join(', ')}`);
  } else {
    lines.push('- none');
  }

  lines.push('- **Tokens consumed:**');
  const present = TOKEN_ORDER.filter(g => c.tokens[g].length > 0);
  if (present.length) {
    for (const g of present) lines.push(`  - ${g}: ${c.tokens[g].map(t => `\`${t}\``).join(', ')}`);
  } else {
    lines.push('  - none');
  }

  lines.push(`- **Composes:** ${c.composes.length ? c.composes.map(x => `\`${x}\``).join(', ') : 'none'}`);
  return lines.join('\n');
}

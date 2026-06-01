/**
 * audit-checks.ts
 *
 * Parses the contracts out of scripts/design-system-static-audit.mjs. Shared by
 * build-skills.ts (orbit-a11y skill) and build-docs-data.ts (per-component a11y
 * notes), so both read the same source of truth.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const REPO_ROOT = resolve(process.cwd());

export interface AuditCheck {
  name: string;
  details: string;
}

/** Extract check(name, pass, details) CALLS from the static audit script. */
export function parseAuditChecks(): AuditCheck[] {
  const path = join(REPO_ROOT, 'scripts', 'design-system-static-audit.mjs');
  const src = existsSync(path) ? readFileSync(path, 'utf-8') : '';
  // Match check(...) calls only — the negative lookbehind skips the
  // `function check(name, pass, details = '')` definition.
  const blocks = [...src.matchAll(/(?<!function )check\(([\s\S]*?)\n\);/g)].map(m => m[1]);
  const out: AuditCheck[] = [];
  for (const body of blocks) {
    const literals = [...body.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1]);
    if (literals.length === 0) continue;
    const name = literals[0].replace(/\\'/g, "'");
    // The remediation message is the last literal that reads as a sentence.
    const sentences = literals.filter(s => /^[A-Z].*\.$/.test(s));
    const details = (sentences.length ? sentences[sentences.length - 1] : '').replace(/\\'/g, "'");
    out.push({ name, details });
  }
  return out;
}

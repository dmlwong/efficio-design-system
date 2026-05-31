import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const includeExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const excludedDirs = new Set(['.git', '.next', 'node_modules']);
const sourceDirs = [
  'packages/orbit/src',
  'apps/docs/app',
  'apps/prototypes/app',
  'apps/prototypes/components',
  'apps/prototypes/data',
];
const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!includeExtensions.has(path.extname(entry))) continue;
    lintFile(fullPath);
  }
}

function lintFile(filePath) {
  const relativePath = path.relative(root, filePath);
  const source = readFileSync(filePath, 'utf8');
  source.split('\n').forEach((line, index) => {
    if (/\bdebugger\b/.test(line)) {
      findings.push(`${relativePath}:${index + 1} contains debugger statement`);
    }
    if (/\bconsole\.(log|debug)\b/.test(line)) {
      findings.push(`${relativePath}:${index + 1} contains console.${line.includes('console.debug') ? 'debug' : 'log'}`);
    }
  });
}

for (const sourceDir of sourceDirs) {
  const fullPath = path.join(root, sourceDir);
  if (existsSync(fullPath)) walk(fullPath);
}

if (findings.length > 0) {
  console.error('Non-interactive lint failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('Non-interactive lint passed.');

import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = join(repoRoot, 'packages/orbit');
const sourceRoot = join(packageRoot, 'src');
const distRoot = join(packageRoot, 'dist');

function copyCssModules(dir) {
  for (const entry of readdirSync(dir)) {
    const sourcePath = join(dir, entry);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      copyCssModules(sourcePath);
      continue;
    }

    if (!entry.endsWith('.module.css')) continue;

    const targetPath = join(distRoot, relative(sourceRoot, sourcePath));
    mkdirSync(dirname(targetPath), { recursive: true });
    copyFileSync(sourcePath, targetPath);
  }
}

copyCssModules(sourceRoot);

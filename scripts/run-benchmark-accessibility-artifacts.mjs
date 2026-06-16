#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const passThroughArgs = [];
let artifactPath;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === '--artifact') {
    artifactPath = args[index + 1];
    index += 1;
    continue;
  }

  if (arg.startsWith('--artifact=')) {
    artifactPath = arg.slice('--artifact='.length);
    continue;
  }

  passThroughArgs.push(arg);
}

const date = new Date().toISOString().slice(0, 10);
const defaultArtifactPath = path.join(
  root,
  'design-brain',
  '_benchmarks',
  'results',
  `${date}-benchmark-accessibility-artifact.md`,
);
const resolvedArtifactPath = path.resolve(root, artifactPath || defaultArtifactPath);
const vitestBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'vitest.cmd' : 'vitest',
);

mkdirSync(path.dirname(resolvedArtifactPath), { recursive: true });

const result = spawnSync(
  vitestBin,
  [
    'run',
    '--config',
    'vitest.benchmark-a11y.config.ts',
    '--reporter=dot',
    ...passThroughArgs,
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      BENCHMARK_A11Y_ARTIFACT_PATH: resolvedArtifactPath,
      BENCHMARK_A11Y_COMMAND: artifactPath
        ? `npm run bench:a11y -- --artifact ${artifactPath}`
        : 'npm run bench:a11y',
    },
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);

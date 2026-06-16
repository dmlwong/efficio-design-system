import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: false,
  esbuild: {
    jsx: 'automatic',
  } as any,
  resolve: {
    alias: {
      '@efficio/orbit': resolve(__dirname, 'packages/orbit/src'),
      '@': resolve(__dirname, 'apps/prototypes'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['test/benchmarks/accessibility-artifact.test.tsx'],
    setupFiles: ['./test/setup.ts'],
  },
});

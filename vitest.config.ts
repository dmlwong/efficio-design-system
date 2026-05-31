import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: false,
  // Vite 8's ESBuildOptions type omits this JSX option, but Vitest still uses it when OXC is disabled.
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
    setupFiles: ['./test/setup.ts'],
    include: ['packages/orbit/src/**/*.test.tsx', 'apps/prototypes/components/feature/clauseiq/**/*.test.tsx'],
  },
});

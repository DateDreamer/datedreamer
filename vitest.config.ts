import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@datedreamer/core': path.resolve(__dirname, './packages/core/src'),
      '@datedreamer/web-components': path.resolve(__dirname, './packages/web-components/src'),
      '@datedreamer/theme': path.resolve(__dirname, './packages/theme/src'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/*.test.ts'],
  }
});

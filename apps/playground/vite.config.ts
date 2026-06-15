
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@datedreamer/core': path.resolve(__dirname, '../packages/core/src'),
      '@datedreamer/web-components': path.resolve(__dirname, '../packages/web-components/src'),
      '@datedreamer/theme': path.resolve(__dirname, '../packages/theme/src'),
    }
  }
});

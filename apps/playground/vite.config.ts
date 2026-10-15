import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Load the live React source so edits update without publishing or rebuilding dist.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@tembok/ui-react': fileURLToPath(new URL('../../packages/ui-react/src/index.ts', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
});

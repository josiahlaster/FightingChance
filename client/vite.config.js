import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site is served from /FightingChance/, so built
// asset URLs must be prefixed with the repo name. Dev is unaffected
// (vite dev ignores `base` for module URLs and keeps its own paths).
// REPO_NAME can override if the repo is ever renamed.
const repoName = process.env.REPO_NAME || 'FightingChance';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the Express backend during development.
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});

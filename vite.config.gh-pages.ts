import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve('./src'),
    },
  },
  plugins: [react(), tailwindcss()],
  base: '/to-do/',
  build: {
    outDir: 'dist',
  },
});

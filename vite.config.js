import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      mathjs: fileURLToPath(new URL('./src/vendor/mathjs-lite.js', import.meta.url)),
    },
  },
});

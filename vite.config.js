import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['kodda.app', 'localhost'],
  },
});
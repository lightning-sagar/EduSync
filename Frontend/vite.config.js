import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Create separate chunks for larger libraries
            if (id.includes('react')) return 'react';
            if (id.includes('other-large-lib')) return 'other-large-lib';
          }
        },
      },
    },
  },
});

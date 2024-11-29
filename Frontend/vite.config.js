import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://edusync-ug2x.onrender.com/',
        changeOrigin: true
      }
    },
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  },
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

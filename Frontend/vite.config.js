import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust as necessary
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group larger modules into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor_react';
            }
            if (id.includes('lodash')) {
              return 'vendor_lodash';
            }
            // Add more conditions for libraries as needed
            return 'vendor';
          }
        },
      },
    },
  },
});

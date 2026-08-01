import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'security-headers-and-cache',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // ─── Security Headers (PRD #16) ───
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Referrer-Policy', 'no-referrer');
          res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
          res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
          res.setHeader('Content-Security-Policy', "frame-ancestors 'none';");

          // ─── Disable Caching for Media (PRD #17) ───
          if (req.url && (/\.(mp4|mp3|webm|ogg|wav|jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(req.url))) {
            res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }

          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // ─── Build Obfuscation (PRD #23) ───
  build: {
    rollupOptions: {
      output: {
        // Hash-based asset filenames instead of readable names
        assetFileNames: 'assets/[hash:16].[ext]',
        chunkFileNames: 'assets/[hash:16].js',
        entryFileNames: 'assets/[hash:16].js',
      }
    }
  }
})

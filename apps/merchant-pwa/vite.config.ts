import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'MS Pay',
        short_name: 'MS Pay',
        description: 'Your virtual currency wallet',
        theme_color: '#0F172A',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache app shell and static assets only
        // CRITICAL: never cache or queue credit-producing API calls (PRD §6)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
        // Explicitly DO NOT add any backgroundSync or offline fallback for API calls
        // Any attempt to queue /recharge, /pay, /approve offline is forbidden (PRD §6)
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ms-pay/types': path.resolve(__dirname, '../../packages/types/src'),
      '@ms-pay/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@ms-pay/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 5174,
  },
});

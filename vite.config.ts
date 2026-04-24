import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

const BUILD_DATE = new Date().toISOString().slice(0, 16).replace('T', ' ');
const isProd = process.env.NODE_ENV === 'production';
const BASE = isProd ? '/health-plan-app/' : './';

export default defineConfig({
  base: BASE,
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE)
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'icons/favicon.ico',
        'icons/apple-touch-icon-180x180.png',
        'icons/pwa-64x64.png',
        'icons/pwa-192x192.png',
        'icons/pwa-512x512.png',
        'icons/maskable-icon-512x512.png'
      ],
      manifest: {
        name: '道標 2',
        short_name: '道標 2',
        description: '健康人生設計プラン v7.4 実行支援 PWA',
        id: BASE,
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FAF8F4',
        theme_color: '#1B2B4A',
        icons: [
          { src: 'icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});

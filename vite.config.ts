import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      // SvelteKit does not reliably inject Vite PWA's register script into
      // SSR output, so app.html registers the worker explicitly.
      injectRegister: false,
      
      manifest: {
        id: '/',
        name: 'Happy Study 3D',
        short_name: 'HappyStudy3D',
        description: 'Free educational PWA for CXC, CAPE, and Software Engineering',
        theme_color: '#4F46E5',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
        ],
        
        categories: ['education', 'productivity', 'study'],
        
        shortcuts: [
          {
            name: 'CXC Studies',
            url: '/cxc',
            description: 'Start CXC study'
          },
          {
            name: 'CAPE Studies',
            url: '/cape',
            description: 'Start CAPE study'
          },
          {
            name: 'Software Engineering',
            url: '/software-engineering',
            description: 'Learn programming'
          },
          {
            name: 'Screen Studio',
            url: '/studio',
            description: 'Record your screen and study walkthroughs'
          }
        ]
      },
      
      workbox: {
        // adapter-vercel creates private server/* build files. They are not
        // public URLs, so precaching them makes Workbox installation fail.
        globIgnores: ['**/server/**'],
        // This app is served by SvelteKit, not a static index.html file.
        // Cache the public root document as the offline app shell instead.
        additionalManifestEntries: [{ url: '/', revision: null }],
        navigateFallback: '/',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /\.(?:mp3|webm|ogg|wav)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'study-audio-assets',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  
  server: {
    fs: {
      allow: ['..']
    }
  },
  
  preview: {
    port: 4173,
    strictPort: true
  },
  
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1500
  },
  
  optimizeDeps: {
    exclude: ['three']
  },
  
  ssr: {
    noExternal: ['three', '@sveltejs/kit']
  }
});

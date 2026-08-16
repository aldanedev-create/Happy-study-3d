import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x',
      regions: ['iad1'],
      split: false
    }),
    
    alias: {
      $components: 'src/lib/components',
      $data: 'src/lib/data',
      $stores: 'src/lib/stores',
      $services: 'src/lib/services',
      $types: 'src/lib/types',
      $utils: 'src/lib/utils',
      $three: 'src/lib/components/three'
    },
    
    csrf: {
      checkOrigin: true
    },
    
    version: {
      name: process.env.npm_package_version,
      pollInterval: 30000
    }
  }
};

export default config;
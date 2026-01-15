import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';



const config = defineConfig({
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1600
  },
  optimizeDeps: {
    exclude: [
      '@tanstack/react-start',
      '@tanstack/start-server-core',
      '@tanstack/start-client-core'
    ]
  },
  plugins: [
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    devtools(),
    tailwindcss(),
    viteReact({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    svgr(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale'],
      cookieName: 'lang',
    }),
  ]
});

export default config;

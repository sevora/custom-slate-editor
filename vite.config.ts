import { defineConfig } from 'vite';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

/**
 * This is the vite.js configuration which would 
 * influence how the vite toolkit works.
 */
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    svgr(),
    dts({ include: [ 'editor' ]})
  ],

  build: {
    copyPublicDir: true,
    lib: {
      entry: resolve(__dirname, 'editor/index.tsx'),
      formats: ['es'],
    },

    rollupOptions: {
      external: [ 'react', 'react/jsx-runtime' ],

      /**
       * These turns all the .ts or .tsx files into
       * entrypoints.
       */
      input: Object.fromEntries(
        glob.sync('editor/**/*.{ts,tsx}').map(file => [
          relative('editor', file.slice(0, file.length - extname(file).length) ),
          fileURLToPath(new URL(file, import.meta.url))
       ])
      ),

      /**
       * We want to make sure the names of the 
       * output files are pretty.
       */
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js'
      }
    }
  }
});
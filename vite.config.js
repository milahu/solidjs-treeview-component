/*
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  server: {
  	open: true, // open app in browser
  }
});
*/

import { defineConfig } from "vite";
import { resolve } from "path";
import solidPlugin from "vite-plugin-solid";

const abspath = relpath => resolve(__dirname, relpath);

export default defineConfig({

  plugins: [
    solidPlugin(),
  ],
  root: abspath('src/demo'),
  base: "./", // relative paths to assets, to make work with github-pages
  //publicDir: abspath('public'),
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
    outDir: abspath('dist'),
    emptyOutDir: true, // force clean
    assetsDir: '',
    rollupOptions: {
      input: {
        'demo': abspath('src/demo/index.html'),
      }
    },
  },
  server: {
    //open: '/src/demo/index.html',
    open: true,
  },
});

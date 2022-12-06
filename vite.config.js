import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

const assetsDir = '';
//const assetsDir = 'assets/';

const outputDefaults = {
  // remove hashes from filenames
  entryFileNames: `${assetsDir}[name].js`,
  chunkFileNames: `${assetsDir}[name].js`,
  assetFileNames: `${assetsDir}[name].[ext]`,
}

export default defineConfig({

  plugins: [
    solidPlugin(),
  ],
  root: "src/demo",
  base: "./", // relative paths for github-pages
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
    outDir: "dist",
    emptyOutDir: true, // force clean
    rollupOptions: {
      output: {
        ...outputDefaults,
      }
    },
  },
  server: {
    //open: true,
  },
  clearScreen: false,
});

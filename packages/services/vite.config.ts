import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: './src/index.ts', // Main entry file
      formats: ['es', 'cjs'], // Output formats: ESM and CommonJS
      fileName: (format) => `index.${format}.js`, // Naming convention
    },
    outDir: 'dist', // Directory to output the build files
    sourcemap: true, // Optional: include sourcemaps
    rollupOptions: {
      external: [], // Specify external dependencies if needed (empty for now)
    },
  },
});

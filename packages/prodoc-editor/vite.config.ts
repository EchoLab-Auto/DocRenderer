import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ProDocEditor',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@prodoc/core', '@prodoc/renderer', '@echolab/ui-frame'],
    },
    sourcemap: true,
    cssCodeSplit: false,
  },
});

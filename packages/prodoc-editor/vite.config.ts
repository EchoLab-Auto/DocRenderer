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
      external: ['vue', 'marked', /^@echolab-auto\/ui-frame(\/.*)?$/, '@prodoc/core'],
    },
    sourcemap: true,
    cssCodeSplit: false,
  },
});

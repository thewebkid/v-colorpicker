import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  return {
    plugins: [vue()],
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'VCpicker',
            fileName: 'v-cpicker',
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue',
              },
              assetFileNames: (assetInfo) => {
                if (assetInfo.name === 'style.css') return 'v-cpicker.css';
                return assetInfo.name;
              },
            },
          },
        }
      : {
          outDir: 'dist-demo',
        },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});

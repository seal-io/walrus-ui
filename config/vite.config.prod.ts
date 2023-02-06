import { mergeConfig } from 'vite';
import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import baseConig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configStyleImportPlugin from './plugin/styleImport';
import configImageminPlugin from './plugin/imagemin';
import { getBranchInfo } from './utils';

const versions = getBranchInfo();

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configArcoResolverPlugin(),
      configStyleImportPlugin(),
      configImageminPlugin(),
      createHtmlPlugin({
        template: 'index.html',
        inject: {
          data: {
            version: versions.version ? versions.version : 'DEV',
            commitId: versions.commitId,
          },
        },
      }),
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, '../index.html'),
          // external: path.resolve(__dirname, '../external.html'),
        },
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConig
);

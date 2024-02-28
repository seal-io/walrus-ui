import { mergeConfig } from 'vite';
import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteImageMin from './plugin/image-min';
import baseConig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configStyleImportPlugin from './plugin/styleImport';
import generateAceWorkerPlugin from './plugin/generate-ace-worker';
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
      viteImageMin(),
      generateAceWorkerPlugin({
        from: 'src/assets/js/ace',
        to: 'dist/assets/js/ace'
      }),
      createHtmlPlugin({
        template: 'index.html',
        inject: {
          data: {
            version: versions.version ? versions.version : 'DEV',
            commitId: versions.commitId
          }
        }
      })
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      },
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, '../index.html')
        },
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            // g6: ['@antv/g6'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n']
          }
        }
      },
      chunkSizeWarningLimit: 1500
    }
  },
  baseConig
);

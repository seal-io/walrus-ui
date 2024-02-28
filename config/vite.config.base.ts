import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoResolverPlugin from './plugin/arcoResolver';
import { getBranchInfo } from './utils';

const { argv } = require('yargs');

const baseUrl = argv.base || '/';
const mode = argv.mode || 'development';
const versions = getBranchInfo();

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    configArcoResolverPlugin()
  ],
  base: baseUrl,
  // root: './',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src')
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets')
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js' // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js' // compile template
      },
      {
        find: 'node_modules',
        replacement: resolve(__dirname, '../node_modules')
      }
    ],
    extensions: ['.ts', '.js']
  },
  optimizeDeps: {
    exclude: ['@antv/x6-vue-shape']
  },
  define: {
    'process.env': {
      dev_mode: mode,
      BASE_URL: baseUrl
    },
    '_SEAL_': {
      commitId: versions.commitId
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`
        },
        additionalData: `@import "@/assets/style/mixins.less";`,
        javascriptEnabled: true
      }
    }
  }
});

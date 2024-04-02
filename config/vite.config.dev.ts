import { mergeConfig } from 'vite';
import path, { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import htmlTemplate from 'vite-plugin-html-template';
import basicSsl from '@vitejs/plugin-basic-ssl';
import baseConfig from './vite.config.base';
import { getBranchInfo } from './utils';
import createProxyTable from './proxy-table';

const versions = getBranchInfo();

// noinspection JSUnusedGlobalSymbols
export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true
      },
      https: true,
      port: 400,
      proxy: createProxyTable()
    },
    plugins: [
      basicSsl(),
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules']
      }),
      htmlTemplate({
        pages: {
          index: {
            template: resolve(__dirname, '../index.html')
          }
        },
        data: {
          version: versions.version ? versions.version : 'DEV',
          commitId: versions.commitId
        }
      })
    ],
    optimizeDeps: {
      exclude: ['@antv/x6']
    },
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, '../index.html')
        }
      }
    }
  },
  baseConfig
);

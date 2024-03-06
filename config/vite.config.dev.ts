import { mergeConfig } from 'vite';
import path, { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import htmlTemplate from 'vite-plugin-html-template';
import basicSsl from '@vitejs/plugin-basic-ssl';
import baseConig from './vite.config.base';
import { getBranchInfo } from './utils';
import createProxyTable from './proxy-table';

const versions = getBranchInfo();

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true
      },
      https: true,
      port: 5050,
      proxy: createProxyTable('https://lmkcc.site')
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
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, '../index.html')
        }
      }
    }
  },
  baseConig
);

import { mergeConfig } from 'vite';
import path, { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import htmlTemplate from 'vite-plugin-html-template';
import baseConig from './vite.config.base';
import { getBranchInfo } from './utils';
import createProxyTable from './proxy-table';
import setRequestHeader from './plugin/setRequestHeader';

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
      port: 4000,
      // cors: {
      //   origin: 'https://localhost:4000'
      // },
      // proxy: createProxyTable('https://192.168.2.5')
      // proxy: createProxyTable('https://e5a5-13-213-92-132.ap.ngrok.io/')
      proxy: createProxyTable('https://192.168.2.123')
    },
    plugins: [
      // setRequestHeader(),
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
          // external: path.resolve(__dirname, '../external.html'),
        }
      }
    }
  },
  baseConig
);

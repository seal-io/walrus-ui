import axios from 'axios';
import { h } from 'vue';
import i18n from '@/locale/index';
import { Modal } from '@arco-design/web-vue';
import { get, startsWith } from 'lodash';

export const getVersion = (data) => {
  const version = get(data, 'version') || '';
  const commit = get(data, 'commitId') || '';
  return startsWith(version, 'v') ? version : `dev-${commit.substring(0, 7)}`;
};
export interface versionData {
  web: { version: string; commitId: string };
  server: { version: string; commitId: string };
}
export function fetchAppVersion(): { version: string; commitId: string } {
  const html = document.documentElement;
  const appVersion = html.getAttribute('data-version') || '';
  const appHash = html.getAttribute('data-hash') || '';
  return {
    version: appVersion,
    commitId: appHash ? appHash.substring(0, 15) : ''
  };
}

export function queryAppServerVersion() {
  return axios.get(`/debug/version`);
}
export function showVersionModal(data: versionData) {
  Modal.info({
    title: i18n.global.t('common.footer.version.title'),
    top: '20%',
    footer: () => h('span'),
    // title: () => h('div', {}, i18n.global.t('common.footer.version.title')),
    simple: true,
    alignCenter: false,
    content: () =>
      h('div', { style: 'text-align: center' }, [
        h('div', { style: 'margin-bottom: 5px' }, [
          h(
            'span',
            {
              style:
                'font-weight: 500;display: inline-block;width: 60px;padding-right: 10px;text-align: right;'
            },
            `${i18n.global.t('common.footer.version.web')}`
          ),
          h(
            'span',
            { style: 'display: inline-block;width: 100px;text-align: left' },
            `${getVersion(get(data, 'web'))}`
          )
        ]),
        h('div', {}, [
          h(
            'span',
            {
              style:
                'font-weight: 500;display: inline-block;width: 60px;padding-right: 10px;text-align: right;'
            },
            `${i18n.global.t('common.footer.version.server')}`
          ),
          h(
            'span',
            { style: 'display: inline-block;width: 100px;text-align: left' },
            `${getVersion(get(data, 'server'))}`
          )
        ])
      ])
  });
}

export async function useAppVersion(): Promise<versionData> {
  const web = fetchAppVersion();
  const { data } = await queryAppServerVersion();
  return {
    web,
    server: {
      version: get(data, 'version') || '',
      commitId: get(data, 'commit') ? get(data, 'commit').substring(0, 15) : ''
    }
  };
}

export default {};

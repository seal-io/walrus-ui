import { PROFILE } from '@/router/config';

export const profileMenu = [
  {
    name: 'settings.help',
    key: 'help',
    icon: '<i class="iconfont icon-bangzhuyushuoming" />',
    children: [
      {
        name: 'common.issue.report',
        key: 'home',
        value: 'https://github.com/seal-io/walrus/issues/new/choose',
        icon: '<icon-github class="size-18"/>'
      },
      {
        name: 'common.social.discord',
        key: 'home',
        value: 'https://discord.com/invite/fXZUKK2baF',
        icon: '<i  class="iconfont icon-discord1 size-18"/>'
      },
      {
        name: 'settings.document',
        key: 'docs',
        value(lang: string) {
          return `https://seal-io.github.io/docs/${lang}`;
        },
        icon: '<icon-book  class="size-18" />'
      },
      {
        name: 'common.footer.version',
        key: 'version',
        value: '',
        icon: '<i class="iconfont icon-version size-18" />'
      }
    ]
  },
  {
    name: 'settings.language',
    key: 'userCenter',
    icon: '<i class="iconfont icon-language"></i>',
    children: [
      {
        name: '中文',
        key: 'chinese',
        route: PROFILE.UserCenter,
        value: 'zh-CN',
        icon: '<i class="iconfont icon-fuhao-zhongwen" />'
      },
      {
        name: 'English',
        key: 'english',
        value: 'en-US',
        icon: '<i class="iconfont icon-english" />'
      }
    ]
  },
  {
    name: 'common.button.download',
    key: 'CliDownload',
    route: 'CliDownload',
    icon: '<icon-download/>',
    children: []
  }
];

export const avatarMenu = [
  {
    name: 'mneu.user.account',
    key: 'Profile',
    icon: '<i class="iconfont icon-user-circle" />',
    iconStyle: { color: 'var(--color-avatar-icon)', opacity: 1 },
    itemStyle: {},
    children: [
      {
        name: 'navbar.appearance',
        key: 'darkMode'
      },
      {
        name: 'propfile.account.user.info',
        key: 'UserCenter',
        route: PROFILE.UserCenter,
        icon: '<icon-user />'
      },
      { name: 'common.button.logout', key: 'logout', icon: '<icon-export/>' }
    ]
  }
];

export default {};

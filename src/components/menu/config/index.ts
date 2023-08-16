import { PROFILE } from '@/router/config';

export const profileMenu = [
  {
    name: 'settings.help',
    key: 'help',
    icon: '<i class="iconfont icon-bangzhuyushuoming size-18" />',
    children: [
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
      },
      {
        name: 'seal.io',
        key: 'home',
        value: 'https://www.seal.io/',
        icon: '<icon-home  class="size-18"/>'
      }
    ]
  },
  {
    name: 'settings.language',
    key: 'userCenter',
    icon: '<i class="iconfont icon-language size-18"></i>',
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
    name: 'common.cli.download',
    key: 'clidownload',
    route: 'CliDownload',
    icon: '<icon-download class="size-18"/>',
    children: [
      // {
      //   name: 'common.cli.download',
      //   key: 'clidownload',
      //   route: 'CliDownload',
      //   icon: '<icon-download />'
      // }
    ]
  }
];

export const avatarMenu = [
  {
    name: 'propfile.account.user.title',
    key: 'Profile',
    icon: '<i class="iconfont icon-user-circle size-20" />',
    iconStyle: { color: 'rgb(var(--arcoblue-5))' },
    itemStyle: { paddingLeft: '10px' },
    children: [
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

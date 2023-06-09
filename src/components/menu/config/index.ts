export const profileMenu = [
  {
    name: 'settings.language',
    key: 'userCenter',
    icon: '<i class="iconfont icon-language size-18"></i>',
    children: [
      {
        name: '中文',
        key: 'chinese',
        route: 'UserCenter',
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
    name: 'propfile.account.user.title',
    key: 'Profile',
    icon: '<i class="iconfont icon-user1 size-20"/>',
    children: [
      {
        name: 'propfile.account.user.info',
        key: 'UserCenter',
        route: 'UserCenter',
        icon: '<icon-user />'
      },
      { name: 'messageBox.logout', key: 'logout', icon: '<icon-export/>' }
    ]
  }
];

export default {};

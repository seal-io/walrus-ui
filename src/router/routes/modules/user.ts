export default {
  path: 'user',
  name: 'User',
  component: () => import('@/views/user/index.vue'),
  meta: {
    hideInMenu: true,
    ignoreCache: true,
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 6
  },
  children: [
    // {
    //   path: 'info',
    //   name: 'Info',
    //   component: () => import('@/views/user/info/index.vue'),
    //   meta: {
    //     hideInMenu: true,
    //     ignoreCache: true,
    //     locale: 'menu.user.info',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'setting',
    //   name: 'Setting',
    //   component: () => import('@/views/user/setting/index.vue'),
    //   meta: {
    //     hideInMenu: true,
    //     ignoreCache: true,
    //     locale: 'menu.user.setting',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'settings',
      name: 'SystemSetting',
      component: () => import('@/views/user/system/setting.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: true,
        locale: 'menu.system.setting',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
};

export default {
  path: 'user',
  name: 'user',
  component: () => import('@/views/user/index.vue'),
  meta: {
    ignoreCache: true,
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 6,
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
      name: 'systemSetting',
      component: () => import('@/views/user/system/setting.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        locale: 'menu.system.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'plugins',
      name: 'pluginsList',
      component: () => import('@/views/user/plugins/index.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        locale: 'menu.plugins.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

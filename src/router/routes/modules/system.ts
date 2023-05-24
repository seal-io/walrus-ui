export default {
  path: 'system',
  name: 'System',
  component: () => import('@/views/system/index.vue'),
  meta: {
    hideInMenu: false,
    ignoreCache: true,
    locale: 'menu.system.setting',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 6
  },
  children: [
    {
      path: 'users',
      name: 'SystemUsers',
      component: () => import('@/views/system/pages/users.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        clearMenuStatus: false,
        locale: 'menu.system.user',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'settings',
      name: 'SystemSetting',
      component: () => import('@/views/system/pages/setting.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        clearMenuStatus: false,
        locale: 'menu.system.config',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
};

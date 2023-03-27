export default {
  path: 'profile',
  name: 'profile',
  component: () => import('@/views/profile/index.vue'),
  meta: {
    // isRemove: true,
    hideInMenu: true,
    locale: 'account.settings.title',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 8
  },
  children: [
    {
      path: 'modify-password',
      name: 'modifyPassword',
      component: () => import('@/views/profile/pages/modify-password.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: true,
        locale: 'user.password.modify',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'api-keys',
      name: 'apiKeys',
      component: () => import('@/views/profile/pages/api-keys.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: true,
        locale: 'account.settings.apikeys',
        requiresAuth: true,
        roles: ['*']
      }
    }
    // {
    //   path: '',
    //   name: 'Basic',
    //   component: () => import('@/views/profile/basic/index.vue'),
    //   meta: {
    //     locale: 'menu.profile.basic',
    //     requiresAuth: true,
    //     roles: ['admin'],
    //   },
    // },
  ]
};

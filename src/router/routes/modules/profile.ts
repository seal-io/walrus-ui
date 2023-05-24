export default {
  path: 'profile',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: {
    // isRemove: true,
    hideInMenu: true,
    locale: 'propfile.account.settings',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 8
  },
  children: [
    {
      path: 'settings',
      name: 'AccountSettings',
      component: () => import('@/views/profile/pages/main.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: true,
        locale: '账户管理',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'modify-password',
      name: 'ModifyPassword',
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
      name: 'ApiKeys',
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

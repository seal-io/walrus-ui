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
    }
  ]
};

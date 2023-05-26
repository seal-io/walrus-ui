export default {
  path: 'profile',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: {
    // isRemove: true,
    hideInMenu: true,
    locale: 'propfile.account.settings',
    requiresAuth: false,
    isRouteView: true,
    icon: 'icon-settings',
    order: 8
  },
  children: [
    {
      path: 'info',
      name: 'UserCenter',
      component: () => import('@/views/profile/pages/main.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: true,
        locale: 'propfile.account.user.title',
        requiresAuth: false,
        roles: ['*']
      }
    }
  ]
};

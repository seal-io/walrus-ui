import PROFILE from '../../config/profile';

export default {
  path: 'profile',
  name: PROFILE.Index,
  component: () => import('@/views/profile/index.vue'),
  meta: {
    // isRemove: true,
    hideInMenu: true,
    locale: 'propfile.account.settings',
    requiresAuth: false,
    isRouteView: true,
    icon: 'icon-settings',
    profileView: true,
    order: 8
  },
  children: [
    {
      path: 'info',
      name: PROFILE.UserCenter,
      component: () => import('@/views/profile/pages/main.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        clearMenuStatus: false,
        locale: 'propfile.account.user.title',
        requiresAuth: false,
        profileView: true,
        roles: ['*']
      }
    }
  ]
};

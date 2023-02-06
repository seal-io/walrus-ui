export default {
  path: 'dashboard',
  name: 'dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    isRemove: false,
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'main',
      name: 'dashboardMain',
      component: () => import('@/views/dashboard/pages/main.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: '',
        requiresAuth: true,
        icon: '',
        order: 0,
      },
    },
  ],
};

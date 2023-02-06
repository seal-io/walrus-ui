export default {
  path: 'logs',
  name: 'logs',
  component: () => import('@/views/logs/index.vue'),
  meta: {
    // hideInMenu: true,
    ignoreCache: true,
    locale: 'navbar.logs',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'logsList',
      component: () => import('@/views/logs/pages/list.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.logs',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
  ],
};

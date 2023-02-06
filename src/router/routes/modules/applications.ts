export default {
  path: 'applications',
  name: 'applications',
  component: () => import('@/views/applications/index.vue'),
  meta: {
    // hideInMenu: true,
    ignoreCache: true,
    locale: 'navbar.application',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'applicationsList',
      component: () => import('@/views/applications/pages/list.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.application',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'detail',
      name: 'applicationsDetail',
      component: () => import('@/views/applications/pages/detail.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.application',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'edit',
      name: 'applicationsEdit',
      component: () => import('@/views/applications/pages/edit.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.application',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
  ],
};

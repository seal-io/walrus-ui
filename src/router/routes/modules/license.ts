export default {
  path: 'license',
  name: 'license',
  component: () => import('@/views/license/index.vue'),
  meta: {
    // hideInMenu: true,
    ignoreCache: true,
    locale: 'navbar.license',
    requiresAuth: true,
    icon: '',
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'licenseList',
      component: () => import('@/views/license/pages/list.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.license',
        requiresAuth: true,
        icon: '',
      },
    },
    {
      path: 'edit',
      name: 'tagEdit',
      component: () => import('@/views/license/pages/detail.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.license',
        requiresAuth: true,
        icon: '',
      },
    },
  ],
};

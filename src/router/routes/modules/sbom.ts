export default {
  path: 'components',
  name: 'sBom',
  component: () => import('@/views/soft-bom/index.vue'),
  meta: {
    // hideInMenu: true,
    ignoreCache: true,
    locale: 'navbar.sbom',
    requiresAuth: true,
    icon: '',
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'sBomList',
      component: () => import('@/views/soft-bom/pages/list.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.sbom',
        requiresAuth: true,
        icon: '',
      },
    },
    {
      path: 'detail',
      name: 'componentDetail',
      component: () => import('@/views/soft-bom/pages/detail.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.sbom',
        requiresAuth: true,
        icon: '',
      },
    },
  ],
};

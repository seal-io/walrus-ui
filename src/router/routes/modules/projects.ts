export default {
  path: 'resource',
  name: 'projects',
  component: () => import('@/views/projects/index.vue'),
  meta: {
    // hideInMenu: true,
    ignoreCache: true,
    locale: 'navbar.projects',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'projectsList',
      component: () => import('@/views/projects/pages/list.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.projects',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'import-repo',
      name: 'importRepo',
      component: () => import('@/views/projects/pages/import-repo.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.projects',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'kuber',
      name: 'kuberResource',
      component: () => import('@/views/projects/pages/kuber-resource.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.projects',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'detail',
      name: 'projectSBom',
      component: () => import('@/views/projects/pages/detail.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.sbom',
        requiresAuth: true,
        icon: '',
      },
    },
    {
      path: 'history',
      name: 'scanHistory',
      component: () => import('@/views/projects/pages/history.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: 'navbar.sbom',
        requiresAuth: true,
        icon: '',
      },
    },
    {
      path: 'fix-detail',
      name: 'fixDetail',
      component: () => import('@/views/projects/pages/fix-detail.vue'),
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

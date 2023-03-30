export default [
  {
    path: 'project/applications/list',
    name: 'ApplicationsList',
    component: () =>
      import('@/views/application-management/applications/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'applications.applications.menu',
      requiresAuth: true,
      icon: 'icon-apps',
      cachePages: ['ApplicationsDetail']
    }
  },
  {
    path: 'project/:projectId/application/detail/:action',
    name: 'ApplicationsDetail',
    component: () =>
      import('@/views/application-management/applications/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'applications.applications.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

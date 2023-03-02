export default [
  {
    path: 'applications/list',
    name: 'applicationsList',
    component: () =>
      import('@/views/application-management/applications/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'applications.applications.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'applications/edit',
    name: 'applicationsEdit',
    component: () =>
      import('@/views/application-management/applications/pages/edit.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'applications.applications.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'applications/detail',
    name: 'applicationsDetail',
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

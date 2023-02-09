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
  }
];

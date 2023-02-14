export default [
  {
    path: 'projects/list',
    name: 'projectsList',
    component: () =>
      import('@/views/application-management/projects/pages/list.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: true,
      ignoreCache: true,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

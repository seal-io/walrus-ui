export default [
  {
    path: 'project/list',
    name: 'projectsList',
    component: () =>
      import('@/views/application-management/projects/pages/list.vue'),
    meta: {
      hideInMenu: false,
      hideMenu: false,
      ignoreCache: true,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

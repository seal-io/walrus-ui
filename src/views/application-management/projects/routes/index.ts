export default [
  {
    path: 'projects/list',
    name: 'projectsList',
    component: () =>
      import('@/views/application-management/projects/pages/list.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'navbar.appManagement',
      requiresAuth: true,
      icon: 'icon-apps',
    },
  },
];

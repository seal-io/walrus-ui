export default [
  {
    path: 'workflows/list',
    name: 'workflowsList',
    component: () =>
      import('@/views/application-management/workflows/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'applications.workflows.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

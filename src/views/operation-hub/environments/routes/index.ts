export default [
  {
    path: 'environment/list',
    name: 'environmentList',
    component: () =>
      import('@/views/operation-hub/environments/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      icon: 'icon-apps',
    },
  },
];

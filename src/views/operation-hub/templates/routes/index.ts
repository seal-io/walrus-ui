export default [
  {
    path: 'templates/list',
    name: 'templateList',
    component: () => import('@/views/operation-hub/templates/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      icon: 'icon-apps',
    },
  },
];

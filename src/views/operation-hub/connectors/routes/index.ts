export default [
  {
    path: 'connector/list',
    name: 'connectorsList',
    component: () => import('@/views/operation-hub/connectors/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps',
    },
  },
];

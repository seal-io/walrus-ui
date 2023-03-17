export default [
  {
    path: 'global-secrets/list',
    name: 'globalSecretsList',
    component: () => import('../pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'applications.applications.secret',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

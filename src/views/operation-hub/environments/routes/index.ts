export default [
  {
    path: 'environment/list',
    name: 'EnvironmentList',
    component: () =>
      import('@/views/operation-hub/environments/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      icon: 'icon-apps',
      cachePages: ['EnvironmentDetail']
    }
  },
  {
    path: 'environment/detail/:action',
    name: 'EnvironmentDetail',
    component: () =>
      import('@/views/operation-hub/environments/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

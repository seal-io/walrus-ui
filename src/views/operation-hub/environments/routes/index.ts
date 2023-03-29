export default [
  {
    path: 'environment/list',
    name: 'environmentList',
    component: () =>
      import('@/views/operation-hub/environments/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      icon: 'icon-apps',
      cachePages: ['environmentDetail']
    }
  },
  {
    path: 'environment/detail',
    name: 'environmentDetail',
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

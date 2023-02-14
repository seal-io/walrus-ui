export default [
  {
    path: 'optimize/list',
    name: 'costOptimizeList',
    component: () => import('@/views/cost-management/optimize/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'cost.optimize.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

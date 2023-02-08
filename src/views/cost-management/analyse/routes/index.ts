export default [
  {
    path: 'cost/list',
    name: 'costAnalyseList',
    component: () => import('@/views/cost-management/analyse/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      icon: 'icon-apps',
    },
  },
];

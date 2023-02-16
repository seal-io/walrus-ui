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
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/perspective-all',
    name: 'costAnalyseAll',
    component: () =>
      import('@/views/cost-management/analyse/pages/perspective-all.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/perspective-project',
    name: 'costAnalyseProject',
    component: () =>
      import('@/views/cost-management/analyse/pages/perspective-project.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/perspective-cluster',
    name: 'costAnalyseCluster',
    component: () =>
      import('@/views/cost-management/analyse/pages/perspective-cluster.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

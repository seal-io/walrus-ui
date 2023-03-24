export default [
  {
    path: 'cost/perspective',
    name: 'costPerspective',
    component: () => import('@/views/cost-management/analyse/pages/main.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/list',
    name: 'costAnalyseList',
    component: () => import('@/views/cost-management/analyse/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'cost.analyse.table.manage',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
  // {
  //   path: 'cost/perspective-all',
  //   name: 'costAnalyseAll',
  //   component: () =>
  //     import('@/views/cost-management/analyse/pages/perspective-all.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     ignoreCache: true,
  //     locale: 'cost.analyse.menu',
  //     requiresAuth: true,
  //     icon: 'icon-apps'
  //   }
  // },
  // {
  //   path: 'cost/perspective-edit',
  //   name: 'costPerspectiveEdit',
  //   component: () =>
  //     import('@/views/cost-management/analyse/pages/perspective-edit.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     ignoreCache: true,
  //     locale: 'cost.analyse.menu',
  //     requiresAuth: true,
  //     icon: 'icon-apps'
  //   }
  // },
  // {
  //   path: 'cost/perspective-project',
  //   name: 'costAnalyseProject',
  //   component: () =>
  //     import('@/views/cost-management/analyse/pages/perspective-project.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     ignoreCache: true,
  //     locale: 'cost.analyse.menu',
  //     requiresAuth: true,
  //     icon: 'icon-apps'
  //   }
  // },
  // {
  //   path: 'cost/perspective-custom',
  //   name: 'costAnalyseCustom',
  //   component: () =>
  //     import('@/views/cost-management/analyse/pages/perspective-custom.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     ignoreCache: true,
  //     locale: 'cost.analyse.menu',
  //     requiresAuth: true,
  //     icon: 'icon-apps'
  //   }
  // },
  // {
  //   path: 'cost/perspective-cluster',
  //   name: 'costAnalyseCluster',
  //   component: () =>
  //     import('@/views/cost-management/analyse/pages/perspective-cluster.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     ignoreCache: true,
  //     locale: 'cost.analyse.menu',
  //     requiresAuth: true,
  //     icon: 'icon-apps'
  //   }
  // }
];

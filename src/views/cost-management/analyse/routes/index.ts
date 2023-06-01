import { Resources } from '@/permissions/config';

export default [
  {
    path: 'cost/perspective',
    name: 'CostPerspective',
    component: () => import('@/views/cost-management/analyse/pages/main.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'menu.costManagement.analyse',
      requiresAuth: true,
      permission: {
        resource: Resources.Costs,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/list',
    name: 'CostAnalyseList',
    component: () => import('@/views/cost-management/analyse/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'menu.costManagement.perspective',
      requiresAuth: true,
      permission: {
        resource: Resources.Costs,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['CostPerspectiveEdit']
    }
  },
  {
    path: 'cost/perspective-edit/:action',
    name: 'CostPerspectiveEdit',
    component: () =>
      import('@/views/cost-management/analyse/pages/perspective-edit.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Costs,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  }
  // {
  //   path: 'cost/perspective-all',
  //   name: 'CostAnalyseAll',
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
  //   path: 'cost/perspective-project',
  //   name: 'CostAnalyseProject',
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
  //   name: 'CostAnalyseCustom',
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
  //   name: 'CostAnalyseCluster',
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

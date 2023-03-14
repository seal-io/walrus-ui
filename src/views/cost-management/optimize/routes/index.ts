export default [
  {
    path: 'optimize',
    // name: 'costOptimizeK8s',
    // component: () => import('@/views/cost-management/optimize/pages/k8s.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'cost.optimize.menu',
      requiresAuth: true,
      icon: ''
    },
    children: [
      {
        path: 'k8s',
        name: 'costOptimizeKube',
        component: () =>
          import('@/views/cost-management/optimize/pages/k8s.vue'),
        meta: {
          hideInMenu: false,
          ignoreCache: true,
          locale: 'K8s',
          requiresAuth: true,
          icon: ''
        }
      },
      {
        path: 'k8s-detail',
        name: 'costOptimizeClusterDetail',
        component: () =>
          import('@/views/cost-management/optimize/pages/cluster-detail.vue'),
        meta: {
          hideInMenu: true,
          ignoreCache: true,
          locale: 'cost.optimize.menu',
          requiresAuth: true,
          icon: 'icon-apps'
        }
      }
    ]
  }
];

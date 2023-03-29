export default [
  {
    path: 'connector/list',
    name: 'ConnectorsList',
    component: () => import('@/views/operation-hub/connectors/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps',
      cachePages: [
        'ConnectorK8sDetail',
        'ConnectorScmDetail',
        'ConnectorCustomDetail'
      ]
    }
  },
  {
    path: 'connector/k8s-detail',
    name: 'ConnectorK8sDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/k8s-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'connector/scm-detail',
    name: 'ConnectorScmDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/scm-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'connector/custom-detail',
    name: 'ConnectorCustomDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/custom-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  }
];

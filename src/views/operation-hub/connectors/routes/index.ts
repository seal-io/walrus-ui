export default [
  {
    path: 'connector/list',
    name: 'connectorsList',
    component: () => import('@/views/operation-hub/connectors/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      icon: 'icon-apps'
    }
  },
  {
    path: 'connector/k8s-detail',
    name: 'connectorK8sDetail',
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
    name: 'connectorScmDetail',
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
    name: 'connectorCustomDetail',
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

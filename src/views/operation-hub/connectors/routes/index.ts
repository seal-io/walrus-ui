import { Resources } from '@/permissions/resources';

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
      permission: {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: [
        'ConnectorK8sDetail',
        'ConnectorScmDetail',
        'ConnectorCustomDetail'
      ]
    }
  },
  {
    path: 'connector/k8s-detail/:action',
    name: 'ConnectorK8sDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/k8s-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'connector/scm-detail/:action',
    name: 'ConnectorScmDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/scm-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'connector/custom-detail/:action',
    name: 'ConnectorCustomDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/custom-detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  }
];

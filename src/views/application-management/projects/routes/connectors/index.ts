import { Resources } from '@/permissions/config';

export default [
  {
    path: 'project/:projectId/connector/k8s-detail/:action',
    name: 'ProjectConnectorK8sDetail',
    component: () => import('../../pages/connector/kubernetes.vue'),
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
    path: 'project/:projectId/connector/scm-detail/:action',
    name: 'ProjectConnectorScmDetail',
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
    path: 'project/:projectId/connector/custom-detail/:action',
    name: 'ProjectConnectorCustomDetail',
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
  },
  {
    path: 'project/:projectId/connector/cloud-provider/:action',
    name: 'ProjectConnectorProviderDetail',
    component: () =>
      import('@/views/operation-hub/connectors/pages/cloud-provider.vue'),
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

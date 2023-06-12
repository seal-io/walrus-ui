import { Resources } from '@/permissions/config';
import { OPERATIONHUB } from '@/router/config';

export default [
  {
    path: 'connector/list',
    name: OPERATIONHUB.ConnectorList,
    component: () => import('@/views/operation-hub/connectors/pages/list.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: []
    }
  },
  {
    path: 'connector/k8s-detail/:action',
    name: OPERATIONHUB.ConnectorK8sDetail,
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
    name: OPERATIONHUB.ConnectorScmDetail,
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
    name: OPERATIONHUB.ConnectorCustomDetail,
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
    path: 'connector/cloud-provider/:action',
    name: OPERATIONHUB.ConnectorProviderDetail,
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

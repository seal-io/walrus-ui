import { Resources } from '@/permissions/config';
import { permissionKey } from '@/store/modules/user/types';
import { PageAction } from '@/views/config';

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
        type: permissionKey.projectRoles,
        pageAction: {
          [PageAction.VIEW]: ['GET'],
          [PageAction.EDIT]: ['POST']
        },
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/connector/scm-detail/:action',
    name: 'ProjectConnectorScmDetail',
    component: () => import('../../pages/connector/version-control.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        type: permissionKey.projectRoles,
        pageAction: {
          [PageAction.VIEW]: ['GET'],
          [PageAction.EDIT]: ['POST']
        },
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/connector/custom-detail/:action',
    name: 'ProjectConnectorCustomDetail',
    component: () => import('../../pages/connector/custom.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        type: permissionKey.projectRoles,
        pageAction: {
          [PageAction.VIEW]: ['GET'],
          [PageAction.EDIT]: ['POST']
        },
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/connector/cloud-provider/:action',
    name: 'ProjectConnectorProviderDetail',
    component: () => import('../../pages/connector/cloud-provider.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.connectors.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Connectors,
        type: permissionKey.projectRoles,
        pageAction: {
          [PageAction.VIEW]: ['GET'],
          [PageAction.EDIT]: ['POST']
        },
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  }
];

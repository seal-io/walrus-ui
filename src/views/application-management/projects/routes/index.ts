import { Resources } from '@/permissions/config';
import { PROJECT } from '@/router/config';
import { permissionKey } from '@/store/modules/user/types';
import { PageAction } from '@/views/config';
import connectorRoutes from './connectors';

export default [
  ...connectorRoutes,
  {
    path: 'project/list',
    name: PROJECT.List,
    component: () =>
      import('@/views/application-management/projects/pages/list.vue'),
    meta: {
      hideInMenu: false,
      hideMenu: false,
      ignoreCache: true,
      locale: 'navbar.appmanagement',
      requiresAuth: true,
      permission: {
        resource: Resources.Projects,
        actions: ['GET']
      },
      cachePages: [PROJECT.Detail],
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/detail',
    name: PROJECT.Detail,
    component: () =>
      import('@/views/application-management/projects/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: false,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      selectedMenu: PROJECT.List,
      permission: {
        resource: Resources.Projects,
        type: permissionKey.projectRoles,
        actions: ['GET']
      },
      cachePages: [
        PROJECT.ConnectorK8sDetail,
        PROJECT.ConnectorScmDetail,
        PROJECT.ConnectorProviderDetail,
        PROJECT.ConnectorCustomDetail,
        PROJECT.EnvDetail,
        PROJECT.EnvEdit
      ],
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment/:environmentId/detail',
    name: PROJECT.EnvDetail,
    component: () =>
      import('@/views/application-management/environments/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: false,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Environments,
        type: permissionKey.projectRoles,
        actions: ['GET']
      },
      cachePages: [PROJECT.ServiceEdit, PROJECT.ServiceDetail],
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment/:action',
    name: PROJECT.EnvEdit,
    component: () =>
      import('@/views/application-management/environments/pages/edit.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Environments,
        type: permissionKey.projectRoles,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment:environmentId/clone',
    name: PROJECT.EnvClone,
    component: () =>
      import('@/views/application-management/environments/pages/edit.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Environments,
        type: permissionKey.projectRoles,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment/:environmentId/service/detail',
    name: PROJECT.ServiceDetail,
    component: () =>
      import('@/views/application-management/services/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Services,
        type: permissionKey.projectRoles,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment/:environmentId/service/:action',
    name: PROJECT.ServiceEdit,
    component: () => import('../../services/pages/edit.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Services,
        type: permissionKey.projectRoles,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/environment/:environmentId/service/clone',
    name: PROJECT.ServiceClone,
    component: () => import('../../services/pages/clone.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      selectedMenu: PROJECT.List,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Services,
        type: permissionKey.projectRoles,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  }
];

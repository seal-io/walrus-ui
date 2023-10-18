import { WORKFLOW, PROJECT } from '@/router/config';
import { Resources } from '@/permissions/config';
import { permissionKey } from '@/store/modules/user/types';
import { PageAction } from '@/views/config';

export default [
  {
    path: 'project/:projectId/workflow/edit',
    name: WORKFLOW.Edit,
    component: () =>
      import('@/views/application-management/workflows/pages/edit.vue'),
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
      cachePages: [],
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/workflow/detail',
    name: WORKFLOW.Detail,
    component: () =>
      import('@/views/application-management/workflows/pages/detail.vue'),
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
      cachePages: [],
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/workflow/:flowId/records',
    name: WORKFLOW.Records,
    component: () =>
      import('@/views/application-management/workflows/pages/records.vue'),
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
      cachePages: [],
      icon: 'icon-apps'
    }
  }
];

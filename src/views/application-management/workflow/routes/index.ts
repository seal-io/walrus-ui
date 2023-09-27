import { WORKFLOW, PROJECT } from '@/router/config';
import { Resources } from '@/permissions/config';
import { permissionKey } from '@/store/modules/user/types';
import { PageAction } from '@/views/config';

export default [
  {
    path: 'project/:projectId/workflow/edit',
    name: WORKFLOW.Edit,
    component: () =>
      import('@/views/application-management/workflow/pages/edit.vue'),
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

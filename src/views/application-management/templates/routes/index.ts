import { Resources } from '@/permissions/config';
import { permissionKey } from '@/store/modules/user/types';
import { PageAction } from '@/views/config';
import { PROJECT } from '@/router/config';

export default [
  {
    path: 'project/:projectId/templates/detail/:action',
    name: PROJECT.TemplateDetail,
    component: () => import('@/views/operation-hub/templates/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Templates,
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

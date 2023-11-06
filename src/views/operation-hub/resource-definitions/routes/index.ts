import { Resources } from '@/permissions/config';
import { OPERATIONHUB } from '@/router/config';
import { PageAction } from '@/views/config';

export default [
  {
    path: 'resource-definition/detail/:action',
    name: OPERATIONHUB.ResourceDefinitionDetail,
    component: () =>
      import('@/views/operation-hub/resource-definitions/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Templates,
        pageAction: {
          [PageAction.VIEW]: ['GET'],
          [PageAction.EDIT]: ['POST']
        }
      },
      icon: 'icon-apps'
    }
  }
];

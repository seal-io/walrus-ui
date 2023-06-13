import { Resources } from '@/permissions/config';
import { OPERATIONHUB } from '@/router/config';

export default [
  {
    path: 'main',
    name: OPERATIONHUB.Main,
    component: () => import('@/views/operation-hub/pages/main.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'menu.operatorHub',
      requiresAuth: true,
      permission: {
        resource: Resources.Templates,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: [
        OPERATIONHUB.ConnectorCustomDetail,
        OPERATIONHUB.ConnectorK8sDetail,
        OPERATIONHUB.ConnectorProviderDetail,
        OPERATIONHUB.ConnectorScmDetail,
        OPERATIONHUB.TemplateDetail,
        OPERATIONHUB.TemplateGPT
      ]
    }
  }
];

import { Resources } from '@/permissions/config';
import { OPERATIONHUB } from '@/router/config';

export default [
  {
    path: 'templates/list',
    name: OPERATIONHUB.TemplateList,
    component: () => import('@/views/operation-hub/templates/pages/list.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: false,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Modules,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['templateGPT', 'TemplateDetail']
    }
  },
  {
    path: 'templates/detail/:action',
    name: OPERATIONHUB.TemplateDetail,
    component: () => import('@/views/operation-hub/templates/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Modules,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'templates/gpt',
    name: OPERATIONHUB.TemplateGPT,
    component: () => import('@/views/operation-hub/templates/pages/gpt.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.ModuleCompletions,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  }
];

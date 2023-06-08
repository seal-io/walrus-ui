import { Resources } from '@/permissions/config';

export default [
  {
    path: 'templates/list',
    name: 'TemplateList',
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
    name: 'TemplateDetail',
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
    name: 'TemplateGPT',
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

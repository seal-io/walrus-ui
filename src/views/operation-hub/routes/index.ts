import { Resources } from '@/permissions/config';

export default [
  {
    path: 'main',
    name: 'OperationMain',
    component: () => import('@/views/operation-hub/pages/main.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'menu.operatorHub',
      requiresAuth: true,
      permission: {
        resource: Resources.Modules,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['EnvironmentDetail']
    }
  }
];

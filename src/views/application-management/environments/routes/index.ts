import { Resources } from '@/permissions/config';
import { PROJECT } from '@/router/config';

export default [
  {
    path: 'environment/list',
    name: 'EnvironmentList',
    component: () => import('../pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Environments,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['EnvironmentDetail']
    }
  },
  {
    path: 'environment/detail/:action',
    name: 'EnvironmentDetail',
    component: () => import('../pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.environments.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Environments,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  }
];

import { Resources } from '@/permissions/config';

export default [
  {
    path: 'project/services/list',
    name: 'ApplicationsList',
    component: () =>
      import('@/views/application-management/services/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'applications.applications.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Projects,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['ApplicationsDetail']
    }
  }
];

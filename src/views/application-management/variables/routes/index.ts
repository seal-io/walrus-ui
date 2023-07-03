import { Resources } from '@/permissions/config';

export default [
  {
    path: 'secrets/list',
    name: 'SecretsList',
    component: () =>
      import('@/views/application-management/variables/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'applications.applications.secret',
      requiresAuth: true,
      permission: {
        resource: Resources.Projects,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  }
];

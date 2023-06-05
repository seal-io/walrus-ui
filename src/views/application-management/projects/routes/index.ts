import { Resources } from '@/permissions/config';

export default [
  {
    path: 'project/list',
    name: 'ProjectsList',
    component: () =>
      import('@/views/application-management/projects/pages/list.vue'),
    meta: {
      hideInMenu: false,
      hideMenu: false,
      ignoreCache: true,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Projects,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'project/:projectId/detail',
    name: 'ProjectDetail',
    component: () =>
      import('@/views/application-management/projects/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      hideMenu: false,
      ignoreCache: true,
      locale: 'applications.projects.menu',
      requiresAuth: true,
      permission: {
        resource: Resources.Projects,
        actions: ['GET']
      },
      icon: 'icon-apps'
    }
  }
];

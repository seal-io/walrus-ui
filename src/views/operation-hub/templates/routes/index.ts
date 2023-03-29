export default [
  {
    path: 'templates/list',
    name: 'TemplateList',
    component: () => import('@/views/operation-hub/templates/pages/list.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: false,
      locale: 'operation.templates.menu',
      requiresAuth: true,
      icon: 'icon-apps',
      cachePage: ['templateGPT', 'templateDetail']
    }
  },
  {
    path: 'templates/detail',
    name: 'TemplateDetail',
    component: () => import('@/views/operation-hub/templates/pages/detail.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'operation.templates.menu',
      requiresAuth: true,
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
      icon: 'icon-apps'
    }
  }
];

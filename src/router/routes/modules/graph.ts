export default {
  path: 'graph',
  name: 'GraphIndex',
  component: () => import('@/views/graph/index.vue'),
  meta: {
    ignoreCache: true,
    locale: 'graph.filter.title',
    requiresAuth: true,
    icon: 'icon-apps',
    roles: ['*'],
    order: 3
  },
  children: [
    {
      path: 'main',
      name: 'GraphMain',
      component: () => import('@/views/graph/pages/graph.vue'),
      meta: {
        fullScreen: true,
        hideInMenu: true,
        ignoreCache: true,
        locale: 'graph.filter.title',
        requiresAuth: true,
        icon: ''
      }
    }
  ]
};

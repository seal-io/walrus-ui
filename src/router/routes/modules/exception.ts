export default {
  path: 'exception',
  name: 'exception',
  component: () => import('@/views/exception/index.vue'),
  meta: {
    hideInMenu: true,
    locale: 'menu.exception',
    requiresAuth: false,
    isRouteView: true,
    icon: 'icon-exclamation-circle',
    order: 6
  },
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('@/views/exception/403/index.vue'),
      meta: {
        hideInMenu: true,
        locale: 'menu.exception.403',
        requiresAuth: false,
        roles: ['*']
      }
    },
    {
      path: '404',
      name: '404',
      component: () => import('@/views/exception/404/index.vue'),
      meta: {
        hideInMenu: true,
        locale: 'menu.exception.404',
        requiresAuth: false,
        roles: ['*']
      }
    },
    {
      path: '500',
      name: '500',
      component: () => import('@/views/exception/500/index.vue'),
      meta: {
        hideInMenu: true,
        locale: 'menu.exception.500',
        requiresAuth: false,
        roles: ['*']
      }
    }
  ]
};

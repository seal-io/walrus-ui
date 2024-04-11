export default {
  path: '/exception',
  name: 'PageException',
  component: () => import('@/views/exception/index.vue'),
  meta: {
    hasNavList: true,
    hideInMenu: true,
    ignoreCache: true,
    locale: '',
    requiresAuth: false,
    icon: '',
    order: 3
  },
  children: [
    {
      path: '403',
      name: 'Page403',
      component: () => import('@/views/exception/403/index.vue'),
      meta: {
        hasNavList: true,
        hideInMenu: true,
        ignoreCache: true,
        locale: '',
        requiresAuth: false,
        icon: '',
        order: 1
      }
    },
    {
      path: '404',
      name: 'Page404',
      component: () => import('@/views/exception/404/index.vue'),
      meta: {
        hasNavList: true,
        hideInMenu: true,
        ignoreCache: true,
        locale: '',
        requiresAuth: false,
        icon: '',
        order: 2
      }
    },
    {
      path: '500',
      name: 'Page500',
      component: () => import('@/views/exception/500/index.vue'),
      meta: {
        hasNavList: true,
        hideInMenu: true,
        ignoreCache: true,
        locale: '',
        requiresAuth: false,
        icon: '',
        order: 3
      }
    }
  ]
};

export default {
  path: '/app',
  name: 'PageDispatch',
  component: () => import('@/views/dispatch/index.vue'),
  meta: {
    hasNavList: true,
    hideInMenu: true,
    ignoreCache: true,
    locale: '',
    requiresAuth: false,
    icon: '',
    order: 3
  }
};

export default {
  path: '/dispatch',
  name: 'PageDispatch',
  component: () => import('@/views/dispatch/index.vue'),
  meta: {
    hasNavList: true,
    hideInMenu: true,
    ignoreCache: true,
    locale: '',
    requiresAuth: true,
    icon: '',
    order: 3,
  },
};

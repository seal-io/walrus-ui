export default {
  path: 'report',
  name: 'eventReport',
  component: () => import('@/views/report/index.vue'),
  meta: {
    noLogin: true,
    hideInMenu: true,
    ignoreCache: true,
    locale: '',
    requiresAuth: true,
    icon: '',
    order: 999,
  },
};

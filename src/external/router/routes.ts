export default {
  path: '/',
  name: 'report',
  redirect: '/report-detail',
  component: () => import('../components/default-layout.vue'),
  children: [
    {
      path: 'report-detail',
      name: 'eventReport',
      component: () => import('@/views/report/index.vue'),
      meta: {
        hideInMenu: true,
        ignoreCache: true,
        locale: '',
        requiresAuth: true,
        icon: '',
        order: 1,
      },
    },
  ],
};

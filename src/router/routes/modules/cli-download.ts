export default {
  path: 'cli',
  name: 'cliIndex',
  component: () => import('@/views/cli-download/index.vue'),
  meta: {
    hideInMenu: true,
    locale: 'navbar.costmanagement',
    requiresAuth: true,
    order: 999,
    icon: ''
  },
  children: [
    {
      path: 'download',
      name: 'CliDownload',
      component: () => import('@/views/cli-download/pages/index.vue'),
      meta: {
        hideInMenu: true,
        locale: '',
        requiresAuth: true,
        order: 999,
        icon: ''
      }
    }
  ]
};

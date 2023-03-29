export default {
  path: 'dashboard',
  name: 'dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    locale: 'navbar.totalView',
    requiresAuth: true,
    icon: 'icon-dashboard',
    onlyRenderChildren: true,
    order: 0
  },
  children: [
    {
      path: 'main',
      name: 'dashboardMain',
      component: () => import('@/views/dashboard/pages/main.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        locale: 'navbar.totalView',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 0
      }
    }
  ]
};

// export default {
//   path: 'dashboard',
//   name: 'dashboardMain',
//   component: () => import('@/views/dashboard/pages/main.vue'),
//   meta: {
//     hideInMenu: false,
//     ignoreCache: true,
//     locale: 'navbar.totalView',
//     requiresAuth: true,
//     icon: 'icon-dashboard',
//     order: 0,
//     children: []
//   }
// };

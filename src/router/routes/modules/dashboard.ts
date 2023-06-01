import { Resources } from '@/permissions/config';

export default {
  path: 'dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    locale: 'navbar.totalView',
    requiresAuth: true,
    isRouteView: true,
    permission: {
      resource: Resources.Dashboards,
      actions: ['GET']
    },
    icon: 'icon-dashboard',
    onlyRenderChildren: true,
    order: 0
  },
  children: [
    {
      path: 'main',
      name: 'DashboardMain',
      component: () => import('@/views/dashboard/pages/main.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        locale: 'navbar.totalView',
        requiresAuth: true,
        permission: {
          resource: Resources.Dashboards,
          actions: ['GET']
        },
        icon: 'icon-dashboard',
        order: 0
      }
    }
  ]
};

// export default {
//   path: 'dashboard',
//   name: 'DashboardMain',
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

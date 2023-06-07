import projectsRoutes from '@/views/application-management/projects/routes';
// import workflowsRoutes from '@/views/application-management/workflows/routes';

export default {
  path: 'app-management',
  name: 'AppManagement',
  component: () => import('@/views/application-management/index.vue'),
  meta: {
    locale: 'navbar.appmanagement',
    requiresAuth: false,
    isRouteView: true,
    order: 1,
    icon: 'icon-apps',
    onlyRenderChildren: true
  },
  children: [...projectsRoutes]
};

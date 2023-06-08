import analyseRoutes from '@/views/cost-management/analyse/routes';
// import optimizeRoutes from '@/views/cost-management/optimize/routes';

export default {
  path: 'cost-management',
  name: 'CostManagement',
  component: () => import('@/views/cost-management/index.vue'),
  meta: {
    locale: 'navbar.costmanagement',
    requiresAuth: false,
    isRouteView: true,
    order: 2,
    icon: 'icon-bar-chart',
    onlyRenderChildren: true
  },
  children: [...analyseRoutes]
};

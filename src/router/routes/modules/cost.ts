import analyseRoutes from '@/views/cost-management/analyse/routes';
// import optimizeRoutes from '@/views/cost-management/optimize/routes';

export default {
  path: 'cost-management',
  name: 'costManagement',
  component: () => import('@/views/cost-management/index.vue'),
  meta: {
    locale: 'navbar.costmanagement',
    requiresAuth: true,
    order: 2,
    icon: 'icon-bar-chart'
  },
  children: [...analyseRoutes]
};

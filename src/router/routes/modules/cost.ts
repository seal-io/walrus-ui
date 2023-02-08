import analyseRoutes from '@/views/cost-management/analyse/routes';
import optimizeRoutes from '@/views/cost-management/optimize/routes';

export default {
  path: 'cost-management',
  name: 'costManagement',
  component: () => import('@/views/cost-management/index.vue'),
  meta: {
    locale: 'navbar.costManagement',
    requiresAuth: true,
    order: 2,
  },
  children: [...analyseRoutes, ...optimizeRoutes],
};

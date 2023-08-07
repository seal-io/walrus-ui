import analyseRoutes from '@/views/cost-management/analyse/routes';
import COST from '../../config/cost-management';

export default {
  path: 'cost-management',
  name: COST.Index,
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

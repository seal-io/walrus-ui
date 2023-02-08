import connectorRoutes from '@/views/operation-hub/connectors/routes';
import environmentRoutes from '@/views/operation-hub/environments/routes';
import templateRoutes from '@/views/operation-hub/templates/routes';

export default {
  path: 'operation',
  name: 'operationHub',
  component: () => import('@/views/operation-hub/index.vue'),
  meta: {
    locale: 'navbar.operationHub',
    requiresAuth: true,
    order: 3,
  },
  children: [...connectorRoutes, ...environmentRoutes, ...templateRoutes],
};

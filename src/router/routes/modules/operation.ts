import connectorRoutes from '@/views/operation-hub/connectors/routes';
import templateRoutes from '@/views/operation-hub/templates/routes';
import secretRoutes from '@/views/operation-hub/secret/routes';

export default {
  path: 'operation',
  name: 'OperationHub',
  component: () => import('@/views/operation-hub/index.vue'),
  meta: {
    locale: 'navbar.operatorhub',
    requiresAuth: false,
    isRouteView: true,
    order: 3,
    icon: 'icon-relation'
  },
  children: [...connectorRoutes, ...templateRoutes, ...secretRoutes]
};

import connectorRoutes from '@/views/operation-hub/connectors/routes';
import environmentRoutes from '@/views/operation-hub/environments/routes';
import templateRoutes from '@/views/operation-hub/templates/routes';

export default {
  path: 'operation',
  name: 'operationHub',
  component: () => import('@/views/operation-hub/index.vue'),
  meta: {
    locale: 'navbar.operatorhub',
    requiresAuth: true,
    order: 3,
    icon: 'icon-relation'
  },
  children: [...connectorRoutes, ...environmentRoutes, ...templateRoutes]
};

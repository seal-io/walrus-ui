import connectorRoutes from '@/views/operation-hub/connectors/routes';
import templateRoutes from '@/views/operation-hub/templates/routes';
import secretRoutes from '@/views/operation-hub/variables/routes';
import operationRoutes from '@/views/operation-hub/routes';
import OPERATIONHUB from '../../config/operation-hub';

export default {
  path: 'operation',
  name: OPERATIONHUB.Index,
  component: () => import('@/views/operation-hub/index.vue'),
  meta: {
    locale: 'navbar.operatorhub',
    requiresAuth: false,
    isRouteView: true,
    order: 3,
    icon: 'icon-relation',
    onlyRenderChildren: true
  },
  children: [
    ...operationRoutes,
    ...connectorRoutes,
    ...templateRoutes,
    ...secretRoutes
  ]
};

import { Resources } from '@/permissions/config';
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
    requiresAuth: true,
    isRouteView: true,
    order: 3,
    icon: 'i class="icon-a-relation10-line iconfont size-18"',
    onlyRenderChildren: true,
    permission: [
      {
        resource: Resources.Templates,
        actions: ['GET']
      },
      {
        resource: Resources.Connectors,
        actions: ['GET']
      },
      {
        resource: Resources.Variables,
        actions: ['GET']
      }
    ]
  },
  children: [
    ...operationRoutes,
    ...connectorRoutes,
    ...templateRoutes,
    ...secretRoutes
  ]
};

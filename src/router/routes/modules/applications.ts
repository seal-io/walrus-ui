import projectsRoutes from '@/views/application-management/projects/routes';
import PROJECT from '../../config/application-management';

export default {
  path: 'app-management',
  name: PROJECT.Index,
  component: () => import('@/views/application-management/index.vue'),
  meta: {
    locale: 'menu.applicationManagement',
    requiresAuth: false,
    isRouteView: true,
    order: 1,
    icon: 'icon-apps',
    onlyRenderChildren: true
  },
  children: [...projectsRoutes]
};

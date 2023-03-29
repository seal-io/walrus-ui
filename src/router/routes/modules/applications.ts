import applicationsRoutes from '@/views/application-management/applications/routes';
import projectsRoutes from '@/views/application-management/projects/routes';
import workflowsRoutes from '@/views/application-management/workflows/routes';
import secretsRoutes from '@/views/application-management/secret/routes';

export default {
  path: 'app-management',
  name: 'AppManagement',
  component: () => import('@/views/application-management/index.vue'),
  meta: {
    locale: 'navbar.appmanagement',
    requiresAuth: true,
    order: 1,
    icon: 'icon-apps'
  },
  children: [
    ...projectsRoutes,
    ...applicationsRoutes,
    ...workflowsRoutes,
    ...secretsRoutes
  ]
};

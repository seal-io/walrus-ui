import applicationsRoutes from '@/views/application-management/applications/routes';
import projectsRoutes from '@/views/application-management/projects/routes';
import workflowsRoutes from '@/views/application-management/workflows/routes';

export default {
  path: 'app-management',
  name: 'appManagement',
  component: () => import('@/views/application-management/index.vue'),
  meta: {
    locale: 'navbar.appmanagement',
    requiresAuth: true,
    order: 1,
  },
  children: [...applicationsRoutes, ...projectsRoutes, ...workflowsRoutes],
};

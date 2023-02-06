import { createRouter, createWebHashHistory } from 'vue-router';
import report from './routes';

const router = createRouter({
  history: createWebHashHistory('/external'),
  routes: [
    report,
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
export default router;

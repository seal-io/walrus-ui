import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import DefaultLayout from '@/layout/default-layout.vue';
import Login from './routes/modules/login';
import appRoutes from './routes';
import resetRoutes from './routes/rest';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    Login,
    ...resetRoutes,
    {
      name: 'root',
      path: '/',
      component: DefaultLayout,
      children: appRoutes
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'forbidden',
      component: () => import('@/views/exception/403/index.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

createRouteGuard(router);
export default router;

export default {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    requiresAuth: false,
    order: 999
  }
};

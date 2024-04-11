import dispatch from './dispatch';
import exception from './exception';

export default [
  {
    path: '/redirect/:to',
    name: 'Redirect',
    component: () => import('@/views/exception/redirect.vue'),
    meta: {
      hasNavList: true,
      hideInMenu: true,
      ignoreCache: true,
      locale: '',
      requiresAuth: false,
      icon: '',
      order: 1
    }
  },
  dispatch,
  exception
];

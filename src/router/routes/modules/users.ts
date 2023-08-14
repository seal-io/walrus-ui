import { Resources } from '@/permissions/config';
import USERS from '../../config/users';

export default {
  path: 'users',
  name: USERS.Index,
  component: () => import('@/views/system/index.vue'),
  meta: {
    hideInMenu: false,
    ignoreCache: true,
    locale: 'menu.systemsettings.user',
    icon: 'i class="icon-users-o iconfont size-18"',
    iconfont: true,
    requiresAuth: true,
    isRouteView: true,
    order: 6,
    onlyRenderChildren: true,
    permission: [
      {
        resource: Resources.Subjects,
        actions: ['GET']
      }
    ]
  },
  children: [
    {
      path: 'list',
      name: USERS.List,
      component: () => import('@/views/users/pages/list.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        clearMenuStatus: false,
        locale: 'menu.systemsettings.user',
        requiresAuth: true,
        permission: [
          {
            resource: Resources.Subjects,
            actions: ['GET']
          }
        ],
        roles: ['*']
      }
    }
  ]
};

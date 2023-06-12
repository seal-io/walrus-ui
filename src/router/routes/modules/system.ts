import { Resources } from '@/permissions/config';
import SYSTEMSETTINGS from '../../config/system-settings';

export default {
  path: 'system',
  name: SYSTEMSETTINGS.Index,
  component: () => import('@/views/system/index.vue'),
  meta: {
    hideInMenu: false,
    ignoreCache: true,
    locale: 'menu.system.setting',
    icon: 'icon-settings',
    requiresAuth: false,
    isRouteView: true,
    order: 6,
    onlyRenderChildren: true
  },
  children: [
    {
      path: 'settings',
      name: SYSTEMSETTINGS.Settings,
      component: () => import('@/views/system/pages/main.vue'),
      meta: {
        hideInMenu: false,
        ignoreCache: true,
        clearMenuStatus: false,
        locale: 'menu.system.setting',
        requiresAuth: true,
        permission: {
          resource: Resources.Subjects,
          actions: ['GET']
        },
        roles: ['*']
      }
    }
    // {
    //   path: 'users',
    //   name: 'SystemUsers',
    //   component: () => import('@/views/system/pages/users.vue'),
    //   meta: {
    //     hideInMenu: false,
    //     ignoreCache: true,
    //     clearMenuStatus: false,
    //     locale: 'menu.system.user',
    //     requiresAuth: true,
    //     permission: {
    //       resource: Resources.Subjects,
    //       actions: ['GET']
    //     },
    //     roles: ['*']
    //   }
    // },
    // {
    //   path: 'settings',
    //   name: 'SystemSetting',
    //   component: () => import('@/views/system/pages/setting.vue'),
    //   meta: {
    //     hideInMenu: false,
    //     ignoreCache: true,
    //     clearMenuStatus: false,
    //     locale: 'menu.system.config',
    //     requiresAuth: true,
    //     permission: {
    //       resource: Resources.Settings,
    //       actions: ['GET']
    //     },
    //     roles: ['*']
    //   }
    // }
  ]
};

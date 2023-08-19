import { Resources } from '@/permissions/config';
import { COSTMANAGEMENT } from '@/router/config';

export default [
  {
    path: 'cost/management',
    name: COSTMANAGEMENT.PageIndex,
    component: () => import('@/views/cost-management/analyse/pages/index.vue'),
    meta: {
      hideInMenu: false,
      ignoreCache: true,
      locale: 'menu.costManagement',
      requiresAuth: true,
      permission: {
        resource: Resources.Costs,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/perspective',
    name: COSTMANAGEMENT.Main,
    component: () => import('@/views/cost-management/analyse/pages/main.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'menu.costManagement.analyse',
      requiresAuth: true,
      selectedMenu: COSTMANAGEMENT.PageIndex,
      permission: {
        resource: Resources.Costs,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  },
  {
    path: 'cost/list',
    name: COSTMANAGEMENT.List,
    component: () => import('@/views/cost-management/analyse/pages/list.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: false,
      locale: 'menu.costManagement.perspective',
      requiresAuth: true,
      permission: {
        resource: Resources.Costs,
        actions: ['GET']
      },
      icon: 'icon-apps',
      cachePages: ['CostPerspectiveEdit']
    }
  },
  {
    path: 'cost/perspective-edit/:action',
    name: COSTMANAGEMENT.Edit,
    component: () =>
      import('@/views/cost-management/analyse/pages/perspective-edit.vue'),
    meta: {
      hideInMenu: true,
      ignoreCache: true,
      locale: 'cost.analyse.menu',
      requiresAuth: true,
      selectedMenu: COSTMANAGEMENT.PageIndex,
      permission: {
        resource: Resources.Costs,
        actions: ['POST']
      },
      icon: 'icon-apps'
    }
  }
];

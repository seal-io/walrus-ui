import type { RouteRecordRaw } from 'vue-router';
import { get } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import { LoginRouteName } from '@/api/config';

const modules: Record<string, any> = import.meta.glob('./modules/*.ts', {
  eager: true
});

const appRoutes: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const defaultModule = modules[key].default;
  // filter routes
  if (!defaultModule || defaultModule?.meta?.isRemove) return;
  if (defaultModule.name === LoginRouteName) return;
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule]
    : [defaultModule];
  appRoutes.push(...moduleList);
});

// set order show in menu
const copyAppRoutes = appRoutes.map((o: RouteRecordRaw) => {
  const route = cloneDeep(o);
  if (route?.children && route?.children.length) {
    route.children.forEach((sRoute: RouteRecordRaw) => {
      sRoute.meta = sRoute.meta || {
        roles: ['*'],
        requiresAuth: true,
        order: 999
      };
      sRoute.meta.order = route?.meta?.order || 999;
    });
  }
  return route;
});
copyAppRoutes.sort((a: RouteRecordRaw, b: RouteRecordRaw) => {
  return (get(a, 'meta.order') || 0) - (get(b, 'meta.order') || 0);
});
export default copyAppRoutes;

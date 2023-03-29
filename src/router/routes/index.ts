import type { RouteRecordRaw } from 'vue-router';
import { get } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';

const modules = import.meta.globEager('./modules/*.ts');
const appRoutes: RouteRecordRaw[] = [];
console.log('modules=======', modules);
Object.keys(modules).forEach((key) => {
  const defaultModule = modules[key].default;
  // filter routes
  if (!defaultModule || defaultModule?.meta?.isRemove) return;
  if (defaultModule.name === 'Login') return;
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
console.log('modules:', copyAppRoutes);
export default copyAppRoutes;

import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import get from 'lodash/get';

export default function usePermission() {
  const userStore = useUserStore();
  type routeRaw = RouteLocationNormalized | RouteRecordRaw;
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.role)
      );
    },
    // setPermissionRoutes(routes:RouteLocationNormalized) {
    //   const permissions = userStore.permissions
    // },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    getFirstRouteName(appRoutes: routeRaw[]) {
      const firstChildren = get(appRoutes, '0.children');
      const firstName = get(appRoutes, '0.name');
      if ((!firstChildren || !firstChildren.length) && !firstName)
        return 'notFound';
      if (firstChildren && firstChildren.length) {
        return get(firstChildren, '0.name');
      }
      return firstName;
    },
    // You can add any rules you want
  };
}

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    isRouteView?: boolean;
    permission?: { resource: string; actions: string[] };
    clearMenuStatus?: boolean; // clear menu selected status when no-menu page active
    cachePages?: string[]; // when to the page that in cachePages cache Current route
    roles?: string[]; // Controls roles that have access to the page
    requiresAuth: boolean; // Whether login is required to access the current page (every route must declare)
    icon?: string; // The icon show in the side menu
    locale?: string; // The locale name show in side menu and breadcrumb
    hideInMenu?: boolean; // If true, it is not displayed in the side menu
    order?: number; // Sort routing menu items. If set key, the higher the value, the more forward it is
    noAffix?: boolean; // if set true, the tag will not affix in the tab-bar
    ignoreCache?: boolean; // if set true, the page will not be cached
    fullScreen?: boolean; // set the page display in fullscreen
    hasNavList?: boolean; // set the navbar show navlist, it is true by default;
    keepAlive?: string[]; // when new route excludes in keepAlive ,shoule be delete from cacheList
    onlyRenderChildren?: boolean; // only render children
  }
}

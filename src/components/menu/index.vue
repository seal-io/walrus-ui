<script lang="tsx">
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter, RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
  // import type { RouteLocationNormalized } from 'vue-router';

  import { useAppStore, useProjectStore } from '@/store';
  import usePermission from '@/hooks/permissions';
  import { listenerRouteChange } from '@/utils/route-listener';
  import localStore from '@/utils/localStore';
  import { USER_DEFAULT_PROJECT } from '@/views/config';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const currentRoute = ref<string>('');
      const appStore = useAppStore();
      const projectStore = useProjectStore();
      const permission = usePermission();
      const router = useRouter();

      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        }
      });
      const appRoute = computed(() => {
        return router.getRoutes().find((el) => {
          // return el.name === currentRoute.value;
          return el.name === 'root';
        }) as RouteRecordNormalized;
      });
      const menuTree = computed(() => {
        let copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
        copyRouter = copyRouter.filter(
          (r: RouteRecordNormalized) => !r?.meta || !r?.meta?.hideInMenu
        );
        console.log('routes====2===', copyRouter);
        copyRouter.sort(
          (a: RouteRecordNormalized, b: RouteRecordNormalized) => {
            return (a.meta.order || 0) - (b.meta.order || 0);
          }
        );
        console.log({ copyRouter, appRoute });
        function travel(_routes: RouteRecordRaw[], layer: number) {
          if (!_routes || !_routes.length) {
            // hide menu
            appStore.updateSettings({ hideMenu: true });
            return null;
          }
          appStore.updateSettings({ hideMenu: false });

          const collector: any = _routes.map((element) => {
            // no access
            if (!permission.accessRouter(element)) {
              return null;
            }

            // leaf node
            if (!element.children) {
              return element;
            }

            // route filter hideInMenu true
            element.children = element.children.filter(
              (x) => x.meta?.hideInMenu !== true
            );

            // Associated child node
            const subItem = travel(element.children, layer);
            if (subItem?.length) {
              element.children = subItem;
              return element;
            }
            // the else logic
            if (layer > 1) {
              element.children = subItem;
              return element;
            }

            if (element.meta?.hideInMenu === false) {
              return element;
            }

            return null;
          });
          return collector.filter(Boolean);
        }
        return travel(copyRouter, 0);
      });
      const goToProject = async (item: RouteRecordRaw) => {
        const defaultProject = await localStore.getValue(USER_DEFAULT_PROJECT);
        if (!projectStore.projectList.length) {
          router.push({
            name: item.name
          });
          return;
        }
        router.push({
          name: 'ProjectDetail',
          params: {
            projectId: defaultProject.id
          }
        });
      };
      // In this case only two levels of menus are available
      // You can expand as needed

      const goto = (item: RouteRecordRaw) => {
        const query: any = item.meta?.query;
        const isReplace: any = item.meta?.replace;
        if (item.name === 'ProjectsList') {
          goToProject(item);
          return;
        }
        if (!isReplace) {
          router.push({
            name: item.name,
            params: {
              query
            }
          });
        }
        if (isReplace) {
          router.replace({
            name: item.name,
            params: {
              query
            }
          });
        }
      };
      listenerRouteChange(({ to }) => {
        const newRoute = to;
        console.log('route_change');
        currentRoute.value = newRoute.matched[1]?.name as string;
        if (newRoute.meta.requiresAuth && !newRoute.meta.hideInMenu) {
          const { matched } = newRoute;
          const key = newRoute.matched[matched.length - 1]?.name as string;
          appStore.updateSettings({ selectedKey: [key] });
        }
        if (newRoute.meta.clearMenuStatus) {
          appStore.updateSettings({ selectedKey: [] });
        }
      }, true);
      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop')
          appStore.updateSettings({ menuCollapse: val });
      };

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              const icon = element?.meta?.icon
                ? `<${element?.meta?.icon}/>`
                : ``;
              let rt: any = null;
              if (
                element?.children &&
                element.children.length &&
                !element.meta?.onlyRenderChildren
              ) {
                rt = (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon: () => h(compile(icon)),
                      title: () => h(compile(t(element?.meta?.locale || '')))
                    }}
                  >
                    {element?.children?.map((elem) => {
                      return (
                        <a-menu-item key={elem.name} onClick={() => goto(elem)}>
                          {t(elem?.meta?.locale || '')}
                          {travel(elem.children ?? [])}
                        </a-menu-item>
                      );
                    })}
                  </a-sub-menu>
                );
              } else if (!element?.children || !element.children.length) {
                rt = (
                  <a-menu-item
                    key={element.name}
                    onClick={() => goto(element)}
                    v-slots={{
                      icon: () => h(compile(icon))
                    }}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              } else if (
                element?.children &&
                element.children.length &&
                element.meta?.onlyRenderChildren
              ) {
                rt = element?.children?.map((elem) => {
                  return (
                    <a-menu-item
                      key={elem.name}
                      onClick={() => goto(elem)}
                      v-slots={{
                        icon: () => h(compile(icon))
                      }}
                    >
                      {t(elem?.meta?.locale || '')}
                    </a-menu-item>
                  );
                });
              }
              nodes.push(rt as never);
            });
          }
          return nodes;
        }
        return travel(menuTree.value);
      };
      // appStore.device !== 'mobile'
      return () => (
        <a-menu
          v-model:collapsed={collapsed.value}
          show-collapse-button={true}
          auto-open={false}
          selected-keys={appStore.selectedKey}
          auto-open-selected={true}
          level-indent={20}
          style="height: 100%"
          onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('./style.less');

  :deep(.arco-menu-inner) {
    // padding-top: 0 !important;
    .arco-menu-item {
      // line-height: 36px;
    }

    .arco-menu-inline-header {
      display: flex;
      align-items: center;
    }

    .arco-menu-icon-suffix .arco-icon {
      font-size: 16px;
    }

    .arco-icon {
      &:not(.arco-icon-down) {
        font-size: 18px;
      }
    }
  }
</style>

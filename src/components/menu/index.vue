<script lang="tsx">
  import _ from 'lodash';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
  // import type { RouteLocationNormalized } from 'vue-router';

  import { useAppStore, useProjectStore, useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import usePermission from '@/hooks/permissions';
  import useListenerRouteChange from '@/hooks/use-listener-route-change';
  import { listenerRouteChange } from '@/utils/route-listener';
  import localStore from '@/utils/localStore';
  import { USER_DEFAULT_PROJECT } from '@/views/config';
  import useLocale from '@/hooks/locale';
  import { queryProjects } from '@/views/application-management/projects/api';
  import { profileMenu } from './config';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t, router, route } = useCallCommon();
      const currentRoute = ref<string>('');
      const appStore = useAppStore();
      const userStore = useUserStore();
      const { changeLocale } = useLocale();
      const { logout } = useUser();
      const projectStore = useProjectStore();
      const permission = usePermission();
      const execListenerRouteChange = useListenerRouteChange();

      // listener to  route change
      execListenerRouteChange();

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

        // need create new project
        if (!projectStore.projectList.length) {
          router.push({
            name: item.name
          });
          return;
        }
        const pro = _.find(
          projectStore.projectList,
          (item) => item.value === defaultProject?.id
        );
        const projectID = pro
          ? defaultProject?.id
          : _.get(projectStore.projectList, '0.value');

        // no permission access to default project
        if (
          !userStore.hasProjectResourceActions({
            resource: Resources.Projects,
            actions: [Actions.GET],
            projectID
          })
        ) {
          router.push({
            name: item.name
          });
          return;
        }
        // has access permission to default project
        router.push({
          name: PROJECT.Detail,
          params: {
            projectId: projectID
          }
        });
      };
      // In this case only two levels of menus are available
      // You can expand as needed

      const goto = async (item: RouteRecordRaw) => {
        const query: any = item.meta?.query;
        const isReplace: any = item.meta?.replace;
        if (item.name === PROJECT.List) {
          await goToProject(item);
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
        console.log('route_change', to);
        currentRoute.value = newRoute.matched[1]?.name as string;
        if (newRoute.meta.requiresAuth || newRoute.meta.profileView) {
          const { matched } = newRoute;
          const activeRoute = newRoute.matched[matched.length - 1];
          const key =
            activeRoute?.meta?.selectedMenu || (activeRoute?.name as string);
          console.log('key====', key);
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
      const handleClickUserMenu = (item) => {
        if (item.key === 'UserCenter') {
          router.push({
            name: item.route
          });
          return;
        }
        if (item.key === 'clidownload') {
          router.push({
            name: item.route
          });
          console.log('item====', item);
          return;
        }
        if (item.key === 'logout') {
          logout();
          return;
        }
        if (item.key === 'chinese' || item.key === 'english') {
          changeLocale(item.value);
        }
      };
      const renderUserMenu = () => {
        function travel() {
          const nodes: any[] = [];
          profileMenu.forEach((item) => {
            let rt: any = null;
            rt = (
              <a-sub-menu
                key={item.key}
                v-slots={{
                  'icon': () =>
                    h(compile(item.icon), {
                      style: {
                        color: 'var(--color-text-3)'
                      }
                    }),
                  'expand-icon-right': () => {},
                  'title': () => h(compile(t(item.name || '')))
                }}
              >
                {item.children?.map((cItem) => {
                  return (
                    <a-menu-item
                      key={cItem.key}
                      v-slots={{
                        icon: () =>
                          h(compile(cItem.icon), {
                            style: {
                              color: 'var(--color-text-3)',
                              fontSize: '16px'
                            }
                          })
                      }}
                      onClick={() => {
                        handleClickUserMenu(cItem);
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--color-text-2)',
                          fontSize: '14px'
                        }}
                      >
                        {t(cItem.name)}
                      </span>
                    </a-menu-item>
                  );
                })}
              </a-sub-menu>
            );
            nodes.push(rt);
          });
          return nodes;
        }
        return travel();
      };

      const getProjectList = async () => {
        try {
          const params = {
            page: -1
          };
          const { data } = await queryProjects(params);
          const list = _.map(data.items, (item) => {
            return {
              label: item.name,
              value: item.id
            };
          });
          const defaultProject = await localStore.getValue(
            USER_DEFAULT_PROJECT
          );
          const defaultValue = route.params.projectId || _.get(list, '0.value');
          const defaultName = _.get(list, '0.label');
          if (!defaultProject?.id && list.length) {
            localStore.setValue(USER_DEFAULT_PROJECT, {
              id: defaultValue,
              name: defaultName
            });
          } else if (!list.length) {
            localStore.setValue(USER_DEFAULT_PROJECT, { id: '', name: '' });
          } else {
            const data = _.find(
              list,
              (item) => item.value === defaultProject?.id
            );
            localStore.setValue(USER_DEFAULT_PROJECT, {
              id: data?.value || defaultValue,
              name: data?.label || defaultName
            });
          }
          projectStore.setInfo({
            projectList: _.cloneDeep(list)
          });
        } catch (error) {
          projectStore.setInfo({
            projectList: []
          });
          console.log(error);
        }
      };
      getProjectList();
      return () => (
        <div class="menu-container">
          <a-menu
            mode="pop"
            v-model:collapsed={collapsed.value}
            show-collapse-button={true}
            auto-open={false}
            selected-keys={appStore.selectedKey}
            auto-open-selected={true}
            level-indent={20}
            style="height: 100%"
            onCollapse={setCollapse}
          >
            <div class="box">
              <div class="sys">{renderSubMenu()}</div>
              <div class="account">{renderUserMenu()}</div>
            </div>
          </a-menu>
        </div>
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

  .menu-container {
    height: 100%;

    .box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding-bottom: 60px;

      .account {
        padding-top: 2px;
        border-top: 1px solid var(--color-border-1);

        .iconfont.icon-language {
          margin-left: 1px;
        }
      }
    }
  }
</style>

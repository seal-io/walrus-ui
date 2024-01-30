<script lang="tsx">
  import _ from 'lodash';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import BC from '@/hooks/broadcast-channel';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
  import {
    useAppVersion,
    showVersionModal,
    versionData,
    getVersion
  } from '@/hooks/fetch-app-version';

  import {
    useAppStore,
    useProjectStore,
    useUserStore,
    useTabBarStore
  } from '@/store';
  import useUser from '@/hooks/user';
  import usePermission from '@/hooks/permissions';
  import useListenerRouteChange from '@/hooks/use-listener-route-change';
  import { listenerRouteChange } from '@/utils/route-listener';
  import useLocale from '@/hooks/locale';
  import { PageAction } from '@/views/config';
  import useEnterApplication from '@/views/hooks/use-enter-application';
  import { profileMenu, avatarMenu } from './config';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { initDefaultProject, gotoEnvironmentDetail } =
        useEnterApplication();
      const { t, router, route } = useCallCommon();
      const currentRoute = ref<string>('');
      const appStore = useAppStore();
      const userStore = useUserStore();
      const { changeLocale, currentLocale } = useLocale();
      const { logout } = useUser();
      const projectStore = useProjectStore();
      const tabBarStore = useTabBarStore();
      const permission = usePermission();
      const execListenerRouteChange = useListenerRouteChange();
      const versionInfo = ref({});

      // listener to  route change
      execListenerRouteChange();

      // sync the project data between tabs
      BC.onmessage((message) => {
        if (message.type === 'project') {
          const { projectList } = message.data;
          projectStore.setInfo({
            projectList
          });
        }
      });
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
          return el.name === 'root';
        }) as RouteRecordNormalized;
      });
      const menuTree = computed(() => {
        let copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
        copyRouter = copyRouter.filter(
          (r: RouteRecordNormalized) => !r?.meta || !r?.meta?.hideInMenu
        );
        copyRouter.sort(
          (a: RouteRecordNormalized, b: RouteRecordNormalized) => {
            return (a.meta.order || 0) - (b.meta.order || 0);
          }
        );
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
      const getAppVersion = async () => {
        versionInfo.value = await useAppVersion();
      };
      const handleShowVersion = () => {
        showVersionModal(versionInfo.value as versionData);
      };

      // In this case only two levels of menus are available
      // You can expand as needed

      const goto = async (item: RouteRecordRaw) => {
        const query: any = item.meta?.query;
        const isReplace: any = item.meta?.replace;
        tabBarStore.clearTags();
        console.log('project list', item, projectStore.projectList);
        if (item.name === PROJECT.List) {
          await initDefaultProject();
          gotoEnvironmentDetail();
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
        currentRoute.value = newRoute.matched[1]?.name as string;
        if (newRoute.meta.requiresAuth || newRoute.meta.profileView) {
          const { matched } = newRoute;
          const activeRoute = newRoute.matched[matched.length - 1];
          const key =
            activeRoute?.meta?.selectedMenu || (activeRoute?.name as string);

          appStore.updateSettings({ selectedKey: [key] });
        }
        if (newRoute.meta.clearMenuStatus) {
          appStore.updateSettings({ selectedKey: [] });
        }
        console.log('currentRoute', appStore.selectedKey);
      }, true);
      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop')
          appStore.updateSettings({ menuCollapse: val });
      };

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
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
                    <a-menu-item key={elem.name} onClick={() => goto(elem)}>
                      {h(compile(icon))}
                      <span class="title"> {t(elem?.meta?.locale || '')}</span>
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
        if (item.key === 'CliDownload') {
          router.push({
            name: item.route
          });
          return;
        }
        if (item.key === 'logout') {
          logout();
          return;
        }
        if (item.key === 'home') {
          window.open(item.value, '_blank');
        }
        if (item.key === 'docs') {
          const lang = currentLocale.value === 'zh-CN' ? 'zh' : '';
          window.open(item.value(lang), '_blank');
          return;
        }
        if (item.key === 'version') {
          handleShowVersion();
          return;
        }
        if (item.key === 'chinese' || item.key === 'english') {
          changeLocale(item.value);
        }
      };
      const renderUserMenu = (menuConfig) => {
        function travel() {
          const nodes: any[] = [];
          menuConfig.forEach((item) => {
            let rt: any = null;
            if (item.children && item.children.length) {
              rt = (
                <a-sub-menu
                  key={item.name}
                  style={{
                    ...item.itemStyle
                  }}
                  v-slots={{
                    'icon': () =>
                      h(compile(item.icon), {
                        style: {
                          ...item.iconStyle
                        }
                      }),
                    'expand-icon-right': () => {},
                    'title': () => {
                      return (
                        <span>
                          {item.key === 'Profile' ? (
                            <Autotip style={{ maxWidth: '80px' }} class="flex">
                              {userStore.name || t(item.name)}
                            </Autotip>
                          ) : (
                            t(item.name || '')
                          )}
                        </span>
                      );
                    }
                  }}
                >
                  {item.children?.map((cItem) => {
                    return (
                      <a-menu-item
                        key={cItem.name}
                        v-slots={{
                          icon: () => h(compile(cItem.icon))
                        }}
                        onClick={() => {
                          handleClickUserMenu(cItem);
                        }}
                      >
                        <span class="title" style={{ fontSize: '12px' }}>
                          {t(cItem.name)}
                        </span>
                      </a-menu-item>
                    );
                  })}
                </a-sub-menu>
              );
            } else {
              rt = (
                <a-menu-item
                  key={item.key}
                  v-slots={{
                    icon: () => h(compile(item.icon))
                  }}
                  onClick={() => {
                    handleClickUserMenu(item);
                  }}
                >
                  <span class="title">{t(item.name)}</span>
                </a-menu-item>
              );
            }

            nodes.push(rt);
          });
          return nodes;
        }
        return travel();
      };

      const init = async () => {
        userStore.info();
        getAppVersion();
      };
      init();
      return () => (
        <div class="menu-container">
          <a-menu
            mode="pop"
            collapsed={false}
            show-collapse-button={false}
            auto-open={false}
            selected-keys={appStore.selectedKey}
            auto-open-selected={true}
            collapsed-width={appStore.smallWidth}
            level-indent={20}
            style="height: 100%"
            onCollapse={setCollapse}
          >
            <div class="box">
              <div class="sys">{renderSubMenu()}</div>
              <div>
                <div class="tools">{renderUserMenu(profileMenu)}</div>
                <div class="account">{renderUserMenu(avatarMenu)}</div>
              </div>
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
    .arco-menu-inline-header {
      display: flex;
      align-items: center;
    }

    .arco-menu-icon-suffix .arco-icon {
      font-size: 14px;
    }

    .arco-icon {
      &:not(.arco-icon-down) {
        font-size: 16px;
      }
    }
  }

  .menu-container {
    height: 100%;
    padding-top: 10px;

    .box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding-bottom: 50px;

      .account {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px solid var(--color-border-2);

        .iconfont.icon-language {
          margin-left: 1px;
        }
      }
    }
  }
</style>

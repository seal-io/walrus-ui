<template>
  <a-breadcrumb class="container-breadcrumb">
    <template #separator>
      <span></span>
    </template>
    <a-breadcrumb-item v-if="menu && !items.length">
      <span class="box">
        <span v-if="menu.type" class="type">{{ menu.type }}</span>
        <span class="item-content">
          <!-- <i v-if="menu.iconfont" class="iconfont" :class="[menu.icon]"></i>
          <component :is="menu.icon" v-else-if="menu.icon"></component> -->
          <span class="label menu">{{ $t(menu.label || '') }}</span>
        </span>
      </span>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="(item, index) in items" :key="index">
      <span class="box">
        <span class="type">{{ $t(item.type || '') }}</span>
        <span
          :id="item.wrapperId"
          class="item-content"
          style="position: relative; height: 25px"
        >
          <span v-if="item.options?.length" class="label single">
            <a-select
              :popup-visible="item.visible"
              :bordered="false"
              :model-value="item.value"
              :input-value="item.inputValue"
              show-footer-on-empty
              :class="{ 'active-bread': index === items.length - 1 }"
              :virtual-list-props="getVirtualListProps(item)"
              :trigger-props="{
                contentClass: 'component-select-drop',
                contentStyle: { width: '200px' },
                preventFocus: false
              }"
              :loading="loading && level === item.level"
              :popup-container="getContainer(item.wrapperId) || ''"
              size="mini"
              :options="_.sortBy(item.options, 'label')"
              class="border-less"
              @click="handleClick(item, index)"
              @change="(val) => handleSelectChange(val, item)"
            >
              <template #empty>
                <span>{{
                  item.inputValue ? $t('common.search.nodata') : ''
                }}</span>
              </template>
              <template #option="{ data }">
                <AutoTip
                  :key="data.value"
                  :tooltip-props="{
                    content: data.label
                  }"
                >
                  <span
                    class="bread-item"
                    style="font-weight: var(--font-weight-medium)"
                    @click.stop="() => handleOption(data, item)"
                  >
                    <span
                      v-if="item.level === pageLevelMap.Environment"
                      class="m-r-4 star-btn"
                      @click.stop="handleSetDefault(data)"
                    >
                      <icon-star
                        v-if="
                          projectStore.defaultActiveEnvironment?.id !==
                            data.value ||
                          !projectStore.isSetDefaultActiveEnvironment
                        "
                        :style="{
                          color: `rgb(var(${StatusColorValueMap.warningBg}))`
                        }"
                      />
                      <icon-star-fill
                        v-if="
                          projectStore.defaultActiveEnvironment?.id ===
                            data.value &&
                          projectStore.isSetDefaultActiveEnvironment
                        "
                        :style="{
                          color: `rgb(var(${StatusColorValueMap.warningColor}))`
                        }"
                      />
                    </span>
                    {{ data.label }}</span
                  >
                </AutoTip>
              </template>
              <template #arrow-icon>
                <OnClickOutside
                  :options="{
                    ignore: ['.bread-option-search-wrapper']
                  }"
                  @trigger="handleClickOutSide(item)"
                >
                  <span
                    v-if="!item.hideDropDown"
                    class="bread-icon-btn"
                    @click.stop="handleTogglePopup(item)"
                  >
                    <icon-down />
                  </span>
                </OnClickOutside>
              </template>
              <template #footer>
                <div class="search-box bread-option-search-wrapper">
                  <a-input
                    v-model="item.inputValue"
                    allow-clear
                    @clear="(val) => handleClearSearch(item)"
                    @input="(val) => handleSearch(item)"
                  >
                    <template #prefix>
                      <icon-search />
                    </template>
                  </a-input>
                </div>
                <div
                  v-if="item.onSetting"
                  style="
                    display: flex;
                    align-items: center;
                    height: 36px;
                    overflow: hidden;
                  "
                >
                  <a-link
                    class="flex-1"
                    style="
                      height: 34px;
                      padding: 0 10px;
                      color: var(--color-text-selected);
                      font-weight: var(--font-weight-medium);
                      font-size: 13px;
                      line-height: 34px;
                    "
                    @click="handleOnSettings(item)"
                  >
                    <icon-settings class="mright-5" />{{
                      $t('common.button.management')
                    }}
                  </a-link>
                </div>
              </template>
            </a-select>
          </span>
          <span v-else class="label single">
            <a-link
              v-if="index !== items.length - 1"
              style="color: var(--color-text-selected)"
              @click="handleClickItem(item)"
            >
              <!-- <component :is="item.icon" v-if="item.icon"></component> -->
              {{ $t(item.label || '') }}
            </a-link>
            <span v-else>
              {{ $t(item.label || '') }}
            </span>
          </span>
        </span>
      </span>
      <span
        v-if="index < items.length - 1"
        class="separator-line"
        :class="{ 'sub-label': !!item.type }"
      >
        <icon-oblique-line class="size-14" style="stroke-width: 4" />
      </span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { StatusColorValueMap, pageLevelMap } from '@/views/config';
  import { PropType, ref } from 'vue';
  import { useProjectStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import { vOnClickOutside, OnClickOutside } from '@vueuse/components';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { getListLabel } from '@/utils/func';

  const props = defineProps({
    items: {
      type: Array as PropType<BreadcrumbOptions[]>,
      default() {
        return [];
      }
    },
    menu: {
      type: Object as PropType<BreadcrumbOptions>,
      default() {
        return null;
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    level: {
      type: String,
      default: ''
    }
  });
  const projectStore = useProjectStore();
  const { router, route } = useCallCommon();
  const emits = defineEmits(['change', 'search']);
  let timer: any = null;

  const handleSetDefault = (item) => {
    // cancel default environment
    if (
      projectStore.checkIsDefaultActiveEnvironment({
        id: item.value,
        name: item.label
      }) &&
      projectStore.isSetDefaultActiveEnvironment
    ) {
      projectStore.setIsDefaultActiveEnvironment(false);
      projectStore.setDefaultActiveProject({
        id: route.params.projectId
      });
      projectStore.setDefaultActiveEnvironment({
        id: route.params.environmentId
      });
      return;
    }
    projectStore.setIsDefaultActiveEnvironment(true);
    projectStore.setDefaultActiveProject({
      id: item.project?.id,
      name: item.project?.name || ''
    });
    projectStore.setDefaultActiveEnvironment({
      id: item.value,
      name: item.label
    });
    projectStore.setEnterProjectDefault({
      list: false,
      detail: false,
      projectId: ''
    });
  };
  const handleSearch = (item) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const data = _.find(item.options, (option) => {
        return _.includes(option.label, item.inputValue);
      });
      if (!data) {
        emits('search', item);
      }
    }, 500);
  };

  const handleClearSearch = (item) => {
    item.inputValue = '';
    emits('search', item);
  };
  const getVirtualListProps = (item) => {
    if (item?.options?.length > 50) {
      return {
        height: 200
      };
    }
    return undefined;
  };
  const handleSelectChange = (value, item) => {
    emits('change', { value, item });
  };
  const handleOption = (data, item) => {
    handleSelectChange(data.value, item);
  };
  const getContainer = (name) => {
    if (!name) return null;
    return document.getElementById(name);
  };
  const handleClick = (item, index) => {
    item.visible = false;
    if (index === props.items.length - 1) {
      return;
    }
    if (item.backAction) {
      router.back();
    } else {
      const params = item.routeParams ? { params: item.routeParams } : {};
      const query = item.routeQuery ? { query: item.routeQuery } : {};
      router.replace({
        name: item.route,
        ...params,
        ...query
      });
    }
  };
  const handleClickItem = (item) => {
    if (item.backAction) {
      router.back();
    } else {
      const params = item.routeParams ? { params: item.routeParams } : {};
      const query = item.routeQuery ? { query: item.routeQuery } : {};
      router.replace({
        name: item.route,
        ...params,
        ...query
      });
    }
  };

  const handleTogglePopup = (item) => {
    item.visible = !item.visible;
  };
  const handleClickOutSide = (item) => {
    item.visible = false;
  };
  const handleOnSettings = (item) => {
    item.onSetting?.(item);
  };
</script>

<style scoped lang="less">
  .container-breadcrumb {
    .bread-item {
      &::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
      }

      .star-btn {
        position: relative;
        z-index: 100;
      }
    }

    margin: 0;
    color: var(--color-text-2);

    :deep(.arco-breadcrumb-item-separator) {
      display: none;
    }

    .label {
      margin-left: 5px;
      color: var(--color-text-2);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-large);

      &.menu {
        margin-left: 0;
      }

      &.single {
        margin-left: 0;
      }

      :deep(.arco-select-view-single) {
        padding: 0;

        &.border-less {
          background-color: transparent;
          border: none;
          border-radius: 0;

          &:hover {
            cursor: default;
          }

          .arco-select-view-icon {
            padding: 3px;
            color: var(--color-text-selected);
            transition: transform 0.2s cubic-bezier(0, 0, 1, 1);

            &:hover {
              background-color: var(--color-fill-3);
              border-radius: var(--border-radius-mini);
              box-shadow: 0 0 6px var(--color-fill-3);
              cursor: pointer;
            }
          }
        }

        .arco-select-view-value {
          margin-right: 12px;
          color: var(--color-text-selected);
          font-weight: var(--font-weight-medium);
          font-size: 14px;
          transform: scale(1.05);

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .separator-line {
      position: relative;
      top: 0;
      margin: 0 30px;
      color: var(--color-text-3);
      font-weight: var(--font-weight-medium);
      font-size: 14px;

      &.sub-label {
        top: 8px;
      }
    }

    .box {
      display: flex;
      flex-direction: column;
      color: var(--color-text-2);
      font-size: 12px;
      line-height: 1.4;

      .type {
        margin-top: 6px;
        color: var(--color-bread-type);
        font-weight: var(--font-weight-regular);
      }

      .separator-line {
        color: var(--color-text-3);
      }

      .item-content {
        display: flex;
        align-items: center;
        font-size: 0;
      }

      :deep(.arco-select-view-icon) {
        .bread-icon-btn {
          position: relative;

          &::after {
            position: absolute;
            top: -6px;
            right: -6px;
            bottom: -6px;
            left: -6px;
            display: inline-block;
            content: '';
          }
        }
      }
    }

    :deep(.arco-breadcrumb-item) {
      display: flex;
      align-items: center;
      padding: 0;
      color: rgba(255, 255, 255, 1);

      .arco-link {
        font-size: var(--font-size-large);
      }

      .arco-trigger-content {
        .arco-select-option {
          line-height: 32px;
        }
      }

      &:last-child {
        font-weight: var(--font-weight-regular);

        .arco-select-view-single {
          .arco-select-view-value {
            color: var(--color-text-2);
            font-weight: var(--font-weight-medium);
            cursor: default;

            // &:hover {
            //   transform: scale(1);
            // }
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .component-select-drop {
    .arco-select-dropdown-has-footer {
      position: relative;
      padding-top: 45px;

      .search-box {
        position: absolute;
        top: 8px;
        left: 0;
        padding: 0 8px;
      }

      .arco-select-dropdown-empty {
        display: block;
        padding: 10px 0;
        color: var(--color-text-3);
        font-size: 12px;
        text-align: center;
      }
    }
  }
</style>

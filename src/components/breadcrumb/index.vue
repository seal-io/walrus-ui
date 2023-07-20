<template>
  <a-breadcrumb class="container-breadcrumb">
    <template #separator>
      <span></span>
    </template>
    <a-breadcrumb-item v-if="menu">
      <span class="box">
        <span v-if="menu.type" class="type">{{ menu.type }}</span>
        <span class="item-content">
          <i v-if="menu.iconfont" class="iconfont" :class="[menu.icon]"></i>
          <component :is="menu.icon" v-else-if="menu.icon"></component>
          <span class="label">{{ $t(menu.label || '') }}</span>
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
              :options="item.options"
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
                  <span>{{ data.label }}</span>
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
                  <a-input v-model="item.inputValue" allow-clear>
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
                    font-weight: 400;
                  "
                >
                  <a-link
                    class="flex-1"
                    style="
                      height: 34px;
                      padding: 0 10px;
                      color: var(--sealblue-6);
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
              style="color: var(--sealblue-6)"
              @click="handleClickItem(item)"
            >
              <component :is="item.icon" v-if="item.icon"></component>
              {{ item.label }}
            </a-link>
            <span v-else>{{ item.label }}</span>
          </span>
          <icon-oblique-line
            v-if="index < items.length - 1"
            class="size-14 separator-line"
            style="stroke-width: 3; margin-left: 14px"
          />
        </span>
      </span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import _, { filter } from 'lodash';
  import { PropType, ref } from 'vue';
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
  const { router } = useCallCommon();
  const emits = defineEmits(['change']);

  const getVirtualListProps = (item) => {
    if (item?.options?.length > 100) {
      return {
        height: 200
      };
    }
    return undefined;
  };
  const handleSelectChange = (value, item) => {
    emits('change', { value, item });
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
      router.replace({
        name: item.route
      });
    }
  };
  const handleClickItem = (item) => {
    if (item.backAction) {
      router.back();
    } else {
      router.replace({
        name: item.route
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
    // margin: 16px 0;
    margin: 0;
    color: var(--color-text-2);

    .label {
      margin-left: 5px;
      color: var(--color-text-2);
      font-size: 14px;

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
            color: var(--sealblue-6);
            transition: transform 0.2s cubic-bezier(0, 0, 1, 1);

            &:hover {
              background-color: transparent;
              border-radius: 50%;
              box-shadow: 0 0 6px var(--sealblue-6);
              cursor: pointer;
            }
          }
        }

        .arco-select-view-value {
          margin-right: 12px;
          color: var(--sealblue-6);
          font-weight: 500;
          font-size: 14px;
          transform: scale(1.05);

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .box {
      display: flex;
      flex-direction: column;
      color: var(--color-text-2);
      font-size: 12px;
      line-height: 1.4;

      .type {
        color: rgba(78, 89, 105, 0.5);
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
      color: rgba(255, 255, 255, 1);

      .arco-trigger-content {
        .arco-select-option {
          line-height: 32px;
        }
      }

      &:last-child {
        font-weight: 400;

        .arco-select-view-single {
          .arco-select-view-value {
            color: var(--color-text-2);
            font-weight: 500;
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
      padding-top: 42px;

      .search-box {
        position: absolute;
        top: 5px;
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

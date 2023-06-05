<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item v-if="menu.label">
      <span class="box">
        <span v-if="menu.type" class="type">Application</span>
        <span class="item-content">
          <component
            :is="menu.icon"
            v-if="menu.icon"
            style="color: rgba(255, 255, 255, 1)"
          ></component>
          <span class="label">{{ menu.label }}</span>
        </span>
      </span>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="(item, index) in items" :key="index">
      <span class="box">
        <span class="type">{{ item.type }}</span>
        <span class="item-content">
          <span v-if="item.options?.length" class="label single">
            <a-select
              :model-value="item.value"
              style="width: 120px"
              :options="item.options"
              size="mini"
              class="border-less"
              @change="(val) => handleSelectChange(val, item)"
            ></a-select>
          </span>
          <span v-else class="label single">{{ item.label }}</span>
        </span>
      </span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType } from 'vue';
  import { BreadcrumbOptions } from '@/views/config/interface';

  defineProps({
    items: {
      type: Array as PropType<BreadcrumbOptions[]>,
      default() {
        return [];
      }
    },
    menu: {
      type: Object as PropType<BreadcrumbOptions>,
      default() {
        return {};
      }
    }
  });

  const emits = defineEmits(['change']);
  const handleSelectChange = (val, item) => {
    emits('change', val, item);
  };
</script>

<style scoped lang="less">
  .container-breadcrumb {
    margin: 16px 0;
    color: rgba(255, 255, 255, 1);

    .label {
      margin-left: 5px;
      color: rgba(255, 255, 255, 1);
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

          .arco-select-view-icon {
            color: #fff;
          }
        }

        .arco-select-view-value {
          color: #fff;
        }
      }
    }

    .box {
      display: flex;
      flex-direction: column;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      line-height: 1.4;

      .item-content {
        display: flex;
        align-items: center;
        font-size: 0;
      }
    }

    :deep(.arco-breadcrumb-item) {
      color: rgba(255, 255, 255, 1);

      &:last-child {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
</style>

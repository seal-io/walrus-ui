<template>
  <div class="service">
    <div class="variables m-t-10">
      <ViewForm
        style="width: 100%; padding: 0"
        :form-data="serviceInfo.attributes"
        :field-list="templateInfo"
      ></ViewForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { onMounted, nextTick } from 'vue';
  import ViewForm from '@/components/form-create/view-form.vue';
  import useServiceData from '../hooks/use-service-data';

  const { initInfo, serviceInfo, templateInfo } = useServiceData();

  const initData = async () => {
    console.log('initfo=========');
    await initInfo();
  };
  defineExpose({
    initData,
    initInfo
  });
</script>

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }

    .arco-modal-body {
      padding-bottom: 0;
    }

    .arco-modal-footer {
      border-top: 1px solid var(--color-neutral-3);
    }
  }
</style>

<style lang="less" scoped>
  @import url('@/components/form-create/style/side-menu.less');

  .service {
    :deep(.arco-tabs-nav-tab-list) {
      padding-left: 10px;
    }

    :deep(.arco-form-item) {
      margin-bottom: 0;

      .arco-form-item-label {
        font-size: 14px;
      }
    }

    :deep(.arco-tabs-content) {
      padding: 16px 0 0 0;
    }

    :deep(.arco-descriptions-layout-inline-vertical) {
      .arco-descriptions-body {
        border: none;
      }

      .arco-descriptions-table {
        border-collapse: separate;
        border-spacing: 10px;

        .arco-descriptions-item {
          padding: 10px;
          border: 1px solid var(--color-border-2);
          border-radius: var(--border-radius-small);
        }
      }

      .arco-textarea-wrapper {
        background-color: var(--color-fill-2);
        border: none;
      }
    }
  }
</style>

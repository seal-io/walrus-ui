<template>
  <div class="license-table-wrap">
    <div class="title">{{ $t('sbom.table.license') }}</div>
    <a-table :data="dataList" :pagination="false" :bordered="false">
      <template #columns>
        <a-table-column data-index="id" :title="$t('sbom.table.license')">
          <template #cell="{ record }">
            <span>{{ get(record, 'license.id') }}</span>
          </template>
        </a-table-column>
        <!-- <a-table-column data-index="type" title="LicenseType"> </a-table-column> -->
        <a-table-column
          data-index="type"
          :title="$t('sbom.table.operation')"
          align="center"
        >
          <template #cell="{ record }">
            <a-link :href="get(record, 'license.url')" target="_blank">{{
              $t('common.button.detail')
            }}</a-link>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { LicenseItem } from '../config/interface';

  defineProps({
    dataList: {
      type: Array as PropType<LicenseItem[]>,
      default() {
        return [];
      },
    },
  });
</script>

<style lang="less" scoped>
  .license-table-wrap {
    .title {
      margin-bottom: 20px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
    }
  }
</style>

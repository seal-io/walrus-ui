<template>
  <div class="resource-wrap">
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('applications.applications.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{ record.createTime }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="type"
          :title="$t('applications.applications.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="status"
          :title="$t('applications.applications.table.status')"
        >
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleEnabled(record)">
                <!-- <template #icon><icon-edit /></template> -->
                {{ $t('common.button.enabled') }}
              </a-link>
              <a-link type="text" size="small" @click="handleDisabled(record)">
                <!-- <template #icon><icon-list style="font-size: 16px" /></template> -->
                {{ $t('common.button.disabled') }}
              </a-link>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { InstanceResource } from '../../config/interface';

  const dataList = ref<InstanceResource[]>([
    { name: 'mydb', type: 'rds', status: 'ready' },
    { name: 'configmap', type: 'k8s', status: 'ready' }
  ]);
  const handleEnabled = (row) => {
    console.log(row);
  };
  const handleDisabled = (row) => {
    console.log(row);
  };
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>

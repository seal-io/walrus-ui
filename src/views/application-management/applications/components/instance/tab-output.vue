<template>
  <div class="output-wrap">
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
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="moduleName"
          :title="$t('applications.applications.table.module')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="capitalize($t('common.input.type'))"
        >
          <template #cell="{ record }">
            <span>{{ record.type }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="value"
          :title="capitalize($t('common.input.value'))"
        >
          <template #cell="{ record }">
            <span>{{ record.sensitive ? '******' : record.value }}</span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { capitalize } from 'lodash';
  import { onMounted, ref, inject, watch } from 'vue';
  import { queryInstanceOutputs } from '../../api';

  const instanceId = inject('instanceId', ref(''));
  const dataList = ref([]);
  const fetchData = async () => {
    try {
      const { data } = await queryInstanceOutputs({ id: instanceId.value });
      dataList.value = data || [];
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => instanceId.value,
    () => {
      fetchData();
    },
    {
      immediate: true
    }
  );
  onMounted(() => {
    // fetchData();
  });
</script>

<style></style>

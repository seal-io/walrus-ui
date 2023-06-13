<template>
  <div class="optimization-wrap">
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
          data-index="target"
          :title="$t('applications.applications.table.target')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="currentVal"
          :title="$t('applications.applications.table.currentval')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="recommendation"
          :title="$t('applications.applications.table.recommendation')"
        >
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const dataList = ref([
    {
      target: 'kubernetes_deployment.myapp.cpu',
      currentVal: '4 Cores',
      recommendation: '2 Cores'
    },
    {
      target: 'kubernetes_deployment.myapp.memory',
      currentVal: '16 GB',
      recommendation: '8 GB'
    }
  ]);
  onMounted(() => {
    console.log('optimization');
  });
</script>

<style></style>

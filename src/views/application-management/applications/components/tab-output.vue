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
          :title="$t('applications.applications.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="content"
          :title="$t('applications.applications.table.content')"
        >
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const dataList = ref([
    { name: 'SERVICE_URL', content: 'https://4uese.service.myorg.com' },
    { name: 'DB_ADDRESS', content: 'mmysql://user@172.21.2.5:3306' },
    { name: 'DB_USERNAME', content: 'user' },
    { name: 'DB_PASSWORD', content: 'password' }
  ]);
  onMounted(() => {
    console.log('output');
  });
</script>

<style></style>

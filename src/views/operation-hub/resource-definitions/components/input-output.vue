<template>
  <a-tabs v-model:active-key="activeKey">
    <a-tab-pane key="table" title="表单">
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :bordered="false"
        :loading="loading"
        :data="inputList"
        :pagination="false"
      ></a-table>
    </a-tab-pane>
    <a-tab-pane key="yaml" title="yaml"></a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Input, Output } from '../config/interface';

  const activeKey = ref('table');
  const loading = ref(false);
  const inputList = ref<Input[]>([]);
  const outputList = ref<Output[]>([]);
</script>

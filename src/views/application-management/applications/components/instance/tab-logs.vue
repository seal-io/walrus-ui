<template>
  <div class="tab-logs-wrap">
    <a-select
      style="width: 200px; margin-bottom: 8px"
      :options="containerList"
      :placeholder="$t('applications.applications.container.holder')"
    ></a-select>
    <AceEditor :model-value="content" read-only></AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';

  const currentVal = ref('');
  const content =
    ref(`time="2023-01-16T03:51:39Z" level=debug msg="dal.vuln 'pkg:maven/org.apache.commons/commons-compress@1.10' range kept 'ghsa/GHSA-hrmr-f5m6-m9pq'"
time="2023-01-16T03:51:39Z" level=debug msg="dal.vuln 'pkg:maven/org.apache.commons/commons-compress@1.10' range kept 'glad/CVE-2018-11771'"
time="2023-01-16T03:51:39Z" level=debug msg="dal.vuln 'pkg:maven/org.apache.commons/commons-compress@1.10' range kept 'glad/CVE-2021-35515'"
time="2023-01-16T03:51:39Z" level=debug msg="dal.vuln 'pkg:maven/org.apa`);
  const containerList = ref([
    { label: 'container1', value: 'a' },
    { label: 'container2', value: 'b' },
    { label: 'container3', value: 'c' }
  ]);
  onMounted(() => {
    console.log('logs');
  });
</script>

<style></style>

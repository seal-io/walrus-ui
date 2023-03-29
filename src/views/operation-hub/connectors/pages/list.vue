<template>
  <comCard borderless top-gap class="connectors">
    <a-tabs
      lazy-load
      class="page-line-tabs"
      :active-key="activeKey"
      type="line"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="item in connectorTypeList"
        :key="item.value"
        :disabled="!item.enable"
        :title="item.label"
      >
        <Component :is="connectorsMap[item.com]"></Component>
      </a-tab-pane>
    </a-tabs>
  </comCard>
</template>

<script lang="ts" setup>
  import { ref, markRaw, provide } from 'vue';
  import { connectorTypeList } from '../config';
  import connectorKubernetes from '../components/connector-kubernetes.vue';
  import connectorCustom from '../components/connector-custom.vue';
  import connectorCloud from '../components/connector-cloud.vue';
  import connectorScm from '../components/connector-scm.vue';

  const connectorsMap = {
    kubernetes: markRaw(connectorKubernetes),
    custom: markRaw(connectorCustom),
    cloud: markRaw(connectorCloud),
    versionControl: markRaw(connectorScm)
  };
  const activeKey = ref('Kubernetes');

  provide('activeKey', activeKey);
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
</script>

<script lang="ts">
  export default {
    name: 'ConnectorsList'
  };
</script>

<style></style>

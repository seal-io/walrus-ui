<template>
  <KubernetesDetail> </KubernetesDetail>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import KubernetesDetail from '@/views/operation-hub/connectors/pages/k8s-detail.vue';
</script>

<script lang="ts">
  export default {
    name: PROJECT.ConnectorK8sDetail
  };
</script>

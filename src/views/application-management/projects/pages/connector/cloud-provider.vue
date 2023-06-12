<template>
  <CloudProvider></CloudProvider>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import CloudProvider from '@/views/operation-hub/connectors/pages/cloud-provider.vue';
</script>

<script lang="ts">
  export default {
    name: PROJECT.ConnectorProviderDetail
  };
</script>

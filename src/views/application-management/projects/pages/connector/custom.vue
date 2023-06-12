<template>
  <Custom></Custom>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import Custom from '@/views/operation-hub/connectors/pages/custom-detail.vue';
</script>

<script lang="ts">
  export default {
    name: PROJECT.ConnectorCustomDetail
  };
</script>

<template>
  <VersionControl></VersionControl>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import VersionControl from '@/views/operation-hub/connectors/pages/scm-detail.vue';
</script>

<script lang="ts">
  export default {
    name: PROJECT.ConnectorScmDetail
  };
</script>

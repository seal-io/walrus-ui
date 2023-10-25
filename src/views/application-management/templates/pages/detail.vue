<template>
  <TemplateDetail> </TemplateDetail>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import TemplateDetail from '@/views/operation-hub/templates/pages/detail.vue';
</script>

<script lang="ts">
  export default {
    name: PROJECT.TemplateDetail
  };
</script>

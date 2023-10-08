<template>
  <div>
    <TableList scope="global" :current-view="currentView"></TableList>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import TableList from '../components/table-list.vue';

  defineProps({
    currentView: {
      type: String,
      default: 'thumb'
    }
  });
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.TemplateList
  };
</script>

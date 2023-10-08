<template>
  <div>
    <TableList scope="project" :current-view="currentView"></TableList>
  </div>
</template>

<script lang="ts" setup>
  import TableList from '@/views/operation-hub/templates/components/table-list.vue';

  defineProps({
    currentView: {
      type: String,
      default: 'thumb'
    }
  });
</script>

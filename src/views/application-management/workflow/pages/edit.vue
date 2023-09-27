<template>
  <flow-editor :height="height"></flow-editor>
</template>

<script lang="ts" setup>
  import flowEditor from '../components/flow-editor.vue';

  const height = 'calc(100vh - 266px)';
</script>

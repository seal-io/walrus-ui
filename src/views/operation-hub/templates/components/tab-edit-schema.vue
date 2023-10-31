<template>
  <div>自定义</div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  const props = defineProps({
    schema: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default() {
        return '100%';
      }
    }
  });
</script>

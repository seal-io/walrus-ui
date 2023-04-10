<template>
  <VCharts
    v-if="renderChart"
    :update-options="{ notMerge: true }"
    :option="options"
    :manual-update="false"
    :autoresize="autoresize"
    :style="{ width, height }"
  />
</template>

<script lang="ts" setup>
  import { ref, nextTick, watch } from 'vue';
  import VCharts from 'vue-echarts';
  // import { useAppStore } from '@/store';

  const props = defineProps({
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    autoresize: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  });
  // const appStore = useAppStore();
  // const theme = computed(() => {
  //   if (appStore.theme === 'dark') return 'dark';
  //   return '';
  // });
  const renderChart = ref(false);
  // wait container expand
  nextTick(() => {
    renderChart.value = true;
  });
</script>

<style scoped lang="less"></style>

<template>
  <div class="box">
    <span
      class="val"
      :style="{ 'background-color': `rgba(${finalColor}, .4` }"
      >{{ value }}</span
    >
    <span
      class="label"
      :style="{ 'background-color': `rgba(${finalColor}, 1` }"
      >{{ label }}</span
    >
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: {
      type: String,
      default() {
        return '';
      },
    },
    value: {
      type: [String, Number],
      default() {
        return 0;
      },
    },
    color: {
      type: String,
      default() {
        return '245, 63, 63';
      },
    },
  });

  const finalColor = computed(() => {
    if (props.value) {
      return props.color;
    }
    return '201,205,212';
  });
</script>

<style lang="less" scoped>
  .box {
    color: #fff;
    font-size: 14px;

    .val,
    .label {
      display: inline-block;
      box-sizing: border-box;
      height: 22px;
      padding: 0 6px;
      line-height: 22px;
      vertical-align: middle;
    }

    .val {
      display: inline-block;
      min-width: 30px;
      max-width: fit-content;
      padding: 0;
      color: rgba(var(--gray-10), 0.5);
      font-size: 12px;
      text-align: center;
    }

    .label {
      font-weight: 500;
      border-left: 1px solid #fff;
    }
  }
</style>

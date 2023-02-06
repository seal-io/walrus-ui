<template>
  <div class="box">
    <a-space :size="1">
      <span class="val h">{{ high }}</span>
      <span class="val m">{{ medium }}</span>
      <span class="val l">{{ low }}</span>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    high: {
      type: [String, Number],
      default() {
        return 0;
      },
    },
    medium: {
      type: [String, Number],
      default() {
        return 0;
      },
    },
    low: {
      type: [String, Number],
      default() {
        return 0;
      },
    },
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
      padding: 0;
      color: #fff;
      font-size: 14px;
      text-align: center;

      &.h {
        background: rgb(245, 63, 63);
      }

      &.m {
        background: rgb(255, 180, 0);
      }

      &.l {
        background: rgba(134, 144, 156, 0.4);
      }
    }
  }
</style>

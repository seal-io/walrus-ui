<template>
  <span class="provider-icon-wrap">
    <span
      class="icon"
      :class="{ dark: appStore.theme === 'dark' }"
      :style="{
        'width': `${size}px`,
        'height': `${size}px`,
        'background-image': `url(${repoIcon.get(toLower(provider))})`
      }"
    ></span>
  </span>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { toLower } from 'lodash';
  import { repoIcon } from './config';

  defineProps({
    provider: {
      type: String,
      default() {
        return 'github';
      }
    },
    size: {
      type: Number,
      default() {
        return 16;
      }
    }
  });
  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .provider-icon-wrap {
    font-size: 0;

    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: -3px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;

      &.dark {
        filter: invert(1) hue-rotate(180deg);
      }
    }
  }
</style>

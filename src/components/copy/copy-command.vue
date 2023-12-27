<template>
  <span v-if="isSupported" class="copy-btn">
    <span @click.stop="handleCopy">
      <a-link v-if="!copied"><icon-copy class="size-14" /></a-link>
      <span v-else
        ><icon-check-circle
          class="size-14 icon-blod"
          style="color: var(--seal-color-success)"
      /></span>
    </span>
  </span>
  <span v-else>
    <!-- <a-tooltip :content="$t('common.copy.notSupport')">
      <i
        class="iconfont icon-warning-filling"
        style="color: var(--seal-color-warning)"
      ></i>
    </a-tooltip> -->
    <clipboard :content="content"></clipboard>
  </span>
</template>

<script lang="ts" setup>
  import { useClipboard } from '@vueuse/core';
  import clipboard from './index.vue';

  const props = defineProps({
    content: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const { copy, copied, isSupported } = useClipboard({
    source: props.content,
    copiedDuring: 3000
  });

  const handleCopy = () => {
    copy(props.content);
  };
</script>

<style lang="less" scoped>
  .copy-btn {
    .arco-link {
      padding: 1px;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      transition: all 0.2s var(--seal-transition-func);

      &:hover {
        border-color: var(--color-border-3);
        transition: all 0.2s var(--seal-transition-func);
      }
    }
  }
</style>

<template>
  <span v-if="isSupported" class="copy-btn">
    <span class="flex" @click.stop="handleCopy">
      <a-link v-if="!copied"><icon-copy class="size-14" /></a-link>
      <span v-else class="copied"
        ><icon-check-circle
          class="size-14 icon-blod"
          style="color: var(--seal-color-success)"
      /></span>
    </span>
  </span>
  <span v-else>
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
    display: flex;
    width: 16px;
    height: 16px;

    .copied {
      display: flex;
      align-items: center;
    }

    .arco-link {
      border-radius: var(--border-radius-mini);
      transition: all 0.2s var(--seal-transition-func);

      &:hover {
        border-color: var(--color-border-3);
        transition: all 0.2s var(--seal-transition-func);
      }
    }
  }
</style>

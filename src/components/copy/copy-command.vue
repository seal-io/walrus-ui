<template>
  <span v-if="isSupported">
    <span @click="handleCopy">
      <a-link v-if="!copied"><icon-copy class="size-14" /></a-link>
      <span v-else
        ><icon-check-circle
          class="size-14 icon-blod"
          style="color: var(--seal-color-success)"
      /></span>
    </span>
  </span>
  <span v-else>
    <a-tooltip :content="$t('common.copy.notSupport')">
      <i
        class="iconfont icon-warning-filling"
        style="color: var(--seal-color-warning)"
      ></i>
    </a-tooltip>
  </span>
</template>

<script lang="ts" setup>
  import { useClipboard } from '@vueuse/core';

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

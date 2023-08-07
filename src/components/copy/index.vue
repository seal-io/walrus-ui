<template>
  <span ref="copyBtn" :data-clipboard-text="content" class="copy-btn">
    <a-link v-if="!copied"><icon-copy class="size-14" /></a-link>
    <span v-else
      ><icon-check-circle
        class="size-14 icon-blod"
        style="color: var(--seal-color-success)"
    /></span>
  </span>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, PropType, ref } from 'vue';

  import ClipboardJS from 'clipboard';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';

  defineProps({
    content: {
      type: String as PropType<string>,
      default() {
        return '';
      }
    }
  });
  const { t } = useI18n();
  const copied = ref(false);
  const copyBtn = ref();

  onMounted(() => {
    nextTick(() => {
      const clipboard = new ClipboardJS(copyBtn.value);
      clipboard.on('success', (e: any) => {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 3000);

        e.clearSelection();
      });
      clipboard.on('error', (e: any) => {
        Message.success(t('common.copy.fail') as string);
        e.clearSelection();
      });
    });
  });
</script>

<style lang="less" scoped>
  .copy-btn {
    cursor: pointer;

    :deep(.arco-icon-copy) {
      color: var(--sealblue-6);
    }

    .arco-link {
      padding: 1px;
      border: 1px solid var(--color-border-2);
      border-radius: 4px;
      transition: all 0.2s var(--seal-transition-func);

      &:hover {
        border-color: var(--color-border-3);
        transition: all 0.2s var(--seal-transition-func);
      }
    }
  }
</style>

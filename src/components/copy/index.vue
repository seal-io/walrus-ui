<template>
  <span ref="copyBtn" :data-clipboard-text="content" class="copy-btn">
    <icon-copy />
  </span>
</template>

<script lang="ts" setup>
  import {
    nextTick,
    onMounted,
    PropType,
    getCurrentInstance,
    computed,
  } from 'vue';

  import ClipboardJS from 'clipboard';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';

  defineProps({
    content: {
      type: String as PropType<string>,
      default() {
        return '';
      },
    },
  });
  const { t } = useI18n();
  const successMsg = computed(() => {
    return t('common.copy.success');
  });
  const failMsg = computed(() => {
    return t('common.copy.fail');
  });
  onMounted(() => {
    const vm: any = getCurrentInstance();
    nextTick(() => {
      const btn = vm.refs.copyBtn as string;
      const clipboard = new ClipboardJS(btn);
      clipboard.on('success', (e: any) => {
        Message.success(t('common.copy.success') as string);
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
  }
</style>

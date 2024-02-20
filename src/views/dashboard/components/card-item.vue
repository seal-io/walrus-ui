<template>
  <div class="card-item">
    <div class="content">
      <providerIcon :size="28" :provider="data.provider"></providerIcon>
      <div class="info">
        <div class="label">{{ $t(data.label) }}</div>
        <div class="value">{{ data.value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import providerIcon from '@/components/provider-icon/index.vue';

  interface DataType {
    label: string;
    value: number;
    provider: string;
  }
  defineProps({
    data: {
      type: Object as PropType<DataType>,
      default() {
        return {};
      }
    }
  });
</script>

<style lang="less" scoped>
  .card-item {
    display: flex;
    justify-content: center;
    padding: 12px 10px;
    text-align: center;
    // background: linear-gradient(#ebfdff 0%, #e9f1fc 100%);
    background: var(--seal-color-bg);
    border-radius: var(--border-radius-small);

    .content {
      display: flex;
      align-items: center;

      .info {
        margin-left: 10px;
        color: var(--color-text-1);
        font-size: 14px;
      }

      .label {
        margin-bottom: 8px;
      }

      .value {
        font-size: 22px;
      }
    }
  }
</style>

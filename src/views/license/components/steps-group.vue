<template>
  <div class="steps-wrap">
    <a-steps :current="step" :status="status">
      <a-step v-for="(item, index) in list" :key="item">
        <template v-if="loading && step === index + 1" #icon>
          <icon-loading />
        </template>
        {{ $t(item) }}
      </a-step>
    </a-steps>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    step: {
      type: Number,
      default() {
        return 1;
      },
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
    status: {
      type: String as PropType<'wait' | 'process' | 'finish' | 'error'>,
      default() {
        return 'wait';
      },
    },
    list: {
      type: Array as PropType<string[]>,
      default() {
        return ['license.edit.step.create', 'license.edit.step.license'];
      },
    },
  });
</script>

<style lang="less" scoped>
  .steps-wrap {
    width: 600px;
    margin: 0 auto;

    :deep(.arco-steps) {
      .arco-steps-icon {
        width: 20px;
        height: 20px;
        font-size: 14px;
        line-height: 18px;
      }

      .arco-steps-item-wait .arco-steps-icon {
        background-color: #fff;
      }

      .arco-steps-item-finish .arco-steps-icon {
        background-color: var(--color-primary-light-2);
      }

      .arco-steps-item-title {
        font-size: 14px;
        line-height: 20px;
      }

      .arco-steps-item-node {
        margin-right: 6px;
      }

      .arco-steps-item:not(:last-child) .arco-steps-item-title::after {
        top: 10px !important;
        height: 2px;
      }
    }
  }
</style>

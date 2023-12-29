<template>
  <a-space direction="vertical" fill class="labels-wrap">
    <div
      v-for="(item, index) in labelList"
      :key="index"
      class="item"
      style="width: 100%"
    >
      <SealViewItemWrap :label="$t('common.input.key')">
        <Autotip style="width: 100%">
          <span>{{ item.key }}</span>
        </Autotip>
      </SealViewItemWrap>
      <div class="separator">:</div>
      <SealViewItemWrap :label="$t('common.input.value')">
        <Autotip style="width: 100%">
          {{ item.value }}
        </Autotip>
      </SealViewItemWrap>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { computed, PropType } from 'vue';
  import { get, keys, map } from 'lodash';

  const props = defineProps({
    labels: {
      type: Object,
      default() {
        return {};
      }
    },
    mode: {
      type: String,
      default() {
        return 'json';
      }
    },
    view: {
      type: String, // label card
      default() {
        return 'label';
      }
    },
    bgColor: {
      type: String,
      default() {
        return 'rgb(232, 242, 255)';
      }
    }
  });
  const labelList = computed(() => {
    const keysList = map(keys(props.labels), (k) => {
      return {
        key: k,
        value: get(props.labels, k)
      };
    });
    return keysList;
  });
</script>

<style lang="less" scoped>
  .labels-wrap {
    .item {
      display: flex;
      align-items: center;

      .seal-view-item-wrap {
        flex: 1;
        width: 50%;
      }

      .separator {
        display: flex;
        justify-content: center;
        padding: 0 4px;
        color: var(--color-text-2);
      }
    }
  }
</style>

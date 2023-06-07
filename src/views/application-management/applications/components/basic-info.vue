<template>
  <div class="basic-info">
    <a-descriptions :data="dataInfo" :column="2">
      <a-descriptions-item
        v-for="(item, index) in dataInfo"
        :key="index"
        :label="item.label"
        :span="item.span"
      >
        <StatusLabel
          v-if="item.key === 'status'"
          :zoom="0.9"
          :status="{
            status: get(item, 'value.summaryStatus'),
            text: get(item, 'value.summaryStatus'),
            message: '',
            transitioning: get(item, 'value.transitioning'),
            error: get(item, 'value.error')
          }"
        ></StatusLabel>
        <div v-else>{{ get(item, 'value') }}</div>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { get } from 'lodash';

  const props = defineProps({
    dataInfo: {
      type: Array as PropType<
        { label: string; value: string; key: string; span?: number }[]
      >,
      default() {
        return [];
      }
    }
  });
</script>

<style lang="less" scoped>
  .basic-info {
    :deep(.arco-descriptions-row) {
      .arco-descriptions-item-label-block {
        font-weight: 400;
      }

      .arco-descriptions-item,
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        line-height: 1.5;
      }
    }
  }
</style>

<template>
  <div class="basic-info">
    <a-descriptions :data="dataInfo" :column="2" layout="inline-vertical">
      <a-descriptions-item
        v-for="(item, index) in dataInfo"
        :key="index"
        :label="item.label"
        :span="item.span"
      >
        <slot name="value" :data="item">
          <StatusLabel
            v-if="item.key === 'status'"
            :zoom="0.9"
            :status="{
              status: get(item, 'value.summaryStatus') || '',
              text: get(item, 'value.summaryStatus'),
              message: get(item, 'value.summaryStatusMessage') || '',
              transitioning: get(item, 'value.transitioning'),
              error: get(item, 'value.error')
            }"
          ></StatusLabel>
          <labelsList
            v-else-if="item.key === 'labels'"
            :labels="item.value"
          ></labelsList>
          <div v-else class="val-content">{{ get(item, 'value') }}</div>
        </slot>
      </a-descriptions-item>
    </a-descriptions>
    <div v-if="actions.length" class="dropdown">
      <DropButtonGroup
        :actions="actions"
        @click="handleClick"
        @select="handleSelect"
      ></DropButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { get } from 'lodash';
  import { MoreAction } from '@/views/config/interface';
  import labelsList from './labels-list.vue';

  const props = defineProps({
    dataInfo: {
      type: Array as PropType<
        { label: string; value: any; key: string; span?: number }[]
      >,
      default() {
        return [];
      }
    },
    actions: {
      type: Array as PropType<MoreAction[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['groupSelect', 'groupClick']);
  const handleSelect = (val) => {
    emits('groupSelect', val);
  };
  const handleClick = (data) => {
    emits('groupClick', data);
  };
</script>

<style lang="less" scoped>
  .basic-info {
    position: relative;

    .dropdown {
      position: absolute;
      top: 5px;
      right: -10px;
    }

    :deep(.arco-descriptions-row) {
      .arco-descriptions-item-label-block {
        font-weight: 500;
        font-size: var(--font-size-small);
      }

      .arco-descriptions-item,
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        min-height: 30px;
        font-weight: 500;
        font-size: var(--font-size-small);
        line-height: 2.5;
      }

      .val-content {
        width: max-content;
        max-width: 600px;
        max-height: 80px;
        overflow-y: auto;
      }
    }
  }
</style>

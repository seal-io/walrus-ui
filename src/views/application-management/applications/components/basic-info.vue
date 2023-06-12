<template>
  <div class="basic-info">
    <a-descriptions :data="dataInfo" :column="2">
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
              status: get(item, 'value.summaryStatus'),
              text: get(item, 'value.summaryStatus'),
              message: '',
              transitioning: get(item, 'value.transitioning'),
              error: get(item, 'value.error')
            }"
          ></StatusLabel>
          <div v-else>{{ get(item, 'value') }}</div>
        </slot>
      </a-descriptions-item>
    </a-descriptions>
    <a-dropdown
      v-if="actions.length"
      size="small"
      style="line-height: 30px"
      position="br"
      @select="handleSelect"
    >
      <a-button
        size="mini"
        style="position: absolute; top: 5px; right: -10px; padding: 0 4px"
        @click.stop="() => {}"
      >
        <icon-more style="font-size: 18px; stroke-width: 5" />
      </a-button>
      <template #content>
        <a-doption
          v-for="item in actions"
          :key="item.value"
          :value="item.value"
          :style="{
            'line-height': '28px'
          }"
        >
          <a-link :status="item.status" class="inline"
            ><component
              :is="item.icon"
              v-bind="item.props"
              style="margin-right: 8px"
            ></component
            >{{ $t(item.label) }}</a-link
          >
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { get } from 'lodash';
  import { MoreAction } from '@/views/config/interface';

  const props = defineProps({
    dataInfo: {
      type: Array as PropType<
        { label: string; value: string; key: string; span?: number }[]
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

  const emits = defineEmits(['select']);
  const handleSelect = (val) => {
    emits('select', val);
  };
</script>

<style lang="less" scoped>
  .basic-info {
    position: relative;

    .dropdown {
      position: absolute;
      top: 0;
      right: 0;
    }

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

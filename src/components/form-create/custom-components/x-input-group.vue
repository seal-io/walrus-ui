<template>
  <div class="x-input">
    <a-input-group style="width: 360px">
      <a-input
        :model-value="dataKey"
        placeholder="key"
        :max-length="50"
        v-bind="$attrs"
        show-word-limit
        @input="(val) => handleDataChange(val, 'key')"
        @change="(val) => handleDataChange(val, 'key')"
      ></a-input
      ><span style="padding: 0 4px">:</span
      ><a-input
        :model-value="dataValue"
        v-bind="$attrs"
        placeholder="value"
        :max-length="50"
        show-word-limit
        @input="(val) => handleDataChange(val, 'value')"
        @change="(val) => handleDataChange(val, 'value')"
      ></a-input>
    </a-input-group>
    <a-space class="btn-wrapper">
      <icon-minus-circle
        v-if="(labelList?.length || 0) > 1"
        class="size-20"
        @click="handleDeleteLabel"
      ></icon-minus-circle>
      <icon-plus-circle-fill
        v-if="position === (labelList?.length || 0) - 1"
        class="size-20"
        style="margin-left: 5px"
        @click="handleAddLabel"
      ></icon-plus-circle-fill>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, reduce } from 'lodash';
  import { useAttrs, PropType } from 'vue';

  const props = defineProps({
    data: {
      type: Object as PropType<{ key: string; value: string }>,
      default() {
        return {};
      }
    },
    dataKey: {
      type: String,
      default() {
        return 'key';
      }
    },
    dataValue: {
      type: String,
      default() {
        return 'value';
      }
    },
    labelList: {
      type: Array as PropType<{ key: string; value: string }[]>,
      default() {
        return [];
      }
    },
    position: {
      type: Number,
      default() {
        return 0;
      }
    }
  });
  const emits = defineEmits([
    'add',
    'delete',
    'update:value',
    'update:dataKey',
    'update:dataValue'
  ]);
  const $attrs = useAttrs();
  const getDataObj = () => {
    const result = reduce(
      props.labelList,
      (obj, item) => {
        obj[item.key] = item.value;
        return obj;
      },
      {}
    );
    emits('update:value', result);
  };
  const handleAddLabel = () => {
    const item = { key: '', value: '' };
    emits('add', item);
  };
  const handleDeleteLabel = () => {
    emits('delete');
  };
  const handleDataChange = (val, prop) => {
    if (prop === 'key') {
      emits('update:dataKey', val);
    }
    if (prop === 'value') {
      emits('update:dataValue', val);
    }
    getDataObj();
  };
</script>

<script lang="ts">
  export default {
    name: 'XInputGroup'
  };
</script>

<style lang="less" scoped>
  .x-input {
    display: flex;
    align-items: center;
  }

  .btn-wrapper {
    margin-left: 12px;

    .arco-icon {
      color: rgb(var(--arcoblue-6));
      cursor: pointer;

      &:hover {
        color: rgb(var(--arcoblue-5));
      }
    }
  }
</style>

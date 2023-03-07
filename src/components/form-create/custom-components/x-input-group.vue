<template>
  <div class="x-input">
    <a-input-group :style="{ width: width }">
      <a-tooltip :popup-visible="popupvisible" :content="$t('common.form.key')">
        <a-input
          :error="isError"
          :model-value="dataKey"
          placeholder="key"
          :max-length="50"
          v-bind="$attrs"
          show-word-limit
          @input="(val) => handleDataChange(val, 'key')"
          @change="(val) => handleDataChange(val, 'key', 'change')"
        ></a-input>
      </a-tooltip>
      <span style="padding: 0 4px">:</span
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
  import { cloneDeep, reduce, get } from 'lodash';
  import { useAttrs, PropType, ref } from 'vue';

  const props = defineProps({
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
    width: {
      type: String,
      default() {
        return '360px';
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
    },
    value: {
      type: Object,
      default() {
        return {};
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
  const isError = ref(false);
  const popupvisible = ref(false);
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
  const handleDataChange = (val, prop, type?) => {
    if (get(props.value, val) && prop === 'key' && type === 'change') {
      isError.value = true;
      popupvisible.value = true;
      setTimeout(() => {
        popupvisible.value = false;
      }, 1000);
      emits('update:dataKey', '');
      return;
    }
    if (prop === 'key') {
      emits('update:dataKey', val);
    }
    if (prop === 'value') {
      emits('update:dataValue', val);
    }
    isError.value = false;
    getDataObj();
  };
</script>

<script lang="ts">
  export default {
    name: 'XInputGroup',
    inheritAttrs: false
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

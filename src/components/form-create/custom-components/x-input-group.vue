<template>
  <div class="x-input">
    <a-input-group :style="{ width: width }">
      <a-tooltip :popup-visible="popupvisible" :content="$t('common.form.key')">
        <a-input
          v-if="!showHintInput"
          :error="!dataKey && triggerValidate"
          :model-value="dataKey"
          placeholder="key"
          :max-length="50"
          v-bind="$attrs"
          show-word-limit
          @input="(val) => handleDataChange(val, 'key', 'input')"
          @change="(val) => handleDataChange(val, 'key', 'change')"
        ></a-input>
        <hintInput
          v-else
          :model-value="dataKey"
          placeholder="key"
          :max-length="50"
          v-bind="$attrs"
          :editor-id="`${formId}_keyEditor${position}`"
          :source="completeData"
          show-word-limit
          @input="(val) => handleDataChange(val, 'key', 'input')"
          @change="(val) => handleDataChange(val, 'key', 'change')"
        ></hintInput>
      </a-tooltip>
      <span style="padding: 0 4px">:</span
      ><a-input
        v-if="!showHintInput"
        :model-value="dataValue"
        :error="!dataValue && triggerValidate"
        v-bind="$attrs"
        placeholder="value"
        :max-length="50"
        show-word-limit
        @input="(val) => handleDataChange(val, 'value')"
        @change="(val) => handleDataChange(val, 'value')"
      ></a-input>
      <hintInput
        v-else
        :model-value="dataValue"
        v-bind="$attrs"
        placeholder="value"
        :max-length="50"
        :editor-id="`${formId}_valueEditor${position}`"
        :source="completeData"
        show-word-limit
        @input="(val) => handleDataChange(val, 'value')"
        @change="(val) => handleDataChange(val, 'value')"
      ></hintInput>
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
  import { cloneDeep, reduce, get, hasIn } from 'lodash';
  import { useAttrs, PropType, ref, inject } from 'vue';
  import hintInput from '@/components/hint-input/index.vue';

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
    // showHintInput: {
    //   type: Boolean,
    //   default() {
    //     return false;
    //   }
    // },
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
    formId: {
      type: String,
      default() {
        return 'local';
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
    },
    triggerValidate: {
      type: Boolean,
      default() {
        return false;
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
  const showHintInput = inject('showHintInput', ref(false));
  const completeData = inject('completeData', ref({}));
  const $attrs = useAttrs();
  const isError = ref(false);
  const popupvisible = ref(false);
  const getDataObj = (list) => {
    const result = reduce(
      list,
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
    const list = cloneDeep(props.labelList);
    list?.splice(props.position, 1);
    getDataObj(list);
    emits('delete');
  };
  const handleDataChange = (val, attr, type?) => {
    // check duplication key
    console.log('props.value===', val, props.value);
    // if (
    //   hasIn(props.value, val) &&
    //   attr === 'key' &&
    //   !!val &&
    //   type === 'change'
    // ) {
    //   isError.value = true;
    //   popupvisible.value = true;
    //   setTimeout(() => {
    //     popupvisible.value = false;
    //   }, 2000);
    //   emits('update:dataKey', '');
    //   return;
    // }
    if (attr === 'key') {
      emits('update:dataKey', val);
    }
    if (attr === 'value') {
      emits('update:dataValue', val);
    }
    isError.value = false;
    getDataObj(props.labelList);
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

<template>
  <div class="x-input">
    <div :cols="24" style="display: flex; align-items: center; width: 100%">
      <!-- key -->
      <div :span="8" style="display: flex; flex: 1; align-items: center">
        <!-- <a-tooltip
          :popup-visible="popupvisible"
          :content="$t('common.form.key')"
        >
        </a-tooltip> -->
        <a-input
          v-if="!showHintInput"
          :error="!dataKey && triggerValidate"
          :model-value="dataKey"
          :placeholder="$t('common.input.key')"
          :max-length="100"
          v-bind="$attrs"
          show-word-limit
          style="width: 100%"
          @input="(val) => handleDataChange(val, 'key', 'input')"
          @change="(val) => handleDataChange(val, 'key', 'change')"
        ></a-input>
        <hintInput
          v-else
          :model-value="dataKey"
          :error="!dataKey && triggerValidate"
          :placeholder="$t('common.input.key')"
          :max-length="100"
          v-bind="$attrs"
          style="width: 100%"
          :editor-id="`${formId}_keyEditor${position}`"
          :source="completeData"
          show-word-limit
          @input="(val) => handleDataChange(val, 'key', 'input')"
          @change="(val) => handleDataChange(val, 'key', 'change')"
        ></hintInput>
      </div>
      <!-- value -->
      <div :span="8" style="display: flex; flex: 1; align-items: center">
        <span style="padding: 0 4px">:</span>
        <a-input-password
          v-if="showPassword"
          style="width: 100%"
          :model-value="dataValue"
          v-bind="$attrs"
          :placeholder="$t('common.input.value')"
          :max-length="$attrs.MaxLength"
          show-word-limit
          @input="(val) => handleDataChange(val, 'value')"
          @change="(val) => handleDataChange(val, 'value')"
        ></a-input-password>
        <a-input
          v-else-if="!showHintInput"
          style="width: 100%"
          :model-value="dataValue"
          v-bind="$attrs"
          :placeholder="$t('common.input.value')"
          :max-length="50"
          show-word-limit
          @input="(val) => handleDataChange(val, 'value')"
          @change="(val) => handleDataChange(val, 'value')"
        ></a-input>
        <hintInput
          v-else
          :model-value="dataValue"
          v-bind="$attrs"
          :placeholder="$t('common.input.value')"
          style="width: 100%"
          :max-length="100"
          :editor-id="`${formId}_valueEditor${position}`"
          :source="completeData"
          show-word-limit
          @input="(val) => handleDataChange(val, 'value')"
          @change="(val) => handleDataChange(val, 'value')"
        ></hintInput>
      </div>
      <!-- description -->
      <div
        v-if="showDescription"
        :span="8"
        style="display: flex; flex: 1; align-items: center"
      >
        <span style="padding: 0 4px">:</span>
        <a-input
          style="width: 100%"
          :model-value="dataDesc"
          :placeholder="$t('common.input.description')"
          :max-length="100"
          v-bind="$attrs"
          show-word-limit
          @input="(val) => handleDataChange(val, 'description', 'input')"
          @change="(val) => handleDataChange(val, 'description', 'change')"
        ></a-input>
      </div>
    </div>
    <div class="btn-wrapper">
      <icon-minus-circle
        v-if="(labelList?.length || 0) > 1 || alwaysDelete"
        class="size-20"
        @click="handleDeleteLabel"
      ></icon-minus-circle>
      <icon-plus-circle-fill
        v-if="position === (labelList?.length || 0) - 1"
        class="size-20"
        style="margin-left: 10px"
        @click="handleAddLabel"
      ></icon-plus-circle-fill>
    </div>
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
        return '';
      }
    },
    dataValue: {
      type: String,
      default() {
        return '';
      }
    },
    dataDesc: {
      type: String,
      default() {
        return '';
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
    },
    showDescription: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showPassword: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showDelete: {
      type: Boolean,
      default() {
        return false;
      }
    },
    alwaysDelete: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits([
    'add',
    'delete',
    'keyChange',
    'update:value',
    'update:dataKey',
    'update:dataValue',
    'update:dataDesc'
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
      emits('keyChange');
    }
    if (attr === 'value') {
      emits('update:dataValue', val);
    }
    if (attr === 'description') {
      emits('update:dataDesc', val);
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
    display: flex;
    justify-content: space-between;
    width: 60px;
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

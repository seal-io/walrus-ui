<template>
  <div class="x-input">
    <div
      :cols="24"
      :style="{
        'display': 'flex',
        'align-items': get($attrs, 'wrap-align') || 'center',
        'width': '100%'
      }"
    >
      <!-- key -->
      <div :span="8" :style="getItemStyle('key')">
        <a-tooltip
          :popup-visible="popupvisible"
          :content="$t('common.form.key')"
        >
          <a-input
            v-if="!showHintInput"
            :error="!dataKey && triggerValidate"
            :model-value="dataKey"
            :max-length="100"
            v-bind="$attrs"
            :placeholder="
              get($attrs?.placeholder, 'key') || $t('common.input.key')
            "
            show-word-limit
            style="width: 100%"
            @input="(val) => handleDataChange(val, 'key', 'input')"
            @change="(val) => handleDataChange(val, 'key', 'change')"
          ></a-input>
          <hintInput
            v-else
            :model-value="dataKey"
            :error="!dataKey && triggerValidate"
            :placeholder="
              get($attrs?.placeholder, 'key') || $t('common.input.key')
            "
            :max-length="100"
            v-bind="$attrs"
            style="width: 100%"
            :editor-id="`${formId}_keyEditor${position}`"
            :source="completeData"
            show-word-limit
            @input="(val) => handleDataChange(val, 'key', 'input')"
            @change="(val) => handleDataChange(val, 'key', 'change')"
          ></hintInput>
        </a-tooltip>
      </div>
      <!-- value -->
      <div :span="8" :style="getItemStyle('value')">
        <span style="padding: 0 4px">{{ separator }}</span>
        <a-select
          v-if="valueOptions.length"
          v-bind="$attrs"
          :error="!dataValue && triggerValidate"
          :options="valueOptions"
          style="width: 100%"
          :model-value="dataValue"
          :placeholder="
            get($attrs?.placeholder, 'value') || $t('common.input.value')
          "
          @change="(val) => handleDataChange(val, 'value')"
        >
        </a-select>
        <a-input-password
          v-else-if="showPassword"
          style="width: 100%"
          :model-value="dataValue"
          v-bind="$attrs"
          :placeholder="
            get($attrs?.placeholder, 'value') || $t('common.input.value')
          "
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
          :placeholder="
            get($attrs?.placeholder, 'value') || $t('common.input.value')
          "
          :max-length="50"
          show-word-limit
          @input="(val) => handleDataChange(val, 'value')"
          @change="(val) => handleDataChange(val, 'value')"
        ></a-input>
        <hintInput
          v-else
          :model-value="dataValue"
          :max-length="100"
          v-bind="$attrs"
          :placeholder="
            get($attrs?.placeholder, 'value') || $t('common.input.value')
          "
          style="width: 100%"
          :editor-id="`${formId}_valueEditor${position}`"
          :source="completeData"
          show-word-limit
          @input="(val) => handleDataChange(val, 'value')"
          @change="(val) => handleDataChange(val, 'value')"
        ></hintInput>
      </div>
      <!-- extra -->
      <div v-if="showExtra" :span="8" :style="getItemStyle('extra')">
        <span style="padding: 0 4px">{{ separator }}</span>
        <component
          v-bind="{ ...$attrs, ...get(dataItem, 'extraProps') }"
          :is="get(internalComponents, get(dataItem, 'extraCom'))"
          style="width: 100%"
          :placeholder="
            get($attrs?.placeholder, 'extra') || $t('common.input.extra')
          "
          show-word-limit
          live-input
          :show-gutter="false"
          :model-value="dataExtra"
          :editor-id="`${token}-${position}`"
          :editor-default-value="dataExtra"
          @input="(val) => handleDataChange(val, 'extra', 'input')"
          @change="(val) => handleDataChange(val, 'extra', 'change')"
        ></component>
      </div>
      <!-- description -->
      <div
        v-if="showDescription"
        :span="8"
        :style="getItemStyle('description')"
      >
        <span style="padding: 0 4px">{{ separator }}</span>
        <template v-if="!valueOptions.length">
          <a-input
            :max-length="100"
            v-bind="$attrs"
            style="width: 100%"
            :model-value="dataDesc"
            :placeholder="
              get($attrs?.placeholder, 'description') ||
              $t('common.input.description')
            "
            show-word-limit
            @input="(val) => handleDataChange(val, 'description', 'input')"
            @change="(val) => handleDataChange(val, 'description', 'change')"
          ></a-input>
        </template>
        <template v-else>
          <component
            v-bind="$attrs"
            :is="get(internalComponents, get($attrs?.components, dataValue))"
            style="width: 100%"
            :placeholder="
              get($attrs?.placeholder, 'description') ||
              $t('common.input.description')
            "
            show-word-limit
            live-input
            :show-gutter="false"
            :model-value="dataDesc"
            :editor-id="`${token}-${position}`"
            :editor-default-value="dataDesc"
            @input="(val) => handleDataChange(val, 'description', 'input')"
            @change="(val) => handleDataChange(val, 'description', 'change')"
          ></component>
        </template>
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
  import { cloneDeep, reduce, get, hasIn, filter } from 'lodash';
  import { useAttrs, PropType, ref, inject } from 'vue';
  import hintInput from '@/components/hint-input/index.vue';
  import internalComponents from '../components/internal';

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
    dataExtra: {
      type: [String, Boolean],
      default() {
        return '';
      }
    },
    separator: {
      type: String,
      default() {
        return ':';
      }
    },
    comType: {
      type: String, // comText, comPassword, ComHintText, comSelect
      default() {
        return 'comText';
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
    token: {
      type: String,
      default() {
        return 'X';
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
    showExtra: {
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
    valueOptions: {
      type: Array as PropType<{ value: string; label: string }[]>,
      default() {
        return [];
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
    },
    dataItem: {
      type: Object,
      default() {
        return {};
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
    'update:dataDesc',
    'update:dataExtra'
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
  const getItemStyle = (key) => {
    return (
      get(props.dataItem, `style.${key}`) || {
        'display': 'flex',
        'flex': 1,
        'align-items': 'center'
      }
    );
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
    if (
      attr === 'key' &&
      !!val &&
      type === 'change' &&
      filter(props.labelList, (s) => s.key === val).length > 1
    ) {
      popupvisible.value = true;
      setTimeout(() => {
        popupvisible.value = false;
      }, 1500);
      emits('update:dataKey', '');
      return;
    }
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
    if (attr === 'extra') {
      emits('update:dataExtra', val);
    }

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

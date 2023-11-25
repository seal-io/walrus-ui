<template>
  <div class="x-input">
    <div
      :cols="24"
      :style="{
        'display': 'flex',
        'align-items': wrapAlign,
        'width': '100%'
      }"
    >
      <!-- key -->
      <div :span="8" :style="getItemStyle('key')">
        <a-tooltip
          :popup-visible="popupvisible"
          :content="$t('common.form.key')"
        >
          <seal-input
            v-if="!showHintInput"
            :error="!dataKey && triggerValidate && shouldKey"
            :model-value="dataKey"
            :max-length="30"
            show-word-limit
            v-bind="$attrs"
            :placeholder="
              get($attrs?.placeholder, 'key') || $t('common.input.key')
            "
            style="width: 100%"
            @input="(val) => handleDataChange(val, 'key', 'input')"
            @change="(val) => handleDataChange(val, 'key', 'change')"
          ></seal-input>
          <hintInput
            v-else
            :model-value="dataKey"
            :error="!dataKey && triggerValidate && shouldKey"
            :placeholder="
              get($attrs?.placeholder, 'key') || $t('common.input.key')
            "
            :max-length="100"
            show-word-limit
            v-bind="$attrs"
            style="width: 100%"
            :editor-id="`${formId}_keyEditor${position}`"
            :source="completeData"
            :show-required-mark="false"
            @input="(val) => handleDataChange(val, 'key', 'input')"
            @change="(val) => handleDataChange(val, 'key', 'change')"
          ></hintInput>
        </a-tooltip>
      </div>
      <!-- value  show as select when there are valueOptions-->
      <div :span="8" :style="getItemStyle('value')">
        <span style="padding: 0 4px">{{ separator }}</span>
        <slot name="value">
          <seal-select
            v-if="valueOptions.length"
            v-bind="$attrs"
            :error="!dataValue && triggerValidate"
            :options="valueOptions"
            style="width: 100%"
            :model-value="dataValue"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            @change="(val) => handleDataChange(val, 'value', 'change')"
          >
          </seal-select>
          <seal-input-password
            v-else-if="showPassword"
            style="width: 100%"
            :model-value="dataValue"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            show-word-limit
            v-bind="$attrs"
            @input="(val) => handleDataChange(val, 'value', 'input')"
            @change="(val) => handleDataChange(val, 'value', 'change')"
          ></seal-input-password>
          <seal-input-number
            v-else-if="$attrs.showNumberInput"
            style="width: 100%"
            :model-value="dataValue"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            show-word-limit
            v-bind="$attrs"
            @input="(val) => handleDataChange(val, 'value', 'input')"
            @change="(val) => handleDataChange(val, 'value', 'change')"
          ></seal-input-number>
          <seal-checkbox
            v-else-if="showCheckbox"
            style="width: 100%"
            :model-value="dataValue"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            v-bind="$attrs"
            :disabled="readonly || $attrs.disabled"
            @change="(val) => handleDataChange(val, 'value', 'change')"
          ></seal-checkbox>
          <seal-input
            v-else-if="!showHintInput"
            style="width: 100%"
            show-word-limit
            :max-length="50"
            v-bind="$attrs"
            :model-value="dataValue"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            @input="(val) => handleDataChange(val, 'value', 'input')"
            @change="(val) => handleDataChange(val, 'value', 'change')"
          ></seal-input>
          <hintInput
            v-else
            :model-value="dataValue"
            show-word-limit
            :max-length="100"
            v-bind="$attrs"
            :placeholder="
              get($attrs?.placeholder, 'value') || $t('common.input.value')
            "
            :show-required-mark="false"
            style="width: 100%"
            :editor-id="`${formId}_valueEditor${position}`"
            :source="completeData"
            @input="(val) => handleDataChange(val, 'value', 'input')"
            @change="(val) => handleDataChange(val, 'value', 'change')"
          ></hintInput>
        </slot>
      </div>
      <!-- description -->
      <div
        v-if="showDescription"
        :span="8"
        :style="{
          ...getItemStyle('description'),
          position: 'relative'
        }"
      >
        <span style="padding: 0 4px">{{ separator }}</span>
        <slot name="description">
          <template v-if="!valueOptions.length">
            <seal-input
              :max-length="100"
              show-word-limit
              v-bind="$attrs"
              style="width: 100%"
              :model-value="dataDesc"
              :placeholder="
                get($attrs?.placeholder, 'description') ||
                $t('common.input.description')
              "
              @input="(val) => handleDataChange(val, 'description', 'input')"
              @change="(val) => handleDataChange(val, 'description', 'change')"
            ></seal-input>
          </template>
          <template v-else>
            <template v-if="get($attrs?.components, dataValue) === 'Checkbox'">
              <a-checkbox
                :default-checked="!!dataDesc"
                :disabled="readonly || $attrs.disabled"
                @change="
                  (val) => handleDataChange(val, 'description', 'change')
                "
              >
              </a-checkbox>
            </template>
            <template v-else>
              <component
                v-bind="$attrs"
                :is="
                  get(internalComponents, get($attrs?.components, dataValue))
                "
                :show-gutter="false"
                style="width: 100%"
                :placeholder="
                  get($attrs?.placeholder, 'description') ||
                  $t('common.input.description')
                "
                show-word-limit
                :model-value="dataDesc"
                :editor-id="`${token}-${position}`"
                :editor-default-value="dataDefault"
                @input="(val) => handleDataChange(val, 'description', 'input')"
                @change="
                  (val) => handleDataChange(val, 'description', 'change')
                "
              ></component>
            </template>
          </template>
        </slot>
        <slot name="descExtra"> </slot>
      </div>
    </div>
    <div
      v-if="!$attrs.disabled && !readonly"
      class="btn-wrapper"
      :class="{ 'two-btn': labelList?.length > 1 || alwaysDelete }"
    >
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
  import {
    InjectCompleteDataKey,
    InjectShowInputHintKey
  } from '@/views/config';
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
    dataDefault: {
      type: String,
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
    wrapAlign: {
      type: String,
      default() {
        return 'center';
      }
    },
    comType: {
      type: String, // comText, comPassword, ComHintText, comSelect
      default() {
        return 'comText';
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
    shouldKey: {
      type: Boolean,
      default() {
        return false;
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
    showCheckbox: {
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
    showNumberInput: {
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
    },
    readonly: {
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
    'valueChange',
    'descChange',
    'update:value',
    'update:dataKey',
    'update:dataValue',
    'update:dataDesc',
    'update:dataExtra'
  ]);
  const showHintInput = inject(InjectShowInputHintKey, ref(false));
  const completeData = inject(InjectCompleteDataKey, ref({}));
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
  const handleDataChange = (value, attr, type?) => {
    // check duplication key
    const val = value;
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
      emits('keyChange', val);
    }
    if (attr === 'value') {
      emits('update:dataValue', val);
      emits('valueChange', val);
    }
    if (attr === 'description') {
      emits('update:dataDesc', val);
      emits('descChange', val);
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
    margin-left: 0;

    &.two-btn {
      margin-left: 12px;
    }

    .arco-icon {
      color: rgb(var(--arcoblue-6));
      cursor: pointer;

      &:hover {
        color: rgb(var(--arcoblue-5));
      }
    }
  }
</style>

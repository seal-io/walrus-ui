<template>
  <div class="form-comp-wrap">
    <template v-if="comType === 'text'">
      <a-input
        :model-value="modelValue"
        @change="handleInputChange"
        @input="(val) => $emit('update:modelValue', val)"
      ></a-input>
    </template>
    <template v-if="comType === 'number'">
      <a-input-number
        :model-value="Number(modelValue)"
        @change="(val) => $emit('update:modelValue', String(val))"
      ></a-input-number>
    </template>
    <template v-if="comType === 'checkbox'">
      <a-checkbox-group
        :model-value="modelValue"
        @change="(val) => $emit('update:modelValue', val)"
      >
        <a-checkbox
          v-for="item in allowedValues"
          :key="item.id"
          :value="item.id"
          >{{ item.name || item.value }}</a-checkbox
        >
      </a-checkbox-group>
    </template>
    <template v-if="comType === 'radio'">
      <a-radio-group
        :model-value="modelValue"
        @change="(val) => $emit('update:modelValue', val)"
      >
        <a-radio
          v-for="item in allowedValues"
          :key="item.id"
          :value="item.id"
          >{{ item.name || item.value }}</a-radio
        >
      </a-radio-group>
    </template>
    <template v-if="['datepicker', 'datetime'].includes(comType)">
      <a-date-picker
        style="width: 100%"
        :format="comType === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
        :value-format="
          comType === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
        "
        :show-time="comType === 'datetime'"
        :model-value="modelValue"
        :default-value="modelValue"
        @change="handleDateChange"
      />
    </template>
    <template v-if="comType === 'textarea'">
      <a-textarea
        :model-value="modelValue"
        :class="{ 'arco-input-focus': !attrs.editable }"
        @input="(val) => $emit('update:modelValue', val)"
      ></a-textarea>
    </template>
    <template v-if="['multiselect', 'select', 'userSelect'].includes(comType)">
      <a-select
        :multiple="comType === 'multiselect'"
        :max-tag-count="1"
        :model-value="modelValue"
        @change="handleSelectChange"
      >
        <a-option v-for="item in allowedValues" :key="item.id" :value="item.id">
          {{ item.name || item.value }}
        </a-option>
      </a-select>
    </template>
    <!-- <template v-if="comType === 'upload'">
      <a-upload action="/" :disabled="$attrs.isDisabled || !$attrs.editable" />
    </template> -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs';
  import { replace, toNumber, get } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { defineComponent, PropType } from 'vue';
  import { CustomField } from '../../config/interface';

  export default defineComponent({
    inheritAttrs: false,
    props: {
      modelValue: {
        type: [String, Number, Boolean, Array] as PropType<any>,
        default() {
          return '';
        },
      },
      dataInfo: {
        type: Object,
        default() {
          return {};
        },
      },
      show: {
        type: Boolean,
        default() {
          return false;
        },
      },
      comType: {
        type: [String],
        default() {
          return 'text';
        },
      },
      allowedValues: {
        type: Array as PropType<{ id: string; name: string; value: string }[]>,
        default() {
          return [];
        },
      },
    },
    emits: ['update:modelValue', 'userChange'],
    setup(props: any) {},
    computed: {
      attrs() {
        return this.$attrs as any;
      },
    },
    methods: {
      handleInputChange(value) {
        this.$emit('update:modelValue', value);
      },
      handleSelectChange(val) {
        this.$emit('update:modelValue', val);
        if (get(this.dataInfo, 'schema.type') === 'user') {
          this.$emit('userChange', val);
        }
      },
      handleDateChange(val) {
        const value =
          this.comType === 'datetime'
            ? dayjs(val).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            : val;
        this.$emit('update:modelValue', value);
      },
    },
  });
</script>

<style lang="less" scoped>
  .form-comp-wrap {
    width: 100%;
    text-align: left;
  }
  // :deep(.arco-input-wrapper) {
  //   width: 360px;
  // }
  .options-desc {
    max-width: 500px;
    margin-top: 5px;
    color: var(--color-text-3);
    font-size: 12px;
    line-height: 18px;
  }

  // :deep(.arco-textarea-wrapper) {
  //   width: 360px;
  // }
</style>

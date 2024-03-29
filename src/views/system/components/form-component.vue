<template>
  <div class="form-comp-wrap">
    <template v-if="comType === 'input'">
      <seal-input
        :model-value="modelValue"
        :disabled="attrs.isDisabled || !attrs.editable"
        :label="attrs.label"
        :required="attrs.required"
        :popup-info="attrs['popup-info']"
        :style="{ width: attrs.width }"
        @change="handleInputChange"
        @blur="handleBlur"
        @input="(val) => handleInput(val)"
      ></seal-input>
    </template>
    <template v-if="comType === 'password'">
      <seal-input-password
        :model-value="modelValue"
        :disabled="attrs.isDisabled || !attrs.editable"
        :label="attrs.label"
        :required="attrs.required"
        :popup-info="attrs['popup-info']"
        :invisible-button="attrs.editable"
        :style="{ width: attrs.width }"
        @change="handleInputChange"
        @blur="handleBlur"
        @input="(val) => handleInput(val)"
      ></seal-input-password>
    </template>
    <template v-if="comType === 'number'">
      <seal-input-number
        v-bind="attrs.binds"
        :style="{ width: attrs.width }"
        :model-value="Number(modelValue)"
        :disabled="attrs.isDisabled || !attrs.editable"
        @change="(val) => $emit('update:modelValue', String(val))"
      ></seal-input-number>
    </template>
    <template v-if="comType === 'switch'">
      <div :style="{ width: attrs.width }">
        <seal-switch
          :disabled="attrs.isDisabled || !attrs.editable"
          :label="attrs.label"
          :required="attrs.required"
          :show-required-mark="false"
          :popup-info="attrs['popup-info']"
          :model-value="modelValue"
          checked-value="true"
          unchecked-value="false"
          size="small"
          @change="(val) => $emit('update:modelValue', String(val))"
        />
      </div>
    </template>
    <template v-if="comType === 'textarea'">
      <seal-textarea
        :model-value="modelValue"
        :style="{ width: attrs.width }"
        :disabled="attrs.isDisabled || !attrs.editable"
        :label="attrs.label"
        :required="attrs.required"
        :popup-info="attrs['popup-info']"
        @input="(val) => $emit('update:modelValue', val)"
      ></seal-textarea>
    </template>
    <template v-if="comType === 'select'">
      <seal-select
        :disabled="attrs.isDisabled || !attrs.editable"
        :label="attrs.label"
        :required="attrs.required"
        :popup-info="attrs['popup-info']"
        :style="{ width: attrs.width }"
        :model-value="modelValue"
        @change="(val) => $emit('update:modelValue', val)"
      >
        <a-option v-for="item in options" :key="item.id" :value="item.id"
          >{{ $t(item.label) }}
        </a-option>
      </seal-select>
      <div class="options-desc">{{ optionDesc }}</div>
    </template>
    <!-- <template v-if="comType === 'upload'">
      <a-upload action="/" :disabled="$attrs.isDisabled || !$attrs.editable" />
    </template> -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import _, { replace } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { defineComponent, PropType } from 'vue';
  import { SettingsItem, ValueType, ChildrenItem } from '../config';

  export default defineComponent({
    inheritAttrs: false,
    props: {
      modelValue: {
        default() {
          return '';
        }
      },
      dataInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      comType: {
        type: [String],
        default() {
          return 'input';
        }
      },
      matchType: {
        type: [String],
        default() {
          return '';
        }
      },
      options: {
        type: Array as PropType<ChildrenItem[]>,
        default() {
          return [];
        }
      }
    },
    emits: ['update:modelValue'],
    setup(props: any) {},
    computed: {
      optionDesc() {
        if (this.comType === 'select') {
          const obj = this.options.find((item) => item.id === this.modelValue);
          return obj ? this.$t(obj.desc as string) ?? '' : '';
        }
        return '';
      },
      attrs() {
        return this.$attrs as any;
      }
    },

    methods: {
      handleInputChange(value) {
        if (this.matchType === 'url' && value) {
          const list = value.split('/');
          const val = this.formatValue(list);
          this.$emit('update:modelValue', _.trim(val));
        }
      },
      handleInput(val) {
        this.$emit('update:modelValue', val);
      },
      handleBlur(ev) {
        const value = replace(ev.target.value, /\s+/g, ' ');
        this.$emit('update:modelValue', _.trim(value));
      },
      formatValue(list: string[]) {
        const len = list.length;
        const last = list[len - 1];
        if (last === '') {
          list.pop();
          this.formatValue(list);
        } else {
          return list.join('/');
        }
        return list.join('/');
      }
    }
  });
</script>

<style lang="less" scoped>
  :deep(.arco-input-wrapper) {
    width: 360px;
  }

  .options-desc {
    max-width: 500px;
    margin-top: 5px;
    color: var(--color-text-3);
    font-size: 12px;
    line-height: 18px;
  }

  :deep(.arco-textarea-wrapper) {
    width: 360px;
  }
</style>

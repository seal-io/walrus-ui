<template>
  <span
    v-on-click-outside="handleBlur"
    class="seal-relative wrapper select"
    :class="{
      'is-focused': isFocus || modelValue,
      'prefix-icon': slots.prefix
    }"
    :style="{ width: $attrs.style?.width || 'max-content' }"
    @click="handleClick"
  >
    <div class="label" :class="{ disabled: $attrs.disabled }">
      <span
        >{{ $attrs.label || placeholder
        }}{{
          $attrs.required
            ? `(${$t('common.form.field.input.required')})`
            : `(${$t('common.form.field.optional')})`
        }}</span
      >
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle
          style="margin-left: 2px; stroke-linecap: initial; cursor: default"
        />
      </a-tooltip>
    </div>
    <a-cascader
      v-bind="$attrs"
      ref="input"
      :model-value="modelValue"
      @clear="handleClear"
      @change="handleChange"
      @input="handleInput"
      @input-value-change="handleInputValueChange"
    >
      <template v-for="slot in Object.keys(slots)" #[slot] :key="slot">
        <slot :name="slot"></slot>
      </template>
    </a-cascader>
  </span>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots, ref } from 'vue';
  import { vOnClickOutside } from '@vueuse/components';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    inputValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    popupInfo: {
      type: String,
      default: ''
    }
  });
  const emits = defineEmits([
    'update:modelValue',
    'update:inputValue',
    'inputValueChange',
    'input',
    'change',
    'focus',
    'blur',
    'clear'
  ]);
  const input = ref(null);
  const isFocus = ref(false);
  const $attrs = useAttrs();
  const slots = useSlots();
  const handleInput = (e) => {
    emits('input', e);
  };
  const handleChange = (value) => {
    emits('update:modelValue', value);
    emits('change', value);
  };
  const handleInputValueChange = (value) => {
    emits('update:inputValue', value);
    emits('inputValueChange', value);
  };
  const handleFocus = (e) => {
    emits('focus', e);
    isFocus.value = true;
  };
  const handleBlur = (e) => {
    isFocus.value = false;
  };
  const handleClear = () => {
    emits('update:modelValue', '');
    emits('change', '');
  };
  const handleClick = () => {
    isFocus.value = true;
  };
</script>

<script lang="ts">
  export default {
    name: 'SealCascader',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
</style>

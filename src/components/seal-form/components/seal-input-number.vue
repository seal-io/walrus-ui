<template>
  <span
    class="seal-relative wrapper"
    :class="{
      'is-focused': isFocus || modelValue || modelValue === 0,
      'prefix-icon': slots.prefix
    }"
    :style="{ width: $attrs.style?.width || 'max-content' }"
  >
    <span
      class="label"
      :class="{ disabled: $attrs.disabled }"
      @click="handleClick"
    >
      <span
        ><span>{{ $attrs.label || placeholder }}</span>
        <span
          v-if="$attrs.required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        ></span
      >
      <Tooltip :popup-info="popupInfo" :doc="$attrs.doc"></Tooltip>
    </span>
    <a-input-number
      v-bind="$attrs"
      ref="input"
      :model-value="modelValue"
      @clear="handleClear"
      @focus="handleFocus"
      @input="handleInput"
      @blur="handleBlur"
      @change="handleChange"
    >
      <template v-for="slot in Object.keys(slots)" #[slot] :key="slot">
        <slot :name="slot"></slot>
      </template>
    </a-input-number>
  </span>
</template>

<script lang="ts" setup>
  import { isNumber, toNumber, isNaN } from 'lodash';
  import { useAttrs, useSlots, ref, watch } from 'vue';
  import Tooltip from '../_components/tooltip.vue';

  const props = defineProps({
    modelValue: {
      type: Number,
      default: null
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
  const input = ref();
  const isFocus = ref(false);
  const emits = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'clear'
  ]);
  const $attrs: any = useAttrs();
  const slots = useSlots();
  const handleInput = (value, e) => {
    emits('update:modelValue', value);
    emits('input', value, e);
  };
  const handleChange = (value, e) => {
    emits('update:modelValue', value);
    emits('change', value, e);
  };
  const handleFocus = (e) => {
    emits('focus', e);
    isFocus.value = true;
  };
  const handleBlur = (e) => {
    emits('blur', e);
    isFocus.value = false;
  };
  const handleClear = () => {
    emits('update:modelValue', '');
    emits('change', '');
  };
  const handleClick = () => {
    input.value?.focus?.();
    isFocus.value = true;
  };
  const validValue = (val) => {
    return val === '' || val === null || val === undefined;
  };
  watch(
    () => props.modelValue,
    (value) => {
      if (!isNumber(value) && !validValue(value)) {
        const val = toNumber(value);
        const newValue = isNaN(val) ? null : val;
        emits('update:modelValue', newValue);
        emits('change', newValue);
      }
    },
    {
      immediate: true
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'SealInputNumber',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
</style>

<template>
  <span
    class="relative wrapper textarea"
    :class="{
      'is-focused': isFocus || modelValue,
      'prefix-icon': slots.prefix
    }"
  >
    <span class="label">
      <span
        >{{ $attrs.label || placeholder
        }}{{
          $attrs.required
            ? `(${$t('common.form.field.input.required')})`
            : `(${$t('common.form.field.optional')})`
        }}</span
      >
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle style="stroke-linecap: initial; cursor: default" />
      </a-tooltip>
    </span>
    <a-textarea
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
    </a-textarea>
  </span>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots, ref } from 'vue';

  const props = defineProps({
    modelValue: {
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
  const input = ref(null);
  const isFocus = ref(false);
  const emits = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'clear'
  ]);
  const $attrs = useAttrs();
  const slots = useSlots();
  const handleInput = (value, e) => {
    const maxLength = $attrs.maxLength || $attrs['max-length'];
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
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
</script>

<script lang="ts">
  export default {
    name: 'SealTextarea',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
  @import url('../style/textarea.less');
</style>

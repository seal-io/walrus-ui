<template>
  <span
    ref="wrapper"
    class="relative wrapper input"
    :class="{
      'is-focused': isFocus || modelValue,
      'prefix-icon': slots.prefix
    }"
  >
    <span
      class="label"
      :class="{ disabled: $attrs.disabled }"
      @click="handleClick"
    >
      <span
        >{{ $attrs.label || placeholder
        }}{{
          showRequiredMark
            ? $attrs.required
              ? `(${$t('common.form.field.input.required')})`
              : `(${$t('common.form.field.optional')})`
            : ''
        }}</span
      >
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle style="stroke-linecap: initial; cursor: default" />
      </a-tooltip>
    </span>
    <a-input
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
    </a-input>
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
    showRequiredMark: {
      type: Boolean,
      default: true
    },
    popupInfo: {
      type: String,
      default: ''
    }
  });
  const wrapper = ref();
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
  const $attrs = useAttrs();
  const slots = useSlots();

  const handleInput = (value, e) => {
    // check the value length, when the length  is great than the $attrs.maxlength, the value will be cut
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
    name: 'SealInput',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
</style>

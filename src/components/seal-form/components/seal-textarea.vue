<template>
  <span
    v-if="!viewStatus"
    class="seal-relative wrapper textarea"
    :class="{
      'is-focused': isFocus || modelValue,
      'prefix-icon': slots.prefix
    }"
    :style="{
      width: $attrs.style?.width || 'max-content'
    }"
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
  <SealViewItemWrap
    v-else
    :label="$attrs.label || placeholder"
    :style="{ width: $attrs.style?.width || 'max-content', ...$attrs.height }"
  >
    <span>{{ modelValue }}</span>
  </SealViewItemWrap>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots, ref } from 'vue';
  import Tooltip from '../_components/tooltip.vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    viewStatus: {
      type: Boolean,
      default: false
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

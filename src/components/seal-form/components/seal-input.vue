<template>
  <span
    v-if="!viewStatus"
    ref="wrapper"
    class="seal-relative wrapper input"
    :class="{
      'is-focused': isFocus || modelValue,
      'prefix-icon': slots.prefix
    }"
    :style="{ width: $attrs.style?.width || 'max-content' }"
  >
    <span
      class="label"
      :class="{ disabled: $attrs.disabled }"
      @click="handleClick"
    >
      <span>
        <span>{{ $attrs.label || placeholder }}</span>
        <span
          v-if="$attrs.required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        >
      </span>
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle
          style="stroke-linecap: initial; cursor: default"
          class="m-l-2"
        />
      </a-tooltip>
    </span>
    <a-input
      v-bind="$attrs"
      ref="input"
      :error="staticError || $attrs.error"
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
    <span
      v-if="!$attrs.showWordLimit && !$attrs['show-word-limit']"
      class="input-tips"
    >
      <a-tooltip
        :popup-visible="staticError"
        :content="
          $t('common.rule.wordlimit', {
            length: $attrs.maxLength || $attrs['max-length']
          })
        "
      >
        <span style="padding: 1px"></span>
      </a-tooltip>
    </span>
  </span>
  <SealViewItemWrap
    v-else
    :label="$attrs.label || placeholder"
    :style="{ width: $attrs.style?.width || 'max-content' }"
  >
    <span>{{ modelValue }}</span>
  </SealViewItemWrap>
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
    viewStatus: {
      type: Boolean,
      default: false
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
  const $attrs: any = useAttrs();
  const slots = useSlots();
  const staticError = ref(false);

  const handleInput = (value, e) => {
    // check the value length, when the length  is great than the $attrs.maxlength, the value will be cut
    const maxLength = $attrs.maxLength || $attrs['max-length'];
    const showWordLimit = $attrs.showWordLimit || $attrs['show-word-limit'];
    staticError.value = value.length === maxLength;
    if (value.length === maxLength && !showWordLimit) {
      setTimeout(() => {
        staticError.value = false;
      }, 1500);
    }
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
  const focus = () => {
    input.value?.focus?.();
  };
  const blur = () => {
    input.value?.blur?.();
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
  defineExpose({
    focus,
    blur
  });
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

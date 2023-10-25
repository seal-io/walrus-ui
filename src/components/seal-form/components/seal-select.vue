<template>
  <span
    v-on-click-outside="handleBlur"
    class="seal-relative wrapper select"
    :class="{
      'is-focused':
        isFocus || (Array.isArray(modelValue) ? modelValue.length : modelValue),
      'prefix-icon': slots.prefix
    }"
    :style="{ width: $attrs.style?.width || 'max-content' }"
    @click="handleClick"
  >
    <div class="label" :class="{ disabled: $attrs.disabled }">
      <span
        ><span>{{ $attrs.label || placeholder }}</span>
        <span
          v-if="$attrs.required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        ></span
      >
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle
          style="margin-left: 2px; stroke-linecap: initial; cursor: default"
        />
      </a-tooltip>
    </div>
    <a-select
      v-bind="$attrs"
      ref="input"
      :model-value="modelValue"
      @clear="handleClear"
      @change="handleChange"
      @input="handleInput"
      @focus="handleFocus"
      @input-value-change="handleInputValueChange"
    >
      <template v-for="slot in Object.keys(slots)" #[slot]="data" :key="slot">
        <slot :name="slot" v-bind="{ ...data }"></slot>
      </template>
      <template #empty>
        <a-empty
          :description="
            searchValue ? $t('common.search.nodata') : $t('common.data.empty')
          "
        ></a-empty>
      </template>
    </a-select>
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
  const input = ref();
  const isFocus = ref(false);
  const searchValue = ref('');
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
    searchValue.value = value;
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
  const focus = () => {
    input.value?.focus?.();
  };
  const blur = () => {
    input.value?.blur?.();
  };
  const handleClear = () => {
    emits('update:modelValue', '');
    emits('change', '');
  };
  const handleClick = () => {
    isFocus.value = true;
  };
  defineExpose({
    focus,
    blur
  });
</script>

<script lang="ts">
  export default {
    name: 'SealSelect',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
</style>

<template>
  <span class="wrapper check" :style="{ width: $attrs.style?.width }">
    <a-checkbox
      v-bind="$attrs"
      :model-value="modelValue"
      @change="handleChange"
    >
      <span class="label-wrap">
        <span class="label" :class="{ disabled: $attrs.disabled }">
          <span>{{ $attrs.label || placeholder }}</span>
          <Tooltip :popup-info="popupInfo" :doc="$attrs.doc"></Tooltip>
        </span>
      </span>
    </a-checkbox>
  </span>
</template>

<script lang="ts" setup>
  import { isBoolean } from 'lodash';
  import { useAttrs, ref, watch } from 'vue';
  import Tooltip from '../_components/tooltip.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
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
  const emits = defineEmits(['update:modelValue', 'change']);
  const $attrs: any = useAttrs();
  const handleChange = (value, e) => {
    emits('update:modelValue', value);
    emits('change', value, e);
  };
  const validValue = (val) => {
    return val === '' || val === null || val === undefined;
  };
  watch(
    () => props.modelValue,
    (value) => {
      if (!isBoolean(value) && !validValue(value)) {
        const newValue = !!value;
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
    name: 'SealCheckbox',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/check.less');
</style>

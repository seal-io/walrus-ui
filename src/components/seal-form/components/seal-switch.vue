<template>
  <span class="wrapper check switch">
    <a-switch
      v-bind="$attrs"
      :model-value="modelValue"
      style="width: max-content"
      @change="handleChange"
    >
    </a-switch>
    <span class="label-wrap">
      <span class="label" :class="{ disabled: $attrs.disabled }">
        <span>{{ $attrs.label || placeholder }}</span>
        <Tooltip :popup-info="popupInfo" :doc="$attrs.doc"></Tooltip>
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { useAttrs, ref } from 'vue';
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
</script>

<script lang="ts">
  export default {
    name: 'SealSwitch',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/check.less');
</style>

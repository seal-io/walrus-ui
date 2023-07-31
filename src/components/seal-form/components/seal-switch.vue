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
        <a-tooltip v-if="popupInfo" :content="popupInfo">
          <icon-info-circle
            style="stroke-linecap: initial; cursor: default"
            class="m-l-2"
          />
        </a-tooltip>
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { useAttrs, ref } from 'vue';

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
  const $attrs = useAttrs();
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

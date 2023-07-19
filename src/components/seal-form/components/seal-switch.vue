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
    name: 'SealSwtich',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  @import url('../style/check.less');
</style>

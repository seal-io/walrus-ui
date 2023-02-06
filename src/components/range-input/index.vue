<template>
  <div class="range-input-wrap">
    <a-input-group>
      <a-input
        v-model.trim="group[0]"
        :style="{ 'max-width': '150px' }"
        :placeholder="$t('common.input.range.start')"
        @change="handleStartChange"
      />
      <a-input
        v-model.trim="group[1]"
        :style="{ width: '150px' }"
        :placeholder="$t('common.input.range.end')"
        @change="handleEndChange"
      />
    </a-input-group>
  </div>
</template>

<script lang="ts" setup>
  import { PROPERTY_TYPES } from '@babel/types';
  import { ref, PropType, onMounted } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [String, Array] as PropType<string | Array<string | number>>,
      default() {
        return [];
      },
    },
  });
  const group = ref<string[]>([]);
  const emits = defineEmits(['update:modelValue', 'change']);
  const handleStartChange = (value) => {
    group.value[0] = value;
    if (group.value.length === 2) {
      emits('update:modelValue', group.value);
    } else {
      emits('update:modelValue', '');
    }
    emits('change', group.value);
  };
  const handleEndChange = (value) => {
    group.value[1] = value;
    if (group.value.length === 2) {
      emits('update:modelValue', group.value);
    } else {
      emits('update:modelValue', '');
    }
    emits('change', group.value);
  };
  onMounted(() => {
    const val = props.modelValue || [];
    group.value = [].concat(val as never[]);
  });
</script>

<style lang="less" scoped>
  .range-input-wrap {
    :deep(.arco-input) {
      text-align: center;
    }
  }
</style>

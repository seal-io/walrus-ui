<template>
  <a-input-number
    v-if="type === 'number'"
    :style="{ width: '80px' }"
    size="small"
    :default-value="defaultValue"
    @change="handleChange"
  />
  <a-switch
    v-else
    :default-checked="defaultValue"
    size="small"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: [Boolean, Number] as PropType<any>,
      default: 0,
    },
  });
  const emit = defineEmits(['inputChange']);
  const handleChange = (value: unknown) => {
    emit('inputChange', {
      value,
      key: props.name,
    });
  };
</script>

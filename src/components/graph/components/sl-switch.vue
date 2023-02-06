<template>
  <span class="switch-wrap" :class="{ off: !modelValue }" @click="handleToggle">
    <span class="btn"></span>
    <span class="text"> <span v-show="!modelValue">OR</span></span>
    <span class="text">
      <span v-show="modelValue">AND</span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default() {
        return true;
      },
    },
  });

  const emits = defineEmits(['update:modelValue', 'change']);
  const handleToggle = () => {
    const val = !props.modelValue;
    emits('update:modelValue', val);
    emits('change', val);
  };
</script>

<style lang="less" scoped>
  .switch-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 45px;
    height: 16px;
    padding: 2px;
    color: #fff;
    font-size: 12px;
    background-color: rgb(var(--primary-6));
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s var(--seal-transition-func);

    // &.off {
    //   background-color: var(--color-fill-4);
    // }
    .text {
      padding: 0 2px;
      font-weight: 400;
    }

    .btn {
      position: absolute;
      top: 2px;
      left: 2px;
      display: inline-block;
      width: 12px;
      height: 12px;
      background-color: #fff;
      border-radius: 6px;
      transition: all 0.2s var(--seal-transition-func);
      content: '';
    }

    &.off .btn {
      transform: translateX(29px);
      transition: all 0.2s var(--seal-transition-func);
    }
  }
</style>

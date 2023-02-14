<template>
  <Transition v-bind="{ ...transitionEvents }" name="drop-slider">
    <slot></slot>
  </Transition>
</template>

<script lang="ts" setup>
  import useTransition from '@/hooks/use-transition';

  const transitionEvents = useTransition();
</script>

<style lang="less" scoped>
  .drop-slider-enter-from,
  .drop-slider-leave-to {
    height: 0;
  }

  .drop-slider-enter-active,
  .drop-slider-leave-active {
    transition: height 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>

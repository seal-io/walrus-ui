<template>
  <div class="thumb-button" :style="{ ...sizeStyle }" @click="handleClick">
    <slot>
      <icon-plus :style="{ fontSize }" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    size: {
      type: Number,
      default() {
        return 80;
      }
    },
    fontSize: {
      type: String,
      default() {
        return '28px';
      }
    }
  });
  const emits = defineEmits(['click']);

  const sizeStyle = computed(() => {
    return {
      height: `${props.size}px`,
      width: `${props.size}px`
    };
  });
  const handleClick = () => {
    emits('click');
  };
</script>

<style lang="less" scoped>
  .thumb-button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--arcoblue-5));
    background-color: rgba(var(--arcoblue-1), 0.3);
    border: 1px solid rgb(var(--arcoblue-5));
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: rgb(var(--arcoblue-6));
      border: 1px solid transparent;
      box-shadow: 0 0 6px rgb(var(--arcoblue-5));
      transition: all 0.3s;
    }
  }
</style>

<template>
  <div class="thumb-item" :class="{ active: active }">
    <span>{{ dataInfo.name }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { InstanceData } from '../config/interface';

  const props = defineProps({
    dataInfo: {
      type: Object as PropType<InstanceData>,
      default() {
        return {};
      }
    },
    active: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['change']);
  const handleCheckedChange = (val) => {
    console.log('val:', val);
    emits('change', val, props.dataInfo.id);
  };
</script>

<style lang="less" scoped>
  .thumb-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 5px;
    .thumbCard();

    &:hover {
      .thumbCardHover();
    }

    &.active {
      .thumbCardHover();
    }
  }
</style>

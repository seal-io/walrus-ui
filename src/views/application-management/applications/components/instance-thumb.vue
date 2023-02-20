<template>
  <div class="thumb-item" :class="{ active: active }">
    <a-dropdown size="small" style="line-height: 30px" @select="handleClick">
      <a-link size="mini" style="position: absolute; top: 0; right: 0">
        <template #icon><icon-more style="font-size: 18px" /></template>
      </a-link>
      <template #content>
        <a-doption value="edit"><icon-edit /></a-doption>
      </template>
    </a-dropdown>

    <span class="name">{{ dataInfo.name }}</span>
    <span>Env: dev</span>
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
  const emits = defineEmits(['change', 'edit']);
  const handleCheckedChange = (val) => {
    console.log('val:', val);
    emits('change', val, props.dataInfo.id);
  };
  const handleClick = (val) => {
    console.log('value===', val);
    emits(val);
  };
</script>

<style lang="less" scoped>
  .thumb-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 5px;
    .thumbCard();

    &:hover {
      .thumbCardHover();
    }

    .name {
      margin-bottom: 10px;
    }

    :deep(.arco-link-icon) {
      margin-right: 0;
    }

    &.active {
      .thumbCardHover();
    }
  }
</style>

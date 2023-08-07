<template>
  <div class="thumb-item">
    <span>{{ dataInfo.name }}</span>
    <a-checkbox
      class="check-box"
      :value="dataInfo.id"
      :model-value="checked"
      @click.stop="() => {}"
      @change="handleCheckedChange"
    ></a-checkbox>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { ProjectRowData } from '../config/interface';

  const props = defineProps({
    dataInfo: {
      type: Object as PropType<ProjectRowData>,
      default() {
        return {};
      }
    },
    checked: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['change']);
  const handleCheckedChange = (val) => {
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

    .arco-checkbox {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
</style>

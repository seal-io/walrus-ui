<template>
  <a-space class="thumb-view-wrap" wrap :size="16">
    <thumbItem
      v-for="(item, index) in list"
      :key="index"
      :data-info="item"
      :checked="includes(checkedList, item.id)"
      @click="handleClickItem(item)"
      @change="handleCheckChange"
    ></thumbItem>
  </a-space>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';
  import { onMounted, PropType, defineEmits } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbItem from './thumb-item.vue';
  import { EnvironmentRow } from '../config/interface';

  const props = defineProps({
    list: {
      type: Array as PropType<EnvironmentRow[]>,
      default() {
        return [];
      }
    },
    checkedList: {
      type: Array as PropType<Array<string | number>>,
      default() {
        return [];
      }
    }
  });
  const emits = defineEmits(['create', 'change']);
  const { router } = useCallCommon();

  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const handleClickItem = (project) => {
    router.push({
      name: 'EnvironmentDetail',
      query: {
        id: project.id
      }
    });
  };
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    padding: 2px;
  }
</style>

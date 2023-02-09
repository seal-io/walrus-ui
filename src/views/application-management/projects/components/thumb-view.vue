<template>
  <a-space class="thumb-view-wrap" wrap :size="16">
    <thumbItem
      v-for="(item, index) in list"
      :key="index"
      :data-info="item"
      :checked="includes(checkedList, item.id)"
      @click="handleClickProject(item)"
      @change="handleCheckChange"
    ></thumbItem>
    <!-- <thumbButton @click="handleCreateProject"></thumbButton> -->
  </a-space>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';
  import { onMounted, PropType, defineEmits } from 'vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import thumbItem from './thumb-item.vue';
  import { ProjectItem } from '../config/interace';

  const props = defineProps({
    list: {
      type: Array as PropType<ProjectItem[]>,
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
  const handleCreateProject = () => {
    emits('create');
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const handleClickProject = (project) => {
    console.log('project:', project);
  };
  onMounted(() => {
    console.log('onmounted');
  });
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    padding: 2px;
  }
</style>

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
    <!-- <thumbButton @click="handleCreate"></thumbButton> -->
  </a-space>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { includes } from 'lodash';
  import { onMounted, PropType, defineEmits } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import thumbItem from './thumb-item.vue';
  import { ProjectRowData } from '../config/interface';

  const props = defineProps({
    list: {
      type: Array as PropType<ProjectRowData[]>,
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
  const handleCreate = () => {
    emits('create');
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const handleClickProject = (project) => {
    router.push({
      name: PROJECT.Detail,
      params: {
        projectId: project.id
      }
    });
  };
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    padding: 2px;
  }
</style>

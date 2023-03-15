<template>
  <div class="thumb-view-wrap" wrap :size="16">
    <a-grid :cols="24" :col-gap="20" :row-gap="20" wrap>
      <a-grid-item
        v-for="(item, index) in list"
        :key="index"
        :span="{ lg: 8, md: 12, sm: 24, xs: 24 }"
      >
        <templateItem
          :data-info="item"
          :provider="item.icon"
          :checked="includes(checkedList, item.id)"
          @change="handleCheckChange"
        ></templateItem>
      </a-grid-item>
    </a-grid>
    <!-- <thumbButton @click="handleCreateProject"></thumbButton> -->
  </div>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';
  import { onMounted, PropType, defineEmits } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import templateItem from './template-item.vue';
  import { TemplateRowData } from '../config/interface';

  const props = defineProps({
    list: {
      type: Array as PropType<TemplateRowData[]>,
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
  const handleCreateProject = () => {
    emits('create');
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };

  const handleClickItem = (project) => {
    console.log('project:', project);
    router.push({
      name: 'templateDetail',
      query: {
        id: project.id
      }
    });
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

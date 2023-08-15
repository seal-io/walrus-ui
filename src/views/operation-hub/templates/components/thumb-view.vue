<template>
  <div class="thumb-view-wrap" wrap :size="16">
    <a-grid v-if="list.length" :cols="24" :col-gap="20" :row-gap="20" wrap>
      <a-grid-item
        v-for="(item, index) in list"
        :key="index"
        :span="{ lg: 6, md: 12, sm: 24, xs: 24 }"
      >
        <templateItem
          :action-list="setModuleActions(item)"
          :data-info="item"
          :provider="item.icon"
          :checked="includes(checkedList, item.id)"
          @change="handleCheckChange"
        ></templateItem>
      </a-grid-item>
    </a-grid>
    <a-empty v-else class="m-t-20"></a-empty>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { MoreAction } from '@/views/config/interface';
  import { useUserStore } from '@/store';
  import { includes, filter } from 'lodash';
  import { ref, onMounted, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import templateItem from './template-item.vue';
  import { TemplateRowData, ModuleAction } from '../config/interface';
  import { actionList } from '../config';

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
  const userStore = useUserStore();
  const emits = defineEmits(['create', 'change']);
  const { router } = useCallCommon();
  const moduleActions = ref<MoreAction[]>([]);
  const handleCreate = () => {
    emits('create');
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const setModuleActions = (info) => {
    const result = filter(actionList, (item) => {
      return item.filterFunc ? item.filterFunc(info) : true;
    });
    return result as MoreAction[];
  };
  const handleClickItem = (project) => {
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      query: {
        id: project.id
      }
    });
  };
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    margin-bottom: 6px;
    padding: 2px;
  }
</style>

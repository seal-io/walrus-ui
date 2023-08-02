<template>
  <div class="thumb-view-wrap" wrap :size="16">
    <a-grid :cols="24" :col-gap="20" :row-gap="20" wrap>
      <a-grid-item
        v-for="(item, index) in list"
        :key="index"
        :span="{ lg: 6, md: 12, sm: 24, xs: 24 }"
      >
        <templateItem
          :action-list="moduleActions"
          :data-info="item"
          :provider="item.icon"
          :checked="includes(checkedList, item.id)"
          @change="handleCheckChange"
        ></templateItem>
      </a-grid-item>
    </a-grid>
    <!-- <thumbButton @click="handleCreate"></thumbButton> -->
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
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
  const moduleActions = ref<ModuleAction[]>([]);
  const handleCreate = () => {
    emits('create');
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const setModuleActions = () => {
    moduleActions.value = filter(actionList, (item) => {
      if (!item.requiredAuth) return true;
      return userStore.hasRolesActionsPermission({
        resource: Resources.Templates,
        actions: [Actions.PUT]
      });
    });
  };
  const handleClickItem = (project) => {
    console.log('project:', project);
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      query: {
        id: project.id
      }
    });
  };
  onMounted(() => {
    console.log('onmounted');
    setModuleActions();
  });
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    margin-bottom: 6px;
    padding: 2px;
  }
</style>

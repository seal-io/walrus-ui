<template>
  <div class="thumb-view-wrap" wrap :size="16">
    <a-grid :cols="24" :col-gap="20" :row-gap="20" wrap>
      <a-grid-item
        v-for="(item, index) in list"
        :key="index"
        :span="{ lg: 6, md: 12, sm: 24, xs: 24 }"
      >
        <templateItem
          :action-list="setModuleActions()"
          :data-info="item"
          :provider="item.icon"
          :checked="includes(checkedList, item.id)"
          @select="(val) => handleSelectAction(val, item)"
          @change="handleCheckChange"
        ></templateItem>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { MoreAction } from '@/views/config/interface';
  import { execSucceed } from '@/utils/monitor';
  import { includes, filter } from 'lodash';
  import { ref, onMounted, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import templateItem from './template-item.vue';
  import { CatalogRowData } from '../config/interface';
  import { actionList } from '../config';
  import { refreshCatalog } from '../api';

  const props = defineProps({
    list: {
      type: Array as PropType<CatalogRowData[]>,
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
  const emits = defineEmits(['create', 'change', 'edit']);
  const { router } = useCallCommon();
  const moduleActions = ref<MoreAction[]>([]);

  const handleRefresh = async (item) => {
    try {
      await refreshCatalog({ id: item.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleEditItem = (item) => {
    emits('edit', item);
  };
  const handleSelectAction = (val, item) => {
    switch (val) {
      case 'refresh':
        handleRefresh(item);
        break;
      case 'edit':
        handleEditItem(item);
        break;
      default:
        break;
    }
  };
  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const setModuleActions = () => {
    const result = filter(actionList, (item) => {
      return userStore.hasRolesActionsPermission({
        resource: Resources.Catalogs,
        actions: [Actions.PUT]
      });
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
  onMounted(() => {});
</script>

<style lang="less" scoped>
  .thumb-view-wrap {
    margin-bottom: 6px;
    padding: 2px;
  }
</style>

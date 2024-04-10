<template>
  <div class="thumb-view-wrap" wrap :size="16">
    <a-grid v-if="list.length" :cols="24" :col-gap="20" :row-gap="20" wrap>
      <a-grid-item
        v-for="item in list"
        :key="`${item.metadata.namespace}/${item.metadata.name}`"
        :span="{ lg: 6, md: 12, sm: 24, xs: 24 }"
      >
        <templateItem
          :action-list="setModuleActions(item)"
          :data-info="item"
          :provider="item.status.icon"
          :checked="
            _.some(
              checkedList,
              (sItem) =>
                sItem.name === item.metadata.name &&
                sItem.namespace === item.metadata.namespace
            )
          "
          :show-checkbox="showCheckbox"
          @view="handleView(item)"
          @edit="handleEdit(item)"
          @delete="handleDelete(item)"
          @change="handleCheckChange"
        ></templateItem>
      </a-grid-item>
    </a-grid>
    <slot v-else name="empty"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB, PROJECT } from '@/router/config';
  import { PageAction } from '@/views/config';
  import { MoreAction } from '@/views/config/interface';
  import _, { includes, filter } from 'lodash';
  import { ref, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import templateItem from './template-item.vue';
  import { TemplateRowData } from '../config/interface';
  import { actionList } from '../config';

  const props = defineProps({
    list: {
      type: Array as PropType<TemplateRowData[]>,
      default() {
        return [];
      }
    },
    checkedList: {
      type: Array as PropType<Array<{ name: string; namespace: string }>>,
      default() {
        return [];
      }
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    catalogList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },
    scope: {
      type: String as PropType<'project' | 'global'>,
      default() {
        return 'global';
      }
    }
  });
  const emits = defineEmits(['create', 'change', 'delete']);
  const { router, route } = useCallCommon();
  const projectId = route.params.projectId as string;
  const handleCreate = () => {
    emits('create');
  };

  const handleCheckChange = (checked, id) => {
    emits('change', checked, id);
  };
  const handleDelete = (item) => {
    emits('delete', item);
  };
  const setModuleActions = (info) => {
    const result = filter(actionList, (item) => {
      return item.filterFun
        ? item.filterFun({ itemInfo: info, projectID: projectId })
        : true;
    });
    return result as MoreAction[];
  };
  const getCatalogName = (id) => {
    const catalog = _.find(props.catalogList, (item) => {
      return item.value === id;
    });
    return catalog?.label;
  };
  const handleView = (item) => {
    let routeName = OPERATIONHUB.TemplateDetail;
    let params: any = { action: PageAction.VIEW };
    if (props.scope === 'project') {
      routeName = PROJECT.TemplateDetail;
      params = {
        action: PageAction.VIEW,
        projectName: route.params.projectName as string
      };
    }
    router.push({
      name: routeName,
      params,
      query: {
        name: item.metadata.name,
        namespace: item.metadata.namespace,
        catalog: getCatalogName(item.catalog?.id)
      }
    });
  };
  const handleEdit = (item) => {
    let routeName = OPERATIONHUB.TemplateDetail;
    let params: any = { action: PageAction.EDIT };
    if (props.scope === 'project') {
      routeName = PROJECT.TemplateDetail;
      params = {
        action: PageAction.EDIT,
        projectName: route.params.projectName as string
      };
    }
    router.push({
      name: routeName,
      params,
      query: {
        name: item.metadata.name,
        namespace: item.metadata.namespace,
        catalog: getCatalogName(item.catalogId)
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

<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <a-button
        v-if="action === PageAction.EDIT"
        type="primary"
        style="margin-right: 8px; padding: 0 6px"
        @click.stop="handleAddConnector"
      >
        <template #icon>
          <icon-plus />
        </template>
        {{ $t('applications.environment.clone.variable') }}</a-button
      >
      <ConnectorSelector
        v-if="showModal"
        v-model:show="showModal"
        v-model:connectorIDs="values"
        :selected="selectedList"
        :list="dataList"
        @confirm="handleConnectorChange"
      ></ConnectorSelector>
    </div>
    <div class="connectors-list">
      <a-table
        column-resizable
        :bordered="true"
        :data="tableData"
        :pagination="false"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="name"
            :title="$t('operation.connectors.table.name')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            align="left"
            :cell-style="{ minWidth: '40px' }"
            data-index="value"
            :title="$t('applications.applications.secret.value')"
          >
            <template #cell="{ record }">
              <span v-if="record.sensitive">
                <icon-lock />
              </span>
              <span v-else>
                {{ !record.sensitive ? record.value : '*******' }}
              </span>
            </template>
          </a-table-column>
          <a-table-column
            v-if="action === 'edit'"
            align="center"
            :width="160"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record, rowIndex }">
              <a-space :size="20">
                <a-link
                  type="text"
                  size="small"
                  @click="handleDelete(record, rowIndex)"
                >
                  <template #icon><icon-delete class="size=20" /></template>
                </a-link>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal } from '@/utils/monitor';
  import { PageAction } from '@/views/config';
  import { ref, PropType } from 'vue';
  import { queryVariables } from '@/views/application-management/variables/api';
  import ConnectorSelector from './connector-selector.vue';

  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'edit';
      }
    },

    tableData: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['update:tableData']);
  const { route } = useCallCommon();
  const showModal = ref(false);
  const selectedList = ref<string[]>([]);
  const dataList = ref<{ label: string; value: string }[]>([]);
  const values = ref<string[]>([]);
  const environmentId = route.params.environmentId as string; // only in clone

  const handleAddConnector = () => {
    showModal.value = true;
  };

  const getDataList = async () => {
    if (!environmentId) return;
    try {
      const { data } = await queryVariables({
        page: -1,
        includeInherited: true
      } as any);
      dataList.value = _.map(data?.items || [], (item: any) => {
        item.value = item.id;
        item.label = item.name;
        return item;
      });
    } catch (error) {
      dataList.value = [];
    }
  };

  const handleDeleteConnector = (row) => {
    const list = _.filter(props.tableData, (item) => {
      return item.value !== row.id;
    });
    selectedList.value = _.filter(selectedList.value, (item) => {
      return item !== row.id;
    });
    emits('update:tableData', list);
  };
  const handleDelete = (row, index) => {
    deleteModal({ onOk: () => handleDeleteConnector(row) });
  };
  const handleConnectorChange = (values) => {
    const list = _.filter(dataList.value, (item) => {
      return _.includes(values, item.value);
    });
    emits('update:tableData', list);
  };
  getDataList();
</script>

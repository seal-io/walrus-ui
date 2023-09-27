<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <a-input-search v-model="query" allow-clear></a-input-search>
    </div>
    <div class="connectors-list">
      <a-table
        column-resizable
        :bordered="true"
        :data="resultList"
        :pagination="false"
        row-key="id"
        :scroll="{ y: 300 }"
        :row-selection="rowSelection"
        @selection-change="handleSelect"
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
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { ref, PropType, computed } from 'vue';
  import { queryVariables } from '@/views/application-management/variables/api';
  import useRowSelect from '@/hooks/use-row-select';

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
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { route } = useCallCommon();
  const dataList = ref<any[]>([]);
  const query = ref('');
  const environmentId = route.params.environmentId as string; // only in clone

  const resultList = computed(() => {
    if (!query.value) {
      return dataList.value;
    }
    return _.filter(dataList.value, (item) => {
      return item.name.includes(query.value);
    });
  });
  const handleSelect = (list) => {
    handleSelectChange(list);

    const selected = _.filter(dataList.value, (item) => {
      return _.includes(selectedKeys.value, item.id);
    }).map((sItem) => {
      return {
        description: sItem.description,
        name: sItem.name,
        value: sItem.value,
        sensitive: sItem.sensitive || false
      };
    });
    emits('update:tableData', selected);
  };
  const getDataList = async () => {
    if (!environmentId) return;
    try {
      const { data } = await queryVariables({
        page: -1
      } as any);
      dataList.value = data?.items || [];
    } catch (error) {
      dataList.value = [];
    }
  };
  getDataList();
</script>

<style lang="less" scoped>
  .connectors-list {
    :deep(.arco-table) {
      .arco-table-tr.arco-table-tr-empty .arco-table-td {
        border-bottom: 1px solid var(--seal-color-table-border);
      }
    }
  }
</style>

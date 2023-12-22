<template>
  <div class="box">
    <div class="title">
      <span class="text">{{
        $t('applications.applications.variables.title')
      }}</span>
      <a-button type="primary" size="small" @click="handleAddVariable">
        {{ $t('applications.applications.variables.button') }}
      </a-button>
    </div>
    <a-table
      column-resizable
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="value"
          :title="$t('common.table.default')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="overwrite"
          :title="$t('workflow.task.variable.runtieEditable')"
        >
          <template #cell="{ record }">
            <a-switch
              v-model="record.overwrite"
              size="small"
              @change="handleOverwriteChange"
            ></a-switch>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          align="left"
          :cell-style="{ minWidth: '40px' }"
          data-index="overwritable"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record, rowIndex }">
            <a-space>
              <a-tooltip :content="$t('common.button.edit')">
                <a-link @click="() => handleEdit({ row: record, rowIndex })"
                  ><icon-edit
                /></a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.delete')">
                <a-link status="danger" @click="() => handleDelete(rowIndex)"
                  ><icon-delete
                /></a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <addVariables
      v-model:show="showVariableModal"
      :info="currentVariable"
      :action="action"
      @save="handleSaveVariable"
    ></addVariables>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType, ref, watch } from 'vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import addVariables from './add-variables.vue';

  const props = defineProps({
    variables: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['update:variables']);
  const showVariableModal = ref(false);
  const currentVariable = ref<any>({});
  const dataList = ref<any[]>([]);
  const currentIndex = ref<number>(0);
  const action = ref<'create' | 'edit'>('create');
  // variables
  const handleAddVariable = () => {
    currentVariable.value = {};
    action.value = 'create';
    setTimeout(() => {
      showVariableModal.value = true;
    }, 100);
  };

  const handleOverwriteChange = () => {
    emits('update:variables', dataList.value);
  };
  const handleSaveVariable = (data) => {
    if (action.value === 'edit') {
      dataList.value.splice(currentIndex.value, 1, data);
    } else {
      dataList.value.push(data);
    }
    emits('update:variables', dataList.value);
  };
  const handleDeleteConfirm = (index) => {
    dataList.value.splice(index, 1);
    emits('update:variables', dataList.value);
  };
  const handleDelete = async (index) => {
    deleteModal({ onOk: () => handleDeleteConfirm(index) });
  };
  const handleEdit = ({ row, rowIndex }) => {
    currentVariable.value = row;
    currentIndex.value = rowIndex;
    action.value = 'edit';
    setTimeout(() => {
      showVariableModal.value = true;
    }, 100);
  };
  watch(
    () => props.variables,
    () => {
      dataList.value = _.cloneDeep(props.variables);
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .box {
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .text {
      color: var(--color-text-2);
      font-weight: 500;
    }
  }
</style>

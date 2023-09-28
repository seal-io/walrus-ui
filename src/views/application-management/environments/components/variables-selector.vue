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
          <a-table-column
            align="center"
            :width="210"
            :title="$t('common.table.operation')"
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
          >
            <template #cell="{ record, rowIndex }">
              <a-link
                type="text"
                size="small"
                @click="handleEdit(record, rowIndex)"
              >
                <template #icon><icon-edit class="size-16" /></template>
              </a-link>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <a-modal
      top="10%"
      :closable="false"
      :align-center="false"
      :width="600"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
      modal-class="project-modal"
      :title="$t('applications.secret.edit')"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-close="handleBeforeClose"
    >
      <a-spin style="width: 100%; text-align: center">
        <a-form ref="formref" :model="formData" auto-label-width>
          <a-form-item
            :label="$t('applications.applications.form.name')"
            hide-label
            field="name"
            validate-trigger="change"
            :rules="[
              {
                required: true,
                match: validateLabelNameRegx,
                message: $t('common.validate.labelName')
              }
            ]"
          >
            <seal-input
              v-model="formData.name"
              :label="$t('applications.applications.form.name')"
              :required="true"
              style="width: 100%"
              :max-length="63"
              show-word-limit
            ></seal-input>
            <template #extra>
              <span class="tips">{{ $t('common.validate.labelName') }}</span>
            </template>
          </a-form-item>
          <a-form-item
            :label="$t('applications.applications.secret.value')"
            field="value"
            hide-label
            validate-trigger="change"
            :rules="[
              { required: true, message: $t('applications.secret.rules.value') }
            ]"
          >
            <seal-textarea
              v-model="formData.value"
              :label="$t('applications.applications.secret.value')"
              :required="true"
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 4 }"
            ></seal-textarea>
          </a-form-item>
          <a-form-item
            :label="$t('common.table.description')"
            field="description"
            hide-label
            validate-trigger="change"
          >
            <seal-textarea
              v-model="formData.description"
              :label="$t('common.table.description')"
              :max-length="100"
              show-word-limit
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 5 }"
            ></seal-textarea>
          </a-form-item>
          <a-form-item
            :label="$t('common.table.sensitive')"
            field="sensitive"
            hide-label
            validate-trigger="change"
          >
            <seal-checkbox
              v-model="formData.sensitive"
              :label="$t('common.table.sensitive')"
              :required="false"
            ></seal-checkbox>
          </a-form-item>
        </a-form>
      </a-spin>
      <template #footer>
        <EditPageFooter style="margin-top: 0">
          <template #save>
            <a-button
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              :type="'outline'"
              class="cap-title cancel-btn"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </template>
        </EditPageFooter>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateLabelNameRegx } from '@/views/config';
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

    selectedList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['update:selectedList']);
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { route } = useCallCommon();
  const dataList = ref<any[]>([]);
  const show = ref(false);
  const formref = ref();
  const query = ref('');
  const environmentId = route.params.environmentId as string; // only in clone
  let activeIndex = 0;
  const formData = ref({
    name: '',
    value: '',
    description: '',
    sensitive: false
  });

  const resultList = computed(() => {
    if (!query.value) {
      return dataList.value;
    }
    return _.filter(dataList.value, (item) => {
      return item.name.includes(query.value);
    });
  });
  const updateSelectedList = () => {
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
    emits('update:selectedList', selected);
  };
  const handleSelect = (list) => {
    handleSelectChange(list);
    updateSelectedList();
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
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        dataList.value[activeIndex] = {
          ...dataList.value[activeIndex],
          ...formData.value
        };
        updateSelectedList();
        show.value = false;
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCancel = () => {
    show.value = false;
    // reset formData
    formData.value = {
      name: '',
      value: '',
      description: '',
      sensitive: false
    };
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
  };
  const handleEdit = (row, index) => {
    activeIndex = index;
    formData.value = {
      name: row.name,
      value: row.value,
      description: row.description,
      sensitive: row.sensitive
    };
    show.value = true;
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

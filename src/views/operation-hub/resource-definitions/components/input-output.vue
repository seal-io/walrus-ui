<template>
  <div>
    <a-tabs v-model:active-key="activeKey" class="page-line-tabs">
      <a-tab-pane key="table" title="表单">
        <div class="content">
          <div class="title">
            <span>输入</span>
            <!-- <span class="add">
              <a-link size="small" @click="handleAddInput">
                <icon-plus style="stroke-width: 4" />
              </a-link>
            </span> -->
          </div>
          <a-table
            column-resizable
            style="margin-bottom: 20px"
            :bordered="false"
            :loading="loading"
            :data="inputList"
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
                data-index="type"
                :title="$t('common.table.type')"
              >
              </a-table-column>
              <a-table-column
                ellipsis
                tooltip
                :cell-style="{ minWidth: '40px' }"
                data-index="desctiption"
                :title="$t('common.table.description')"
              >
              </a-table-column>
              <a-table-column
                ellipsis
                tooltip
                :cell-style="{ minWidth: '40px' }"
                data-index="default"
                :title="$t('common.table.default')"
              >
              </a-table-column>
              <a-table-column
                align="center"
                :width="210"
                :title="$t('common.table.operation')"
                ellipsis
                tooltip
                :cell-style="{ minWidth: '40px' }"
              >
                <template #cell="{ rowIndex }">
                  <a-space>
                    <a-tooltip :content="$t('common.button.edit')">
                      <a-link @click="handleEdit('input', rowIndex)">
                        <icon-edit />
                      </a-link>
                    </a-tooltip>
                    <a-tooltip :content="$t('common.button.delete')">
                      <a-link
                        status="danger"
                        @click="handleDelete('input', rowIndex)"
                      >
                        <icon-delete />
                      </a-link>
                    </a-tooltip>
                  </a-space>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
        <div class="content">
          <div class="title">
            <span>输出</span>
            <!-- <a-link size="small" @click="handleAddOutput">
              <icon-plus style="stroke-width: 4" />
            </a-link> -->
          </div>
          <a-table
            column-resizable
            style="margin-bottom: 20px"
            :bordered="false"
            :loading="loading"
            :data="outputList"
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
                data-index="description"
                :title="$t('common.table.description')"
              >
              </a-table-column>
              <a-table-column
                align="center"
                :width="210"
                :title="$t('common.table.operation')"
                ellipsis
                tooltip
                :cell-style="{ minWidth: '40px' }"
              >
                <template #cell="{ rowIndex }">
                  <a-space>
                    <a-tooltip :content="$t('common.button.edit')">
                      <a-link @click="handleEdit('output', rowIndex)">
                        <icon-edit />
                      </a-link>
                    </a-tooltip>
                    <a-tooltip :content="$t('common.button.delete')">
                      <a-link
                        status="danger"
                        @click="handleDelete('output', rowIndex)"
                      >
                        <icon-delete />
                      </a-link>
                    </a-tooltip>
                  </a-space>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="yaml" title="yaml">
        <AceEditor
          v-model="code"
          lang="yaml"
          height="600px"
          :read-only="readOnly"
          :editor-default-value="defaultCode"
        >
        </AceEditor>
      </a-tab-pane>
      <template #extra>
        <slot></slot>
      </template>
    </a-tabs>
    <addInputVariable
      v-model:show="showAddInputModal"
      :title="inputTitle"
      :info="inputData"
      :action="action"
      @save="handleSaveInputVariable"
    ></addInputVariable>
    <addOutput
      v-model:show="showAddOutputModal"
      :title="outputTitle"
      :info="outputData"
      :action="action"
      @save="handleSaveOutputVariable"
    ></addOutput>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, PropType } from 'vue';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import addInputVariable from './add-input-variable.vue';
  import addOutput from './add-output.vue';
  import { Input, Output } from '../config/interface';

  const props = defineProps({
    schemma: {
      type: Object as PropType<{ input: any[]; output: any[] }>,
      default() {
        return {};
      }
    },
    readOnly: {
      type: Boolean,
      default() {
        return true;
      }
    }
  });
  const activeKey = ref('table');
  const loading = ref(false);
  const inputList = ref<Input[]>([]);
  const outputList = ref<Output[]>([]);
  const code = ref('');
  const defaultCode = ref('');
  const inputData = ref<any>({});
  const outputData = ref<any>({});
  const action = ref<'create' | 'edit'>('create');
  const showAddInputModal = ref(false);
  const showAddOutputModal = ref(false);
  const activeIndex = ref(0);

  const outputTitle = computed(() => {
    return action.value === 'create' ? '添加输出变量' : '编辑输出变量';
  });
  const inputTitle = computed(() => {
    return action.value === 'create' ? '添加输入变量' : '编辑输入变量';
  });
  const handleAddInput = () => {
    action.value = 'create';
    showAddInputModal.value = true;
  };
  const handleAddOutput = () => {
    action.value = 'create';
    showAddOutputModal.value = true;
  };
  const handleSaveInputVariable = (data) => {
    if (action.value === 'edit') {
      inputList.value[activeIndex.value] = data;
      return;
    }
    inputList.value.push({
      ...data
    });
  };
  const handleSaveOutputVariable = (data) => {
    if (action.value === 'edit') {
      outputList.value[activeIndex.value] = data;
      return;
    }
    outputList.value.push({
      ...data
    });
  };

  const handleEdit = (type, index) => {
    activeIndex.value = index;
    if (type === 'input') {
      action.value = 'edit';
      inputData.value = inputList.value[index];
      showAddInputModal.value = true;
    } else {
      action.value = 'edit';
      outputData.value = outputList.value[index];
      showAddOutputModal.value = true;
    }
  };
  const handleDelete = (type, index) => {
    if (type === 'input') {
      inputList.value.splice(index, 1);
    } else {
      outputList.value.splice(index, 1);
    }
  };
</script>

<style lang="less" scoped>
  .page-line-tabs {
    .content {
      .title {
        height: 32px;
        padding: 0 10px;
        font-weight: 500;
        line-height: 32px;
      }
    }
  }
</style>

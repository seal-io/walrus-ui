<template>
  <div class="tab-content-wrap">
    <div class="icon-btn-group margin-b10">
      <IconBtnGroup
        v-model:active="currentView"
        :icon-list="iconList"
        @change="handleToggle"
      ></IconBtnGroup>
    </div>

    <a-table
      v-if="currentView === 'list'"
      column-resizable
      style="margin-bottom: 20px"
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
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="$t('common.table.type')"
        >
          <template #title>
            <span>{{ $t('common.table.type') }}</span>
            <a-tooltip :content="$t('operation.templates.detail.type.tips')">
              <icon-info-circle class="mleft-5" />
            </a-tooltip>
          </template>
          <template #cell="{ record }">
            <span v-if="isString(record.type)">{{ record.type }}</span>
            <a-tooltip v-else :content-style="{ maxHeight: '240px' }">
              <template #content>
                <span style="white-space: pre-wrap">{{
                  JSON.stringify(record.type, null, 2)
                }}</span>
              </template>
              <span>{{ get(record.type, '0') }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="description"
          :title="$t('common.table.description')"
        >
        </a-table-column>
      </template>
    </a-table>
    <AceEditor
      v-if="currentView === 'json'"
      lang="json"
      :height="height"
      read-only
      :show-gutter="false"
      :editor-default-value="jsonData"
    >
    </AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { get, reduce, filter, pick, map, isString } from 'lodash';
  import { PropType, computed, ref } from 'vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { Schema } from '../config/interface';

  const iconList = [
    {
      icon: 'icon-table',
      view: 'list',
      style: {
        fontSize: '14px'
      },
      iconfont: true
    },
    {
      icon: 'icon-code-square',
      view: 'json',
      style: {
        fontSize: '14px'
      },
      iconfont: false
    }
  ];
  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    },
    wrapSize: {
      type: Number,
      default() {
        return 200;
      }
    }
  });
  const currentView = ref('list');
  const height = ref(`calc(100vh - 480px)`);

  const dataList = computed(() => {
    const result = initFormState(
      get(props.schema, 'schema.openAPISchema.components.schemas.variables')
    );
    const list = filter(result.fieldSchemaList, (item) => {
      return !item.uiSchema.hidden;
    });
    return list || [];
  });
  const jsonData = computed(() => {
    const data = reduce(
      dataList.value || [],
      (obj, item) => {
        const key = item.name as string;
        obj[key] = {
          ...pick(item, ['type', 'default', 'description']),
          required: item.uiSchema.required || false
        };
        return obj;
      },
      {}
    );

    return JSON.stringify(data, null, 2);
  });
  const handleToggle = (type) => {
    currentView.value = type;
  };
</script>

<style lang="less" scoped>
  // @import url('@/views/commons/style/icon-btn-group.less');
</style>

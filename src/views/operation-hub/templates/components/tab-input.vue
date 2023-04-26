<template>
  <div class="tab-content-wrap">
    <a-space class="icon-btn-group margin-b10">
      <icon-list
        class="size-14"
        :class="{ active: currentView === 'list' }"
        @click="handleToggle('list')"
      />
      <a-divider direction="vertical" :margin="1"></a-divider>
      <icon-code-square
        class="size-14"
        :class="{ active: currentView === 'json' }"
        @click="handleToggle('json')"
      />
    </a-space>
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
            <a-tooltip>
              <template #content>
                <span style="white-space: pre-wrap">{{
                  JSON.stringify(record.type, null, 2)
                }}</span>
              </template>
              <span>{{ record.type }}</span>
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
      :height="400"
      read-only
      :show-gutter="false"
      :editor-default-value="jsonData"
    >
    </AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { get, reduce, filter, pick, map } from 'lodash';
  import { PropType, computed, ref } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { Schema } from '../config/interface';

  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    }
  });
  const currentView = ref('list');
  const dataList = computed(() => {
    const list = filter(get(props.schema, 'variables'), (item) => {
      return !item.hidden;
    });
    return list || [];
  });
  const jsonData = computed(() => {
    const data = reduce(
      get(props.schema, 'variables') || [],
      (obj, item) => {
        const key = item.name as string;
        obj[key] = {
          ...pick(item, ['type', 'default', 'description', 'required'])
        };
        return obj;
      },
      {}
    );
    // const data = map(get(props.schema, 'variables') || [], (item) => {
    //   return {
    //     ...pick(item, ['name', 'type', 'default', 'description', 'required'])
    //   };
    // });
    return JSON.stringify(data, null, 2);
  });
  const handleToggle = (type) => {
    currentView.value = type;
  };
</script>

<style lang="less" scoped>
  @import url('@/views/commons/style/icon-btn-group.less');
</style>

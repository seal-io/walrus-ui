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
          data-index="Name"
          :title="$t('applications.applications.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="Description"
          :title="$t('common.table.description')"
        >
        </a-table-column>
      </template>
    </a-table>
    <AceEditor
      v-if="currentView === 'json'"
      lang="json"
      read-only
      :show-gutter="false"
      :editor-default-value="jsonData"
    >
    </AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { get, reduce } from 'lodash';
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
    const list = get(props.schema, 'Variables');
    return list || [];
  });
  const jsonData = computed(() => {
    const data = reduce(
      get(props.schema, 'Variables') || [],
      (obj, item) => {
        const key = item.Name as string;
        obj[key] = `// ${item.Description}`;
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
  @import url('@/views/commons/style/icon-btn-group.less');
</style>

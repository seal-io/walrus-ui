<template>
  <div class="pager-list-wrap">
    <div class="page-box" :class="{ single: total <= 10 }">
      <a-pagination
        size="small"
        :total="total"
        :page-size="queryParams.perPage"
        :current="queryParams.page"
        show-total
        show-page-size
        :hide-on-single-page="queryParams.perPage === 10"
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
    <a-space fill :size="20" direction="vertical">
      <template v-if="group === 'dependency'">
        <dependencies
          v-for="(item, index) in dataList"
          :key="`de${index}`"
          :type-list="typeList"
          :issues-data="item"
          :show-ignore="false"
          @edit-ignore="handleEditIgnore"
          @reset-ignore="handResetIgnore"
        ></dependencies>
        <a-empty v-if="!dataList.length"></a-empty>
      </template>
      <template v-if="group === 'license'">
        <licenses
          v-for="(item, index) in dataList"
          :key="`l${index}`"
          :type-list="typeList"
          :issues-data="item"
          :show-ignore="false"
          @edit-ignore="handleEditIgnore"
          @reset-ignore="handResetIgnore"
        />
        <a-empty v-if="!dataList.length"></a-empty>
      </template>
      <!-- <template v-if="group === 'dependencyInspect'">
        <dependency-inspect
          v-for="(item, index) in dataList"
          :key="`d${index}`"
          :type-list="typeList"
          :issues-data="item"
        />
      </template> -->
      <!-- <template v-if="group === 'sercurity'">
        <sercurity-testing
          v-for="(item, index) in dataList"
          :key="`s${index}`"
          :type-list="typeList"
          :issues-data="item"
        ></sercurity-testing>
      </template> -->
      <template v-if="group === 'policyConfig'">
        <policy-config
          v-for="(item, index) in dataList"
          :key="`p${index}`"
          :type-list="typeList"
          :issues-data="item"
          :show-ignore="false"
          @edit-ignore="handleEditIgnore"
          @reset-ignore="handResetIgnore"
        />
        <a-empty v-if="!dataList.length"></a-empty>
      </template>
      <template v-if="group === 'pluginIssue'">
        <plugin-issue
          v-for="(item, index) in dataList"
          :key="`ue${index}`"
          :violation-type="$t(get(violationTypeMap, `${item?.type}`) || '')"
          :type-list="typeList"
          :issues-data="item"
          :show-ignore="false"
          @edit-ignore="handleEditIgnore"
          @reset-ignore="handResetIgnore"
        />
        <a-empty v-if="!dataList.length"></a-empty>
      </template>
    </a-space>
    <div
      class="page-box"
      :class="{ single: total <= 10 }"
      style="margin-top: 20px"
    >
      <a-pagination
        size="small"
        :total="total"
        :page-size="queryParams.perPage"
        :current="queryParams.page"
        show-total
        show-page-size
        :hide-on-single-page="queryParams.perPage === 10"
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
    <ignoreModal
      v-model:show="showModal"
      :status="status"
      :title="title"
      :data="modalData"
      @save="handleSaved"
    ></ignoreModal>
  </div>
</template>

<script lang="ts" setup>
  import { slice, ceil, get } from 'lodash';
  import { computed, PropType, reactive } from 'vue';
  import dependencies from './dependencies.vue';
  import licenses from './licenses.vue';
  import dependencyInspect from './dependency-inspect.vue';
  import sercurityTesting from './sercurity-testing.vue';
  import policyConfig from './policy-config.vue';
  import pluginIssue from './plugin-issue.vue';
  import { issuesItem } from '../api/report';
  import { violationTypeMap } from '../configs';
  import ignoreModal from './ignore-modal.vue';
  import useIgnoreModal from '../hooks/use-ignore-modal';

  const props = defineProps({
    list: {
      type: Array as PropType<issuesItem[]>,
      default() {
        return [];
      },
    },
    group: {
      type: String,
      default() {
        return 'a';
      },
    },
    typeList: {
      type: Object,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['refresh', 'editIgnore', 'resetIgnore']);
  const {
    title,
    showModal,
    handleSaved,
    modalData,
    handResetIgnore,
    handleEditIgnore,
    status,
  } = useIgnoreModal(emits);
  const queryParams = reactive({
    page: 1,
    perPage: 10,
  });
  const total = computed(() => {
    return props.list.length;
  });
  const pages = computed(() => {
    return ceil(props.list.length / queryParams.perPage);
  });
  const dataList = computed(() => {
    const start = (queryParams.page - 1) * queryParams.perPage;
    const arr = slice(props.list, start, start + queryParams.perPage);
    console.log('dataList===', arr);
    return arr;
  });
  const handlePageChange = (page) => {
    queryParams.page = page;
    console.log({ page });
  };
  const handlePageSizeChange = (pageSize) => {
    queryParams.perPage = pageSize;
    console.log({ pageSize });
  };
</script>

<style lang="less" scoped>
  .pager-list-wrap {
    .page-box {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;

      &.single {
        margin-bottom: 0;
      }
    }
  }
</style>

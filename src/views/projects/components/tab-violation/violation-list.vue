<template>
  <div class="pager-list-wrap">
    <filterBox style="margin-bottom: 5px; padding: 0">
      <template #params>
        <a-input
          v-model="query"
          allow-clear
          :placeholder="$t('resource.violation.search.vuln')"
          @change="handleFilterChange"
          @input="handleQueryChange"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-select
          v-model="sortType"
          placeholder=""
          :bordered="true"
          @change="handleFilterChange"
        >
          <a-option value="highest">{{
            $t('report.detail.sortByHigh')
          }}</a-option>
          <a-option value="lowest">{{
            $t('report.detail.sortByLow')
          }}</a-option>
        </a-select>
        <a-select
          v-model="ignoreType"
          placeholder=""
          :bordered="true"
          @change="handleIgnoreTypeChange"
        >
          <a-option
            v-for="item in ignoreOptions"
            :key="item.value"
            :value="item.value"
            >{{ $t(item.label) }}</a-option
          >
        </a-select>
        <a-select
          v-model="violationType"
          :placeholder="$t('projects.fixdetail.table.type')"
          style="width: 220px"
          @change="handleViolationTypeChange"
        >
          <a-option
            v-for="(item, index) in violationTypeList"
            :key="index"
            :label="$t(item.label)"
            :value="item.value"
          >
          </a-option>
        </a-select>
      </template>
      <template #button-group>
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
      </template>
    </filterBox>
    <!-- <a-divider></a-divider> -->
    <a-spin :loading="loading" style="width: 100%">
      <a-space
        fill
        :size="10"
        direction="vertical"
        :style="dataList.length ? 'padding: 0 0px 10px' : 'padding: 0 0px 0px'"
      >
        <a-empty v-if="!dataList.length" class="empty-wrap"> </a-empty>
        <div v-for="(item, index) in dataList" :key="index">
          <template v-if="item.violationType === 'vulnerability'">
            <vulnViolations
              :resource-list="resourceList"
              :show-resource-url="showResourceUrl"
              :violation-type="$t(get(violationTypeMap, `${item?.type}`) || '')"
              :type-list="typeList"
              :issues-data="item"
              @createJira="handlePostJira"
              @edit-ignore="handleEditIgnore"
              @reset-ignore="handResetIgnore"
            ></vulnViolations>
          </template>
          <template v-if="item.violationType === 'license'">
            <licenseViolation
              :resource-list="resourceList"
              :show-resource-url="showResourceUrl"
              :violation-type="$t(get(violationTypeMap, `${item?.type}`) || '')"
              :type-list="typeList"
              :issues-data="item"
              @createJira="handlePostJira"
              @edit-ignore="handleEditIgnore"
              @reset-ignore="handResetIgnore"
            />
          </template>
          <!-- <template v-if="item.violationType === 'dependency'">
            <dependencyViolation
              :violation-type="$t(get(violationTypeMap, `${item?.properties?.type}`) || '')"
              :type-list="typeList"
              :issues-data="item"
            />
          </template>
          <template v-if="item.violationType === 'sast'">
            <sastViolation
              violation-type="SAST"
              :type-list="typeList"
              :issues-data="item"
            ></sastViolation>
          </template> -->
          <template v-if="item.violationType === 'configure'">
            <configureViolation
              :resource-list="resourceList"
              :show-resource-url="showResourceUrl"
              :violation-type="$t(get(violationTypeMap, `${item?.type}`) || '')"
              :type-list="typeList"
              :issues-data="item"
              @createJira="handlePostJira"
              @edit-ignore="handleEditIgnore"
              @reset-ignore="handResetIgnore"
            />
          </template>
          <template v-if="item.violationType === 'other'">
            <otherViolation
              :resource-list="resourceList"
              :show-resource-url="showResourceUrl"
              :violation-type="$t(get(violationTypeMap, `${item?.type}`) || '')"
              :type-list="typeList"
              :issues-data="item"
              @createJira="handlePostJira"
              @edit-ignore="handleEditIgnore"
              @reset-ignore="handResetIgnore"
            />
          </template>
        </div>
      </a-space>
    </a-spin>
    <div
      class="page-box"
      :class="{ single: total <= 10 }"
      style="margin-top: 10px; margin-bottom: 0"
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
    <jiraTicket
      v-model:show="showTicket"
      :project-name="projectName"
      :project-id="projectId"
      :jira-space="jiraSpace"
      :is-private="jiraIsPrivate"
      :violation-id="violationId"
      :violation-severity="severity"
      :integration-id="integrationId"
      ticket-type="single"
      :show-severity="false"
    ></jiraTicket>
  </div>
</template>

<script lang="ts" setup>
  import { slice, ceil, get, includes } from 'lodash';
  import { ref, computed, PropType, reactive, watchEffect, inject } from 'vue';
  import { tableListRow } from '@/api/projects';
  import vulnViolations from '@/views/report/components/dependencies.vue';
  import licenseViolation from '@/views/report/components/licenses.vue';
  import dependencyViolation from '@/views/report/components/dependency-inspect.vue';
  import sastViolation from '@/views/report/components/sercurity-testing.vue';
  import configureViolation from '@/views/report/components/policy-config.vue';
  import otherViolation from '@/views/report/components/plugin-issue.vue';
  import { issuesItem } from '@/views/report/api/report';
  import filterBox from '@/components/filter-box/index.vue';
  import {
    violationTypeList,
    violationTypeMap,
    ignoreOptions,
  } from '@/views/report/configs';
  import useIgnoreModal from '@/views/report/hooks/use-ignore-modal';
  import ignoreModal from '@/views/report/components/ignore-modal.vue';
  import { useJiraTicket } from '@/views/projects/hooks/index';
  import jiraTicket from '../jira-ticket.vue';

  const props = defineProps({
    showResourceUrl: {
      type: Boolean,
      default() {
        return false;
      },
    },
    list: {
      type: Array as PropType<issuesItem[]>,
      default() {
        return [];
      },
    },
    resourceList: {
      type: Array as PropType<tableListRow[]>,
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
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  });

  const basicInfo = inject('basicInfo');
  const {
    showTicket,
    projectName,
    projectId,
    integrationId,
    violationId,
    getPlateList,
    jiraSpace,
    jiraIsPrivate,
    severity,
    handleCreateJiraTicket,
  } = useJiraTicket();
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
  const sortType = ref('highest');
  const query = ref('');
  let queryTimer: any = null;
  const ignoreType = ref('false');
  const violationType = ref('all');
  const dataList = ref<issuesItem[]>([]);
  const rawDataList = ref<issuesItem[]>([]);
  const queryParams = reactive({
    page: 1,
    perPage: 10,
  });
  const total = computed(() => {
    return rawDataList.value.length;
  });
  const pages = computed(() => {
    return ceil(props.list.length / queryParams.perPage);
  });
  const handleIgnoreTypeChange = (val) => {
    ignoreType.value = val;
    emits('refresh', val);
  };
  const handlePostJira = (violation) => {
    const data = {
      id: get(basicInfo, 'id'),
      name: violation.title,
      violationId: violation.id,
      severity: violation.severity,
    };
    handleCreateJiraTicket('jira', data);
  };
  const filterDataList = () => {
    let list = props.list.filter((item) => {
      return violationType.value === 'all'
        ? true
        : item.violationType === violationType.value;
    });
    list = list.filter((sItem) => {
      if (!query.value) {
        return true;
      }
      const vioNamespace = get(sItem, 'vulnerability.namespace') || '';
      const depsName = get(sItem, 'artifact.name') || '';
      const depsNamespace = get(sItem, 'artifact.namespace') || '';
      const vioMessage = get(sItem, 'message') || '';
      const vioSummary = get(sItem, 'summary') || '';
      const vulnName = get(sItem, 'vulnerability.name') || '';
      return (
        includes(vulnName, query.value) ||
        includes(depsName, query.value) ||
        includes(vioMessage, query.value) ||
        includes(vioSummary, query.value) ||
        includes(vioNamespace, query.value) ||
        includes(depsNamespace, query.value)
      );
    });
    if (sortType.value === 'lowest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return a.severityValue - b.severityValue;
      });
    }
    if (sortType.value === 'highest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return b.severityValue - a.severityValue;
      });
    }
    rawDataList.value = [].concat(list as never[]);
  };
  const fetchDataList = () => {
    const start = (queryParams.page - 1) * queryParams.perPage;
    const list = slice(rawDataList.value, start, start + queryParams.perPage);
    dataList.value = [].concat(list as never[]);
  };
  const handlePageChange = (page) => {
    queryParams.page = page;
    fetchDataList();
    console.log({ page });
  };
  const handlePageSizeChange = (pageSize) => {
    queryParams.perPage = pageSize;
    fetchDataList();
    console.log({ pageSize });
  };
  const getDataList = () => {
    filterDataList();
    fetchDataList();
    console.log('dataList===', rawDataList.value, dataList.value);
  };
  const handleFilterChange = () => {
    queryParams.page = 1;
    getDataList();
    // console.log('dataList===', dataList.value)
  };
  const handleViolationTypeChange = () => {
    query.value = '';
    handleFilterChange();
  };
  const handleQueryChange = () => {
    clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      handleFilterChange();
    }, 300);
  };
  watchEffect(() => {
    getDataList();
  });
  getPlateList();
</script>

<style lang="less" scoped>
  .empty-wrap {
    padding: 20px 0;
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px 4px 0 0;
  }

  .pager-list-wrap {
    .page-box {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
      padding: 0 10px;

      &.single {
        margin-bottom: 0;
      }
    }

    :deep(.filter-box-wrap) {
      // margin-top: 10px;
      .arco-select {
        background-color: var(--color-fill-2);
      }

      .arco-input-wrapper {
        background-color: var(--color-fill-2);
      }

      .arco-pagination {
        .arco-select {
          background-color: #fff;
        }
      }
    }
  }
</style>

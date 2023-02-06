<template>
  <div class="fix-wrap projects-list-wrap">
    <!-- <filterBox style="padding: 0 10px">
      <template #params> </template>
    </filterBox> -->
    <!-- <a-divider style="margin: 0"></a-divider> -->
    <com-card padding="20px 0 0px">
      <a-table
        column-resizable
        style="padding-bottom: 20px"
        :loading="loading"
        :data="dataList"
        :pagination="false"
        row-key="id"
        :row-selection="rowSelection"
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '60px' }"
            :title="$t('applications.table.list.name')"
            data-index="name"
          >
            <template #cell="{ record }">
              <a-link class="proj-name" @click="handleViewDetail(record)">{{
                record.fullName
              }}</a-link>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('projects.table.updateTime')"
            data-index="updateTime"
            align="left"
          >
            <template #cell="{ record }">
              <span>{{
                dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
              }}</span>
            </template>
          </a-table-column>
          <!-- <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('projects.table.namespace')"
            data-index="namespace"
          >
          </a-table-column> -->
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('projects.table.source')"
            data-index="provider"
          >
            <template #cell="{ record }">
              <span
                class="repo-icon"
                :style="{
                  'background-image': `url(${get(
                    repoIcon,
                    toLower(record.provider)
                  )})`,
                }"
              ></span>
              <span class="source">{{ record.provider }} </span>
            </template>
          </a-table-column>
          <a-table-column
            :width="lang === 'en' ? 420 : 370"
            :title="$t('projects.table.scanTime')"
            data-index="lastEvaluationTime"
            align="left"
          >
            <template #cell="{ record }">
              <a-space :size="4">
                <severityBar
                  :layout="['H', 'M', 'L']"
                  :severity="{
                    high: get(record, 'issueHighCount'),
                    medium: get(record, 'issueMediumCount'),
                    low: get(record, 'issueLowCount'),
                  }"
                ></severityBar>
                <a-link
                  v-if="record.evaluationStatus === 'finished'"
                  class="link-btn"
                  :class="[lang]"
                  target="_blank"
                  :href="resolvePath(record)"
                  >{{ $t('logs.list.viewReport') }}</a-link
                >
                <a-tag
                  v-else-if="record.evaluationStatus === 'running'"
                  class="link-btn scan-loading"
                  :class="[lang]"
                  size="small"
                  color="#206ccf"
                  >{{ $t('projects.table.testing') }}</a-tag
                >
                <a-tag
                  v-else-if="record.evaluationStatus === 'error'"
                  class="link-btn"
                  :class="[lang]"
                  size="small"
                  color="#F53F3F"
                  >{{ $t('projects.table.fail') }}</a-tag
                >
                <a-tag
                  v-else
                  class="link-btn"
                  :class="[lang]"
                  size="small"
                  color="#0fc6c2"
                  >{{ $t('projects.table.ready') }}</a-tag
                >
                <span class="from-now-time" :class="[lang]">{{
                  dayjs(record.lastEvaluationTime).locale(lang).fromNow()
                }}</span>
              </a-space>
            </template>
          </a-table-column>
          <!-- <a-table-column
            :title="$t('projects.table.operation')"
            align="center"
          >
            <template #cell="{ record }">
              <div class="button-wrap">
                <a-dropdown-button size="small">
                  <template #icon>
                    <icon-down style="margin-left: 0" />
                  </template>
                  <a-button
                    :loading="record.loading"
                    :disabled="record.evaluationStatus === 'running'"
                    type="text"
                    size="small"
                    @click="handleScan(record)"
                    >{{ $t('projects.list.scan') }}</a-button
                  >
                  <template #content>
                    <div class="btn-group-wrap">
                      <a-button
                        type="text"
                        size="small"
                        @click="handleCreateTicket(record)"
                        >{{ $t('projects.button.jira') }}</a-button
                      >
                      <a-button
                        type="text"
                        size="small"
                        @click="handleViewHistory(record)"
                        >{{ $t('projects.button.history') }}</a-button
                      >
                    </div>
                  </template>
                </a-dropdown-button>
              </div>
            </template>
          </a-table-column> -->
        </template>
      </a-table>
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
    </com-card>
    <jiraTicket
      v-model:show="showTicket"
      :project-name="projectName"
      :project-id="projectId"
      :jira-space="jiraSpace"
      :is-private="jiraIsPrivate"
      :integration-id="integrationId"
    ></jiraTicket>
  </div>
</template>

<script lang="ts" setup>
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { pickBy, get, toLower, map, cloneDeep, assignIn } from 'lodash';
  import dayjs from 'dayjs';
  import { useWebsocket, wssResourceList } from '@/hooks/use-websocket';
  import { Message } from '@arco-design/web-vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { ref, reactive, computed, onMounted, nextTick } from 'vue';
  import { tableListRow, scanProject } from '@/api/projects';
  import useLoading from '@/hooks/loading';
  import filterBox from '@/components/filter-box/index.vue';
  import comCard from '@/components/page-wrap/com-card.vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { repoIcon } from '@/views/intergration/config';
  import severityBar from '@/components/severity-bar/index.vue';
  import { deleteRepos } from '@/views/projects/api/import-repo';
  import { useJiraTicket } from '@/views/projects/hooks/index';
  import jiraTicket from '@/views/projects/components/jira-ticket.vue';
  import { queryAppsResources } from '../api/applications';

  type strNum = string | number | boolean;
  interface filtersValue {
    [key: string]: strNum[];
  }
  const {
    showTicket,
    projectName,
    projectId,
    integrationId,
    getPlateList,
    jiraSpace,
    jiraIsPrivate,
    handleCreateJiraTicket,
  } = useJiraTicket();
  const { t, locale, route, router } = useCallCommon();
  const id = route.query.id as string;
  const dataList = ref<tableListRow[]>([]);
  const total = ref<number>(0);
  const queryParams: Pagination = reactive({
    page: 1,
    perPage: 10,
  });
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);
  const { loading, setLoading } = useLoading(true);
  const lang = computed(() => {
    return locale.value === 'zh-CN' ? 'zh-cn' : 'en';
  });

  const handleViewReport = (row: any) => {
    router.push({
      name: 'eventReport',
      query: {
        id: row.lastEvaluationEventID,
      },
    });
  };
  const resolvePath = (row: any) => {
    const path = router.resolve({
      name: 'eventReport',
      query: { id: row.lastEvaluationEventID, provider: row.provider },
    });
    return path.href;
  };
  const fetchData = async () => {
    try {
      const params = {
        id,
        ...queryParams,
      };
      setLoading(true);
      const { data } = await queryAppsResources(params);
      // const list = data?.items || [];
      dataList.value = [].concat(data);
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      dataList.value = [];
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  const handleReset = () => {
    // queryParams.fullName = '';
    // queryParams.provider = [];
    // queryParams.withIssues = '';
    queryParams.page = 1;
    handleFilter();
  };

  const handleFilerChange = (val: filtersValue) => {
    Object.keys(val).forEach((key) => {
      queryParams[key] = val[key] || [];
    });
    queryParams.page = 1;
    handleFilter();
  };

  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };

  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    handleFilter();
  };

  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log({ list });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val,
        };
      });
      await deleteRepos(ids);
      loading.value = false;
      Message.success(t('common.message.success'));
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleDeleteRepo = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleViewDetail = (row) => {
    console.log({ row });
    router.push({
      name: 'projectSBom',
      query: {
        id: row.id,
        versionId: 'latest',
      },
    });
  };
  const handleViewHistory = (row) => {
    router.push({
      name: 'scanHistory',
      query: {
        id: row.id,
      },
    });
  };
  const handleCreateTicket = (row) => {
    handleCreateJiraTicket('jira', row);
  };
  const handleScan = async (row) => {
    try {
      row.loading = true;
      const { data } = await scanProject(row.id);
      row.loading = false;
      row.evaluationStatus = 'running';
      // row.evaluationStatus = data.evaluationStatus;
    } catch (error) {
      console.log(error);
      row.loading = false;
    }
  };
  const wssOnMessage = (message) => {
    dataList.value = map(dataList.value, (o) => {
      const item = cloneDeep(o);
      if (item.id === message.id) {
        assignIn(item, message);
      }
      return item;
    });
  };
  const loopUpdateRunTime = () => {
    dataList.value = map(dataList.value, (o) => {
      if (o.evaluationStatus === 'running') {
        const item = cloneDeep(o);
        return item;
      }
      return o;
    });
  };
  const createWssConnect = () => {
    const { updateEvaluateTime } = useWebsocket({
      url: wssResourceList,
      onmessage: wssOnMessage,
    });
    nextTick(() => {
      updateEvaluateTime(loopUpdateRunTime);
    });
  };

  createWssConnect();
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less">
  .page-pop-arrow {
    display: none;
  }

  .btn-group-wrap {
    display: flex;
    flex-direction: column;
  }

  .page-pop-content {
    box-sizing: border-box;
    // height: 100px;
    padding: 4px;

    &.arco-popconfirm-popup-content .arco-popconfirm-body {
      margin-bottom: 0;
    }

    .arco-icon-plus {
      margin-bottom: 7px;
    }

    .arco-popconfirm-footer {
      display: none;
    }

    &.arco-popconfirm-popup-content {
      padding: 4px !important;
      line-height: 1;
    }

    .arco-popconfirm-icon {
      display: none !important;
    }
  }
</style>

<style lang="less" scoped>
  .projects-list-wrap {
    .button-wrap {
      :deep(.arco-btn-secondary) {
        padding: 0 1px;

        .arco-btn-size-small {
          height: 26px;
          padding: 0 10px;
        }
      }
    }

    .repo-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      vertical-align: -4px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }

    .from-now-time {
      display: inline-block;
      text-align: left;

      &.en {
        width: 125px;
      }

      &.zh-cn {
        width: 90px;
      }
    }

    .link-btn {
      display: inline-block;
      box-sizing: border-box;
      width: 85px;
      text-align: center;

      &.zh-cn {
        width: 65px;
      }
    }

    .proj-name {
      display: inline;
      color: var(--sealblue-6);
      cursor: pointer;

      .arco-icon {
        display: inline-block;
        margin-left: 4px;
        font-size: 14px;
        vertical-align: text-top;
      }
    }

    .source {
      font-size: 12px;
      text-transform: capitalize;
    }
  }
</style>

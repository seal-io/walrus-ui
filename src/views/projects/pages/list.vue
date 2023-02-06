<template>
  <div class="container projects-list-wrap">
    <a-layout class="layout-wrap" :class="{ 'no-sider': false }">
      <a-layout-content class="layout-content">
        <a-space
          v-if="filtered"
          :size="15"
          direction="horizontal"
          class="filter-wrap"
          fill
        >
          <a-space>
            <a-select
              v-model="queryParams.tags"
              allow-clear
              multiple
              :max-tag-count="1"
              style="width: 200px"
              :placeholder="$t('applications.list.filter.tag')"
              @change="handlerSearch"
            >
              <a-option
                v-for="(item, index) in tagsDataList"
                :key="index"
                :value="item.value"
                >{{ item.label }}</a-option
              >
              <template #empty><span></span></template>
            </a-select>
            <a-select
              v-model="queryParams.withIssues"
              :style="{ width: '160px' }"
              :placeholder="$t('projects.select.holder')"
              allow-clear
              @change="handlerSearch"
            >
              <a-option
                v-for="item in withIssuesList"
                :key="item.value"
                :value="item.value"
                >{{ $t(item.label) }}</a-option
              >
            </a-select>
            <a-select
              v-model="queryParams.provider"
              :style="{ width: '200px' }"
              :placeholder="$t('projects.table.source')"
              allow-clear
              multiple
              :max-tag-count="1"
              @change="handlerSearch"
            >
              <a-option
                v-for="item in integrationList"
                :key="item.value"
                :value="item.value"
                >{{ $t(item.title) }}</a-option
              >
            </a-select>
            <a-input
              v-model="queryParams.fullName"
              allow-clear
              style="width: 240px"
              :placeholder="$t('resource.list.holder.name')"
              @clear="handlerSearch"
              @change="handlerSearch"
              @press-enter="handlerSearch"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input>
            <a-button
              type="primary"
              style="margin-left: 15px"
              @click="handleReset"
              >{{ $t('common.button.reset') }}</a-button
            >
          </a-space>
          <a-space>
            <a-popconfirm
              position="br"
              arrow-class="page-pop-arrow"
              content-class="page-pop-content"
              @popup-visible-change="handleVisibleChange"
            >
              <template #content>
                <addPop
                  :repo-map-list="repoMapList"
                  @click="handleClickPopItem"
                ></addPop>
              </template>
              <template #icon> <span></span></template>
              <a-button type="primary"
                >{{ $t('resource.list.button.add')
                }}<icon-down :class="{ open: popVisible }"
              /></a-button>
            </a-popconfirm>
            <a-button
              type="primary"
              status="warning"
              :disabled="!selectedKeys.length"
              @click="handleDeleteRepo"
              >{{ $t('common.button.delete') }}</a-button
            >
          </a-space>
        </a-space>
        <a-card class="general-card q-s-w-card">
          <a-space direction="vertical" :size="20" fill>
            <a-table
              column-resizable
              :loading="loading"
              :data="dataList"
              :pagination="false"
              row-key="id"
              :row-selection="rowSelection"
              :row-class="setRowClass"
              @selection-change="handleSelectChange"
            >
              <template #columns>
                <a-table-column
                  ellipsis
                  tooltip
                  cell-class="resource-name"
                  :cell-style="{ minWidth: '60px' }"
                  :title="$t('projects.resource.list.title')"
                  data-index="name"
                >
                  <template #cell="{ record }">
                    <a-link
                      class="proj-name"
                      @click="handleViewDetail(record)"
                      >{{ record.childName || record.fullName }}</a-link
                    >
                  </template>
                </a-table-column>
                <a-table-column
                  ellipsis
                  tooltip
                  :cell-style="{ minWidth: '60px' }"
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
                    <span class="source"
                      >{{
                        get(integrationRepoMap, record.provider)
                          ? get(integrationRepoMap, record.provider)
                          : capitalize(record.provider)
                      }}
                    </span>
                  </template>
                </a-table-column>
                <a-table-column
                  :title="$t('resource.list.table.tag')"
                  ellipsis
                  tooltip
                  :cell-style="{ minWidth: '40px' }"
                >
                  <template #cell="{ record }">
                    <AutoTip
                      :tooltip-props="{ content: join(record.tags, ',') }"
                    >
                      <span>
                        <a-tag
                          v-for="(val, index) in record.tags"
                          :key="index"
                          class="table-cell-tag"
                          color="#0DA5AA"
                          size="small"
                          style="margin-right: 4px; padding: 0 4px"
                          >{{ val }}</a-tag
                        >
                      </span>
                    </AutoTip>
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
                <a-table-column
                  :title="$t('projects.table.operation')"
                  :width="110"
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
                              v-if="
                                record.isParent &&
                                record.kind === 'containerImage'
                              "
                              :disabled="
                                some(
                                  record.children,
                                  (s) => s.evaluationStatus === 'running'
                                ) || record.evaluationStatus === 'running'
                              "
                              type="text"
                              size="small"
                              @click="handleEditImage(record)"
                              >{{ $t('common.button.edit') }}</a-button
                            >
                            <a-button
                              type="text"
                              size="small"
                              @click="handleCreateTicket(record)"
                              >{{ $t('projects.button.jira') }}</a-button
                            >

                            <a-button
                              type="text"
                              size="small"
                              @click="handleShowAddTag(record)"
                              >{{ $t('projects.list.button.tag') }}</a-button
                            >
                            <a-button
                              type="text"
                              size="small"
                              @click="handleShowSettingModal(record)"
                              >{{
                                $t('resource.scan.settings.title')
                              }}</a-button
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
                </a-table-column>
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
          </a-space>
        </a-card>
      </a-layout-content>
    </a-layout>
    <jiraTicket
      v-model:show="showTicket"
      :project-name="projectName"
      :project-id="projectId"
      :jira-space="jiraSpace"
      :is-private="jiraIsPrivate"
      :integration-id="integrationId"
    ></jiraTicket>
    <containerRegistry
      v-model:show="showContainerModal"
      :provider="provider"
      :registry-id="registryId"
      :image-data="imageData"
      @reset="handleResetContainer"
      @save="handleReset"
    ></containerRegistry>
    <addTags
      v-model:show="showAddTagsModal"
      :tags="tagsList"
      :resource-id="resourceId"
      @save="handleSaveTag"
    ></addTags>
    <uploadSbom v-model:show="showSbomModal" @save="handleReset"></uploadSbom>
    <scanSettings
      v-model:show="showSettingsModal"
      :kind="resourceKind"
      :resource-id="modalResourceId"
      :resource-data="resourceData"
    ></scanSettings>
  </div>
</template>

<script lang="ts" setup>
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import {
    pickBy,
    get,
    toLower,
    map,
    flatten,
    join,
    each,
    cloneDeep,
    assignIn,
    capitalize,
    some,
  } from 'lodash';
  import dayjs from 'dayjs';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { ref, reactive, computed, onMounted, nextTick } from 'vue';
  import {
    tableListRow,
    TableQueryParams,
    queryDataList,
    scanProject,
  } from '@/api/projects';
  import useLoading from '@/hooks/loading';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { repoIcon, integrationRepoMap } from '@/views/intergration/config';
  import severityBar from '@/components/severity-bar/index.vue';
  import { useWebsocket, wssResourceList } from '@/hooks/use-websocket';
  import { queryResourceTags } from '@/views/applications/api/applications';
  import { deleteRepos } from '../api/import-repo';
  import addPop from '../components/add-pop.vue';
  import { childrenItem, withIssuesList, uploadSbomConfig } from '../config';
  import { PopupItem } from '../config/interface';
  import {
    useContainerRegistry,
    useJiraTicket,
    useAddTags,
    useQueryIntegration,
    useUploadSbom,
    useScanSettings,
  } from '../hooks/index';
  // modal components ...
  import jiraTicket from '../components/jira-ticket.vue';
  import containerRegistry from '../components/integration/container-registry.vue';
  import addTags from '../components/add-tags.vue';
  import uploadSbom from '../components/integration/upload-sbom.vue';
  import scanSettings from '../components/scan-settings/index.vue';

  defineProps({
    filtered: {
      type: Boolean,
      default() {
        return true;
      },
    },
  });
  type strNum = string | number | boolean;
  interface filtersValue {
    [key: string]: strNum[];
  }
  interface query extends Pagination {
    fullName: string;
    provider: string[];
    withIssues: string;
    tags: string[];
  }
  // create jira ticket
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

  // import oci resource
  const {
    showContainerModal,
    provider,
    registryId,
    imageData,
    handleResetContainer,
    handleAddContainerRegistry,
  } = useContainerRegistry();

  // add tags
  const { handleShowAddTag, showAddTagsModal, resourceId, tagsList } =
    useAddTags();
  // upload sbom
  const { handleShowUploadSbomModal, showSbomModal } = useUploadSbom();
  // scan settings
  const {
    showSettingsModal,
    modalResourceId,
    handleShowSettingModal,
    resourceKind,
    resourceData,
  } = useScanSettings();
  const { t, locale } = useI18n();
  const router = useRouter();
  const dataList = ref<tableListRow[]>([]);
  const siderCollpase = ref<boolean>(false);
  const popVisible = ref<boolean>(false);
  const total = ref<number>(0);
  const tagsDataList = ref<{ value: string; label: string }[]>([]);
  const queryParams: query = reactive({
    fullName: '',
    provider: [],
    withIssues: '',
    tags: [],
    page: 1,
    perPage: 10,
    all: false,
  });

  // add reource callback handler
  const popupClickhandlerMap = {
    oci: handleAddContainerRegistry,
    uploaded: handleShowUploadSbomModal,
  };

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

  const integrationList = ref<childrenItem[]>([
    { checked: false, title: 'GitHub', value: 0, key: '', id: 'github' },
  ]);
  const repoMapList = ref<PopupItem[]>(uploadSbomConfig);
  const handleVisibleChange = (val) => {
    popVisible.value = val;
  };
  // TODO
  const getIntegrationList = () => {
    integrationList.value = repoMapList.value.map((s) => {
      const item = {
        checked: false,
        title: s.title,
        key: '',
        value: s.provider,
        id: s.provider,
        clickHandler: s.clickHandler,
      };
      return item;
    });
  };

  const fetchConfigRepo = async () => {
    const result = await useQueryIntegration();
    repoMapList.value = [...flatten(result || [])].concat(uploadSbomConfig);
    getIntegrationList();
  };

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
  const handleClickPopItem = (data: PopupItem) => {
    console.log({ data });
    popupClickhandlerMap[data.provider]?.({
      ...data,
      containerRegistryID: data.id,
    });
  };
  const fetchData = async (params: TableQueryParams = { ...queryParams }) => {
    try {
      setLoading(true);
      params = pickBy(
        params,
        (val: any) => val || val.length
      ) as TableQueryParams;
      const { data } = await queryDataList({
        ...params,
        all: !!queryParams?.tags?.length,
      });
      let list: any = data?.items || [];
      list = map(list, (s) => {
        const children = get(s, 'edges.children') || [];
        s.isLeaf = !children.length;
        s.isParent = true;
        if (children.length) {
          each(children, (c) => {
            c.isLeaf = true;
            c.childName = c.version;
            c.isChilren = true;
            c.disabled = true;
            c.parentId = s.id;
          });
          s.children = children;
        }
        return s;
      });
      dataList.value = [].concat(list);
      total.value = data?.pagination?.total || 0;
      console.log('dataList===', dataList.value);
    } catch (error) {
      dataList.value = [];
      console.log('error======', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  let timer: any = null;
  const handlerSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.fullName = '';
    queryParams.provider = [];
    queryParams.tags = [];
    queryParams.withIssues = '';
    queryParams.page = 1;
    handleFilter();
  };
  const handleCollapse = (collapse: boolean) => {
    siderCollpase.value = collapse;
  };

  const handleFilerChange = (val: filtersValue) => {
    Object.keys(val).forEach((key) => {
      queryParams[key] = val[key] || [];
    });
    queryParams.page = 1;
    handleFilter();
    console.log('filters:', queryParams.provider.length);
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

  const handleFilterToggle = () => {
    siderCollpase.value = !siderCollpase.value;
  };
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log({ list });
  };
  const setRowClass = (record) => {
    if (record.raw.isChilren && record.raw.disabled) {
      return 'disabled-row-child';
    }
    return '';
  };
  const loadMore = (record, done) => {
    const list = get(record, 'edges.children') || [];
    done(list);
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
  const handleEditImage = (row) => {
    console.log('row===', row);
    popupClickhandlerMap[row.provider]?.({ ...row, dataId: row.id });
  };
  const handleScan = async (row) => {
    console.log('message:', row);
    try {
      row.loading = true;
      const { data } = await scanProject(row.id);
      setTimeout(() => {
        row.loading = false;
      }, 200);
      // row.evaluationStatus = data.evaluationStatus;
    } catch (error) {
      console.log(error);
      row.loading = false;
    }
  };
  const getResourceTags = async () => {
    const { data } = await queryResourceTags();
    tagsDataList.value = map(data, (val) => {
      return {
        label: val,
        value: val,
      };
    });
  };
  const handleSaveTag = () => {
    handleFilter();
    getResourceTags();
  };
  const wssOnMessage = (message) => {
    dataList.value = map(dataList.value, (o) => {
      const item = cloneDeep(o);
      if (item.id === message.id) {
        assignIn(item, message);
        item.loading = message.evaluationStatus === 'running';
        const children = get(message, 'edges.children') || [];
        item.children = children.length ? children : null;
        item.isLeaf = !children.length;
        item.isParent = !!children.length;
        if (children.length) {
          each(children, (c) => {
            c.isLeaf = true;
            c.childName = c.version;
            c.isChilren = true;
            c.disabled = true;
            c.parentId = item.id;
            c.loading = c.evaluationStatus === 'running';
          });
        }
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
      if (get(o, 'children') && get(o, 'children')?.length) {
        o.edges.children = map(o.edges.children, (s) => {
          if (s.evaluationStatus === 'running') {
            const obj = cloneDeep(s);
            return obj;
          }
          return s;
        });
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
  onMounted(async () => {
    await fetchData();
    fetchConfigRepo();
    getPlateList();
    getResourceTags();
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
  .container {
    :deep(.arco-layout-sider) {
      box-sizing: border-box;
      margin-right: 10px;
      padding: 0 8px 4px;
      box-shadow: none;
    }

    :deep(.arco-icon-down) {
      margin-left: 5px;
      transition: transform 0.3s;

      &.open {
        transform: rotate(-180deg);
        transition: transform 0.3s;
      }
    }

    :deep(.arco-table-tr) {
      &.disabled-row-child {
        .arco-table-operation {
          .arco-table-cell {
            display: none;
          }
        }

        .arco-table-td.resource-name {
          .arco-table-cell.arco-table-cell-align-left > span:first-child {
            padding-left: 20px !important;
          }
        }
      }
    }

    .button-wrap {
      :deep(.arco-btn-secondary) {
        padding: 0 1px;

        .arco-btn-size-small {
          height: 26px;
          padding: 0 10px;
        }
      }
    }

    .edit-btn {
      height: 100%;
      padding: 0 1px;
      color: var(--sealblue-6);
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background-color: #fff;
        border-radius: 2px;
      }
    }

    :deep(.arco-input-tag) {
      padding-right: 0;
      padding-left: 5px;

      .arco-input-tag-tag {
        border: none;
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

    .filter-wrap {
      justify-content: space-between;
      width: 100%;

      :deep(.arco-select) {
        background-color: #fff;
      }

      :deep(.arco-tag) {
        font-weight: 400;
      }
    }

    .link-btn {
      display: inline-block;
      box-sizing: border-box;
      width: 85px;
      text-align: center;

      &.zh-cn {
        width: 70px;
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

    // :deep(.arco-btn-primary.arco-btn-status-warning) {
    //   background-color: rgb(134, 144, 156);
    //   transition: all 0.3s;

    //   &:hover {
    //     background-color: rgba(134, 144, 156, 0.7);
    //     transition: all 0.3s;
    //   }
    // }
    :deep(.arco-card-body) {
      padding: 20px;
    }

    :deep(.arco-tag-size-medium) {
      font-size: 14px;
    }

    :deep(.arco-input-wrapper) {
      background-color: #fff;
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
    }

    :deep(.arco-avatar) {
      width: 28px;
      height: 28px;
      background-color: #fff;
      border: 1px solid var(--sealblue-6);
      cursor: pointer;

      .arco-icon {
        color: var(--sealblue-6);
        font-weight: normal;
        font-size: 16px;
      }
    }
  }
</style>

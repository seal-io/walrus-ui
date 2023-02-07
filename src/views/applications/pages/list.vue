<template>
  <div class="application-list">
    <filterBox>
      <template #params>
        <!-- <a-select
          v-model="queryParams.tags"
          allow-clear
          multiple
          :max-tag-count="1"
          style="width: 200px"
          :placeholder="$t('applications.list.filter.tag')"
          @change="handleSearch"
        >
          <a-option
            v-for="(item, index) in tagsList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</a-option
          >
          <template #empty><span></span></template>
        </a-select> -->
        <a-input
          v-model="queryParams.name"
          allow-clear
          style="width: 300px"
          :placeholder="$t('applications.list.filter.name')"
          @change="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <!-- <a-button
          type="primary"
          style="margin-left: 15px"
          @click="handleReset"
          >{{ $t('common.button.reset') }}</a-button
        > -->
      </template>
      <template #button-group>
        <a-button type="primary" @click="handleAddApps">{{
          $t('applications.list.button.add')
        }}</a-button>
        <a-button
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDeleteRepo"
          >{{ $t('common.button.delete') }}</a-button
        >
      </template>
    </filterBox>
    <spin-card>
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :loading="loading"
        :data="dataList"
        :pagination="false"
        :bordered="false"
        row-key="id"
        :row-selection="rowSelection"
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '60px' }"
            :title="$t('applications.detail.basic.app')"
            data-index="name"
          >
            <template #cell="{ record }">
              <a-link class="proj-name" @click="handleViewDetail(record)">{{
                record.name
              }}</a-link>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px', maxWidth: '200px' }"
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
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="resourceCount"
            align="center"
            :title="$t('applications.table.list.assets')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="selectors"
            :title="$t('applications.table.list.tags')"
          >
            <template #cell="{ record }">
              <AutoTip
                :tooltip-props="{ content: join(record.selectors, ',') }"
              >
                <span>
                  <a-tag
                    v-for="(val, index) in record.selectors"
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
            :width="220"
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
                <!-- <a-link
                  v-if="record.evaluationStatus === 'finished'"
                  class="link-btn"
                  :class="[lang]"
                  target="_blank"
                  :href="resolvePath(record)"
                  >{{ $t('logs.list.viewReport') }}</a-link
                > -->
                <!-- <a-tag
                  v-else-if="record.evaluationStatus === 'running'"
                  class="link-btn"
                  :class="[lang]"
                  size="small"
                  color="#206ccf"
                  >{{ $t('projects.table.testing') }}</a-tag
                > -->
                <!-- <a-tag
                  v-else-if="record.evaluationStatus === 'error'"
                  class="link-btn"
                  :class="[lang]"
                  size="small"
                  color="#F53F3F"
                  >{{ $t('projects.table.fail') }}</a-tag
                > -->
                <!-- <a-tag
                  v-else
                  class="link-btn"
                  :class="[lang]"
                  size="small"
                  color="#0fc6c2"
                  >{{ $t('projects.table.ready') }}</a-tag
                > -->
                <!-- <span class="from-now-time" :class="[lang]">{{
                  dayjs(record.lastEvaluationTime).locale(lang).fromNow()
                }}</span> -->
              </a-space>
            </template>
          </a-table-column>
          <a-table-column
            :width="100"
            :title="$t('projects.table.operation')"
            align="center"
          >
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="handleEdit(record)">{{
                $t('common.button.edit')
              }}</a-button>
              <!-- <div class="button-wrap">
                <a-dropdown-button size="small">
                  <template #icon>
                    <icon-down style="margin-left: 0" />
                  </template>
                  <a-button
                    type="text"
                    size="small"
                    @click="handleEdit(record)"
                    >{{ $t('common.button.edit') }}</a-button
                  >
                  <template #content>
                    <div class="btn-group-wrap">
                      <a-button
                        :loading="record.loading"
                        :disabled="record.evaluationStatus === 'running'"
                        type="text"
                        size="small"
                        @click="handleScan(record)"
                        >{{ $t('projects.list.scan') }}</a-button
                      >
                    </div>
                  </template>
                </a-dropdown-button>
              </div> -->
            </template>
          </a-table-column>
        </template>
      </a-table>
      <a-pagination
        style="margin-top: 20px"
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
    </spin-card>
  </div>
</template>

<script lang="ts" setup>
  import _, { get, map, join } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, computed } from 'vue';
  import { deleteModal } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import useLoading from '@/hooks/loading';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import filterBox from '@/components/filter-box/index.vue';
  import severityBar from '@/components/severity-bar/index.vue';
  import { scanProject } from '@/api/projects';
  import {
    ListParams,
    TableRowData,
    queryAppsList,
    deleteApps,
    queryResourceTags,
  } from '../api/applications';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { loading, setLoading } = useLoading();
  const { t, locale, router } = useCallCommon();
  const queryParams: ListParams = reactive({
    page: 1,
    perPage: 10,
    name: '',
    tags: [],
  });
  let timer: any = null;
  const dataList = ref<TableRowData[]>([]);
  const tagsList = ref<{ value: string; label: string }[]>([]);
  const total = ref(100);
  const lang = computed(() => {
    return locale.value === 'zh-CN' ? 'zh-cn' : 'en';
  });

  const getResourceTags = async () => {
    const { data } = await queryResourceTags();
    tagsList.value = map(data, (val) => {
      return {
        label: val,
        value: val,
      };
    });
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = _.pickBy(
        queryParams,
        (val: any) => val || val.length
      ) as ListParams;
      const { data } = await queryAppsList(params);
      const list: any = data?.items || [];
      dataList.value = [].concat(list);
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
    queryParams.name = '';
    queryParams.tags = [];
    queryParams.page = 1;
    handleFilter();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    handleFilter();
  };
  const handleEdit = (row) => {
    router.push({
      name: 'applicationsEdit',
      query: {
        id: row.id,
      },
    });
  };
  const handleViewDetail = (row) => {
    console.log({ row });
    router.push({
      name: 'applicationsDetail',
      query: {
        id: row.id,
        versionId: 'latest',
      },
    });
  };
  const handleAddApps = () => {
    router.push({
      name: 'applicationsEdit',
    });
  };
  const handleScan = async (row) => {
    try {
      row.loading = true;
      const { data } = await scanProject(row.id);
      row.loading = false;
      row.evaluationStatus = 'running';
    } catch (error) {
      console.log(error);
      row.loading = false;
    }
  };
  const resolvePath = (row: any) => {
    const path = router.resolve({
      name: 'eventReport',
      query: { id: row.lastEvaluationEventID },
    });
    return path.href;
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val,
        };
      });
      await deleteApps(ids);
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
  const initData = () => {
    fetchData();
    getResourceTags();
  };
  initData();
</script>

<style lang="less">
  .btn-group-wrap {
    display: flex;
    flex-direction: column;
  }
</style>

<style lang="less" scoped>
  .application-list {
    .button-wrap {
      :deep(.arco-btn-secondary) {
        padding: 0 1px;

        .arco-btn-size-small {
          height: 26px;
          padding: 0 10px;
        }
      }
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

      &.zh-cn {
        width: 65px;
      }
    }
  }
</style>

<template>
  <div class="tab-license-wrap">
    <filterBox style="margin-bottom: 5px; padding: 0">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          :placeholder="$t('resource.detail.license.query')"
          @change="handlerSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </template>
    </filterBox>
    <com-card :bordered="false" padding="20px 0px 0">
      <a-table
        column-resizable
        :loading="loading"
        :data="dataList"
        :pagination="false"
        row-key="id"
        @sorter-change="handleSortChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('resource.detail.license.name')"
            data-index="displayName"
          >
            <template #cell="{ record }">
              <span>{{ record.displayName }}</span>
              <a-tag
                v-if="record.deprecated"
                style="margin-left: 4px; color: #f77234"
                color="rgba(247, 114, 52,.2)"
                size="small"
                >{{ $t('license.tablist.deprecated') }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('resource.detail.license.deps')"
            data-index="packageCount"
          >
            <template #cell="{ record }">
              <span>{{ record.packageCount }}</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('resource.detail.license.tags')">
            <template #cell="{ record }">
              <AutoTip :tooltip-props="{ content: getTags(record) }">
                <span v-for="(item, index) in record.details" :key="index">
                  <template v-if="item?.tags?.length">
                    <a-tag
                      v-for="(val, sIndex) in item.tags"
                      :key="sIndex"
                      color="#0DA5AA"
                      size="small"
                      style="margin-right: 4px; padding: 0 4px"
                      >{{ val }}</a-tag
                    >
                  </template>
                </span>
              </AutoTip>
            </template>
          </a-table-column>
          <a-table-column :title="$t('common.button.detail')" align="left">
            <template #cell="{ record }">
              <template v-if="get(record, 'details')?.length">
                <span v-for="(item, index) in record.details" :key="index">
                  <a-tooltip :content="item.name">
                    <a-button
                      :bordered="true"
                      color="#206ccf"
                      size="mini"
                      type="outline"
                      style="
                        max-width: 100px;
                        margin-right: 5px;
                        margin-bottom: 5px;
                        padding: 0 4px;
                        overflow: hidden;
                      "
                      @click="handleView(item.id)"
                      >{{ item.name }}</a-button
                    >
                  </a-tooltip>
                </span>
              </template>
              <!-- <a-button
                  type="text"
                  @click="handleView(record)"
                  >{{ $t('common.button.detail') }}</a-button
                > -->
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
    </com-card>
    <licenseContent
      v-model:show="show"
      :data-info="licenseData"
    ></licenseContent>
  </div>
</template>

<script lang="ts" setup>
  import { each, get, join, pickBy } from 'lodash';
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { UseSortDirection } from '@/utils/common';
  import filterBox from '@/components/filter-box/index.vue';
  import { queryLicenseInfo } from '@/views/license/api';
  import {
    queryResourceLicenses,
    LicenseItem,
    LicenseParams,
  } from '../../api/fix-advice';
  import licenseContent from './license-content.vue';

  const route = useRoute();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: 'name',
    defaultOrder: 'ascend',
  });
  const total = ref<number>(0);
  const { loading, setLoading } = useLoading(true);
  const queryParams = reactive({
    page: 1,
    perPage: 10,
    query: '',
    sort: '',
  });
  const show = ref(false);
  const licenseData = reactive({
    name: '',
    description: '',
    id: '',
    link: '',
  });
  const dataList = ref<LicenseItem[]>([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      let params: any = {
        resourceID: route.query.id,
        version: route.query.versionId,
        ...queryParams,
      };
      params = pickBy(params, (val) => !!val);
      const { data } = await queryResourceLicenses(params);
      dataList.value = data?.items || [];
      total.value = get(data, 'pagination.total') || 0;
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getTags = (record) => {
    if (!record?.details?.length) return '';
    let list = [];
    each(record.details, (item) => {
      list = list.concat(item.tags);
    });
    return join(list, ',');
  };
  const handleFilter = () => {
    fetchData();
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
  const handleView = async (id) => {
    const { data } = await queryLicenseInfo(id);
    Object.assign(licenseData, data);
    setTimeout(() => {
      show.value = true;
    }, 50);
  };
  const handlerSearch = () => {
    console.log('search');
    queryParams.page = 1;
    handleFilter();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    queryParams.sort = sort.value;
    queryParams.page = 1;
    fetchData();
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .tab-license-wrap {
    .arco-input-wrapper {
      background: var(--color-fill-2) !important;
    }
  }
</style>

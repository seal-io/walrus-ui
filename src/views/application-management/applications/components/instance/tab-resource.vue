<template>
  <div class="resource-wrap">
    <a-table
      :loading="loading"
      column-resizable
      hide-expand-button-on-empty
      style="margin-bottom: 10px"
      :bordered="false"
      :data="dataList"
      :row-class="setRowClass"
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
          align="center"
          data-index="type"
          :title="$t('applications.applications.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="module"
          :title="$t('applications.applications.table.module')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>

        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="status.summaryStatus"
          :title="$t('applications.applications.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: get(record, 'status.summaryStatus'),
                text: get(record, 'status.summaryStatus'),
                message: get(record, 'status.summaryStatusMessage'),
                transitioning: get(record, 'status.transitioning'),
                error: get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <!-- <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleEnabled(record)">
                <template #icon><icon-edit /></template>
                {{ $t('common.button.enabled') }}
              </a-link>
              <a-link type="text" size="small" @click="handleDisabled(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                {{ $t('common.button.disabled') }}
              </a-link>
            </a-space>
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
      :hide-on-single-page="
        queryParams.perPage === 10 || queryParams.perPage === -1
      "
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import _, { get, filter, concat } from 'lodash';
  import {
    onMounted,
    ref,
    reactive,
    inject,
    watch,
    nextTick,
    onBeforeUnmount
  } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { createWebsocketInstance } from '@/hooks/use-websocket';
  import { InstanceResource } from '../../config/interface';
  import { websocketEventType } from '../../config';
  import { queryApplicationResource } from '../../api';

  const emits = defineEmits(['updateEndpoint']);
  const instanceId = inject('instanceId', ref(''));
  const websocketInstance = ref<any>(null);
  const total = ref(0);
  const loading = ref(false);
  const queryParams = reactive({
    page: 1,
    perPage: -1
  });
  const dataList = ref<InstanceResource[]>([]);
  const handleEnabled = (row) => {
    console.log(row);
  };
  const handleDisabled = (row) => {
    console.log(row);
  };
  const setRowClass = (record) => {
    if (record.raw.isChilren) {
      return 'row-child';
    }
    return '';
  };
  const setParentDataProperties = (data) => {
    data.isLeaf = !data.components?.length;
    data.isParent = true;
    data.key = data.id;
  };
  const setChildDataProperties = (parent) => {
    setParentDataProperties(parent);
    const children = parent.components || [];
    if (children.length) {
      _.each(children, (data) => {
        data.isLeaf = true;
        data.isChilren = true;
        data.parentId = parent.id;
        data.key = parent.id;
      });
    }
    parent.children = children;
  };

  const setDataList = (list) => {
    return _.map(list, (s) => {
      setChildDataProperties(s);
      return s;
    });
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params = {
        ...queryParams,
        instanceID: instanceId.value
      };
      const { data } = await queryApplicationResource(params);
      let list: any = data?.items || [];
      list = setDataList(list);
      dataList.value = [].concat(list);
      loading.value = false;
    } catch (error) {
      dataList.value = [];
      loading.value = false;
      console.log(error);
    }
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
  const updateDataList = (data) => {
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.instance?.id === instanceId.value
    );

    const childResources = _.filter(collections, (item) =>
      _.get(item, 'composition.id')
    );
    const parentResources = _.filter(
      collections,
      (item) => !_.get(item, 'composition.id')
    );

    // use it only delete action
    let ids = data.ids || [];

    // DELETE
    if (data?.type === websocketEventType.delete) {
      // delete parent resource
      ids = _.filter(ids, (childId) => {
        const updateIndex = _.findIndex(
          dataList.value,
          (sItem) => sItem.id === childId
        );
        if (updateIndex > -1) {
          dataList.value.splice(updateIndex, 1);
        }
        return updateIndex === -1;
      });

      //  delete sub resource
      _.each(ids, (childId) => {
        _.each(dataList.value, (sItem) => {
          const deleteIndex = _.findIndex(
            sItem.components || [],
            (item) => item.id === childId
          );
          if (deleteIndex > -1) {
            sItem.components.splice(deleteIndex, 1);
          }
        });
      });
      dataList.value = setDataList(dataList.value);
      return;
    }

    // CREATE
    if (data?.type === websocketEventType.create) {
      // parent resource
      dataList.value = concat(_.cloneDeep(parentResources), dataList.value);
      // sub resource
      _.each(childResources, (item) => {
        _.each(dataList.value, (pItem) => {
          if (item?.composition?.id === pItem.id) {
            pItem.components = concat(
              _.cloneDeep(item),
              pItem.components || []
            );
          }
        });
      });
      dataList.value = setDataList(dataList.value);
      return;
    }

    // UPDATE
    if (collections.length) {
      setTimeout(() => {
        emits('updateEndpoint');
      }, 100);
    }
    _.each(parentResources, (item) => {
      const updateIndex = _.findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      } else {
        dataList.value = _.concat(_.cloneDeep(item), dataList.value);
      }
    });

    _.each(childResources, (item) => {
      _.each(dataList.value, (pItem) => {
        if (item.composition.id === pItem.id) {
          const updateIndex = _.findIndex(
            pItem.components,
            (cItem) => cItem.id === item.id
          );
          if (updateIndex > -1) {
            const updateItem = _.cloneDeep(item);
            pItem.components[updateIndex] = updateItem;
          } else {
            pItem.components = _.concat(_.cloneDeep(item), pItem.components);
          }
        }
      });
    });
    dataList.value = setDataList(dataList.value);
  };
  const createInstanceListWebsocket = () => {
    try {
      if (websocketInstance.value) return;
      websocketInstance.value = createWebsocketInstance({
        url: `/application-resources`,
        onmessage: updateDataList
      });
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => instanceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
      nextTick(() => {
        createInstanceListWebsocket();
      });
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    console.log('wss unmounted');
    websocketInstance.value?.close?.();
  });
  onMounted(() => {
    console.log('resource');
  });
</script>

<style lang="less" scoped>
  .resource-wrap {
    :deep(.arco-table-cell-inline-icon) {
      margin-right: 6px;
    }

    :deep(.arco-table-tr) {
      background-color: red;

      &.row-child {
        .arco-table-td:first-child {
          .arco-table-cell {
            span:first-child {
              padding-left: 10px !important;
            }
          }
        }
      }
    }
  }
</style>

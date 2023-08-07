<template>
  <div class="resource-wrap">
    <a-table
      :loading="loading"
      column-resizable
      style="margin-bottom: 10px"
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
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="type"
          :title="$t('applications.applications.instance.endpoint')"
        >
          <template #cell="{ record }">
            <a-space
              v-if="record?.endpoints?.length"
              direction="vertical"
              :size="5"
            >
              <a-link
                v-for="(item, index) in record.endpoints"
                :key="index"
                style="line-height: 1"
                :href="
                  includes(item, 'https') || includes(item, 'http')
                    ? item
                    : `http://${item}`
                "
                target="_blank"
                >{{
                  record.resourceSubKind === 'NodePort'
                    ? get(split(item, ':'), 1)
                    : item
                }}</a-link
              >
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import _, { split, get, includes } from 'lodash';
  import {
    onMounted,
    ref,
    reactive,
    inject,
    watch,
    defineExpose,
    onBeforeUnmount,
    nextTick
  } from 'vue';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import usePermissionParams from '@/views/application-management/hooks/use-permission-params';
  import { websocketEventType } from '@/views/config/index';
  import { EndPointRow } from '../../config/interface';
  import { queryInstanceEndpoints } from '../../api';

  const { setChunkRequest } = useSetChunkRequest();
  const permissionParams = usePermissionParams();
  let axiosInstance = createAxiosToken();
  let chunkRequesSource: any = null;
  const serviceId = inject('serviceId', ref(''));
  const loading = ref(false);
  const requestCacheList = ref<number[]>([]);
  const queryParams = reactive({
    page: -1
  });
  const dataList = ref<EndPointRow[]>([]);

  const fetchData = async () => {
    if (!serviceId.value) return;
    axiosInstance?.cancel?.();
    axiosInstance = createAxiosToken();
    try {
      loading.value = true;
      requestCacheList.value.push(1);
      const params = {
        ...queryParams,
        serviceID: serviceId.value
      };
      const { data } = await queryInstanceEndpoints(
        params,
        axiosInstance?.token
      );
      dataList.value = _.map(data || [], (item) => {
        item.id = `${item.moduleName}/${item.name}`;
        return item;
      });
      loading.value = false;
      requestCacheList.value.pop();
    } catch (error) {
      requestCacheList.value.pop();
      dataList.value = [];
      loading.value = !!requestCacheList.value.length;
    }
  };

  const updateChunkedList = (data) => {
    const collections = _.map(data?.collection, (item) => {
      item.id = `${item.moduleName}/${item.name}`;
      return item;
    });

    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      dataList.value = _.concat(collections, dataList.value);
      return;
    }
    // DELETE
    if (data?.type === websocketEventType.DELETE) {
      dataList.value = _.filter(dataList.value, (item) => {
        return !_.find(collections, (sItem) => sItem.id === item.id);
      });
      return;
    }
    // UPDATE
    _.each(collections, (item) => {
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
  };
  const updateHandler = (list: object[]) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  watch(
    () => serviceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
      chunkRequesSource?.cancel?.();
      nextTick(() => {
        chunkRequesSource = setChunkRequest({
          url: `/services/${serviceId.value}/access-endpoint`,
          params: {
            ...permissionParams
          },
          handler: updateHandler,
          beforeReconnect: fetchData
        });
      });
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
  });
</script>

<style></style>

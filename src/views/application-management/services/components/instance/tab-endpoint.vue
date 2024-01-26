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
          :tooltip="{
            position: 'tr'
          }"
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="url"
          :title="$t('applications.applications.instance.endpoint')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                _.startsWith(record.url, 'https') ||
                _.startsWith(record.url, 'http')
              "
              style="line-height: 1"
              :href="record.url"
              target="_blank"
              >{{ record.url }}</a-link
            >
            <span v-else style="padding: 1px 4px">{{ record.url }}</span>
          </template>
        </a-table-column>
      </template>
      <template #empty>
        <result-view
          :loading="loading"
          :title="$t('resource.endpoints.result.title')"
          :subtitle="$t('resource.endpoints.result.subTitle')"
        >
          <template #icon>
            <i class="iconfont icon-endpoints"></i>
          </template>
        </result-view>
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
    onBeforeUnmount,
    nextTick
  } from 'vue';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import { websocketEventType } from '@/views/config/index';
  import { EndPointRow } from '../../config/interface';
  import { ProvideServiceIDKey } from '../../config';
  import {
    queryInstanceEndpoints,
    SERVICE_RESOURCE_API_PREFIX
  } from '../../api';

  const { setChunkRequest } = useSetChunkRequest();
  let axiosInstance = createAxiosToken();
  let chunkRequesSource: any = null;
  const serviceId = inject(ProvideServiceIDKey, ref(''));
  const loading = ref(false);
  const requestCacheList = ref<number[]>([]);

  const dataList = ref<EndPointRow[]>([]);

  const fetchData = async () => {
    if (!serviceId.value) return;
    axiosInstance?.cancel?.();
    axiosInstance = createAxiosToken();
    try {
      loading.value = true;
      requestCacheList.value.push(1);
      const params = {
        serviceID: serviceId.value
      };
      const { data } = await queryInstanceEndpoints(
        params,
        axiosInstance?.token
      );
      dataList.value = data || [];
      loading.value = false;
      requestCacheList.value.pop();
    } catch (error) {
      requestCacheList.value.pop();
      dataList.value = [];
      loading.value = !!requestCacheList.value.length;
    }
  };

  const updateChunkedList = (data) => {
    dataList.value = data?.collection || [];
  };
  const updateHandler = (list: object[]) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  watch(
    () => serviceId.value,
    () => {
      fetchData();
      chunkRequesSource?.cancel?.();
      nextTick(() => {
        chunkRequesSource = setChunkRequest({
          url: `${SERVICE_RESOURCE_API_PREFIX()}/endpoints`,
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

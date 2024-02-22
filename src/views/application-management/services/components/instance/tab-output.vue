<template>
  <div class="output-wrap">
    <a-table
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
          data-index="name"
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="capitalize($t('common.input.type'))"
        >
          <template #title>
            <span class="flex flex-align-center">
              <span>{{ $t('common.table.type') }}</span>
              <a-tooltip :content="$t('operation.templates.detail.type.tips')">
                <icon-info-circle class="mleft-5" />
              </a-tooltip>
            </span>
          </template>
          <template #cell="{ record }">
            <span
              v-if="
                _.isString(
                  _.get(record, ['schema', 'x-walrus-original', 'type'])
                )
              "
              >{{
                _.get(record, ['schema', 'x-walrus-original', 'type'])
              }}</span
            >
            <a-tooltip v-else :content-style="{ maxHeight: '240px' }">
              <template #content>
                <span style="white-space: pre-wrap">{{
                  JSON.stringify(
                    _.get(record, ['schema', 'x-walrus-original', 'type']),
                    null,
                    2
                  )
                }}</span>
              </template>
              <span>{{
                _.get(record, ['schema', 'x-walrus-original', 'type', '0'])
              }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="value"
          :title="capitalize($t('common.input.value'))"
        >
          <template #cell="{ record }">
            <AutoTip
              :tooltip-props="{ style: 'white-space: pre', position: 'tr' }"
            >
              <span>{{ record.sensitive ? '******' : record.value }}</span>
            </AutoTip>
          </template>
        </a-table-column>
      </template>
      <template #empty>
        <result-view
          :loading="loading"
          :title="$t('resource.outputs.result.title')"
          subtitle=""
        >
          <template #icon>
            <i
              class="iconfont icon-variable"
              style="font-weight: 500; font-size: 24px"
            ></i>
          </template>
        </result-view>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import _, { capitalize } from 'lodash';
  import { onMounted, ref, inject, watch, nextTick } from 'vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { websocketEventType } from '@/views/config';
  import { queryInstanceOutputs, SERVICE_RESOURCE_API_PREFIX } from '../../api';
  import { OutputsRow } from '../../config/interface';
  import { ProvideServiceIDKey } from '../../config';

  const { setChunkRequest } = useSetChunkRequest();
  const serviceId = inject(ProvideServiceIDKey, ref(''));
  const dataList = ref<OutputsRow[]>([]);
  const loading = ref(false);
  let chunkRequestSource: any = null;

  const fetchData = async () => {
    if (!serviceId.value) {
      return;
    }
    try {
      loading.value = true;
      const { data } = await queryInstanceOutputs({ id: serviceId.value });
      dataList.value = _.map(data || [], (o) => {
        const item = _.cloneDeep(o);
        item.id = `${item.moduleName}/${item.name}`;
        return item;
      });
      loading.value = false;
    } catch (error) {
      //
      loading.value = false;
    }
  };
  const updateChunkedList = (data) => {
    const collections = _.map(data?.collection, (o) => {
      const item = _.cloneDeep(o);
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
      fetchData();
      chunkRequestSource?.cancel?.();
      nextTick(() => {
        chunkRequestSource = setChunkRequest({
          url: `${SERVICE_RESOURCE_API_PREFIX()}/outputs`,
          handler: updateHandler,
          beforeReconnect: fetchData
        });
      });
    },
    {
      immediate: true
    }
  );
</script>

<style></style>

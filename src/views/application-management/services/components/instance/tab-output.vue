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
            <span>{{ $t('common.table.type') }}</span>
            <a-tooltip :content="$t('operation.templates.detail.type.tips')">
              <icon-info-circle class="mleft-5" />
            </a-tooltip>
          </template>
          <template #cell="{ record }">
            <span
              v-if="_.isString(_.get(record, ['x-walrus-original', 'type']))"
              >{{ _.get(record, ['x-walrus-original', 'type']) }}</span
            >
            <a-tooltip v-else :content-style="{ maxHeight: '240px' }">
              <template #content>
                <span style="white-space: pre-wrap">{{
                  JSON.stringify(
                    _.get(record, ['x-walrus-original', 'type']),
                    null,
                    2
                  )
                }}</span>
              </template>
              <span>{{
                _.get(record, ['x-walrus-original', 'type', '0'])
              }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="value"
          :title="capitalize($t('common.input.value'))"
        >
          <template #cell="{ record }">
            <span>{{ record.sensitive ? '******' : record.value }}</span>
          </template>
        </a-table-column>
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
  let chunkRequesSource: any = null;
  const fetchData = async () => {
    try {
      const { data } = await queryInstanceOutputs({ id: serviceId.value });
      dataList.value = _.map(data || [], (item) => {
        item.id = `${item.moduleName}/${item.name}`;
        return item;
      });
    } catch (error) {
      //
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
      fetchData();
      chunkRequesSource?.cancel?.();
      nextTick(() => {
        chunkRequesSource = setChunkRequest({
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
  onMounted(() => {
    // fetchData();
  });
</script>

<style></style>

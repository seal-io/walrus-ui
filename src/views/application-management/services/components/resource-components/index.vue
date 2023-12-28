<template>
  <div id="resource-wrap" class="resource-wrap">
    <!-- <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model="query"
          :placeholder="$t('applications.instance.tab.resource.holder')"
          allow-clear
          style="width: 260px"
          @clear="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </template>
      <template #button-group>
        <slot name="right"></slot>
      </template>
    </FilterBox> -->
    <a-spin :loading="loading" style="width: 100%">
      <div class="list">
        <div v-if="componentList.length">
          <RowItem
            v-for="(item, index) in componentList"
            :key="index"
            :row-data="item"
          >
            <template #status="{ record }">
              <span v-if="!_.get(record, 'status.summaryStatus')">-</span>
              <StatusLabel
                v-else
                :status="{
                  status: _.get(record, 'status.summaryStatus'),
                  text: _.get(record, 'status.summaryStatus'),
                  message: _.get(record, 'status.summaryStatusMessage'),
                  transitioning: _.get(record, 'status.transitioning'),
                  error: _.get(record, 'status.error'),
                  inactive: _.includes(
                    StartableStatus,
                    _.get(record, 'status.summaryStatus')
                  )
                }"
              ></StatusLabel>
            </template>
            <template #actions="{ record }">
              <a-space :size="20">
                <a-tooltip
                  v-if="resourceLoggable(record)"
                  :content="$t('common.button.logs')"
                >
                  <a-link
                    type="text"
                    size="small"
                    @click="
                      handleViewLogs({
                        ...record,
                        resourceID: record.resource?.id
                      })
                    "
                  >
                    <icon-font type="icon-rizhi" style="font-size: 16px" />
                  </a-link>
                </a-tooltip>
                <a-tooltip
                  v-if="resourceExecutable(record)"
                  :content="$t('applications.instance.tab.term')"
                >
                  <a-link
                    type="text"
                    size="small"
                    @click="
                      handleConnectTerminal({
                        ...record,
                        resourceID: record.resource?.id
                      })
                    "
                  >
                    <icon-code-square class="size-16" />
                  </a-link>
                </a-tooltip>
              </a-space>
            </template>
          </RowItem>
          <div
            v-if="!showMore && dataList.length > 10"
            class="flex flex-align-center flex-justify-center m-t-20"
            @click.stop="handleShowMore"
          >
            <a-link>{{ $t('common.button.more') }}<icon-double-down /></a-link
          ></div>
        </div>
        <div v-else class="empty">
          <a-empty></a-empty>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    PropType,
    ref,
    computed,
    watchEffect,
    onMounted,
    nextTick
  } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { ServiceResource } from '../../config/interface';
  import { getResourceKeyList } from '../../config/utils';
  import useFetchResource from '../hooks/use-fetch-chunk-data';
  import { StartableStatus } from '../../config';
  import RowItem from './row-item.vue';

  const props = defineProps({
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const { loading, fetchData, createResourceChunkRequest, dataList } =
    useFetchResource();

  const emits = defineEmits(['logs', 'terminal']);

  const query = ref('');
  const expandedKeys = ref<string[]>([]);
  const showMore = ref(false);

  const componentList = computed(() => {
    let result: ServiceResource[] = [];
    if (!query.value) {
      result = _.cloneDeep(dataList.value);
    } else {
      const list = _.map(dataList.value, (o) => {
        const item = _.cloneDeep(o);
        item.children = _.filter(item.children, (sItem) =>
          _.includes(sItem.name, query.value)
        );
        return item;
      });
      result = _.filter(list, (cItem) => {
        return _.includes(cItem.name, query.value) || cItem?.children?.length;
      }) as ServiceResource[];
    }

    return showMore.value ? result : _.take(result, 10);
  });

  const handleShowMore = () => {
    showMore.value = true;
  };
  const handleConnectTerminal = (data) => {
    emits('terminal', data);
  };

  const handleViewLogs = (data) => {
    emits('logs', data);
  };

  const setExpandedKeys = () => {
    if (!query.value) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = _.map(
        _.filter(dataList.value, (item) => !!item.children?.length),
        (sItem) => sItem.key
      );
    }
  };
  const setRowClass = (record) => {
    if (record.raw.isChilren) {
      return 'row-child';
    }
    return '';
  };
  const handleSearch = () => {};
  const handleExpandedChange = (keys) => {
    expandedKeys.value = keys;
  };

  const resourceLoggable = (row) => {
    const loggableList = getResourceKeyList({ ...row }, 'loggable');

    return !!loggableList.length;
  };
  const resourceExecutable = (row) => {
    const execList = getResourceKeyList({ ...row }, 'executable');
    return !!execList.length;
  };

  watchEffect(() => {
    setExpandedKeys();
  });
  fetchData();
  onMounted(() => {
    nextTick(() => {
      createResourceChunkRequest();
    });
  });
</script>

<style lang="less" scoped>
  .resource-wrap {
    // .list {
    //   border-top: 1px dotted var(--color-border-3);
    // }
    :deep(.arco-table-cell-inline-icon) {
      margin-right: 6px;
    }

    :deep(.arco-icon) {
      &.icon-node {
        color: var(--color-text-2);
      }
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

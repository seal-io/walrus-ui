<template>
  <div id="resource-wrap" class="resource-wrap">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="query"
          :placeholder="$t('applications.instance.tab.resource.holder')"
          allow-clear
          style="width: 240px"
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
    </FilterBox>
    <a-table
      :loading="isLoading"
      column-resizable
      hide-expand-button-on-empty
      style="margin-bottom: 10px"
      :bordered="false"
      :data="dataList"
      :expanded-keys="expandedKeys"
      :row-class="setRowClass"
      :pagination="false"
      @expanded-change="handleExpandedChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :width="240"
          data-index="name"
          :title="$t('common.table.name')"
        >
          <template #cell="{ record }">
            <icon-font
              v-if="_.get(record, 'composition.id')"
              type="icon-node"
              class="mright-5 icon-node"
            ></icon-font>
            <span>{{ record.name }}</span>
          </template>
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
            <span v-if="!_.get(record, 'status.summaryStatus')">-</span>
            <StatusLabel
              v-else
              :status="{
                status: _.get(record, 'status.summaryStatus'),
                text: _.get(record, 'status.summaryStatus'),
                message: _.get(record, 'status.summaryStatusMessage'),
                transitioning: _.get(record, 'status.transitioning'),
                error: _.get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column align="center" :title="$t('common.table.operation')">
          <template #cell="{ record }">
            <a-space :size="20">
              <a-tooltip
                v-if="resourceLoggable(record)"
                :content="$t('common.button.logs')"
              >
                <a-link
                  type="text"
                  size="small"
                  @click="
                    handleViewLogs({ ...record, serviceID: record.service?.id })
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
                      serviceID: record.service?.id
                    })
                  "
                >
                  <icon-code-square class="size-16" />
                </a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <resourceControl
      v-model:visible="terminalShow"
      v-model:tabs="drawerTabs"
      :type="modalType"
      :update-active="updateActive"
      @delete="handleTerminalDelete"
    >
    </resourceControl>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import _ from 'lodash';
  import { PropType, ref, computed, watchEffect } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { ConnectorCategory } from '@/views/operation-hub/connectors/config';
  import FilterBox from '@/components/filter-box/index.vue';
  import { ServiceResource } from '../../config/interface';
  import { getResourceKeyList } from '../../config/utils';
  import resourceControl from './resource-control.vue';
  import useResourceControl from '../hooks/use-resource-control';

  const props = defineProps({
    resourceList: {
      type: Array as PropType<ServiceResource[]>,
      default() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const {
    modalType,
    drawerTabs,
    terminalShow,
    updateActive,
    handleViewLogs,
    handleConnectTerminal,
    handleTerminalDelete
  } = useResourceControl();
  const query = ref('');
  const expandedKeys = ref<string[]>([]);

  const dataList = computed(() => {
    if (!query.value) {
      return _.cloneDeep(props.resourceList);
    }
    const list = _.map(props.resourceList, (o) => {
      const item = _.cloneDeep(o);
      item.children = _.filter(item.children, (sItem) =>
        _.includes(sItem.name, query.value)
      );
      return item;
    });
    const result = _.filter(list, (cItem) => {
      return _.includes(cItem.name, query.value) || cItem?.children?.length;
    });

    return result as ServiceResource[];
  });

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
</script>

<style lang="less" scoped>
  .resource-wrap {
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

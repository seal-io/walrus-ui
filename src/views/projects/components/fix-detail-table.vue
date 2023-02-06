<template>
  <div class="fix-detail-table-wrap">
    <a-table
      column-resizable
      :data="dataList"
      :pagination="false"
      :bordered="true"
      style="margin-top: 10px"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :title="$t('projects.fixdetail.table.vulner')"
          data-index="namespace"
        >
          <template #cell="{ record }">
            <span>{{
              record.namespace
                ? `${record.namespace}/${record.name}`
                : record.name
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px', maxWidth: '320px' }"
          :title="$t('projects.table.description')"
          data-index="description"
        >
          <template #cell="{ record }">
            <span>{{ record?.description }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px', maxWidth: '220px' }"
          :title="$t('projects.fixdetail.table.fromdeps')"
          data-index="object"
        >
          <template #cell="{ record }">
            <span>{{
              record.isFromDeps
                ? record.depsPkgName
                : $t('projects.fixdetail.table.fromself')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :title="$t('projects.fixdetail.table.severity')"
          data-index="severity"
          align="center"
        >
          <template #cell="{ record }">
            <a-tag
              size="small"
              :color="`rgba(${get(
                severityColorValueMap,
                toLower(record.overall.severity)
              )}, 0.8)`"
              class="s-tag sev-tag"
              >{{
                $t(get(severityMaps, toLower(record.overall.severity)) || '')
              }}</a-tag
            >
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          :title="$t('resource.detail.table.affect')"
        >
          <template #cell="{ record }">
            <span>{{ record.affected }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :title="$t('projects.resource.tabfix.patchedversion')"
          data-index="patched"
        >
        </a-table-column>
        <a-table-column
          :title="$t('projects.fixdetail.table.score')"
          data-index="score"
          align="center"
        >
          <template #cell="{ record }">
            <span>{{ get(record, 'overall.score') }}</span>
          </template>
        </a-table-column>
        <a-table-column
          :width="130"
          :title="$t('projects.fixdetail.table.publishDate')"
          data-index="modified"
        >
          <template #cell="{ record }">
            <span>{{ dayjs(record.modified).format('YYYY-MM-DD') }}</span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import dayjs from 'dayjs';
  import { get, toLower } from 'lodash';
  import {
    riskColorMap,
    severityMaps,
    severityColorValueMap,
  } from '@/config/global';
  import { FixVulnerItem } from '../api/fix-advice';

  defineProps({
    dataList: {
      type: Array as PropType<FixVulnerItem[]>,
      default() {
        return [];
      },
    },
  });
</script>

<style></style>

<template>
  <!-- for fix table -->
  <div class="simple-table-wrap">
    <a-card class="general-card q-s-w-card">
      <a-table
        column-resizable
        :loading="loading"
        :bordered="{ headerCell: false }"
        :data="dataList"
        :pagination="false"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="name"
            :title="$t('sbom.table.name')"
          >
            <template #cell="{ record }">
              <span>{{ get(record, 'softwarePackage.name') }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="version"
            :title="$t('projects.resource.tabfix.version')"
          >
            <template #cell="{ record }">
              <span class="version-wrap">
                <span>{{ get(record, 'softwarePackage.from.version') }}</span>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('projects.resource.tabfix.release')"
            ellipsis
            tooltip
            :width="120"
          >
            <template #cell="{ record }">
              <span>{{
                get(record, 'softwarePackage.from.releaseTime')
                  ? dayjs(
                      get(record, 'softwarePackage.from.releaseTime')
                    ).format('YYYY-MM-DD')
                  : '-'
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :width="100"
            :title="$t('projects.resource.tabfix.vulner')"
            align="center"
          >
            <template #cell="{ record }">
              <span>{{
                add(
                  get(record, 'softwarePackage.from.vulnerabilities.total'),
                  get(
                    record,
                    'softwarePackage.from.dependencyVulnerabilities.vulnerabilitySummary.total'
                  )
                )
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            :title="$t('projects.table.description')"
            align="center"
          >
            <template #cell="{ record }">
              <span>{{
                get(
                  (get(record, 'softwarePackage.reason') || '').match(pkgReg),
                  '0'
                )
                  ? $t(
                      getIncomptableReason(
                        incompatibleReasonList,
                        get(record, 'softwarePackage.reason')
                      ),
                      {
                        pkg: get(
                          (get(record, 'softwarePackage.reason') || '').match(
                            pkgReg
                          ),
                          '0'
                        ),
                      }
                    )
                  : $t(
                      getIncomptableReason(
                        incompatibleNoUpgradeReasonList,
                        get(record, 'softwarePackage.reason')
                      )
                    )
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :width="100"
            data-index="packageManageFilePath"
            :title="$t('projects.resource.tabfix.filePath')"
          >
          </a-table-column>
          <a-table-column
            :width="160"
            align="center"
            :title="$t('sbom.table.operation')"
          >
            <template #cell="{ record }">
              <a-button type="text" @click="handleToFixDetail(record)">
                {{ $t('common.button.detail') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { get, add } from 'lodash';
  import { PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { FixAdviceItem } from '../../api/fix-advice';
  import {
    getIncomptableReason,
    incompatibleReasonList,
    incompatibleNoUpgradeReasonList,
  } from '../../config';

  defineProps({
    dataList: {
      type: Array as PropType<FixAdviceItem[]>,
      default() {
        return [];
      },
    },
    bordered: {
      type: Boolean,
      default() {
        return true;
      },
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  });
  const compatibilityMap = {
    high: 'projects.risk.high',
    medium: 'projects.risk.middle',
    low: 'projects.risk.low',
  };
  const { route, router } = useCallCommon();
  const pkgReg = /(?<=upgrading\s+).+(?=,)/gi;
  const handleToFixDetail = (row) => {
    router.push({
      name: 'fixDetail',
      query: {
        id: row.id,
        repositoryID: route.query.id,
        version: route.query.versionId,
      },
    });
  };
</script>

<style lang="less">
  .arco-trigger-content.arco-tooltip-content.summary-content {
    box-sizing: border-box;
    max-width: 430px;

    .arco-collapse-item-header {
      padding: 5px 0;
      background-color: transparent;
    }

    .arco-collapse-item-content {
      padding-right: 5px;
      padding-left: 5px;
      background-color: transparent;
    }
  }
</style>

<style lang="less" scoped>
  .simple-table-wrap {
    // padding: 10px;
    // background: var(--color-fill-2);
    .general-card {
      :deep(.arco-card-body) {
        padding: 10px;

        .arco-tag.c-tag {
          border-radius: 0;
        }
      }
    }

    .version-wrap {
    }
  }
</style>

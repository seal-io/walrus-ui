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
            :title="$t('resource.detail.tabfix.version')"
          >
            <template #cell="{ record }">
              <span class="version-wrap">
                <span>{{ get(record, 'softwarePackage.from.version') }}</span>
                <a-tooltip>
                  <template #content>
                    <div>{{
                      $t('projects.resource.tabfix.currentVersion')
                    }}</div>
                    <span>{{ $t('projects.resource.tabfix.release') }}:</span>
                    <span>{{
                      dayjs(
                        get(record, 'softwarePackage.from.releaseTime')
                      ).format('YYYY-MM-DD')
                    }}</span>
                  </template>
                  <icon-info-circle-fill
                    style="margin-left: 2px; color: #206ccf; font-size: 14px"
                  />
                </a-tooltip>
              </span>
              <IconFont
                v-if="get(record, 'isFixable')"
                type="icon-jinrujiantou"
                style="
                  margin: 0 4px;
                  color: #23c343;
                  font-size: 20px;
                  vertical-align: -4px;
                "
              ></IconFont>
              <span v-if="get(record, 'isFixable')" class="version-wrap">
                <span>{{ get(record, 'softwarePackage.to.version') }}</span>
                <a-tooltip>
                  <template #content>
                    <div>{{ $t('projects.resource.tabfix.patchVersion') }}</div>
                    <span>{{ $t('projects.resource.tabfix.release') }}:</span>
                    <span>{{
                      dayjs(
                        get(record, 'softwarePackage.to.releaseTime')
                      ).format('YYYY-MM-DD')
                    }}</span>
                  </template>
                  <icon-info-circle-fill
                    style="margin-left: 2px; color: #206ccf; font-size: 14px"
                  />
                </a-tooltip>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
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
              <IconFont
                v-if="get(record, 'isFixable')"
                type="icon-jinrujiantou"
                style="
                  margin: 0 4px;
                  color: #23c343;
                  font-size: 20px;
                  vertical-align: -4px;
                "
              ></IconFont>
              <span v-if="get(record, 'isFixable')">{{
                add(
                  get(record, 'softwarePackage.to.vulnerabilities.total'),
                  get(
                    record,
                    'softwarePackage.to.dependencyVulnerabilities.vulnerabilitySummary.total'
                  )
                )
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            :width="120"
            :title="$t('projects.resource.tabfix.compatibility')"
            align="center"
          >
            <template #cell="{ record }">
              <div v-if="get(record, 'isFixable')">
                <a-tooltip
                  v-if="get(record, 'compatibilityDetail.summary')"
                  content-class="summary-content"
                  background-color="#FDF4BF"
                >
                  <a-badge
                    :max-count="10"
                    dot
                    :count="
                      keys(record?.compatibilityDetail?.minorDifferences)
                        .length +
                        keys(record?.compatibilityDetail?.majorDifferences)
                          .length || 1
                    "
                    :dot-style="{
                      height: '8px',
                      width: '8px',
                    }"
                  >
                    <span style="padding: 5px 5px; background: none">
                      <a-tag
                        class="c-tag"
                        size="small"
                        :color="
                          get(compatibilityColor, record.compatibilityLevel)
                        "
                        >{{
                          $t(
                            get(compatibilityMap, record.compatibilityLevel) ||
                              ''
                          )
                        }}</a-tag
                      >
                    </span>
                  </a-badge>
                  <template #content>
                    <div>
                      <!-- <a-link>{{get(record, 'compatibilityDetail.summary')}}</a-link> -->
                      <a-collapse
                        :bordered="false"
                        style="background: transparent"
                      >
                        <a-collapse-item
                          key="summary--1"
                          :show-expand-icon="false"
                        >
                          <template #header>
                            <a-link
                              ><icon-unordered-list />
                              {{ getCompatbleInfo(record) }}</a-link
                            >
                          </template>
                          <strong
                            v-if="
                              keys(
                                record?.compatibilityDetail?.majorDifferences
                              ).length
                            "
                            >Major Version Differences:</strong
                          >
                          <div
                            v-for="key in keys(
                              record?.compatibilityDetail?.majorDifferences
                            )"
                            :key="key"
                            style="text-indent: 10px"
                          >
                            <strong>{{ key }}:</strong>
                            <span>{{
                              get(
                                record?.compatibilityDetail?.majorDifferences,
                                `${key}`
                              )
                            }}</span>
                          </div>
                          <a-divider
                            v-if="
                              keys(
                                record?.compatibilityDetail?.minorDifferences
                              ).length &&
                              keys(
                                record?.compatibilityDetail?.majorDifferences
                              ).length
                            "
                            style="margin: 10px 0"
                          ></a-divider>
                          <strong
                            v-if="
                              keys(
                                record?.compatibilityDetail?.minorDifferences
                              ).length
                            "
                            style="margin-top: 15px"
                            >Minor Version Differences:</strong
                          >
                          <div
                            v-for="key in keys(
                              record?.compatibilityDetail?.minorDifferences
                            )"
                            :key="key"
                            style="text-indent: 15px"
                          >
                            <strong>{{ key }}:</strong>
                            <span>{{
                              get(
                                record?.compatibilityDetail?.minorDifferences,
                                `${key}`
                              )
                            }}</span>
                          </div>
                        </a-collapse-item>
                      </a-collapse>
                    </div>
                  </template>
                </a-tooltip>
                <a-tag
                  v-else
                  class="c-tag"
                  size="small"
                  :color="get(compatibilityColor, record.compatibilityLevel)"
                  >{{
                    $t(get(compatibilityMap, record.compatibilityLevel) || '')
                  }}</a-tag
                >
              </div>
              <span v-else>{{ $t('common.data.none') }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
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
  import { get, keys, includes, add } from 'lodash';
  import { PropType } from 'vue';
  import { compatibilityColor } from '@/config/global';
  import useCallCommon from '@/hooks/use-call-common';
  import severityBar from '@/components/severity-bar/index.vue';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import { FixAdviceItem } from '../../api/fix-advice';
  import { compatibleDescMap } from '../../config';

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
  const { route, router, t } = useCallCommon();
  const getCompatbleInfo = (record) => {
    const majorDifferences = get(
      record,
      'compatibilityDetail.majorDifferences'
    );
    const minorDifferences = get(
      record,
      'compatibilityDetail.minorDifferences'
    );
    if (includes(get(record, 'compatibilityDetail.summary'), 'Breaking')) {
      return t(compatibleDescMap['breaking']);
    }
    if (includes(get(record, 'compatibilityDetail.summary'), 'incompatible')) {
      return keys(majorDifferences).length
        ? t(compatibleDescMap['incompatible'], {
            num: keys(majorDifferences).length,
          })
        : t(compatibleDescMap['incompatible'], {
            num: keys(minorDifferences).length,
          });
    }
    if (includes(get(record, 'compatibilityDetail.summary'), 'different')) {
      return keys(majorDifferences).length
        ? t(compatibleDescMap['different'], {
            num: keys(majorDifferences).length,
          })
        : t(compatibleDescMap['different'], {
            num: keys(minorDifferences).length,
          });
    }
    return '';
  };
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

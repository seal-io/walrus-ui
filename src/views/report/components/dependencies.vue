<template>
  <div>
    <a-card class="general-card q-s-w-card" :bordered="true">
      <template #title>
        <div class="violation-title-wrap">
          <div class="card-title" :size="5" fill>
            <div>
              <div class="vulner-title" style="margin-bottom: 8px">
                <span>{{ artifactName }}</span>
                <a-tag
                  v-if="get(issuesData, 'dismissInfo.dismissed')"
                  size="small"
                  class="ignore-tag"
                  >{{ $t('report.detail.ignore.ignored') }}</a-tag
                >
              </div>
              <a-space class="vulner-desc" :size="20" fill>
                <a-space fill :size="20">
                  <span
                    >{{ $t('report.detail.namespace') }}:
                    <span>{{ vulnerabilityInfo.namespace }}</span></span
                  >
                  <span
                    >{{ $t('report.detail.vulnerability') }}:
                    <span>{{ vulnerabilityInfo.name }}</span>
                    <a-tag
                      v-if="vulnerabilityInfo.deprecated"
                      color="#F77234"
                      size="small"
                      style="margin-left: 4px"
                      >{{ $t('report.detail.deprecated') }}</a-tag
                    >
                  </span>
                  <span
                    >CVSS:
                    <span v-if="!get(vulnerabilityInfo, 'cvss.vectorString')">{{
                      $t('common.data.none')
                    }}</span>
                    <span
                      v-else-if="get(vulnerabilityInfo, 'cvss.baseScore') > 0"
                      >{{ get(vulnerabilityInfo, 'cvss.baseScore') }}</span
                    >
                  </span>
                  <span v-if="violationType"
                    >{{ $t('projects.resource.violation.type') }}:
                    <span class="violation-type">{{
                      violationType
                    }}</span></span
                  >
                </a-space>
              </a-space>
            </div>
          </div>
          <a-tooltip>
            <template #content>
              <cvssPopup :vulnerability-info="vulnerabilityInfo"></cvssPopup>
            </template>
            <a-tag
              :color="getSeverityColor(severityMap, issuesData.severity)"
              class="seal-tag severity-info"
            >
              {{ $t(severityMaps[toLower(issuesData.severity)] || '') }}
            </a-tag>
          </a-tooltip>
        </div>
      </template>
      <div class="violation-content-wrap">
        <div v-if="showIgnore" class="action-group">
          <actionButtonGroup
            :issues-data="issuesData"
            @create-jira="
              handleCreateJiraTicket(issuesData, {
                title: artifactName,
              })
            "
            @create="
              handleEditAction(issuesData, {
                action: 'create',
                title: artifactName,
              })
            "
            @update="
              handleEditAction(issuesData, {
                action: 'update',
                title: artifactName,
              })
            "
            @reset="handleResetAction(issuesData)"
          >
          </actionButtonGroup>
        </div>
        <div class="info">
          <span>
            <span class="title">{{ $t('report.detail.fixed') }}:</span>
            <span class="val">{{
              get(vulnerabilityInfo, 'patched')?.length
                ? join(get(vulnerabilityInfo, 'patched'), ',')
                : $t('report.detail.nofixed')
            }}</span>
          </span>
          <span>
            <span class="title">{{ $t('report.detail.modified') }}:</span>
            <span class="val">{{
              dayjs(get(vulnerabilityInfo, 'modified')).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }}</span>
          </span>
        </div>
        <div>
          <div class="title sm">{{ $t('report.detail.description') }}</div>
          <div
            style="line-height: 1.5"
            class="description"
            :class="{ 'active-desc': activeKey.includes('1') }"
            v-html="mdParse(vulnerabilityInfo.description)"
          ></div>
        </div>
        <div class="basic-info-wrap">
          <div class="m-title title">{{ $t('report.detail.vulnerLink') }}</div>
          <div>
            <div v-if="vulnerabilityInfo?.references?.length">
              <div>
                <a-link
                  class="extenal-link"
                  :href="get(vulnerabilityInfo, 'references.0')"
                  target="_blank"
                  >{{ get(vulnerabilityInfo, 'references.0') }}</a-link
                >
              </div>
              <div v-show="tailLinkList.length && activeKey.includes('1')">
                <div v-for="(item, index) in tailLinkList" :key="index">
                  <a-link :href="item" target="_blank" class="extenal-link">{{
                    item
                  }}</a-link>
                </div>
              </div>
            </div>
            <div class="resource-expand-wrap">
              <div v-if="showResourceUrl">
                <div class="sm title">{{
                  $t('projects.resource.list.title')
                }}</div>
                <div class="resource-wrap">
                  <ProviderIcon
                    :provider="resourceInfo?.provider"
                  ></ProviderIcon>
                  <a-link @click="handleViewResourceDetail(resourceInfo.id)">{{
                    resourceInfo?.fullName
                  }}</a-link>
                </div>
              </div>
              <div class="expand-btn-wrap">
                <icon-double-down
                  :class="{ expanded: activeKey.includes('1') }"
                  class="expand-btn"
                  @click="handleToggleExpand"
              /></div>
            </div>
          </div>
        </div>
        <a-collapse
          v-model:activeKey="activeKey"
          :bordered="false"
          style="margin-top: 10px"
        >
          <a-collapse-item key="1" :show-expand-icon="false">
            <template #header>
              <div v-show="showBtn" ref="expandTrigger"
                ><icon-double-down
              /></div>
            </template>
            <a-space direction="vertical" fill>
              <div v-if="get(issuesData, 'dismissInfo.dismissed')">
                <div class="title">{{ $t('report.detail.ignore.title') }}</div>
                <a-descriptions
                  :data="ignoreDetailInfo"
                  :column="3"
                  :bordered="true"
                >
                  <template #label="{ label }">
                    <span>{{ $t(label) }}</span>
                  </template>
                </a-descriptions>
              </div>
              <div v-if="issuesData?.vulnerability?.cvss?.baseScore > -1">
                <div class="title">{{ $t('report.detail.cvssScore') }}</div>
                <a-table :bordered="true" :data="cvssData" :pagination="false">
                  <template #columns>
                    <a-table-column
                      :title="$t('report.detail.version')"
                      data-index="version"
                    ></a-table-column>
                    <a-table-column
                      :title="$t('report.detail.baseScore')"
                      data-index="baseScore"
                    ></a-table-column>
                    <a-table-column :title="$t('report.detail.scoreDetail')">
                      <template #cell="{ record }">
                        <a-space :size="20">
                          <span>
                            <span style="margin-right: 5px; font-weight: 500"
                              >{{ $t('report.detail.exploScore') }}:</span
                            >
                            <span style="display: inline-block; width: 30px">{{
                              record.exploitabilityScore
                            }}</span></span
                          >
                          <span>
                            <span style="margin-right: 5px; font-weight: 500"
                              >{{ $t('report.detail.impactScore') }}:</span
                            >
                            <span style="display: inline-block; width: 30px">{{
                              record.impactScore
                            }}</span></span
                          >
                        </a-space>
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </div>
              <div>
                <div class="title">{{ $t('report.detail.artifact') }}</div>
                <a-descriptions
                  :data="artifactData"
                  :column="4"
                  :bordered="true"
                >
                  <template #label="{ label }">
                    <span>{{ $t(label) }}</span>
                  </template>
                </a-descriptions>
              </div>
              <div>
                <div class="title">{{
                  $t('report.detail.policyViolation')
                }}</div>
                <a-descriptions
                  :data="policyData"
                  layout="vertical"
                  :bordered="true"
                >
                  <template #label="{ label }">
                    <span>{{ $t(label) }}</span>
                  </template>
                  <template #value="{ data, value }">
                    <span v-if="data.languageShow">{{ $t(value) }}</span>
                    <span v-else>{{ value }}</span>
                  </template>
                </a-descriptions>
              </div>
            </a-space>
          </a-collapse-item>
        </a-collapse>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { PackageURL } from 'packageurl-js';
  import { toLower, get, cloneDeep, tail, join, round } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { tableListRow } from '@/api/projects';
  import { useLocaleKey } from '@/utils/func';
  import { PropType, reactive, computed, ref } from 'vue';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import { getValueOnConfigs } from '@/utils/validate';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import {
    artifactConfig,
    policyDataConfig,
    severityMaps,
    getViolationLabel,
  } from '../configs';
  import useReportFunc, { useMd2Html } from '../hooks/use-report-func';
  import useIgnoreModal from '../hooks/use-ignore-modal';
  import actionButtonGroup from './action-button-group.vue';
  import { issuesItem } from '../api/report';
  import cvssPopup from './cvss-popup.vue';

  const props = defineProps({
    title: {
      type: String,
      default() {
        return '';
      },
    },
    resourceList: {
      type: Array as PropType<tableListRow[]>,
      default() {
        return [];
      },
    },
    showResourceUrl: {
      type: Boolean,
      default() {
        return false;
      },
    },
    typeList: {
      type: Object,
      default() {
        return {};
      },
    },
    violationType: {
      type: String,
      default() {
        return '';
      },
    },
    issuesData: {
      type: Object,
      default() {
        return {};
      },
    },
    showIgnore: {
      type: Boolean,
      default() {
        return true;
      },
    },
  });

  const severityMap = {
    high: '#ff5722',
    medium: '#ff7d00',
    low: '#ffb400',
  };
  const vulnerSeverityMaps = {
    critical: 'report.detail.critical',
    high: 'report.detail.high',
    medium: 'report.detail.medium',
    low: 'report.detail.low',
  };
  const vulnerSeverityMap = {
    critical: '#f53f3f',
    high: '#ff5722',
    medium: '#ff7d00',
    low: '#ffb400',
  };
  type keysActive = string | number;
  const emits = defineEmits([
    'refresh',
    'editIgnore',
    'resetIgnore',
    'createJira',
  ]);
  const { handleEditAction, handleResetAction, handleCreateJiraTicket } =
    useIgnoreModal(emits);
  const { ignoreDetailInfo, resourceInfo, handleViewResourceDetail } =
    useReportFunc(props);
  const { t } = useI18n();
  const { localeKey } = useLocaleKey();
  const expandTrigger = ref();
  const showBtn = ref(false);
  const activeKey = ref<keysActive[]>(['2']);
  const { mdParse } = useMd2Html();
  const getSeverityColor = (obj, val) => {
    return val ? obj[toLower(val)] : '';
  };

  const handleToggleExpand = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    expandTrigger.value.dispatchEvent(event);
  };
  const policyData = computed(() => {
    const data = props.issuesData?.policy || {};
    const list = policyDataConfig.map((o) => {
      const item = cloneDeep(o);
      if (item.key === 'action') {
        item.value = getValueOnConfigs(data[item.key], []);
      } else if (item.key === 'type') {
        // item.value = getValueOnConfigs(data[item.key], props.typeList);
        const localeText = get(props.typeList, `${data.category}${data.type}`);
        item.value = localeKey(localeText) ? t(localeText) : data.type;
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    console.log('list==report=d=', list);
    return list;
  });
  const vulnerabilityInfo = computed(() => {
    return props.issuesData?.vulnerability || {};
  });
  const tailLinkList = computed(() => {
    const vulner = props.issuesData?.vulnerability || {};
    return tail(vulner?.references || []) as Array<string>;
  });
  const artifactName = computed(() => {
    const artifact = props.issuesData?.artifact || {};
    const data = PackageURL.fromString(artifact.packageURL);
    const name = data.namespace ? `${data.namespace}/${data.name}` : data.name;
    return data.version ? `${name}@${data.version}` : name;
  });
  // const namespace = computed(() => {
  //   const data = props.issuesData?.artifact || {};
  //   return data.namespace ? `${data.namespace}/` : '';
  // });
  const artifactData = computed(() => {
    const artifact = props.issuesData?.artifact || {};
    const data = PackageURL.fromString(artifact.packageURL);
    data['packageType'] = data.type;
    const list = artifactConfig.map((o) => {
      const item = cloneDeep(o);
      if (item.subkey) {
        item.value = data[item.subkey]
          ? `${data[item.subkey]}/${data[item.key]}`
          : data[item.key];
      } else if (item.key === 'introducedThrough') {
        item.value = get(artifact, item.key) || '';
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });

  const cvssData = computed(() => {
    const cvss = props.issuesData?.vulnerability?.cvss;
    const list = cvss ? [{ ...cvss }] : [];
    return list;
  });
</script>

<style lang="less" scoped>
  @import url('../style/style.less');

  .general-card.q-s-w-card {
    .expand-btn {
      color: rgba(var(--arcoblue-6), 0.5);
      font-size: 22px;
      cursor: pointer;
      transition: transform 0.3s;

      &.expanded {
        transform: rotate(-180deg);
        transition: transform 0.3s;
      }

      &:hover {
        animation: bounce 0.5s var(--seal-transition-func);
      }
    }

    :deep(.arco-collapse-item) {
      .arco-collapse-item-header-left {
        justify-content: center;
        padding: 0;
        color: rgba(var(--arcoblue-6), 0.5);
        font-size: 22px;
        background: linear-gradient(
          to right,
          #fff 0%,
          #fff 35%,
          rgba(190, 218, 255, 0.5) 50%,
          #fff 65%,
          #fff 100%
        );

        &:hover .arco-collapse-item-header-title {
          animation: bounce 0.3s ease-in;
        }
      }

      .arco-icon-hover {
        display: none;
      }
    }

    :deep(.arco-collapse-item-content) {
      padding: 0;
      background-color: #fff;
      border: none;

      .arco-collapse-item-content-box {
        padding-bottom: 20px;
      }
    }

    :deep(.arco-card-body) {
      padding: 0;
    }

    .card-title {
      padding: 10px;
      padding-right: 40px;
      color: var(--seal-color-text-6);
      text-align: left;
      background-color: var(--color-fill-2);
    }

    .title {
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 500;
    }

    .description {
      max-height: 50px;
      overflow: hidden;

      :deep(p) {
        margin-block-end: 5px;
        margin-block-start: 5px;
      }

      &.active-desc {
        max-height: max-content;
      }
    }

    .info {
      .val {
        padding: 0 10px 0 5px;
      }
    }

    :deep(.arco-tag) {
      padding: 0 5px;
    }

    :deep(.arco-descriptions-body) {
      border-radius: 0;
    }

    :deep(.arco-table-container) {
      border-radius: 0;

      .arco-table-cell {
        padding: 5px 16px;
      }
    }
  }
</style>

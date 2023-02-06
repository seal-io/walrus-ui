<template>
  <div>
    <a-card class="general-card q-s-w-card" :bordered="true">
      <template #title>
        <div class="violation-title-wrap">
          <div class="card-title">
            <div class="vulner-title">
              <span>{{ vulnerabilityInfo.message }}</span>
              <a-tag
                v-if="get(issuesData, 'dismissInfo.dismissed')"
                size="small"
                class="ignore-tag"
                >{{ $t('report.detail.ignore.ignored') }}</a-tag
              >
            </div>
            <div v-if="violationType"
              >{{ $t('projects.resource.violation.type') }}:
              <span class="violation-type">{{ violationType }}</span></div
            >
            <a-tag
              :color="getSeverityColor(severityMap, issuesData.severity)"
              class="seal-tag"
              >{{ $t(severityMaps[toLower(issuesData.severity)]) }}</a-tag
            >
          </div>
        </div>
      </template>
      <div class="violation-content-wrap">
        <div v-if="showIgnore" class="action-group">
          <actionButtonGroup
            :issues-data="issuesData"
            @create-jira="
              handleCreateJiraTicket(issuesData, {
                title: vulnerabilityInfo.message,
              })
            "
            @create="
              handleEditAction(issuesData, {
                action: 'create',
                title: vulnerabilityInfo.message,
              })
            "
            @update="
              handleEditAction(issuesData, {
                action: 'update',
                title: vulnerabilityInfo.message,
              })
            "
            @reset="handleResetAction(issuesData)"
          >
          </actionButtonGroup>
        </div>
        <div>
          <div class="title">{{ $t('report.detail.policyDesc') }}</div>
          <div>{{ get(issuesData, 'policy.description') }}</div>
        </div>
        <div class="basic-info-wrap">
          <div v-if="vulnerabilityInfo.link || vulnerabilityInfo.fileLink">
            <div class="title m-title">{{ $t('report.detail.link') }}</div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: flex-start;
              "
            >
              <a-link
                v-if="vulnerabilityInfo.link"
                :href="vulnerabilityInfo.link"
                target="_blank"
                class="extenal-link"
                >{{ $t('report.detail.viewPolicy') }}</a-link
              >
              <span
                v-if="vulnerabilityInfo.link && vulnerabilityInfo.fileLink"
                class="dot-spe"
              ></span>
              <a-link
                v-if="vulnerabilityInfo.fileLink"
                :href="vulnerabilityInfo.fileLink"
                target="_blank"
                class="extenal-link"
                >{{ $t('report.detail.viewFile') }}</a-link
              >
            </div>
          </div>
          <div class="resource-expand-wrap">
            <div v-if="showResourceUrl">
              <div class="sm title">{{
                $t('projects.resource.list.title')
              }}</div>
              <div class="resource-wrap">
                <ProviderIcon :provider="resourceInfo?.provider"></ProviderIcon>
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
                  <template #value="{ value, data }">
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
  import { toLower, get, cloneDeep } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { useLocaleKey } from '@/utils/func';
  import { PropType, reactive, computed, ref } from 'vue';
  import { getValueOnConfigs } from '@/utils/validate';
  import { actionList } from '@/views/policy/config';
  import { tableListRow } from '@/api/projects';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import {
    licenseArtifactConfig,
    policyDataConfig,
    severityMaps,
    getViolationLabel,
  } from '../configs';
  import useReportFunc from '../hooks/use-report-func';
  import useIgnoreModal from '../hooks/use-ignore-modal';
  import actionButtonGroup from './action-button-group.vue';

  const props = defineProps({
    title: {
      type: String,
      default() {
        return '';
      },
    },
    typeList: {
      type: Object,
      default() {
        return [];
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
    issuesData: {
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
  const vulnerSeverityMap = {
    critical: '#f53f3f',
    high: '#ff5722',
    medium: '#ff7d00',
    low: '#ffb400',
  };
  const {
    vulnerabilityInfo,
    ignoreDetailInfo,
    resourceInfo,
    handleViewResourceDetail,
  } = useReportFunc(props);
  const emits = defineEmits([
    'refresh',
    'editIgnore',
    'resetIgnore',
    'createJira',
  ]);
  const { handleEditAction, handleResetAction, handleCreateJiraTicket } =
    useIgnoreModal(emits);
  type keysActive = string | number;
  const { t } = useI18n();
  const { localeKey } = useLocaleKey();
  const activeKey = ref<keysActive[]>(['2']);
  const expandTrigger = ref();
  const showBtn = ref(false);
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
        item.value = getValueOnConfigs(data[item.key], actionList);
      } else if (item.key === 'type') {
        // item.value = getValueOnConfigs(`policy.${data[item.key]}`, props.typeList);
        const localeText = get(props.typeList, `${data.category}${data.type}`);
        item.value = localeKey(localeText) ? t(localeText) : data.type;
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });

  const artifactName = computed(() => {
    const data = props.issuesData?.artifact || {};
    return `${data.name}:${data.version}`;
  });

  const artifactData = computed(() => {
    const data = props.issuesData?.artifact || {};
    const list = licenseArtifactConfig.map((o) => {
      const item = cloneDeep(o);
      if (item.subkey) {
        item.value = data[item.subkey]
          ? `${data[item.subkey]}/${data[item.key]}`
          : data[item.key];
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });
  console.log('issueData===', props.issuesData, props.typeList);
</script>

<style lang="less" scoped>
  @import url('../style/style.less');

  .general-card.q-s-w-card {
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
      color: var(--seal-color-text-6);
      text-align: left;
      background-color: var(--color-fill-2);
    }

    .vulner-title {
      margin-right: 50px;
    }

    .title {
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 500;
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

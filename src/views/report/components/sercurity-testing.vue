<template>
  <div>
    <a-card class="general-card q-s-w-card" :bordered="true">
      <template #title>
        <a-space class="card-title" :size="5" direction="vertical" fill>
          <div class="vulner-title" style="margin-bottom: 5px">
            <span
              >{{ $t('report.detail.incident') }}:
              <span>{{ vulnerabilityInfo.description }}</span></span
            >
          </div>
          <a-space class="vulner-desc" :size="20" fill>
            <span>{{ vulnerabilityInfo.file }}</span>
            <span v-if="violationType" style="margin-left: 10px"
              >{{ $t('projects.resource.violation.type') }}:
              <span class="violation-type">{{ violationType }}</span></span
            >
            <!-- <span
              >Vulnerability: <span>{{ vulnerabilityInfo.id }}</span></span
            >
            <span
              >Vulnerability Severity:
              <a-tag
                :color="
                  getSeverityColor(
                    vulnerSeverityMap,
                    vulnerabilityInfo.severity
                  )
                "
                >{{ vulnerabilityInfo.severity }}</a-tag
              ></span
            > -->
          </a-space>
          <!-- <span
            class="seal-tag"
            :style="{
              color: getSeverityColor(severityMap, issuesData.severity),
            }"
            >{{ severityMaps[toLower(issuesData.severity)] }}</span
          > -->
          <a-tag
            :color="getSeverityColor(severityMap, issuesData.severity)"
            class="seal-tag"
            >{{ $t(severityMaps[toLower(issuesData.severity)]) }}</a-tag
          >
        </a-space>
      </template>
      <a-space direction="vertical" fill style="padding: 0 10px">
        <div>
          <div class="title">{{ $t('report.detail.link') }}</div>
          <div
            ><a-link :href="commitLink" target="_blank">{{
              $t('report.detail.seeOngithub', { provider: 'github' })
            }}</a-link></div
          >
        </div>
        <div>
          <div class="title">{{ $t('report.detail.description') }}</div>
          <div style="display: flex; justify-content: space-between">
            <div>{{ vulnerabilityInfo.description }}</div>
            <div
              ><icon-double-down
                class="expand-btn"
                :class="{ expanded: activeKey.includes('1') }"
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
              <div>
                <div class="title">{{ $t('report.detail.occurrence') }}</div>
                <a-descriptions
                  :data="artifactData"
                  :column="3"
                  :bordered="true"
                >
                  <template #label="{ label }">
                    <span>{{ $t(label) }}</span>
                  </template>
                  <template #value="{ data, value }">
                    <a-link
                      v-if="data.key === 'commit' || data.key === 'file'"
                      target="_blank"
                      :href="data.link"
                      >{{ value }}</a-link
                    >
                    <span v-else>{{ value }}</span>
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
              <!-- <div>
                <div class="title">CVSS Score</div>
                <a-table :bordered="true" :data="cvssData" :pagination="false">
                  <template #columns>
                    <a-table-column
                      title="Version"
                      data-index="version"
                    ></a-table-column>
                    <a-table-column
                      title="Base Score"
                      data-index="baseScore"
                    ></a-table-column>
                    <a-table-column
                      title="Exploitability Score"
                      data-index="exploitabilityScore"
                    ></a-table-column>
                    <a-table-column
                      title="Impact Score"
                      data-index="impactScore"
                    ></a-table-column>
                  </template>
                </a-table>
              </div> -->
            </a-space>
          </a-collapse-item>
        </a-collapse>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { toLower, get, cloneDeep, capitalize } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { useLocaleKey } from '@/utils/func';
  import { PropType, reactive, computed, ref } from 'vue';
  import { getValueOnConfigs } from '@/utils/validate';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import {
    occurrenceConfig,
    policyDataConfig,
    severityMaps,
    getViolationLabel,
  } from '../configs';

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
        return {};
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
        item.value = getValueOnConfigs(data[item.key], []);
      } else if (item.key === 'type') {
        // item.value = getValueOnConfigs(data[item.key], props.typeList);
        const localeText = get(props.typeList, `${data.category}${data.type}`);
        item.value = localeKey(localeText) ? t(localeText) : data.type;
        console.log('localeText====', localeText);
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });
  const vulnerabilityInfo = computed(() => {
    return props.issuesData?.sast || {};
  });
  const commitLink = computed(() => {
    const data = props.issuesData?.sast || {};
    const url = `${data.repositoryURL}/blob/${data.commit}/${data.file}#L${data.startLine}-L${data.endLine}`;
    return url;
  });
  const artifactData = computed(() => {
    const data = props.issuesData?.sast || {};
    const list = occurrenceConfig.map((o) => {
      const item = cloneDeep(o);
      if (item.key === 'commit') {
        item.link = `${data.repositoryURL}/commit/${data.commit}`;
        item.value = data.commit.substr(0, 5);
      } else if (item.key === 'file') {
        item.link = `${data.repositoryURL}`;
        item.value = data.file;
      } else if (item.key === 'date') {
        item.value = dayjs(data[item.key]).format('YYYY-MM-DD HH:mm:ss');
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });

  const cvssData = computed(() => {
    let list = props.issuesData?.vulnerability?.cvss || [];
    list = list.map((item) => {
      item.baseScore = item?.metrics?.baseScore;
      item.exploitabilityScore = item?.metrics?.exploitabilityScore;
      item.impactScore = item?.metrics?.impactScore;
      return item;
    });
    return list;
  });
</script>

<style lang="less" scoped>
  @import url('../style/style.less');

  .general-card.q-s-w-card {
    border: 1px solid var(--seal-border-gray-2);
    border-radius: 0;

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
        animation: bounce 0.3s ease-in;
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

    :deep(.arco-card-header) {
      position: relative;
      padding: 0;
      border-bottom: 1px solid var(--seal-border-gray-2);

      .arco-card-header-title {
        font-size: 14px;
      }
    }

    .card-title {
      padding: 10px;
      color: var(--seal-color-text-6);
      text-align: left;
      background-color: var(--color-fill-2);
    }

    .title {
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 500;
    }

    :deep(.arco-tag) {
      padding: 0 5px;
    }

    :deep(.seal-tag) {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      height: 100%;
      font-weight: 400;
      font-size: 22px;
      text-align: center;
      text-transform: capitalize;
      border-radius: 0;
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

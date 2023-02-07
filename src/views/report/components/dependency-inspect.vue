<template>
  <div>
    <a-card class="general-card q-s-w-card" :bordered="true">
      <template #title>
        <a-space
          class="card-title"
          :size="0"
          direction="vertical"
          fill
          style="min-height: 50px"
        >
          <div class="vulner-title"> {{ namespace }}{{ artifactName }} </div>
          <span v-if="violationType"
            >{{ $t('projects.resource.violation.type') }}:
            <span class="violation-type">{{ violationType }}</span></span
          >
          <a-tag
            :color="getSeverityColor(severityMap, issuesData.severity)"
            class="seal-tag"
            >{{ $t(severityMaps[toLower(issuesData.severity)]) }}</a-tag
          >
        </a-space>
      </template>
      <a-space direction="vertical" fill style="padding: 0 10px">
        <div>
          <div class="title">{{ $t('report.detail.policyDesc') }}</div>
          <div>{{ get(issuesData, 'policy.description') }}</div>
        </div>
        <div>
          <div style="display: flex; justify-content: flex-end">
            <div
              class="expand-btn"
              :class="{ expanded: activeKey.includes('1') }"
              ><icon-double-down @click="handleToggleExpand"
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
                <div class="title">{{ $t('report.detail.artifact') }}</div>
                <a-descriptions
                  :data="artifactData"
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
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { toLower, get, cloneDeep } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { useLocaleKey } from '@/utils/func';
  import { PropType, reactive, computed, ref } from 'vue';
  import { getValueOnConfigs } from '@/utils/validate';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import {
    licenseArtifactConfig,
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
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });
  const vulnerabilityInfo = computed(() => {
    return props.issuesData?.artifact || {};
  });

  const artifactName = computed(() => {
    const data = props.issuesData?.artifact || {};
    return `${data.name}:${data.version}`;
  });
  const namespace = computed(() => {
    const data = props.issuesData?.artifact || {};
    return data.namespace ? `${data.namespace}/` : '';
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
      justify-content: center;
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

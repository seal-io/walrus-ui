<template>
  <div class="node-info">
    <div class="title">
      <span class="text">{{ $t('graph.resource.node.info') }}</span>
    </div>
    <div class="box">
      <div v-if="get(currentNodeInfo, 'properties.partial')" class="info-item">
        <div class="label" :class="[lang]">{{
          $t('graph.resource.node.childNode')
        }}</div>
        <div class="value">
          {{ $t('graph.resource.node.notes') }}
          <IconFont type="icon-warn" style="margin-right: 3px"></IconFont>
        </div>
      </div>
      <div class="info-item">
        <div class="label" :class="[lang]">{{
          $t('common.table.operation')
        }}</div>
        <div class="value">
          <a-link @click="handleShowSubGraph">{{
            $t('graph.resource.node.view')
          }}</a-link>
        </div>
      </div>
      <div v-for="(item, index) in nodeInfo" :key="index" class="info-item">
        <div class="label" :class="[lang]">{{ $t(item.label) }}</div>
        <div v-if="!item.link" class="value">{{
          item.locale ? $t(item.value) : item.value
        }}</div>
        <div v-if="item.link" class="value">
          <ProviderIcon
            v-if="get(item, 'properties.provider')"
            :provider="get(item, 'properties.provider')"
          ></ProviderIcon>
          <a-link :href="item.link" target="_blank">{{ item.value }}</a-link>
        </div>
        <div v-if="item.copy" class="copy">
          <copy :content="item.value"></copy>
        </div>
      </div>
      <div v-if="nodeIssueList.length" class="info">
        <div class="sub-title">{{ $t('graph.resource.node.issue') }}</div>
        <div class="tag-wrap">
          <a-tag
            v-for="item in nodeIssueList"
            :key="item.label"
            :color="`rgb(${get(severityColorValueMap, item.severity || '')})`"
            >{{ $t(item.label) }}{{ `(${item.value})` }}</a-tag
          >
        </div>
      </div>
      <div v-if="nodeVulnList.length" class="info">
        <div class="sub-title">{{ $t('graph.resource.type.vuln') }}</div>
        <div class="tag-wrap">
          <a-tag
            v-for="item in nodeVulnList"
            :key="item.label"
            :class="{ none: toLower(item.severity) === 'none' }"
            :color="`rgb(${get(
              severityColorValueMap,
              toLower(item.severity)
            )})`"
            >{{ $t(item.label) }}{{ `(${item.value})` }}</a-tag
          >
        </div>
        <ul v-if="vulnList.length" class="vuln-list-wrap">
          <li
            v-for="(vuln, index) in vulnList"
            :key="index"
            class="list-item"
            :class="[toLower(get(vuln, 'cvss.baseSeverity') || '')]"
          >
            <a-link :href="resolvePath(vuln.id)" target="_blank">{{
              get(vuln, 'cvss.version')
                ? `${vuln.name}@${get(vuln, 'cvss.version')}`
                : vuln.name
            }}</a-link>
          </li>
        </ul>
      </div>
      <div v-if="nodeLicense.length" class="info">
        <div class="sub-title">{{ $t('graph.filter.license') }}</div>
        <div class="tag-wrap">
          <a-tag v-for="item in nodeLicense" :key="item.label" bordered
            >{{ $t(item.label) }}{{ `(${item.value})` }}</a-tag
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toLower, capitalize, get } from 'lodash';
  import { severityColorValueMap } from '@/config/global';
  import copy from '@/components/copy/index.vue';
  import { PropType, computed } from 'vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { NodeType } from '../config';

  interface Option {
    label: string;
    value: string;
    copy?: boolean;
    link?: string;
    severity?: string;
    locale?: string;
  }
  const props = defineProps({
    nodeInfo: {
      type: Array as PropType<Option[]>,
      default() {
        return [];
      }
    },
    currentNodeInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    nodeLicense: {
      type: Array as PropType<Option[]>,
      default() {
        return [];
      }
    },
    nodeVulnList: {
      type: Array as PropType<Option[]>,
      default() {
        return [];
      }
    },
    nodeIssueList: {
      type: Array as PropType<Option[]>,
      default() {
        return [];
      }
    },
    vulnList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });
  const { locale } = useI18n();
  const router = useRouter();
  const emits = defineEmits(['showChildGraph']);
  const lang = computed(() => {
    return locale.value === 'zh-CN' ? 'zh-cn' : 'en';
  });
  const resolvePath = (id) => {
    const path = router.resolve({
      name: 'vulnerDetail',
      query: { id }
    });
    return path.href;
  };
  const handleShowSubGraph = () => {
    emits('showChildGraph');
  };
</script>

<style lang="less" scoped>
  @bgcolor: #f1f6fe;

  .node-info {
    .title {
      padding: 10px 5px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      background: rgb(var(--primary-6));
    }

    .info-item {
      display: flex;
      flex-basis: fit-content;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      padding: 5px;
      font-size: 13px;
      text-align: left;

      &:nth-of-type(even) {
        background: @bgcolor;
      }

      .label {
        width: 55px;
        font-weight: 500;

        &.en {
          width: 80px;
        }
      }

      .value {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;

        .arco-link {
          display: inline;
        }
      }

      .copy {
        width: 16px;
        text-align: right;
      }

      :deep(.arco-tag) {
        height: 16px;
        padding: 0 2px;
        font-size: 12px;
        line-height: 16px;
      }
    }

    .vuln-list-wrap {
      margin: 0;
      padding: 0;
      list-style-type: none;

      .list-item {
        position: relative;
        padding: 0 0 0 6px;
        font-size: 12px;
        list-style-type: none;
        cursor: pointer;

        .arco-link {
          font-size: 12px;
        }

        &::before {
          position: absolute;
          top: 7px;
          left: 0;
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          content: '';
        }

        &.critical::before {
          background-color: rgb(203, 39, 45);
        }

        &.high::before {
          background-color: rgb(245, 63, 63);
        }

        &.medium::before {
          background-color: rgb(255, 125, 0);
        }

        &.low::before {
          background-color: rgb(250, 220, 25);
        }

        &.none::before {
          background-color: #e5e6eb;
        }
      }
    }

    .info {
      padding: 5px;

      .sub-title {
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 13px;
      }

      .tag-wrap {
        display: inline-flex;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 5px;
        font-size: 14px;

        .arco-tag {
          display: inline-block;
          min-width: 30px;
          height: 20px;
          margin-right: 5px;
          margin-bottom: 5px;
          padding: 0 5px;
          // color: var(--color-text-3);
          font-weight: 400;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          border-radius: 10px;

          &.none {
            color: var(--color-text-2);
          }
        }
      }
    }
  }
</style>

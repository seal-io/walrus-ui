<template>
  <div class="vulner-list-wrap">
    <a-list :bordered="false">
      <template #header>
        <span>{{ $t('sbom.component.detail.vulner') }}</span>
      </template>
      <a-list-item v-for="(item, index) in dataList" :key="index">
        <a-list-item-meta>
          <template #title>
            <span class="text-title">{{ item.description }}</span>
          </template>
          <template #description>
            <span class="desc-text"
              >{{ get(item, 'namespace') }}/{{ get(item, 'name') }}</span
            >
            <a-divider
              v-if="
                get(item, 'cvss.baseScore') > 0 ||
                get(item, 'cvss.baseSeverity')
              "
              direction="vertical"
            ></a-divider>
            <a-tag
              v-if="get(item, 'cvss.baseSeverity')"
              size="small"
              :color="
                get(severityColor, toLower(get(item, 'cvss.baseSeverity')))
              "
            >
              {{ capitalize(get(item, 'cvss.baseSeverity')) }}</a-tag
            >
            <span v-if="get(item, 'cvss.baseScore') > 0" class="score-box">
              CVSS
              {{
                get(item, 'cvss.baseScore') > 0
                  ? get(item, 'cvss.baseScore')
                  : ''
              }}</span
            >
            <!-- <span>{{ get(item, 'namespace') }}/{{ get(item, 'name') }}</span> -->
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="text" size="small" @click="handleToView(item.id)">{{
            $t('common.button.detail')
          }}</a-button>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
  import { capitalize, get, toLower } from 'lodash';
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';
  import { severityColor } from '@/config/global';
  import { VulnerItem } from '../config/interface';

  defineProps({
    dataList: {
      type: Array as PropType<VulnerItem[]>,
      default() {
        return [];
      },
    },
  });
  const router = useRouter();
  const handleToView = (id) => {
    router.push({
      name: 'vulnerDetail',
      query: {
        id,
      },
    });
  };
</script>

<style lang="less" scoped>
  .vulner-list-wrap {
    :deep(.arco-list) {
      .arco-list-header {
        padding: 0 0 20px 0;
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 16px;
      }

      .arco-list-item-meta-title {
        margin: 5px 0;
        padding-right: 10px;

        .desc-text {
          font-weight: 400;
          // color: var(--color-text-2);
          font-size: 14px;
        }
      }

      .arco-list-item-meta-description {
        display: flex;
        align-items: center;

        .score-box {
          margin-left: 15px;
          color: var(--color-text-3);
          font-weight: 500;
          font-size: 14px;
          text-align: center;
        }
      }

      .arco-list-item-meta-content {
        width: 100%;
      }

      .arco-list-item:last-child {
        border-bottom: 1px solid var(--color-neutral-3);
      }

      .arco-list-item {
        padding: 0 10px 6px;
      }

      .text-title {
        color: #f53f3f;
      }
    }
  }
</style>

<template>
  <div class="issue-rank-wrap" style="width: 100%">
    <a-list :bordered="false">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <a-list-item v-for="(item, index) in dataList" :key="index">
        <a-list-item-meta>
          <template #title>
            <div class="title-content">
              <div class="name-wrap">
                <ProviderIcon :provider="item.provider"></ProviderIcon>
                <!-- <a-link @click="handleViewDetail(item)">{{
                  item.fullName
                }}</a-link> -->
                <AutoTip
                  :tooltip-props="{ content: item.fullName }"
                  style="
                    max-width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                >
                  <a-link
                    style="display: inline"
                    @click="handleViewDetail(item)"
                    >{{ item.fullName }}</a-link
                  >
                </AutoTip>
              </div>
              <severityBar
                class="severity-wrapper"
                style="flex-basis: 170px; text-align: right"
                :layout="['H', 'M', 'L']"
                :severity="{
                  high: get(item, 'issueHighCount'),
                  medium: get(item, 'issueMediumCount'),
                  low: get(item, 'issueLowCount')
                }"
              ></severityBar>
            </div>
          </template>
          <template #description> </template>
          <template #avatar>
            <span>{{ index + 1 }}</span>
          </template>
        </a-list-item-meta>
      </a-list-item>
      <template #empty>
        <div class="empty-wrap" :style="{ height: height }">
          <a-empty></a-empty>
        </div>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import severityBar from '@/components/severity-bar/index.vue';

  defineProps({
    dataList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default() {
        return '120px';
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const router = useRouter();
  const handleViewDetail = (row) => {
    console.log({ row });
    router.push({
      name: 'ProjectSBom',
      query: {
        id: row.id,
        versionId: 'latest'
      }
    });
  };
</script>

<style lang="less" scoped>
  .issue-rank-wrap {
    :deep(.arco-list-content) {
      .arco-list-item {
        padding: 0 10px !important;
      }

      .arco-list-item-main {
        width: inherit;
      }

      .arco-list-item-meta-content {
        width: 100%;

        .title-content {
          display: flex;
          justify-content: space-between;

          .name-wrap {
            display: flex;
            flex: 1;
            align-items: center;
            // flex-basis: 100px;
            // min-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      .arco-list-item-meta {
        padding: 8px 0;
      }

      .arco-list-item-meta-avatar {
        width: 12px;
      }
    }

    :deep(.arco-list-header) {
      padding: 12px 10px;
      font-size: 12px;
      line-height: 1.2;
    }

    :deep(.arco-empty) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: inherit;

      .arco-empty-description {
        font-size: 12px;
      }
    }
  }
</style>

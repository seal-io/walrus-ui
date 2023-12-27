<template>
  <div class="issue-rank-wrap">
    <a-list :bordered="false">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <a-list-item v-for="(item, index) in dataList" :key="index">
        <a-list-item-meta>
          <template #title>
            <div class="title-content">
              <div>
                <span>{{ item.name }}</span>
              </div>
              <span>{{ item.value }}</span>
            </div>
          </template>
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
  import { PropType } from 'vue';

  defineProps({
    dataList: {
      type: Array as PropType<{ name: string; value: number }[]>,
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
</script>

<style lang="less" scoped>
  .issue-rank-wrap {
    :deep(.arco-list-content) {
      .arco-list-item {
        padding: 0 10px !important;
      }

      .arco-list-item-meta-content {
        width: 100%;

        .title-content {
          display: flex;
          justify-content: space-between;
        }

        .arco-list-item-meta-title {
          color: rgb(var(--gray-10));
          font-weight: var(--font-weight-regular);
          font-size: 12px;
        }
      }

      .arco-list-item-meta-avatar {
        width: 12px;
      }

      .arco-list-item-meta {
        padding: 6px 0;
      }
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

    :deep(.arco-list-header) {
      padding: 12px 10px;
      font-size: 12px;
      line-height: 1.2;
    }
  }
</style>

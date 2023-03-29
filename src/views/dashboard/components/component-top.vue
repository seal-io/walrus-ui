<template>
  <div class="com-top-wrap">
    <div class="title">{{ $t('dashboard.component.freq.title') }}</div>
    <a-table
      :stripe="true"
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          :width="50"
          :title="$t('dashboard.component.freq.index')"
          align="center"
        >
          <template #cell="{ rowIndex }">
            <span>{{ rowIndex + 1 }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :title="$t('dashboard.component.freq.name')"
          data-index="name"
        >
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          title="组件类型"
          data-index="language"
        >
        </a-table-column> -->
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :title="$t('dashboard.component.freq.resource')"
          :width="100"
          align="center"
          data-index="resourcesNum"
        >
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          title="版本"
          data-index="version"
        >
        </a-table-column> -->
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          title="漏洞数"
          :width="100"
          align="center"
          data-index="vulnerabilitySummary.total"
        >
        </a-table-column> -->
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          title="发布时间"
          data-index="name"
        >
        </a-table-column> -->
        <a-table-column
          ellipsis
          tooltip
          align="center"
          :cell-style="{ minWidth: '40px' }"
          :width="120"
          :title="$t('sbom.table.operation')"
        >
          <template #cell="{ record }">
            <a-button
              type="text"
              size="small"
              @click="handleToComponentDetail(record)"
            >
              {{ $t('common.button.detail') }}
            </a-button>
          </template>
        </a-table-column>
      </template>
      <template #empty>
        <div class="empty-wrap" :style="{ height: height }">
          <a-empty></a-empty>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';
  import { PackageItem } from '../api/dashboard';

  defineProps({
    dataList: {
      type: Array as PropType<PackageItem[]>,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default() {
        return '120px';
      }
    }
  });
  const router = useRouter();
  const handleToComponentDetail = (row) => {
    router.push({
      name: 'ComponentDetail',
      query: {
        id: row.ID
      }
    });
  };
</script>

<style lang="less" scoped>
  .com-top-wrap {
    .title {
      margin-bottom: 12px;
      font-weight: 500;
      font-size: 12px;
    }

    :deep(.arco-table-td) {
      border-bottom: 0;

      .arco-table-cell {
        padding: 6px 10px;
      }
    }

    :deep(.arco-table-th) {
      font-size: 12px;

      .arco-table-cell {
        padding: 6px 10px;
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
  }
</style>

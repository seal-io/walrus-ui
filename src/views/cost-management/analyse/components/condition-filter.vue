<template>
  <div class="condition-filter-wrap">
    <div class="btn-wrap">
      <span class="icon-btn-wrap plus" @click="handleAddORFilter"
        ><icon-plus-circle-fill class="size-20" />OR</span
      >
    </div>
    <div class="condition-box wrapper">
      <div v-if="filterDataList.length">
        <div
          v-for="(item, index) in filterDataList"
          :key="index"
          class="content-wrap"
          :class="{ group: item?.length > 1 }"
        >
          <a-space
            v-for="(sItem, sIndex) in item"
            :key="sIndex"
            :size="5"
            fill
            class="condition-item"
          >
            <a-select
              v-model="sItem.filterName"
              :options="perspectiveDataList"
              style="flex: 1; width: 200px"
            ></a-select>
            <a-select
              v-model="sItem.operator"
              :options="operatorList"
              style="width: 120px"
            ></a-select>
            <a-select
              v-model="sItem.values"
              :max-tag-count="2"
              multiple
              :options="perspectiveDataList"
              style="flex: 1; min-width: 240px"
            ></a-select>
            <span class="icon-btn-box">
              <span
                class="icon-btn-wrap"
                @click="handleDeleteFilter(item, sIndex)"
                ><icon-minus-circle class="size-20"></icon-minus-circle
              ></span>
              <span
                v-if="sIndex === item?.length - 1"
                class="icon-btn-wrap plus"
                @click="handleAddFilter(item)"
                ><icon-plus-circle-fill class="size-20" />AND</span
              >
            </span>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, PropType } from 'vue';
  import { filter } from 'lodash';
  import { relationOptions, operatorList } from '../config';
  import { FilterItem } from '../config/interface';

  type FilterDataItem = FilterItem[];
  const props = defineProps({
    filterList: {
      type: Array as PropType<FilterDataItem[]>,
      default() {
        return [];
      }
    }
  });
  const perspectiveDataList = ref<{ label: string; value: string }[]>([
    { label: 'connectorID', value: 'cluster1' },
    { label: 'cluster-2', value: 'cluster2' },
    { label: 'clusterNamespace', value: 'clusterNamespace' },
    { label: 'workload', value: 'workload' },
    { label: 'app', value: 'app' }
  ]);
  const filterDataList = ref<FilterDataItem[]>([
    [
      { filterName: 'workload', operator: 'IN', values: ['w1', 'w2'] },
      { filterName: 'workload', operator: 'IN', values: ['w1', 'w2'] }
    ],
    [{ filterName: 'workload', operator: 'IN', values: ['w1', 'w2'] }],
    [{ filterName: 'workload', operator: 'IN', values: ['w1', 'w2'] }]
  ]);
  const setPolicyData = () => {};

  const handleAddFilter = (item) => {
    item.push({
      filterName: '',
      operator: '',
      values: []
    });
  };
  const handleAddORFilter = () => {
    filterDataList.value.push([
      {
        filterName: '',
        operator: '',
        values: []
      }
    ]);
  };
  const handleDeleteFilter = (item, index) => {
    item.splice(index, 1);
    filterDataList.value = filter(filterDataList.value, (o) => !!o.length);
  };

  onMounted(() => {
    setPolicyData();
  });
</script>

<style lang="less" scoped>
  .condition-filter-wrap {
    .btn-wrap {
      margin-top: 6px;
      margin-bottom: 10px;

      .icon-btn-wrap {
        color: var(--sealblue-6);
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }

        &.plus {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .condition-box {
    position: relative;
    display: flex;
    padding: 16px;
    // background-color: var(--color-fill-2);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .content-wrap {
      position: relative;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      &.group::before {
        position: absolute;
        top: -6px;
        right: -8px;
        bottom: -6px;
        left: -8px;
        display: inline-block;
        background-color: rgba(168, 186, 240, 0.2);
        border-radius: 4px;
        content: '';
      }
    }

    &.and::after {
      left: 25px;
    }

    &.and::before {
      left: 25px;
    }

    &.only::after {
      width: 0;
    }

    &.only::before {
      width: 0;
    }

    .condition {
      display: flex;
      flex-direction: column;
    }

    .condition-item {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0;
      }
      // width: 650px;
      // margin-left: 30px;
    }

    .icon-btn-box {
      display: flex;
      align-items: center;
      margin-left: 8px;
      color: var(--sealblue-6);

      .icon-btn-wrap {
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }

        &.plus {
          display: flex;
          align-items: center;
          margin-left: 12px;
        }
      }
    }

    .operator {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 30px;

      &::before {
        position: absolute;
        top: 0;
        bottom: calc(50% + 14px);
        left: 50%;
        display: inline-block;
        border-left: 1px solid var(--color-border-3);
        content: '';
      }

      &::after {
        position: absolute;
        top: calc(50% + 14px);
        bottom: 0;
        left: 50%;
        display: inline-block;
        border-left: 1px solid var(--color-border-3);
        content: '';
      }
    }
  }
</style>

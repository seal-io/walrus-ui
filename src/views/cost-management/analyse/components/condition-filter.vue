<template>
  <div class="condition-filter-wrap">
    <a-space class="btn-wrap" :size="10" @click.stop="handleAddPolicy">
      <a-button type="primary">
        <icon-plus style="margin-right: 4px" />
        <span>添加策略</span>
      </a-button>
      <a-button type="primary" @click.stop="handleAddPolicyGroup">
        <icon-layers style="margin-right: 4px" />
        <span>添加策略组</span>
      </a-button>
    </a-space>
    <div
      class="condition-box wrapper"
      :class="{ only: conditionCount.length < 2 }"
    >
      <div v-if="conditionCount.length > 1" class="operator">
        <!-- <a-select
        :options="relationOptions"
        style="width: 80px"
        size="small"
      ></a-select> -->
        OR
      </div>
      <a-space class="condition" :size="10" direction="vertical">
        <template v-if="policyDataList.length">
          <div
            v-for="(item, index) in policyDataList"
            :key="index"
            class="condition-item"
            style="width: 520px"
          >
            <a-select
              v-model="item[0].filterName"
              :options="perspectiveDataList"
              style="flex: 1"
            ></a-select>
            <a-select
              v-model="item[0].operator"
              :options="operatorList"
              style="flex-basis: 100px"
            ></a-select>
            <a-input style="flex: 1"></a-input>
            <!-- <a-input style="flex: 1" v-model="item[0].values"></a-input> -->
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleDeleteFilter('or', index)"
            >
              <icon-minus></icon-minus>
            </a-button>
            <a-button
              v-if="index === policyDataList.length - 1"
              type="primary"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleAddFilter('or')"
            >
              <icon-plus></icon-plus>
            </a-button>
          </div>
        </template>

        <template v-if="policyGroupDataList.length">
          <div
            v-for="(sItem, sIndex) in policyGroupDataList"
            :key="sIndex"
            class="condition-box and"
          >
            <div class="operator">
              <!-- <a-select
            :options="relationOptions"
            style="width: 80px"
            size="small"
          ></a-select> -->
              AND
            </div>
            <a-space
              v-if="sItem.length"
              class="condition"
              :size="10"
              direction="vertical"
            >
              <div
                v-for="(pItem, pIndex) in sItem"
                :key="pIndex"
                class="condition-item"
                style="width: 520px"
              >
                <a-select
                  v-model="pItem.filterName"
                  :options="perspectiveDataList"
                  style="flex: 1"
                ></a-select>
                <a-select
                  v-model="pItem.operator"
                  :options="operatorList"
                  style="flex-basis: 100px"
                ></a-select>
                <a-input style="flex: 1"></a-input>
                <!-- <a-input style="flex: 1" v-model="pItem.values"></a-input> -->

                <a-button
                  type="outline"
                  size="mini"
                  shape="round"
                  class="mini-icon-btn"
                  style="margin-left: 8px"
                  @click="handleDeleteFilter('and', pIndex, sItem)"
                >
                  <icon-minus></icon-minus>
                </a-button>
                <a-button
                  v-if="pIndex === sItem.length - 1"
                  type="primary"
                  size="mini"
                  shape="round"
                  class="mini-icon-btn"
                  style="margin-left: 8px"
                  @click="handleAddFilter('and', sItem)"
                >
                  <icon-plus></icon-plus>
                </a-button>
              </div>
            </a-space>
          </div>
        </template>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { filter } from 'lodash';
  import { relationOptions, operatorList } from '../config';
  import { FilterItem } from '../config/interface';

  type FilterDataItem = FilterItem[];
  const perspectiveDataList = ref<{ label: string; value: string }[]>([
    { label: 'cluster-1', value: 'cluster1' },
    { label: 'cluster-2', value: 'cluster2' },
    { label: 'clusterNamespace', value: 'clusterNamespace' },
    { label: 'workload', value: 'workload' },
    { label: 'app', value: 'app' }
  ]);
  const filterDataList = ref<FilterDataItem[]>([
    // [
    //   { filterName: 'cluster-1', operator: 'IN', values: ['a', 'b'] },
    //   { filterName: 'cluster-2', operator: 'NOTIN', values: ['a1', 'b1'] }
    // ],
    [{ filterName: 'workload', operator: 'IN', values: ['w1', 'w2'] }]
  ]);
  const policyDataList = ref<FilterDataItem[]>([]);
  const policyGroupDataList = ref<FilterDataItem[]>([]);
  const setPolicyData = () => {
    policyDataList.value = filter(
      filterDataList.value,
      (item) => item.length === 1
    );
    policyGroupDataList.value = filter(
      filterDataList.value,
      (item) => item.length > 1
    );
  };
  const conditionCount = computed(() => {
    return [...policyDataList.value, ...policyGroupDataList.value];
  });
  const handleAddFilter = (type, group?) => {
    if (type === 'or') {
      policyDataList.value.push([
        {
          filterName: '',
          operator: '',
          values: []
        }
      ]);
    }
    if (type === 'and') {
      group?.push([
        {
          filterName: '',
          operator: '',
          values: []
        }
      ]);
    }
  };
  const handleDeleteFilter = (type, index, group?) => {
    if (type === 'or') {
      policyDataList.value.splice(index, 1);
      console.log('policyDataList:', policyDataList.value);
    }
    if (type === 'and') {
      group?.splice(index, 1);
      policyGroupDataList.value = filter(
        policyGroupDataList.value,
        (item) => !!item.length
      );
    }
  };
  const handleAddPolicy = () => {
    policyDataList.value.push([{ filterName: '', operator: '', values: [] }]);
  };
  const handleAddPolicyGroup = () => {
    policyGroupDataList.value.push([
      { filterName: '', operator: '', values: [] },
      { filterName: '', operator: '', values: [] }
    ]);
    console.log('policyDataList===', policyDataList.value);
  };
  onMounted(() => {
    setPolicyData();
  });
</script>

<style lang="less" scoped>
  .condition-filter-wrap {
    .btn-wrap {
      display: flex;
      margin-bottom: 20px;
    }
  }

  .condition-box {
    position: relative;
    display: flex;
    padding: 16px 10px;
    background-color: var(--color-fill-2);
    border-radius: 2px;

    &.wrapper {
      width: 640px;
    }

    &::before {
      position: absolute;
      top: 15px;
      left: 20px;
      // left: 50px;
      display: inline-block;
      // width: 60px;
      width: 40px;
      border-top: 1px solid var(--color-border-3);
      content: '';
    }

    &::after {
      position: absolute;
      bottom: 15px;
      left: 20px;
      // left: 50px;
      display: inline-block;
      // width: 60px;
      width: 40px;
      border-top: 1px solid var(--color-border-3);
      content: '';
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
      align-items: center;
      justify-content: flex-start;
      margin-left: 30px;
    }

    .operator {
      position: relative;
      display: flex;
      align-items: center;

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

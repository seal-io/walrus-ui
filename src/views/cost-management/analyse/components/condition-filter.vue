<template>
  <div class="condition-filter-wrap">
    <div v-if="filterDataList.length" class="btn-wrap">
      <span class="icon-btn-wrap plus" @click="handleAddORFilter"
        ><icon-plus-circle-fill class="size-20" />OR</span
      >
    </div>
    <div class="condition-box wrapper">
      <div v-if="!filterDataList.length" class="no-data">
        <a-button type="text" size="small" @click="handleAddORFilter">
          <template #icon><icon-plus /></template>
          {{ $t('cost.analyse.view.strategy') }}
        </a-button>
      </div>
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
            <a-cascader
              v-model="sItem.fieldName"
              :error="!sItem.fieldName && triggerValidate"
              allow-search
              :options="perspectiveFields"
              style="flex: 1; width: 220px"
              @change="(val) => handleCascaderChange(val, sItem)"
            >
            </a-cascader>
            <a-select
              v-model="sItem.operator"
              :error="!sItem.operator && triggerValidate"
              :options="operatorList"
              style="width: 120px"
              @change="handleOperatorChange"
            ></a-select>
            <a-select
              v-model="sItem.values"
              :error="!sItem?.values?.length && triggerValidate"
              :max-tag-count="2"
              multiple
              :loading="sItem.loading"
              :options="sItem.fieldValues"
              style="flex: 1; width: 240px"
              @popup-visible-change="
                (visible) => handlePopupVisible(visible, sItem)
              "
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
  import { ref, onMounted, computed, PropType, watch, defineExpose } from 'vue';
  import { cloneDeep, filter, find, get, some, keys, every } from 'lodash';
  import dayjs from 'dayjs';
  import { relationOptions, operatorList, DateShortCuts } from '../config';
  import { FilterItem } from '../config/interface';
  import { queryPerspectiveFieldValues } from '../api';

  type FilterDataItem = FilterItem[];
  const props = defineProps({
    conditions: {
      type: Array as PropType<FilterDataItem[]>,
      default() {
        return [];
      }
    },
    validate: {
      type: Boolean,
      default() {
        return true;
      }
    },
    timeRange: {
      type: String,
      default() {
        return 'now-7d';
      }
    },
    perspectiveFields: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    }
  });
  const emits = defineEmits(['update:conditions']);
  const filterDataList = ref<FilterDataItem[]>([]);
  const triggerValidate = ref(false);
  const setPolicyData = () => {};

  const fieldVaildator = () => {
    if (props.validate) {
      triggerValidate.value = true;
      const result = every(filterDataList.value, (item) => {
        return every(item, (s) => {
          return !!s.fieldName && !!s.operator && !!s?.values?.length;
        });
      });
      return result;
    }
    return true;
  };
  const handleAddFilter = (item) => {
    item.push({
      fieldName: '',
      operator: '',
      values: []
    });
    emits('update:conditions', filterDataList.value);
  };
  const handleOperatorChange = () => {
    emits('update:conditions', filterDataList.value);
  };
  const handleAddORFilter = () => {
    filterDataList.value.push([
      {
        fieldName: '',
        operator: '',
        values: []
      }
    ]);
    emits('update:conditions', filterDataList.value);
  };
  const handleDeleteFilter = (item, index) => {
    item.splice(index, 1);
    filterDataList.value = filter(filterDataList.value, (o) => !!o.length);
    emits('update:conditions', filterDataList.value);
  };
  const handleCascaderChange = (val, sItem) => {
    sItem.values = [];
    sItem.fieldValues = [];
    emits('update:conditions', filterDataList.value);
  };
  const handlePopupVisible = async (visible, sItem) => {
    try {
      if (visible && !sItem?.fieldValues?.length && sItem.fieldName) {
        sItem.loading = true;
        const date = find(
          DateShortCuts,
          (item) => item.timeControl === props.timeRange
        );
        const { data } = await queryPerspectiveFieldValues({
          fieldName: sItem.fieldName,
          fieldType: 'filter',
          startTime:
            get(date, 'value.0') || dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
          endTime:
            get(date, 'value.1') || dayjs().format('YYYY-MM-DDT23:59:59Z')
        });
        sItem.fieldValues = data?.items || [];
        sItem.loading = false;
      }
    } catch (error) {
      sItem.loading = false;
      sItem.fieldValues = [];
      console.log(error);
    }
  };
  watch(
    () => props.conditions,
    () => {
      filterDataList.value = cloneDeep(props.conditions);
    },
    {
      immediate: true
    }
  );
  defineExpose({
    fieldVaildator
  });
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
          width: 55px;
        }
      }
    }
  }

  .condition-box {
    position: relative;
    display: flex;
    min-width: 360px;
    padding: 16px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .no-data {
      width: 100%;
      color: var(--sealblue-6);
      font-size: 12px;
      text-align: center;
      cursor: pointer;
    }

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

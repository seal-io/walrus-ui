<template>
  <div class="cluster-item-wrap">
    <div class="btn-wrap">
      <a-checkbox
        v-model="checkedAll"
        :disabled="checkedAllDisabled"
        :indeterminate="indeterminate"
        @change="handleChangeAll"
        >{{ title }}
      </a-checkbox>
    </div>
    <div>
      <a-checkbox-group
        :model-value="modelValue"
        style="padding-left: 20px"
        @change="handleCheckChange"
      >
        <a-checkbox
          v-for="(item, index) in options"
          :key="index"
          style="width: 25%"
          :disabled="item.imported"
          :value="item.name"
        >
          <AutoTip :tooltip-props="{ content: item.fullName }">{{
            item.fullName
          }}</AutoTip>
        </a-checkbox>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { map, isEqual, every, includes, filter, find, get } from 'lodash';
  import { ref, PropType, computed, watchEffect } from 'vue';
  import { ResouceItem } from '../api/resource';

  const props = defineProps({
    cid: {
      type: String,
      default() {
        return '0';
      },
    },
    title: {
      type: String,
      default() {
        return 'cluster name';
      },
    },
    modelValue: {
      type: Array as PropType<Array<string>>,
      default() {
        return [];
      },
    },
    options: {
      type: Array as PropType<Array<ResouceItem>>,
      default() {
        return [];
      },
    },
  });
  const emits = defineEmits(['change', 'update:modelValue']);
  const checkedAll = ref(false);
  const checkedAllDisabled = ref(false);
  const indeterminate = ref(false);
  const valueList = ref<string[]>([]);
  const handleChangeAll = () => {
    if (checkedAll.value) {
      const rawValues = map(props.options, (item) => item.name);
      emits('update:modelValue', rawValues);
    } else {
      const hasImportedValues = map(
        filter(props.options, (item) => item.imported),
        (s) => s.name
      );
      emits('update:modelValue', hasImportedValues);
    }
  };
  const handleCheckChange = (value) => {
    emits('change', value);
    emits('update:modelValue', value);
  };
  watchEffect(() => {
    // update valueList
    valueList.value = filter(props.modelValue, (val) => {
      const data = find(
        props.options,
        (item) => item.name === val && !item.imported
      );
      return !!data;
    });
    // console.log('valueList====', valueList.value)
    checkedAllDisabled.value = every(props.options, (item) => item.imported);
    const rawValues = map(
      filter(props.options, (item) => !item.imported),
      (i) => i.name
    );
    if (every(rawValues, (val) => includes(valueList.value, val))) {
      checkedAll.value = true;
      indeterminate.value = false;
    } else if (valueList.value.length) {
      checkedAll.value = false;
      indeterminate.value = true;
    } else {
      checkedAll.value = false;
      indeterminate.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .btn-wrap {
    margin-bottom: 6px;
  }

  .cluster-item-wrap {
    :deep(.arco-checkbox-group) {
      display: block;

      .arco-checkbox {
        margin-right: 0;
      }

      .arco-checkbox-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>

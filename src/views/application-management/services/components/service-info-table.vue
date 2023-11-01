<template>
  <div>
    <a-space class="m-b-10 flex-end" fill style="padding: 0 10px">
      <a-input-search
        v-model="queryName"
        :placeholder="$t('common.filter.attrs')"
        style="width: 200px"
        allow-clear
        @change="handleQueryChange"
      ></a-input-search>
      <a-select
        v-model="filterParams.required"
        :placeholder="$t('common.filter.isrequired.holder')"
        allow-clear
        style="width: 140px"
      >
        <a-option
          v-for="item in requiredOptions"
          :key="item.value"
          :value="item.value"
          :label="$t(item.label)"
        ></a-option>
      </a-select>
      <a-select
        v-model="filterParams.hasValue"
        :placeholder="$t('common.filter.filled.holder')"
        allow-clear
        style="width: 140px"
      >
        <a-option
          v-for="item in hasValueOptions"
          :key="item.value"
          :value="item.value"
          :label="$t(item.label)"
        ></a-option>
      </a-select>
      <a-button type="outline" @click="handleClear">{{
        $t('common.button.clear')
      }}</a-button>
    </a-space>
    <a-descriptions v-bind="$attrs" :data="dataList">
      <template #value="{ data }">
        <slot name="value" :data="data"> </slot>
      </template>
      <template #label="{ data }">
        <slot name="label" :data="data"> </slot>
      </template>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useAttrs, PropType, computed, toRef } from 'vue';
  import useFillterAttributes from '@/components/form-create/hooks/use-fillter-attributes';
  import {
    hasValueOptions,
    requiredOptions
  } from '@/components/form-create/config';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    formData: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    }
  });

  const $attrs = useAttrs();
  const {
    queryName,
    filterFields,
    filterParams,
    handleClear,
    handleQueryChange
  } = useFillterAttributes(toRef(props, 'formData'));

  const dataList = computed(() => {
    return _.filter(props.data, (item) => {
      return filterFields(item);
    });
  });
</script>

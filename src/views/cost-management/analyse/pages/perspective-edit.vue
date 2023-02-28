<template>
  <ComCard top-gap>
    <GroupTitle title="新建视图"></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('cost.analyse.table.name')"
        field="name"
        validate-trigger="change"
        :rules="[{ required: true, message: '视角名称必填' }]"
      >
        <a-input
          v-model="formData.name"
          :max-length="50"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item label="Group By">
        <a-select v-model="formData.allocationQueries[0].groupBy"> </a-select>
      </a-form-item>
      <a-form-item label="过滤器">
        <ConditionFilter
          v-model:conditions="formData.allocationQueries[0].filters"
          :perspective-fields="perspectiveFields"
        ></ConditionFilter>
      </a-form-item>

      <a-form-item label="Share Cost">
        <template #label>
          <div style="display: flex; align-items: center">
            <span
              >Share Cost
              <a-tooltip content="Define Share Cost Buckets">
                <icon-info-circle /> </a-tooltip
            ></span>
          </div>
        </template>
        <ConditionFilter
          v-model:conditions="
            formData.allocationQueries[0].shareCosts[0].filters
          "
          :perspective-fields="perspectiveFields"
        ></ConditionFilter>
      </a-form-item>
      <a-form-item
        label=""
        field="formData.allocationQueries.0.shareCosts.0.sharingStrategy"
      >
        <span class="label">Sharing Strategy</span>
        <a-radio-group
          v-model="formData.allocationQueries[0].shareCosts[0].sharingStrategy"
        >
          <a-radio
            v-for="item in costShareMode"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label=""
        field="formData.allocationQueries.0.shareCosts.0.idleCostFilters"
      >
        <span class="label">Idle Cost Filters</span>
        <a-select
          v-model="formData.allocationQueries[0].shareCosts[0].idleCostFilters"
          multiple
          style="width: 360px"
          :options="costShareMode"
          placeholder="Idle Cost"
        ></a-select>
      </a-form-item>
      <a-form-item label="" field="managementCostFilters">
        <span class="label">Management Cost Filters</span>
        <a-select
          v-model="
            formData.allocationQueries[0].shareCosts[0].managementCostFilters
          "
          multiple
          style="width: 360px"
          :options="costShareMode"
          placeholder="Idle Cost"
        ></a-select>
      </a-form-item>
    </a-form>
    <EditPageFooter>
      <template #save>
        <a-button
          :loading="submitLoading"
          type="primary"
          class="cap-title cancel-btn"
          @click="handleOk"
          >{{ $t('common.button.save') }}</a-button
        >
      </template>
      <template #cancel>
        <a-button
          :type="'outline'"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template>
    </EditPageFooter>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { map, each, startsWith } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ConditionFilter from '../components/condition-filter.vue';
  import { costShareMode } from '../config';
  import { PerspectiveRowData, FieldsOptions } from '../config/interface';
  import { filtersData } from '../config/testData';
  import {
    queryItemPerspective,
    createPerspective,
    updatePerspective,
    queryPerspectiveFields
  } from '../api';

  const { t, router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const perspectiveInfo = ref<any>({});
  const loading = ref(false);
  const submitLoading = ref(false);
  const perspectiveFields = ref<FieldsOptions[]>([]);
  const formData = reactive({
    name: '',
    builtin: false,
    allocationQueries: [
      {
        groupBy: '',
        step: '',
        filters: [],
        shareCosts: [
          {
            filters: [],
            idleCostFilters: [],
            managementCostFilters: [],
            sharingStrategy: ''
          }
        ]
      }
    ]
  });
  const handleCancel = () => {
    router.back();
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    console.log('formData====', formData);
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        if (id) {
          await updatePerspective({ ...formData, id });
        } else {
          await createPerspective(formData);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const getPerspectiveInfo = async () => {
    if (!id) return;
    try {
      const { data } = await queryItemPerspective({ id });
      perspectiveInfo.value = data;
    } catch (error) {
      perspectiveInfo.value = {};
      console.log(error);
    }
  };
  const getPerspectiveFields = async () => {
    try {
      const { data } = await queryPerspectiveFields();
      const list = data?.items || [];
      const labelList: Array<{ label: string; value: string }> = [];
      const fieldList: Array<{ label: string; value: string }> = [];
      each(list, (o) => {
        if (startsWith(o.fieldName, 'label:')) {
          labelList.push({
            ...o,
            value: o.fieldName
          });
        } else {
          fieldList.push({
            ...o,
            value: o.fieldName
          });
        }
      });
      perspectiveFields.value = [
        {
          label: 'Label',
          value: 'labelGroup',
          children: [...labelList]
        },
        ...fieldList
      ];
    } catch (error) {
      perspectiveFields.value = [];
      console.log(error);
    }
  };
  const init = async () => {
    await getPerspectiveFields();
    getPerspectiveInfo();
  };
  init();
</script>

<style lang="less" scoped>
  .arco-form-item-content {
    .label {
      display: inline-block;
      width: 180px;
      padding-right: 10px;
    }
  }
</style>

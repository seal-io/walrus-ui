<template>
  <SpinCard top-gap :loading="loading">
    <GroupTitle title="新建视图" show-back></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('cost.analyse.table.name')"
        field="name"
        validate-trigger="change"
        :rules="[{ required: true, message: '视图名称必填' }]"
      >
        <a-input
          v-model="formData.name"
          :max-length="50"
          show-word-limit
        ></a-input>
      </a-form-item>
      <GroupTitle
        title="定义过滤条件"
        style="margin-top: 10px"
        :bordered="true"
      ></GroupTitle>
      <a-form-item
        :label="$t('cost.analyse.table.time')"
        field="timeRange"
        :validate-trigger="['change']"
        :rules="[{ required: true, message: '时间范围必选' }]"
      >
        <a-select v-model="formData.timeRange" @change="handleTimeChange">
          <a-option
            v-for="item in timeRangeOptions"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="分组依据"
        field="allocationQueries.0.groupBy"
        :rules="[{ required: true, message: '分组依据不能为空' }]"
      >
        <a-cascader
          v-model="formData.allocationQueries[0].groupBy"
          allow-search
          :options="groupByList"
          style="width: 360px"
          @change="handleGroupByChange"
        >
        </a-cascader>
      </a-form-item>
      <a-form-item
        v-if="!groupByDate.includes(formData.allocationQueries[0].groupBy)"
        label="粒度"
        :validate-trigger="['change']"
        field="allocationQueries.0.step"
        :rules="[{ required: true, message: '粒度不能为空' }]"
      >
        <a-cascader
          v-model="formData.allocationQueries[0].step"
          allow-search
          :options="stepList"
          style="width: 360px"
          @change="handleStepChange"
        >
        </a-cascader>
      </a-form-item>
      <a-form-item
        label="过滤器"
        field="allocationQueries.0.filters"
        :rules="[{ required: true, message: '过滤器不能为空' }]"
      >
        <ConditionFilter
          ref="allfilter"
          v-model:conditions="formData.allocationQueries[0].filters"
          :perspective-fields="perspectiveFields"
          :time-range="formData.timeRange"
        ></ConditionFilter>
      </a-form-item>
      <GroupTitle
        title="定义共享费用"
        style="margin-top: 10px"
        :bordered="true"
      ></GroupTitle>
      <a-form-item
        label="过滤器"
        field="allocationQueries.shareCosts.0.filters"
        :rules="[{ required: false, message: '过滤器不能为空' }]"
      >
        <ConditionFilter
          ref="costfilter"
          v-model:conditions="
            formData.allocationQueries[0].shareCosts[0].filters
          "
          :time-range="formData.timeRange"
          :perspective-fields="perspectiveFields"
        ></ConditionFilter>
      </a-form-item>

      <a-form-item
        label="空闲费用"
        field="formData.allocationQueries.0.shareCosts.0.idleCostFilters"
      >
        <a-select
          v-model="formData.allocationQueries[0].shareCosts[0].idleCostFilters"
          allow-search
          multiple
          :max-tag-count="1"
          :options="idleCostFieldList"
          style="width: 360px"
          @change="handleCostFilterChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="管理费用" field="managementCostFilters">
        <a-select
          v-model="
            formData.allocationQueries[0].shareCosts[0].managementCostFilters
          "
          allow-search
          multiple
          :max-tag-count="1"
          :options="idleCostFieldList"
          style="width: 360px"
          @change="handleCostFilterChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="分配方法"
        field="formData.allocationQueries.0.shareCosts.0.sharingStrategy"
      >
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
  </SpinCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, reactive } from 'vue';
  import {
    map,
    each,
    startsWith,
    find,
    get,
    pick,
    cloneDeep,
    assignIn,
    some,
    filter,
    includes
  } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import moduleWrapper from '@/views/application-management/applications/components/module-wrapper.vue';
  import ConditionFilter from '../components/condition-filter.vue';
  import { costShareMode, timeRangeOptions, DateShortCuts } from '../config';
  import { PerspectiveRowData, FieldsOptions } from '../config/interface';
  import {
    queryItemPerspective,
    createPerspective,
    updatePerspective,
    queryPerspectiveFields,
    queryPerspectiveFieldValues
  } from '../api';

  const { t, router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const allfilter = ref();
  const costfilter = ref();
  const groupByDate = ['day', 'week', 'month', 'year'];
  const perspectiveInfo = ref<any>({});
  const loading = ref(false);
  const submitLoading = ref(false);
  const perspectiveFields = ref<FieldsOptions[]>([]);
  const groupByList = ref<FieldsOptions[]>([]);
  const stepList = ref<FieldsOptions[]>([]);
  const idleCostFieldList = ref<FieldsOptions[]>([]);
  const formData = reactive({
    name: '',
    startTime: dayjs().subtract(6, 'day').format('YYYY-MM-DDTHH:mm:ssZ'),
    endTime: dayjs().subtract(0, 'day').format('YYYY-MM-DDT23:59:59Z'),
    builtin: false,
    timeRange: 'now-7d',
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

  const validateFilters = (val, callback) => {
    console.log('validateFilters=', val);
    const filters = get(formData, 'allocationQueries.0.filters') || [];
    if (some(filters, val)) {
      callback('值不能为空');
    }
  };
  const handleCancel = () => {
    router.back();
  };

  const setPerspectiveCostFilter = (data, callback) => {
    const idleCostFilters =
      get(data, 'allocationQueries.0.shareCosts.0.idleCostFilters') || [];
    const managementCostFilters =
      get(data, 'allocationQueries.0.shareCosts.0.managementCostFilters') || [];
    data.allocationQueries[0].shareCosts[0].idleCostFilters = map(
      idleCostFilters,
      callback
    ) as never[];
    data.allocationQueries[0].shareCosts[0].managementCostFilters = map(
      managementCostFilters,
      callback
    ) as never[];
  };
  const setConditionFilterFieldValues = (data) => {
    const filtersList = get(data, 'allocationQueries.0.filters') || [];
    each(filtersList, (item) => {
      each(item, (s) => {
        s.fieldValues = filter(idleCostFieldList.value, (p) => {
          return includes(s?.values, p.value);
        });
      });
    });
  };
  const validateForm = async () => {
    const res = await formref.value?.validate();
    const allres = allfilter.value.fieldVaildator();
    const costres = costfilter.value.fieldVaildator();
    return !res && allres && costres;
  };
  const handleOk = async () => {
    const res = await validateForm();
    console.log('formData====', res, formData);
    if (res) {
      try {
        submitLoading.value = true;
        const data = cloneDeep(formData);
        if (get(data, 'allocationQueries.0.step') === 'null') {
          data.allocationQueries[0].step = '';
        }
        data.endTime = 'now';
        data.startTime = data.timeRange;
        setPerspectiveCostFilter(data, (val) => {
          return {
            connectorID: val
          };
        });
        console.log('formData:', formData);
        if (id) {
          await updatePerspective({ ...data, id });
        } else {
          await createPerspective(data);
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
      loading.value = true;
      const { data } = await queryItemPerspective({ id });
      if (!get(data, 'allocationQueries.0.step')) {
        data.allocationQueries[0].step = 'null';
      }
      perspectiveInfo.value = data;
      assignIn(formData, data);
      formData.timeRange = formData.startTime;
      console.log('perspectiveInfo===', formData);
      setPerspectiveCostFilter(formData, (item) => {
        return item.connectorID;
      });
      setConditionFilterFieldValues(formData);
      loading.value = false;
    } catch (error) {
      loading.value = false;
      perspectiveInfo.value = {};
      console.log(error);
    }
  };

  const generatePerspectiveFields = (list) => {
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
    const labelGroup = labelList.length
      ? [
          {
            label: 'Label',
            value: 'labelGroup',
            children: [...labelList]
          }
        ]
      : [];
    return [...labelGroup, ...fieldList];
  };
  const getFieldValues = async () => {
    try {
      const dateData = find(
        DateShortCuts,
        (item) => item.timeControl === formData.timeRange
      );
      const params = {
        endTime:
          get(dateData, 'value.1') || dayjs().format('YYYY-MM-DDT23:59:59Z'),
        startTime:
          get(dateData, 'value.0') || dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        fieldName: 'connector_id',
        fieldType: 'filter'
      };
      const { data } = await queryPerspectiveFieldValues(params);
      const list = data?.items || [];
      idleCostFieldList.value = list;
      console.log('idleCostFieldList;', idleCostFieldList.value);
    } catch (error) {
      idleCostFieldList.value = [];
      console.log(error);
    }
  };
  const getPerspectiveGroupBy = async () => {
    try {
      const params = {
        ...pick(formData, ['startTime', 'endTime']),
        fieldType: 'groupBy'
      };
      const { data } = await queryPerspectiveFields(params);
      const list = data?.items || [];
      const resultList = generatePerspectiveFields(list);
      groupByList.value = resultList;
      console.log('groupByList===', JSON.stringify(list));
    } catch (error) {
      groupByList.value = [];
      console.log(error);
    }
  };
  const getPerspectiveStep = async () => {
    try {
      const params = {
        ...pick(formData, ['startTime', 'endTime']),
        fieldType: 'step'
      };
      const { data } = await queryPerspectiveFields(params);
      const list = data?.items || [];
      const resultList = generatePerspectiveFields(list);
      stepList.value = resultList;
      each(stepList.value, (o) => {
        if (o.label === 'Cumulative') {
          o.value = 'null';
        }
      });
    } catch (error) {
      stepList.value = [];
      console.log(error);
    }
  };
  const getPerspectiveFields = async () => {
    try {
      const params = {
        ...pick(formData, ['startTime', 'endTime']),
        fieldType: 'filter'
      };
      const { data } = await queryPerspectiveFields(params);
      const list = data?.items || [];
      const resultList = generatePerspectiveFields(list);
      perspectiveFields.value = resultList;
    } catch (error) {
      perspectiveFields.value = [];
      console.log(error);
    }
  };
  const handleTimeChange = (val) => {
    const data = find(DateShortCuts, (item) => item.timeControl === val);
    formData.startTime =
      get(data, 'value.0') || dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    formData.endTime =
      get(data, 'value.1') || dayjs().format('YYYY-MM-DDT23:59:59Z');
    getPerspectiveFields();
    getPerspectiveGroupBy();
    getPerspectiveStep();
    getFieldValues();
  };
  const handleGroupByChange = (val) => {
    if (!groupByDate.includes(val)) {
      formData.allocationQueries[0].step = '';
    }
  };
  const handleStepChange = (val) => {
    if (val) {
      groupByList.value = filter(groupByList.value, (item) => {
        return !groupByDate.includes(item.value);
      });
    }
  };
  const handleCostFilterChange = (val) => {};
  const init = async () => {
    loading.value = true;
    await Promise.all([getPerspectiveFields(), getFieldValues()]);
    loading.value = false;
    getPerspectiveInfo();
    getPerspectiveGroupBy();
    getPerspectiveStep();
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

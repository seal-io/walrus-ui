<template>
  <SpinCard top-gap :loading="loading" style="width: 100%">
    <GroupTitle
      :title="title"
      show-back
      :show-edit="pageAction === 'view' && !builtin"
      @edit="handleEdit"
    ></GroupTitle>
    <a-form
      ref="formref"
      :model="formData"
      auto-label-width
      label-align="right"
    >
      <a-form-item
        :label="$t('cost.analyse.table.name')"
        field="name"
        validate-trigger="change"
        :rules="[{ required: !viewable, message: '视图名称必填' }]"
      >
        <a-input
          v-if="!viewable"
          v-model="formData.name"
          :max-length="50"
          :show-word-limit="!viewable"
        ></a-input>
        <span v-else class="readonly-view-label">{{ formData.name }}</span>
        <template #extra>
          <span>All, Project, Cluster为系统内置名称</span>
        </template>
      </a-form-item>
      <GroupTitle
        title="定义费用单元"
        style="margin-top: 10px"
        :bordered="true"
      ></GroupTitle>
      <a-form-item
        :label="$t('cost.analyse.table.time')"
        field="timeRange"
        :validate-trigger="['change']"
        :rules="[{ required: !viewable, message: '时间范围必选' }]"
      >
        <a-select
          v-if="!viewable"
          v-model="formData.timeRange"
          @change="handleTimeChange"
        >
          <a-option
            v-for="item in timeRangeOptions"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          ></a-option>
        </a-select>
        <span v-else class="readonly-view-label">{{
          $t(getListLabel(formData.timeRange, timeRangeOptions) || '-')
        }}</span>
        <template v-if="!viewable" #extra>
          <span class="tips">切换时间范围将清空过滤器选项的值</span>
        </template>
      </a-form-item>
      <a-form-item
        label="分组依据"
        field="allocationQueries.0.groupBy"
        :rules="[{ required: !viewable, message: '分组依据不能为空' }]"
      >
        <a-cascader
          v-if="!viewable"
          v-model="formData.allocationQueries[0].groupBy"
          allow-search
          :options="groupList"
          style="width: 360px"
          @change="handleGroupByChange"
        >
        </a-cascader>
        <span v-else class="readonly-view-label">{{
          getListLabel(formData.allocationQueries[0].groupBy, groupList) || '-'
        }}</span>
      </a-form-item>
      <a-form-item
        v-if="!groupByDate.includes(formData.allocationQueries[0].groupBy)"
        label="粒度"
        :validate-trigger="['change']"
        field="allocationQueries.0.step"
        :rules="[{ required: !viewable, message: '粒度不能为空' }]"
      >
        <a-cascader
          v-if="!viewable"
          v-model="formData.allocationQueries[0].step"
          allow-search
          :options="stepList"
          style="width: 360px"
          @change="handleStepChange"
        >
        </a-cascader>
        <span v-else class="readonly-view-label">{{
          getListLabel(formData.allocationQueries[0].step, stepList) || '-'
        }}</span>
      </a-form-item>
      <a-form-item
        label="费用来源"
        field="allocationQueries.0.filters"
        :rules="[{ required: !viewable, message: '费用来源不能为空' }]"
      >
        <ConditionFilter
          v-if="
            (!viewable || formData.allocationQueries[0].filters.length) &&
            perspectiveInfo.name !== 'All'
          "
          ref="allfilter"
          v-model:conditions="formData.allocationQueries[0].filters"
          :viewable="viewable"
          :perspective-fields="perspectiveFields"
          :time-range="formData.timeRange"
        ></ConditionFilter>
        <span v-else class="readonly-view-label">{{
          perspectiveInfo.name === 'All' ? 'All' : '-'
        }}</span>
      </a-form-item>
      <GroupTitle
        title="公摊费用拆分规则"
        style="margin-top: 10px"
        :bordered="true"
      ></GroupTitle>
      <a-form-item
        label="公摊费用来源"
        field="allocationQueries.shareCosts.0.filters"
        :rules="[{ required: false, message: '公摊费用来源不能为空' }]"
      >
        <ConditionFilter
          v-if="
            !viewable ||
            formData.allocationQueries[0].shareCosts[0].filters.length
          "
          ref="costfilter"
          v-model:conditions="
            formData.allocationQueries[0].shareCosts[0].filters
          "
          :viewable="viewable"
          :time-range="formData.timeRange"
          :perspective-fields="perspectiveFields"
        ></ConditionFilter>
        <span v-else class="readonly-view-label"> - </span>
      </a-form-item>

      <a-form-item
        label="分摊集群空闲费用"
        field="allocationQueries.0.shareCosts.0.idleCostFilters"
      >
        <a-select
          v-if="!viewable"
          v-model="formData.allocationQueries[0].shareCosts[0].idleCostFilters"
          allow-search
          multiple
          :max-tag-count="1"
          :options="idleCostFieldList"
          style="width: 360px"
          @change="handleCostFilterChange"
        >
        </a-select>
        <span v-else class="readonly-view-label">{{
          getListLabel(
            formData.allocationQueries[0].shareCosts[0].idleCostFilters,
            idleCostFieldList
          ) || '-'
        }}</span>
      </a-form-item>
      <a-form-item label="分摊集群管理费用" field="managementCostFilters">
        <a-select
          v-if="!viewable"
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
        <span v-else class="readonly-view-label">{{
          getListLabel(
            formData.allocationQueries[0].shareCosts[0].managementCostFilters,
            idleCostFieldList
          ) || '-'
        }}</span>
      </a-form-item>
      <a-form-item
        label="分摊方式"
        field="allocationQueries.0.shareCosts.0.sharingStrategy"
        :rules="[
          {
            required: sharingStrategyRequired && !viewable,
            message: '分摊方式不能为空'
          }
        ]"
      >
        <a-radio-group
          v-if="!viewable"
          v-model="formData.allocationQueries[0].shareCosts[0].sharingStrategy"
        >
          <a-radio
            v-for="item in costShareMode"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
        <span v-else class="readonly-view-label">{{
          getListLabel(
            formData.allocationQueries[0].shareCosts[0].sharingStrategy,
            costShareMode
          ) || '-'
        }}</span>
      </a-form-item>
    </a-form>
    <EditPageFooter v-if="!viewable && !builtin">
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
  import { ref, reactive, computed } from 'vue';
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
    includes,
    pickBy,
    keys,
    isEqual
  } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { useTabBarStore } from '@/store';
  import { getListLabel } from '@/utils/func';
  import usePageAction from '@/hooks/use-page-action';
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

  const tabBarStore = useTabBarStore();
  const { pageAction, handleEdit } = usePageAction();
  const { t, router, route } = useCallCommon();
  const id = route.query.id as string;
  const builtin = ref(route.query.builtin || false);
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
  let copyFormData = {};
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

  const title = computed(() => {
    if (!id) {
      return '新建视图';
    }
    if (id && (pageAction.value === 'view' || builtin.value)) {
      return '视图详情';
    }
    return '编辑视图';
  });
  const viewable = computed(() => {
    return pageAction.value === 'view' || !!builtin.value;
  });
  const groupList = computed(() => {
    const step = get(formData, 'allocationQueries.0.step');
    if (step === 'null' || !step) return cloneDeep(groupByList.value);
    return filter(groupByList.value, (item) => {
      return !groupByDate.includes(item.value);
    });
  });
  const sharingStrategyRequired = computed(() => {
    const shareCostFilter = get(
      formData,
      'allocationQueries.0.shareCosts.0.filters'
    );
    const shareCostIdleCostFilters = get(
      formData,
      'allocationQueries.0.shareCosts.0.idleCostFilters'
    );
    const shareCostmanagementCostFilters = get(
      formData,
      'allocationQueries.0.shareCosts.0.managementCostFilters'
    );
    if (
      shareCostFilter?.length ||
      shareCostIdleCostFilters?.length ||
      shareCostmanagementCostFilters?.length
    ) {
      return true;
    }
    return false;
  });
  const validateFilters = (val, callback) => {
    console.log('validateFilters=', val);
    const filters = get(formData, 'allocationQueries.0.filters') || [];
    if (some(filters, val)) {
      callback('值不能为空');
    }
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
    const shareCostsFiltersList =
      get(data, 'allocationQueries.0.shareCosts.0.filters') || [];
    each(filtersList, (item) => {
      each(item, (s) => {
        s.fieldValues = filter(idleCostFieldList.value, (p) => {
          return includes(s?.values, p.value);
        });
      });
    });
    each(shareCostsFiltersList, (item) => {
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
  const setShareCostFilter = (list) => {
    const arr = map(list, (item) => {
      return {
        ...pickBy(item, (val) => val?.length)
      };
    });
    return filter(arr, (o) => keys(o).length);
  };
  const handleOk = async () => {
    if (isEqual(copyFormData, formData)) {
      router.back();
      return;
    }
    const res = await validateForm();
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
        const shareCost = setShareCostFilter(
          get(data, 'allocationQueries.0.shareCosts') || []
        );
        data.allocationQueries[0].shareCosts = shareCost as never[];
        if (id) {
          await updatePerspective({ ...data, id });
        } else {
          await createPerspective(data);
          tabBarStore.deleteTag(0, {
            title: '',
            name: 'CostAnalyseList',
            fullPath: ''
          });
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
      builtin.value = data?.builtin || false;
      if (!get(data, 'allocationQueries.0.step')) {
        data.allocationQueries[0].step = 'null';
      }
      perspectiveInfo.value = data;
      const shareCost = {
        filters: get(data, 'allocationQueries.0.shareCosts.0.filters') || [],
        idleCostFilters:
          get(data, 'allocationQueries.0.shareCosts.0.idleCostFilters') || [],
        managementCostFilters:
          get(data, 'allocationQueries.0.shareCosts.0.managementCostFilters') ||
          [],
        sharingStrategy:
          get(data, 'allocationQueries.0.shareCosts.0.sharingStrategy') || ''
      };
      data.allocationQueries[0].shareCosts = [{ ...shareCost }];
      assignIn(formData, data);
      formData.timeRange = formData.startTime;
      console.log('perspectiveInfo===', formData);
      setPerspectiveCostFilter(formData, (item) => {
        return item.connectorID;
      });
      setConditionFilterFieldValues(formData);
      setTimeout(() => {
        loading.value = false;
      }, 100);
    } catch (error) {
      setTimeout(() => {
        loading.value = false;
      }, 100);
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
          get(dateData, 'value.1') ||
          dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00'),
        startTime:
          get(dateData, 'value.0') ||
          dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00'),
        fieldName: 'connector_id',
        fieldType: 'filter'
      };
      const { data } = await queryPerspectiveFieldValues(params);
      const list = data?.items || [];
      idleCostFieldList.value = list;
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
      // console.log('groupByList===', JSON.stringify(list));
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
  const setDateRange = () => {
    const data = find(
      DateShortCuts,
      (item) => item.timeControl === formData.timeRange
    );
    formData.startTime =
      get(data, 'value.0') || dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00');
    formData.endTime =
      get(data, 'value.1') || dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00');
  };
  const resetFilterFieldValue = () => {
    // formData.allocationQueries[0].filters
    // formData.allocationQueries[0].shareCosts[0].filters
    each(formData.allocationQueries[0].filters, (item) => {
      each(item || [], (sItem: any) => {
        console.log('sItem=======', sItem);
        sItem.values = [];
      });
    });
    each(formData.allocationQueries[0].shareCosts[0].filters, (item) => {
      each(item || [], (sItem: any) => {
        sItem.values = [];
      });
    });
  };
  const handleTimeChange = (val) => {
    setDateRange();
    resetFilterFieldValue();
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
    console.log('step:', val);
  };
  const handleCostFilterChange = (val) => {};
  const handleCancel = () => {
    if (
      pageAction.value === 'edit' &&
      route.params.action === 'view' &&
      !builtin.value
    ) {
      pageAction.value = 'view';
      getPerspectiveInfo();
      return;
    }
    router.back();
  };
  const init = async () => {
    loading.value = true;
    setDateRange();
    await Promise.all([getPerspectiveFields(), getFieldValues()]);
    loading.value = false;
    getPerspectiveInfo();
    getPerspectiveGroupBy();
    getPerspectiveStep();
    setTimeout(() => {
      copyFormData = cloneDeep(formData);
    }, 100);
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

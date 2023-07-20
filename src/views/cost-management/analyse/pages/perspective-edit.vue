<template>
  <div class="perspective-box">
    <BreadWrapper>
      <Breadcrumb
        :items="[
          {
            label: $t('navbar.costmanagement'),
            icon: 'icon-bar-chart',
            backAction: true,
            route: 'CostManangement'
          },
          {
            label: title
          }
        ]"
      ></Breadcrumb>
    </BreadWrapper>
    <SpinCard :loading="loading" style="width: 100%">
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="pageAction === PageAction.VIEW && !builtin"
        @edit="handleEdit"
      ></GroupTitle>
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        label-align="left"
      >
        <ComCard padding="0">
          <a-form-item
            :label="$t('cost.analyse.table.name')"
            field="name"
            validate-trigger="change"
            hide-label
            :rules="[
              {
                required: true,
                match: validateLabelNameRegx,
                message: $t('common.validate.labelName')
              }
            ]"
          >
            <seal-input
              v-if="!viewable"
              v-model.trim="formData.name"
              :label="$t('cost.analyse.table.name')"
              :required="true"
              :max-length="63"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :show-word-limit="!viewable"
            ></seal-input>
            <span v-else class="readonly-view-label">{{ formData.name }}</span>
            <template v-if="!viewable" #extra>
              <div :style="{ maxWidth: `${InputWidth.LARGE}px` }">{{
                $t('common.validate.labelName')
              }}</div>
            </template>
          </a-form-item>
        </ComCard>

        <GroupTitle
          :title="$t('cost.optimize.form.title.group1')"
          flex-start
          class="m-t-20"
          :bordered="false"
        ></GroupTitle>
        <a-form-item
          :label="$t('cost.analyse.table.time')"
          field="timeRange"
          hide-label
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('cost.optimize.form.rule.time')
            }
          ]"
        >
          <seal-select
            v-if="!viewable"
            v-model="formData.timeRange"
            :label="$t('cost.analyse.table.time')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleTimeChange"
          >
            <a-option
              v-for="item in timeRangeOptions"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </seal-select>
          <span v-else class="readonly-view-label">{{
            $t(getListLabel(formData.timeRange, timeRangeOptions) || '-')
          }}</span>
          <template v-if="!viewable" #extra>
            <span class="tips">{{
              $t('cost.optimize.form.timeRange.tips')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.groupby')"
          field="allocationQueries.0.groupBy"
          hide-label
          :rules="[
            {
              required: true,
              message: $t('cost.optimize.form.rule.groupby')
            }
          ]"
        >
          <seal-cascader
            v-if="!viewable"
            v-model="formData.allocationQueries[0].groupBy"
            :label="$t('cost.optimize.form.groupby')"
            :required="true"
            allow-search
            :options="groupList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleGroupByChange"
          >
          </seal-cascader>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(formData.allocationQueries[0].groupBy, groupList) ||
                '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          v-if="!groupByDate.includes(formData.allocationQueries[0].groupBy)"
          :label="$t('cost.optimize.form.step')"
          :validate-trigger="['change']"
          hide-label
          field="allocationQueries.0.step"
          :rules="[
            {
              required: true,
              message: $t('cost.optimize.form.rule.step')
            }
          ]"
        >
          <seal-cascader
            v-if="!viewable"
            v-model="formData.allocationQueries[0].step"
            :label="$t('cost.optimize.form.step')"
            :required="true"
            allow-search
            :options="stepList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleStepChange"
          >
          </seal-cascader>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(formData.allocationQueries[0].step, stepList) || '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.costFilter')"
          field="allocationQueries.0.filters"
          hide-label
          :rules="[
            {
              required: true,
              message: $t('cost.optimize.form.rule.cost')
            }
          ]"
        >
          <SealFormItemWrap
            v-if="
              (!viewable || formData.allocationQueries[0].filters.length) &&
              perspectiveInfo.name !== AllPerspectiveName
            "
            :label="$t('cost.optimize.form.costFilter')"
            :required="true"
            :style="{ minWidth: `${InputWidth.LARGE}px` }"
          >
            <ConditionFilter
              ref="allfilter"
              v-model:conditions="formData.allocationQueries[0].filters"
              :viewable="viewable"
              :perspective-fields="perspectiveFields"
              :time-range="formData.timeRange"
            ></ConditionFilter>
          </SealFormItemWrap>
          <span v-else class="readonly-view-label">{{
            perspectiveInfo.name === AllPerspectiveName
              ? AllPerspectiveName
              : '-'
          }}</span>
        </a-form-item>
        <GroupTitle
          :title="$t('cost.optimize.form.title.group2')"
          flex-start
          class="m-t-20"
          :bordered="false"
        ></GroupTitle>
        <a-form-item
          :label="$t('cost.optimize.form.commonCost')"
          field="allocationQueries.shareCosts.0.filters"
          hide-label
        >
          <SealFormItemWrap
            v-if="
              !viewable ||
              formData.allocationQueries[0].shareCosts[0].filters.length
            "
            :label="$t('cost.optimize.form.commonCost')"
            :style="{ minWidth: `${InputWidth.LARGE}px` }"
          >
            <ConditionFilter
              ref="costfilter"
              v-model:conditions="
                formData.allocationQueries[0].shareCosts[0].filters
              "
              :viewable="viewable"
              :time-range="formData.timeRange"
              :perspective-fields="perspectiveFields"
            ></ConditionFilter>
          </SealFormItemWrap>

          <span v-else class="readonly-view-label"> - </span>
        </a-form-item>

        <a-form-item
          :label="$t('cost.optimize.form.shareCost')"
          hide-label
          field="allocationQueries.0.shareCosts.0.idleCostFilters"
        >
          <seal-select
            v-if="!viewable"
            v-model="
              formData.allocationQueries[0].shareCosts[0].idleCostFilters
            "
            :label="$t('cost.optimize.form.shareCost')"
            allow-search
            multiple
            :max-tag-count="1"
            :options="idleCostFieldList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleCostFilterChange"
          >
          </seal-select>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(
                formData.allocationQueries[0].shareCosts[0].idleCostFilters,
                idleCostFieldList
              ) || '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.sharemngCost')"
          hide-label
          field="managementCostFilters"
        >
          <seal-select
            v-if="!viewable"
            v-model="
              formData.allocationQueries[0].shareCosts[0].managementCostFilters
            "
            :label="$t('cost.optimize.form.sharemngCost')"
            allow-search
            multiple
            :max-tag-count="1"
            :options="idleCostFieldList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleCostFilterChange"
          >
          </seal-select>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(
                formData.allocationQueries[0].shareCosts[0]
                  .managementCostFilters,
                idleCostFieldList
              ) || '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.shareType')"
          hide-label
          field="allocationQueries.0.shareCosts.0.sharingStrategy"
          :rules="[
            {
              required: sharingStrategyRequired && !viewable,
              message: $t('cost.optimize.form.rule.shareType')
            }
          ]"
        >
          <SealFormItemWrap
            v-if="!viewable"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :label="$t('cost.optimize.form.shareType')"
          >
            <a-radio-group
              v-model="
                formData.allocationQueries[0].shareCosts[0].sharingStrategy
              "
            >
              <a-radio
                v-for="item in costShareMode"
                :key="item.value"
                :value="item.value"
                >{{ $t(item.label) }}</a-radio
              >
            </a-radio-group>
          </SealFormItemWrap>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(
                formData.allocationQueries[0].shareCosts[0].sharingStrategy,
                costShareMode
              ) || '-'
            )
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
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { COSTMANAGEMENT } from '@/router/config';
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
  import {
    PageAction,
    validateLabelNameRegx,
    InputWidth
  } from '@/views/config';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { useTabBarStore } from '@/store';
  import { getListLabel } from '@/utils/func';
  import usePageAction from '@/hooks/use-page-action';
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

  const AllPerspectiveName = 'All';
  const { scrollToView } = useScrollToView();
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
      return t('cost.analyse.table.create');
    }
    if (id && (pageAction.value === PageAction.VIEW || builtin.value)) {
      return t('cost.analyse.table.view');
    }
    return t('cost.analyse.table.edit');
  });
  const viewable = computed(() => {
    return pageAction.value === PageAction.VIEW || !!builtin.value;
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
    if (isEqual(copyFormData, formData) && id) {
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
        copyFormData = cloneDeep(formData);
        if (id) {
          await updatePerspective({ ...data, id });
        } else {
          await createPerspective(data);
          tabBarStore.deleteTag(0, {
            title: '',
            name: COSTMANAGEMENT.List,
            fullPath: ''
          });
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      scrollToView();
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
      groupByList.value = resultList.filter((sItem) => sItem.value !== 'year');
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
      stepList.value = resultList.filter((sItem) => sItem.value !== 'year');
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
  const cancelCallback = () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW &&
      !builtin.value
    ) {
      pageAction.value = PageAction.VIEW;
      getPerspectiveInfo();
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData);
          router.push({
            name: to.name as string
          });
        }
      });
      return false;
    }
    return true;
  });
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
  .perspective-box {
    // :deep(.arco-form) {
    //   .group-title {
    //     margin-bottom: 25px;

    //     .title-wrap {
    //       justify-content: flex-start;
    //     }
    //   }
    // }
    .arco-form-item-content {
      .label {
        display: inline-block;
        width: 180px;
        padding-right: 10px;
      }
    }
  }
</style>

<style lang="less">
  .arco-cascader-panel {
    height: max-content;
  }
</style>

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
            :validate-trigger="['change', 'input']"
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
              :disabled="!!id"
              :max-length="63"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :show-word-limit="!viewable"
            ></seal-input>
            <span v-else class="readonly-view-label">{{ formData.name }}</span>
            <!-- <template v-if="!viewable" #extra>
              <div :style="{ maxWidth: `${InputWidth.LARGE}px` }">{{
                $t('common.validate.labelName')
              }}</div>
            </template> -->
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
          field="costQueries.0.groupBy"
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
            v-model="formData.costQueries[0].groupBy"
            :label="$t('cost.optimize.form.groupby')"
            :required="true"
            allow-search
            :options="groupList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleGroupByChange"
          >
          </seal-cascader>
          <span v-else class="readonly-view-label">{{
            $t(getListLabel(formData.costQueries[0].groupBy, groupList) || '-')
          }}</span>
        </a-form-item>
        <a-form-item
          v-if="!groupByDate.includes(formData.costQueries[0].groupBy)"
          :label="$t('cost.optimize.form.step')"
          :validate-trigger="['change']"
          hide-label
          field="costQueries.0.step"
          :rules="[
            {
              required: true,
              message: $t('cost.optimize.form.rule.step')
            }
          ]"
        >
          <seal-cascader
            v-if="!viewable"
            v-model="formData.costQueries[0].step"
            :label="$t('cost.optimize.form.step')"
            :required="true"
            allow-search
            :options="stepList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleStepChange"
          >
          </seal-cascader>
          <span v-else class="readonly-view-label">{{
            $t(getListLabel(formData.costQueries[0].step, stepList) || '-')
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.costFilter')"
          field="costQueries.0.filters"
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
              (!viewable || formData.costQueries[0].filters.length) &&
              perspectiveInfo.name !== AllPerspectiveName
            "
            :label="$t('cost.optimize.form.costFilter')"
            :required="true"
            :style="{ minWidth: `${InputWidth.LARGE}px` }"
          >
            <ConditionFilter
              ref="allfilter"
              v-model:conditions="formData.costQueries[0].filters"
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
          :label="$t('cost.optimize.form.shareCost')"
          hide-label
          field="costQueries.0.sharedOptions.idle.sharingStrategy"
        >
          <seal-select
            v-if="!viewable"
            v-model="formData.costQueries[0].sharedOptions.idle.sharingStrategy"
            allow-clear
            :label="$t('cost.optimize.form.shareCost')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleCostFilterChange"
          >
            <a-option
              v-for="item in costShareMode"
              :key="item.value"
              :value="item.value"
            >
              {{ $t(item.label) }}
            </a-option>
          </seal-select>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(
                formData.costQueries[0].sharedOptions.idle.sharingStrategy,
                costShareMode
              ) || '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.sharemngCost')"
          hide-label
          field="costQueries.0.sharedOptions.management.sharingStrategy"
        >
          <seal-select
            v-if="!viewable"
            v-model="
              formData.costQueries[0].sharedOptions.management.sharingStrategy
            "
            allow-clear
            :label="$t('cost.optimize.form.sharemngCost')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleCostFilterChange"
          >
            <a-option
              v-for="item in costShareMode"
              :key="item.value"
              :value="item.value"
            >
              {{ $t(item.label) }}
            </a-option>
          </seal-select>
          <span v-else class="readonly-view-label">{{
            $t(
              getListLabel(
                formData.costQueries[0].sharedOptions.management
                  .sharingStrategy,
                costShareMode
              ) || '-'
            )
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('cost.optimize.form.commonCost')"
          field="costQueries.sharedOptions.item"
          hide-label
        >
          <div v-if="!viewable" class="flex flex-column">
            <div
              v-for="(item, index) in formData.costQueries[0].sharedOptions
                .item"
              :key="index"
              class="flex flex-align-center flex-justify-between m-b-10"
            >
              <SealFormItemWrap
                :label="$t('cost.optimize.form.commonCost')"
                :style="{ minWidth: `${InputWidth.LARGE}px` }"
              >
                <div>
                  <ConditionFilter
                    :ref="(el) => setRefMap(el, `costfilter${index}`)"
                    v-model:conditions="item.filters"
                    :viewable="viewable"
                    :time-range="formData.timeRange"
                    :error="
                      !item.filters?.length &&
                      !!item.sharingStrategy &&
                      triggerValidate
                    "
                    :perspective-fields="perspectiveFields"
                  ></ConditionFilter>
                  <div class="m-t-10">
                    <seal-select
                      v-model="item.sharingStrategy"
                      allow-clear
                      :error="
                        !item.sharingStrategy &&
                        triggerValidate &&
                        item.filters.length
                      "
                      :style="{ minWidth: `${InputWidth.MIDDLE}px` }"
                      :label="$t('cost.optimize.form.sharingStrategy')"
                    >
                      <a-option
                        v-for="item in costShareMode"
                        :key="item.value"
                        :value="item.value"
                        >{{ $t(item.label) }}</a-option
                      >
                    </seal-select>
                  </div>
                </div>
              </SealFormItemWrap>
              <div class="btn-group m-l-10 flex flex-start" style="width: 66px">
                <a-button
                  type="text"
                  size="small"
                  class="m-r-10"
                  @click="handleDeleteShareOptionItem(index)"
                >
                  <template #icon>
                    <icon-minus-circle class="size-20"
                  /></template>
                </a-button>
                <a-button
                  v-if="
                    index ===
                    formData.costQueries[0].sharedOptions.item.length - 1
                  "
                  type="text"
                  size="small"
                  @click="handleAddShareOptionItem"
                >
                  <template #icon
                    ><icon-plus-circle-fill class="size-20"
                  /></template>
                </a-button>
              </div>
            </div>
            <SealFormItemWrap
              v-if="!formData.costQueries[0].sharedOptions.item.length"
              :label="$t('cost.optimize.form.commonCost')"
              :style="{ minWidth: `${InputWidth.LARGE}px` }"
            >
              <div
                class="fill-width seal-bordered border-radius-4 p-16 align-center"
              >
                <a-button
                  type="text"
                  size="small"
                  @click="handleAddShareOptionItem"
                >
                  <template #icon><icon-plus /></template>
                  {{ $t('cost.analyse.view.strategy') }}
                </a-button>
              </div>
            </SealFormItemWrap>
          </div>
          <span v-else class="readonly-view-label"> - </span>
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
  import _, {
    map,
    each,
    startsWith,
    find,
    get,
    pick,
    cloneDeep,
    assignIn,
    filter,
    includes,
    pickBy,
    keys,
    isEqual,
    omit
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
  import useDynamicRef from '@/hooks/use-dynamic-ref';
  import ConditionFilter from '../components/condition-filter.vue';
  import { costShareMode, timeRangeOptions, DateShortCuts } from '../config';
  import { FieldsOptions } from '../config/interface';
  import {
    queryItemPerspective,
    createPerspective,
    updatePerspective,
    queryPerspectiveFields,
    queryPerspectiveFieldValues
  } from '../api';

  const AllPerspectiveName = 'All';
  const { refMap, setRefMap } = useDynamicRef();
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
  const triggerValidate = ref(false);
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
    costQueries: [
      {
        groupBy: '',
        step: '',
        filters: [],
        sharedOptions: {
          item: [{ filters: [], sharingStrategy: '' }],
          idle: {
            sharingStrategy: ''
          },
          management: {
            sharingStrategy: ''
          }
        }
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
    const step = get(formData, 'costQueries.0.step');
    if (step === 'null' || !step) return cloneDeep(groupByList.value);
    return filter(groupByList.value, (item) => {
      return !groupByDate.includes(item.value);
    });
  });

  const handleDeleteShareOptionItem = (index) => {
    formData.costQueries[0].sharedOptions.item.splice(index, 1);
  };
  const handleAddShareOptionItem = () => {
    formData.costQueries[0].sharedOptions.item.push({
      filters: [],
      sharingStrategy: ''
    });
  };
  const setPerspectiveCostFilter = (data, isInit?: boolean) => {
    const sharedOptions = get(data, 'costQueries.0.sharedOptions');
    if (!sharedOptions) {
      data.costQueries[0].sharedOptions = {};
    }
    const idleCostFilters = get(data, 'costQueries.0.sharedOptions.idle') || {
      sharingStrategy: ''
    };
    const managementCostFilters = get(
      data,
      'costQueries.0.sharedOptions.management'
    ) || {
      sharingStrategy: ''
    };
    let sharedItem = get(data, 'costQueries.0.sharedOptions.item') || [];
    if (isInit && !sharedItem.length) {
      sharedItem = [{ filters: [], sharingStrategy: '' }];
    }
    data.costQueries[0].sharedOptions.item = sharedItem;
    data.costQueries[0].sharedOptions.idle = idleCostFilters;
    data.costQueries[0].sharedOptions.management = managementCostFilters;
  };
  const pickPerspectiveCostFilter = (data) => {
    data.costQueries[0].sharedOptions.item = _.filter(
      data.costQueries[0].sharedOptions.item,
      (item) => {
        return item.filters.length && item.sharingStrategy;
      }
    ).map((sItem) => {
      return _.pickBy(sItem, (val) => val?.length);
    });

    data.costQueries[0].sharedOptions.idle = _.pickBy(
      data.costQueries[0].sharedOptions.idle,
      (val) => val
    );
    data.costQueries[0].sharedOptions.management = _.pickBy(
      data.costQueries[0].sharedOptions.management,
      (val) => val
    );
    data.costQueries[0].sharedOptions = _.pickBy(
      data.costQueries[0].sharedOptions,
      (val) => !_.isEmpty(val)
    );
    if (_.isEmpty(data.costQueries[0].sharedOptions)) {
      data.costQueries[0] = omit(data.costQueries[0], 'sharedOptions');
    }
  };
  const setConditionFilterFieldValues = (data) => {
    const filtersList = get(data, 'costQueries.0.filters') || [];
    const shareItems = get(data, 'costQueries.0.sharedOptions.item') || [];
    each(filtersList, (item) => {
      each(item, (s) => {
        s.fieldValues = filter(idleCostFieldList.value, (p) => {
          return includes(s?.values, p.value);
        });
      });
    });
    each(shareItems, (item) => {
      each(item.filters, (o) => {
        each(o, (s) => {
          s.fieldValues = filter(idleCostFieldList.value, (p) => {
            return includes(s?.values, p.value);
          });
        });
      });
    });
  };
  const validateCostFilter = () => {
    if (keys(refMap.value).length) {
      const res = _.every(_.keys(refMap.value), (key) => {
        const refEl = refMap.value[key];
        return refEl?.fieldVaildator?.();
      });
      return res;
    }
    return true;
  };
  const validateCostFilerStrategy = () => {
    const res = _.every(formData.costQueries[0].sharedOptions.item, (item) => {
      // optimize the validation
      return (
        (item.filters?.length && item.sharingStrategy) ||
        (!item.filters?.length && !item.sharingStrategy)
      );
    });
    return res;
  };
  const validateForm = async () => {
    const res = await formref.value?.validate();
    const allres = allfilter.value.fieldVaildator();
    const costres = validateCostFilter();
    const strategyres = validateCostFilerStrategy();
    return !res && allres && costres && strategyres;
  };

  const handleOk = async () => {
    const res = await validateForm();
    // trigger the validation not from the form
    triggerValidate.value = true;
    if (res) {
      try {
        submitLoading.value = true;
        const data = cloneDeep(formData);
        if (get(data, 'costQueries.0.step') === 'null') {
          data.costQueries[0].step = '';
        }
        data.endTime = 'now';
        data.startTime = data.timeRange;
        setPerspectiveCostFilter(data);
        pickPerspectiveCostFilter(data);
        // when the data is not changed, do not submit
        if (isEqual(copyFormData, data) && id) {
          copyFormData = cloneDeep(formData);
          router.back();
          return;
        }
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
      if (!get(data, 'costQueries.0.step')) {
        data.costQueries[0].step = 'null';
      }
      perspectiveInfo.value = data;
      assignIn(formData, data);
      formData.timeRange = formData.startTime;
      setPerspectiveCostFilter(formData, true);
      setConditionFilterFieldValues(formData);
      setTimeout(() => {
        loading.value = false;
      }, 100);
    } catch (error) {
      setTimeout(() => {
        loading.value = false;
      }, 100);
      perspectiveInfo.value = {};
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
    } catch (error) {
      groupByList.value = [];
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
    each(formData.costQueries[0].filters, (item) => {
      each(item || [], (sItem: any) => {
        sItem.values = [];
      });
    });
    each(formData.costQueries[0].sharedOptions.item, (item) => {
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
      formData.costQueries[0].step = '';
    }
  };
  const handleStepChange = (val) => {};
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
            path: to.path as string
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

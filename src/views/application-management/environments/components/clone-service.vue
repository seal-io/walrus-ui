<template>
  <div>
    <div class="svc-wrapper">
      <a-spin :loading="asyncLoading" style="width: 100%">
        <a-grid :cols="24" :row-gap="8" :col-gap="8">
          <a-grid-item v-for="item in editServiceList" :key="item.id" :span="6">
            <serviceThumb
              style="width: 100%; height: 90px"
              :active="item.id === active"
              :data-info="item"
              @click="handleClickInstance(item)"
            >
              <template #description>
                <span style="font-size: 13px">{{
                  _.get(item, 'environment.name')
                }}</span>
              </template>
              <template #default>
                <span style="font-weight: 700; font-size: 13px">{{
                  _.get(item, 'name')
                }}</span>
              </template>
              <template #status>
                <div v-if="showCheck">
                  <a-checkbox
                    :model-value="selectedList.has(item.id)"
                    @click.stop="() => {}"
                    @change="(val) => handleCheckChange(val, item)"
                  ></a-checkbox>
                </div>
              </template>
            </serviceThumb>
          </a-grid-item>
        </a-grid>
      </a-spin>
    </div>
    <div v-if="active" v-show="show" class="bordered">
      <a-alert :show-icon="true" style="margin-bottom: 10px">
        <span>
          <span>{{ $t('applications.applications.edit') }}</span>
          <span v-show="hasChange" class="change-tips">{{
            `(${$t('common.tips.change')})`
          }}</span>
        </span>
        <template #action>
          <EditPageFooter style="margin-top: 0; padding: 0">
            <template #save>
              <a-button
                type="primary"
                size="small"
                class="cap-title"
                @click="handleOk"
                >{{ $t('common.button.confirm') }}</a-button
              >
            </template>
            <template #cancel>
              <a-button
                size="small"
                :type="'outline'"
                class="cap-title"
                @click="handleCancel"
                >{{ $t('common.button.cancel') }}</a-button
              >
            </template>
          </EditPageFooter>
        </template>
      </a-alert>
      <GroupTitle
        :title="$t('applications.applications.detail.basic')"
        :bordered="false"
        flex-start
        style="margin: 30px 0 10px 0"
      ></GroupTitle>
      <div class="variables">
        <a-form
          ref="formref"
          :model="formData"
          auto-label-width
          layout="vertical"
        >
          <a-form-item
            :label="$t('operation.environments.table.name')"
            field="name"
            hide-label
            :validate-trigger="['change']"
            :rules="[
              {
                required: pageAction === PageAction.EDIT,
                match: validateLabelNameRegx,
                message: $t('common.validate.labelName')
              }
            ]"
          >
            <seal-input
              v-model="formData.name"
              style="width: 100%"
              :max-length="63"
              :required="pageAction === PageAction.EDIT"
              :label="$t('operation.environments.table.name')"
              show-word-limit
            ></seal-input>
            <template #extra>
              <div style="max-width: 500px">{{
                $t('common.validate.labelName')
              }}</div>
            </template>
          </a-form-item>
          <a-form-item
            :label="$t(`applications.projects.form.label`)"
            hide-label
          >
            <SealFormItemWrap
              :label="$t(`applications.projects.form.label`)"
              style="width: 100%"
            >
              <a-space
                v-if="labelList?.length"
                style="display: flex; flex-direction: column"
                direction="vertical"
              >
                <xInputGroup
                  v-for="(sItem, sIndex) in labelList"
                  :key="sIndex"
                  v-model:dataKey="sItem.key"
                  v-model:dataValue="sItem.value"
                  v-model:value="formData.labels"
                  :data-item="{
                    style: {
                      key: {
                        'display': 'flex',
                        'flex': 1,
                        'align-items': 'center'
                      }
                    }
                  }"
                  :trigger-validate="validateTrigger"
                  :label-list="labelList"
                  :position="sIndex"
                  @add="(obj) => handleAddLabel(obj, labelList)"
                  @delete="handleDeleteLabel(labelList, sIndex)"
                ></xInputGroup>
              </a-space>
            </SealFormItemWrap>
          </a-form-item>
          <a-form-item :label="$t('common.table.description')" hide-label>
            <seal-textarea
              v-model="formData.description"
              :label="$t('common.table.description')"
              :max-length="200"
              show-word-limit
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            ></seal-textarea>
          </a-form-item>
        </a-form>
        <GroupTitle
          :title="$t('applications.applications.detail.configuration')"
          :bordered="false"
          flex-start
          style="margin: 10px 0 0 0"
        ></GroupTitle>
        <a-tabs
          v-if="formTabs.length > 1"
          class="page-line-tabs"
          :active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="(group, index) in formTabs"
            :key="`schemaForm${index}`"
            :title="variablesGroup[group]?.label"
          >
            <formCreate
              :ref="(el: refItem) => setRefMap(el, `schemaForm${index}`)"
              :form-id="`schemaForm${index}`"
              layout="vertical"
              action="post"
              api=""
              :show-footer="false"
              :submit="() => {}"
              :attributes="variableAttributes"
              :model="variablesGroupForm[group]?.attributes"
              :form-schema="variablesGroup[group]?.variables"
            >
            </formCreate>
          </a-tab-pane>
        </a-tabs>
        <formCreate
          v-if="formTabs.length < 2"
          ref="schemaForm"
          form-id="schemaForm"
          layout="vertical"
          action="post"
          api=""
          :show-footer="false"
          :submit="() => {}"
          :model="variablesGroupForm[defaultGroupKey]?.attributes"
          :form-schema="variablesGroup[defaultGroupKey]?.variables"
        >
        </formCreate>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PageAction, validateLabelNameRegx } from '@/views/config';
  import {
    ref,
    PropType,
    computed,
    ComponentPublicInstance,
    provide,
    watch,
    defineExpose
  } from 'vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupTitle from '@/components/group-title/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import serviceThumb from '../../services/components/service-thumb.vue';
  import { ServiceRowData } from '../../services/config/interface';
  import useServiceData from '../../services/hooks/use-service-data';

  type refItem = Element | ComponentPublicInstance | null;

  const props = defineProps({
    serviceList: {
      type: Array as PropType<ServiceRowData[]>,
      default() {
        return [];
      }
    },
    showCheck: {
      type: Boolean,
      default() {
        return true;
      }
    },
    asyncLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const {
    id,
    init,
    generateVariablesGroup,
    setFormAttributes,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
    getTemplatesVersions,
    initCompleteData,
    serviceInfo,
    formData,
    pageAction,
    defaultGroupKey,
    templateInfo,
    variablesGroup,
    variablesGroupForm,
    templateVersionList,
    templateVersionFormCache,
    serviceDataList,
    templateList,
    completeData,
    title,
    refMap,
    asyncLoading,
    setRefMap
  } = useServiceData();
  const {
    labelList,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList,
    validateTrigger
  } = useLabelsActions(formData);
  const { scrollToView } = useScrollToView();
  provide('showHintInput', true);
  provide('completeData', completeData);
  const active = ref('');
  const selectedList = ref(new Set());
  const editServiceList = ref<any[]>([]);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const formref = ref();
  const show = ref(true);
  const activeServiceInfo = ref<any>({});
  const variableAttributes = ref<any>({});
  const hasChange = ref(false);
  let copyFormData: any = null;

  const formTabs = computed(() => {
    const list = _.keys(variablesGroup.value);
    if (_.includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ..._.pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });

  // get group form data
  const getRefFormData = async (noValidate?: boolean) => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        const moduleForm = await refEL?.getFormData?.(noValidate);
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };

  const getFormData = async (noValidate?: boolean) => {
    let moduleFormList: any[] = [];
    if (_.keys(variablesGroup.value).length > 1) {
      moduleFormList = await getRefFormData(noValidate);
    } else {
      const result = await schemaForm.value?.getFormData(noValidate);
      moduleFormList = [{ formData: result }];
    }
    return moduleFormList;
  };

  const checkFormDataHasChange = async () => {
    const moduleFormList = await getFormData(true);
    copyFormData.attributes = {
      ..._.reduce(
        moduleFormList,
        (obj, s) => {
          obj = {
            ...obj,
            ...s.formData
          };
          return obj;
        },
        {}
      )
    };
    return !_.isEqual(copyFormData, formData);
  };
  const handleClickInstance = async (data) => {
    if (active.value === data.id && show.value) {
      return;
    }
    if (show.value && active.value) {
      hasChange.value = await checkFormDataHasChange();
    }
    if (hasChange.value) {
      return;
    }

    active.value = data.id;
    show.value = true;
    activeKey.value = 'schemaForm0';
    activeServiceInfo.value = data;
    serviceInfo.value = _.cloneDeep(data);
    await setFormAttributes();
    generateVariablesGroup(PageAction.EDIT);
    getLabelList();
    copyFormData = _.cloneDeep(formData);
  };
  const handleCheckChange = (checked, item) => {
    if (checked) {
      selectedList.value.add(item.id);
    } else {
      selectedList.value.delete(item.id);
    }
  };

  const setVariableAttributes = async () => {
    const moduleFormList = await getFormData(true);
    variableAttributes.value = _.reduce(
      moduleFormList,
      (obj, s) => {
        obj = {
          ...obj,
          ...s.formData
        };
        return obj;
      },
      {}
    );
  };

  const handleTabChange = (val) => {
    activeKey.value = val;
    setVariableAttributes();
  };

  const validateFormData = async () => {
    const moduleFormList = await getFormData();
    const validFailedForm = _.find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    return { validFailedForm, moduleFormList };
  };
  const updateCompleteData = (oldName, newName) => {
    if (completeData.value.service[newName]) {
      return;
    }
    completeData.value.service[newName] = _.cloneDeep(
      completeData.value.service[oldName]
    );
    delete completeData.value.service[oldName];
  };
  const updateActiveServiceData = () => {
    const index = _.findIndex(
      editServiceList.value,
      (item) => item.id === active.value
    );
    if (index > -1) {
      editServiceList.value[index].attributes = _.cloneDeep(
        formData.attributes
      );
      updateCompleteData(editServiceList.value[index].name, formData.name);
      editServiceList.value[index].name = formData.name;
      editServiceList.value[index].description = formData.description;
      editServiceList.value[index].labels = formData.labels;
    }
  };
  const getSelectServiceData = () => {
    const result = _.filter(editServiceList.value, (item) =>
      selectedList.value.has(item.id)
    );
    return result;
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    const { validFailedForm, moduleFormList } = await validateFormData();
    if (!validFailedForm && !res) {
      formData.attributes = {
        ..._.reduce(
          moduleFormList,
          (obj, s) => {
            obj = {
              ...obj,
              ...s.formData
            };
            return obj;
          },
          {}
        )
      };
      show.value = false;
      updateActiveServiceData();
      hasChange.value = false;
    } else {
      scrollToView();
    }
  };
  const handleCancel = () => {
    serviceInfo.value = _.cloneDeep(activeServiceInfo.value);
    setFormAttributes();
    generateVariablesGroup(PageAction.EDIT);
    show.value = false;
  };
  defineExpose({
    getSelectServiceData
  });
  watch(
    () => props.serviceList,
    () => {
      selectedList.value.clear();
      _.each(props.serviceList, (item) => {
        selectedList.value.add(item.id);
      });
      editServiceList.value = _.cloneDeep(props.serviceList);
    },
    {
      immediate: true
    }
  );
  initCompleteData();
</script>

<style lang="less" scoped>
  .bordered {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
  }

  .change-tips {
    margin-left: 5px;
    color: rgb(var(--danger-6));
    font-size: 12px;
  }

  .svc-wrapper {
    max-height: 240px;
    padding-bottom: 10px;
    overflow: auto;
  }
</style>

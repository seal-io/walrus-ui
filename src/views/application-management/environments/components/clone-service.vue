<template>
  <div>
    <GroupTitle class="m-t-20" :bordered="false" :title="title" flex-start>
      <template v-if="showCheck" #right>
        <a-checkbox
          class="m-l-10 check-box"
          :indeterminate="
            selectedList.size > 0 && selectedList.size < editServiceList.length
          "
          :model-value="
            selectedList.size === editServiceList.length &&
            editServiceList.length > 0
          "
          @change="handleCheckboxChange"
          >{{ $t('common.checbox.all') }}</a-checkbox
        >
      </template>
    </GroupTitle>
    <div class="svc-wrapper">
      <a-spin :loading="completeDataLoading" style="width: 100%">
        <a-grid :cols="24" :row-gap="8" :col-gap="8">
          <a-grid-item v-for="item in editServiceList" :key="item.id" :span="6">
            <serviceThumb
              style="width: 100%; height: 90px"
              :active="item.id === active"
              :data-info="item"
              @click="handleClickInstance(item)"
            >
              <template #description>
                <span style="font-size: 14px">{{
                  _.get(item, 'environment.name')
                }}</span>
              </template>
              <template #default>
                <span style="font-weight: 700; font-size: 14px">{{
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
    <a-modal
      top="10%"
      :closable="false"
      :align-center="false"
      :width="1000"
      :ok-text="$t('common.button.save')"
      :visible="!!active && show"
      :mask-closable="false"
      :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
      modal-class="project-modal"
      :title="$t('applications.applications.edit')"
    >
      <div v-if="active" v-show="show">
        <GroupTitle
          :title="$t('applications.applications.detail.basic')"
          :bordered="false"
          flex-start
          style="margin: 0 0 10px 0"
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
                    always-delete
                    should-key
                    @add="(obj) => handleAddLabel(obj, labelList)"
                    @delete="handleDeleteLabel(labelList, sIndex)"
                  ></xInputGroup>
                </a-space>
                <template v-else>
                  <a-link
                    class="p-0"
                    @click="handleAddLabel(labelItem, labelList)"
                  >
                    <icon-plus-circle-fill
                      :size="24"
                      font-size="14px size-24"
                    ></icon-plus-circle-fill>
                  </a-link>
                </template>
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
          <GroupForm
            ref="groupForm"
            v-model:form-data="formData.attributes"
            :schema="schemaVariables"
          ></GroupForm>
        </div>
      </div>
      <template #footer>
        <EditPageFooter style="margin-top: 0">
          <template #save>
            <a-button type="primary" class="cap-title" @click="handleOk">{{
              $t('common.button.confirm')
            }}</a-button>
          </template>
          <template #cancel>
            <a-button
              :type="'outline'"
              class="cap-title"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </template>
        </EditPageFooter>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    PageAction,
    validateLabelNameRegx,
    InjectCompleteDataKey,
    InjectShowInputHintKey,
    InjectSchemaFormStatusKey
  } from '@/views/config';
  import { ref, PropType, computed, provide, onMounted, watch } from 'vue';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupTitle from '@/components/group-title/index.vue';
  import serviceThumb from '../../services/components/service-thumb.vue';
  import useServiceData from '../../services/hooks/use-service-data';

  const CloneType = {
    SERVICE: 'service',
    ENVIRONMENT: 'environment'
  };
  const props = defineProps({
    serviceIds: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    cloneType: {
      type: String as PropType<'service' | 'environment'>,
      default() {
        return 'environment';
      }
    },
    showCheck: {
      type: Boolean,
      default() {
        return true;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    asyncLoading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    hintData: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    resourceType: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const {
    setFormAttributes,
    completeDataLoading,
    serviceInfo,
    templateInfo,
    schemaVariables,
    formData,
    pageAction
  } = useServiceData(props);
  const {
    labelList,
    labelItem,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList,
    validateTrigger
  } = useLabelsActions(formData);
  const { scrollToView } = useScrollToView();

  provide(InjectSchemaFormStatusKey, ref(PageAction.EDIT));

  const emits = defineEmits(['update:hintData']);
  const completeData = ref<any>({});
  const serviceDataList = ref<any[]>([]);
  const active = ref('');
  const groupForm = ref();
  const selectedList = ref(new Set());
  const editServiceList = ref<any[]>([]);
  const formref = ref();
  const show = ref(true);
  const activeServiceInfo = ref<any>({});
  const hasChange = ref(false);

  provide(InjectShowInputHintKey, true);
  provide(InjectCompleteDataKey, completeData);

  const handleCheckboxChange = (checked) => {
    if (checked) {
      selectedList.value = new Set(_.map(editServiceList.value, 'id'));
    } else {
      selectedList.value = new Set();
    }
  };

  const handleClickInstance = async (data) => {
    data.attributes = data.attributes || {};
    active.value = data.id;
    show.value = true;
    activeServiceInfo.value = data;
    serviceInfo.value = _.cloneDeep(data);
    await setFormAttributes();

    getLabelList();
  };
  const handleCheckChange = (checked, item) => {
    if (checked) {
      selectedList.value.add(item.id);
    } else {
      selectedList.value.delete(item.id);
    }
  };

  const updateCompleteData = (oldName, newName) => {
    if (completeData.value.resource[newName]) {
      return;
    }
    completeData.value[props.resourceType][newName] = _.cloneDeep(
      completeData.value[props.resourceType][oldName]
    );
    delete completeData.value[props.resourceType][oldName];
    emits('update:hintData', completeData.value);
  };
  const updateActiveServiceData = () => {
    const index = _.findIndex(
      editServiceList.value,
      (item) => item.id === active.value
    );
    if (index > -1) {
      editServiceList.value[index].attributes = _.cloneDeep(
        formData.value.attributes
      );
      updateCompleteData(
        editServiceList.value[index].name,
        formData.value.name
      );
      editServiceList.value[index].name = formData.value.name;
      editServiceList.value[index].description = formData.value.description;
      editServiceList.value[index].labels = formData.value.labels;
    }
  };
  const getSelectServiceData = () => {
    const result = _.filter(editServiceList.value, (item) =>
      selectedList.value.has(item.id)
    );
    return result;
  };
  const handleOk = async () => {
    validateLabel();
    const res = await formref.value?.validate();
    const groupFormRes = await groupForm.value?.validate();
    const hiddenFormData = groupForm.value?.getHiddenData();
    if (!groupFormRes && !res && !validateTrigger.value) {
      formData.value.attributes = {
        ...formData.value.attributes,
        ...hiddenFormData
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
    show.value = false;
  };
  const setSelectServiceList = () => {
    selectedList.value.clear();
    if (props.cloneType === CloneType.ENVIRONMENT) {
      _.each(serviceDataList.value, (item) => {
        selectedList.value.add(item.id);
      });
      editServiceList.value = _.cloneDeep(serviceDataList.value);
      return;
    }
    if (props.cloneType === CloneType.SERVICE) {
      selectedList.value = new Set(props.serviceIds);
      editServiceList.value = _.filter(serviceDataList.value, (item) =>
        selectedList.value.has(item.id)
      );
    }
  };
  const init = async () => {
    setSelectServiceList();
  };
  watch(
    () => props.hintData,
    () => {
      completeData.value = props.hintData;
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.dataList,
    () => {
      serviceDataList.value = _.cloneDeep(props.dataList);
      init();
    },
    {
      immediate: true
    }
  );
  defineExpose({
    getSelectServiceData
  });
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .bordered {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
  }

  .m-l-10.check-box {
    width: max-content;
  }

  .change-tips {
    margin-left: 10px;
    color: rgb(var(--danger-6));
    font-size: 14px;
  }

  .svc-wrapper {
    max-height: 320px;
    padding-bottom: 10px;
    overflow: auto;
  }
</style>

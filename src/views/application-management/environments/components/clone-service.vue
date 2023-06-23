<template>
  <div>
    <a-space wrap>
      <instanceThumb
        v-for="item in editServiceList"
        :key="item.id"
        :size="[158, 80]"
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
      </instanceThumb>
    </a-space>
    <div v-if="active" v-show="show" class="bordered">
      <div class="variables">
        <a-form :model="formData" auto-label-width layout="vertical">
          <a-form-item
            :label="$t('operation.environments.table.name')"
            field="name"
            :validate-trigger="['change']"
            :rules="[
              {
                required: pageAction === PageAction.EDIT,
                message: $t('operation.environments.rule.name')
              }
            ]"
          >
            <a-input
              v-model="formData.name"
              style="width: 500px"
              :max-length="30"
              show-word-limit
            ></a-input>
          </a-form-item>
        </a-form>
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

      <EditPageFooter>
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PageAction } from '@/views/config';
  import {
    ref,
    PropType,
    computed,
    ComponentPublicInstance,
    provide,
    watch,
    defineExpose
  } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import instanceThumb from '../../services/components/instance-thumb.vue';
  import { ServiceRowData } from '../../services/config/interface';
  import { AppInstanceStatus } from '../../services/config';
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

  provide('showHintInput', true);
  provide('completeData', completeData);

  const active = ref('');
  const selectedList = ref(new Set());
  const editServiceList = ref<any[]>([]);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const show = ref(true);
  const activeServiceInfo = ref<any>({});

  const formTabs = computed(() => {
    const list = _.keys(variablesGroup.value);
    if (_.includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ..._.pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });

  const handleTabChange = (val) => {
    activeKey.value = val;
  };

  const handleClickInstance = async (data) => {
    active.value = data.id;
    show.value = true;
    activeKey.value = 'schemaForm0';
    activeServiceInfo.value = data;
    serviceInfo.value = _.cloneDeep(data);
    await setFormAttributes();
    generateVariablesGroup(PageAction.EDIT);
  };
  const handleCheckChange = (checked, item) => {
    if (checked) {
      selectedList.value.add(item.id);
    } else {
      selectedList.value.delete(item.id);
    }
  };
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
  const validateFormData = async () => {
    const moduleFormList = await getFormData();
    const validFailedForm = _.find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    return { validFailedForm, moduleFormList };
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
      editServiceList.value[index].name = formData.name;
    }
  };
  const getSelectServiceData = () => {
    const result = _.filter(editServiceList.value, (item) =>
      selectedList.value.has(item.id)
    );
    return result;
  };
  const handleOk = async () => {
    const { validFailedForm, moduleFormList } = await validateFormData();
    if (!validFailedForm) {
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
</style>

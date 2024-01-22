<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="route.params.projectId ? { icon: 'icon-apps' } : null"
        :items="
          route.params.projectId
            ? [
                ...breadCrumbList,
                {
                  type: 'menu.operatorHub.connector',
                  label: title
                }
              ]
            : [
                { ...operationRootBread, label: $t(operationRootBread.label) },
                {
                  label: title
                }
              ]
        "
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard class="kuber-detail-wrap">
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="
          pageAction === PageAction.VIEW &&
          (route.params.projectId
            ? userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                connectorID: id,
                projectID: route.params.projectId,
                actions: [Actions.PUT]
              })
            : userStore.hasRolesActionsPermission({
                resource: Resources.Connectors,
                actions: [Actions.PUT]
              }))
        "
        @edit="handleEdit"
      ></GroupTitle>
      <div>
        <a-form
          ref="formref"
          :model="formData"
          auto-label-width
          label-align="left"
        >
          <a-form-item
            :label="$t('operation.connectors.form.name')"
            hide-asterisk
            hide-label
            field="name"
            :disabled="!!id"
            :validate-trigger="['change', 'input']"
            :style="{ maxWidth: `${InputWidth.LARGE}px` }"
            :rules="[
              {
                required: true,
                message: $t('common.rule.name')
              },
              {
                required: true,
                match: validateLabelNameRegx,
                message: $t('common.validate.labelName')
              }
            ]"
          >
            <seal-input
              v-model.trim="formData.name"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.form.name')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="validateInputLength.NAME"
              show-word-limit
            ></seal-input>

            <!-- <template v-if="pageAction === PageAction.EDIT" #extra>
              <div :style="{ maxWidth: `${InputWidth.LARGE}px` }">{{
                $t('common.validate.labelName')
              }}</div>
            </template> -->
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.table.environmentType')"
            hide-label
            hide-asterisk
            field="applicableEnvironmentType"
            :disabled="!!id"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rules.environmentType')
              }
            ]"
          >
            <seal-select
              v-model="formData.applicableEnvironmentType"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.table.environmentType')"
              :required="true"
              :options="EnvironmentTypeList"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-select>
            <!-- <span v-else class="readonly-view-label">{{
              $t(EnvironmentTypeMap[formData.applicableEnvironmentType] || '')
            }}</span> -->
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.form.type')"
            hide-asterisk
            hide-label
            field="type"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rule.type')
              }
            ]"
          >
            <seal-input
              v-model="formData.type"
              :view-status="pageAction === PageAction.VIEW"
              :disabled="formData.id"
              :label="$t('operation.connectors.form.type')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-input>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.form.attribute')"
            hide-asterisk
            hide-label
            no-style
            field="configData"
            :rules="[
              {
                required: false,
                message: $t('operation.connectors.attribute.rule')
              }
            ]"
          >
            <a-space
              v-if="attributeList?.length && pageAction === PageAction.EDIT"
              fill
              style="display: flex; flex-direction: column; width: 780px"
              direction="vertical"
            >
              <xInputGroup
                v-for="(sItem, sIndex) in attributeList"
                :key="sIndex"
                v-model:dataKey="sItem.key"
                v-model:dataValue="sItem.value"
                v-model:dataDesc="sItem.type"
                :data-default="sItem.default"
                :data-item="sItem"
                show-description
                separator=""
                :show-required-mark="false"
                :trigger-validate="triggerValidate"
                :width="`${InputWidth.LARGE}px`"
                class="group-item"
                :wrap-align="sItem.type === 'dynamic' ? 'flex-start' : 'center'"
                :placeholder="{
                  value: $t('common.input.value'),
                  description: $t('common.input.value'),
                  key: $t('common.input.key')
                }"
                :components="{
                  string: 'Input',
                  number: 'InputNumber',
                  bool: 'Checkbox',
                  dynamic: 'AceEditor'
                }"
                :max-length="null"
                :label-list="attributeList"
                :position="sIndex"
                @add="(obj) => handleAddLabel(obj)"
                @delete="handleDeleteLabel(attributeList, sIndex)"
              >
                <template #value>
                  <seal-input
                    v-if="!sItem.visible"
                    v-model="sItem.value"
                    :show-required-mark="false"
                    style="width: 100%"
                    :error="!sItem.value && triggerValidate && !!sItem.key"
                    :placeholder="$t('common.input.value')"
                  ></seal-input>
                  <seal-input-password
                    v-else
                    v-model="sItem.value"
                    style="width: 100%"
                    :show-required-mark="false"
                    :error="!sItem.value && triggerValidate && !!sItem.key"
                    :placeholder="$t('common.input.value')"
                  ></seal-input-password>
                </template>
                <template #description>
                  <a-checkbox v-model="sItem.visible">{{
                    $t('operation.connectors.attribute.sensitive')
                  }}</a-checkbox>
                  <a-tooltip
                    :content="
                      $t('operation.connectors.attribute.sensitive.tips')
                    "
                  >
                    <template #content>
                      <div style="white-space: pre-wrap">{{
                        $t('operation.connectors.attribute.sensitive.tips')
                      }}</div>
                    </template>
                    <icon-info-circle class="mleft-5" />
                  </a-tooltip>
                </template>
              </xInputGroup>
            </a-space>
            <template
              v-if="
                pageAction === PageAction.VIEW &&
                _.filter(attributeList, (item) => item.key).length
              "
            >
              <div class="arco-form-item-label m-b-10"
                ><span>{{
                  $t('operation.connectors.form.attribute')
                }}</span></div
              >
              <DescriptionTable
                :style="{ width: `${InputWidth.LARGE}px` }"
                :data-list="attributeList"
              >
                <template #value="{ row }">
                  <AutoTip
                    :tooltip-props="{
                      content: row.value
                    }"
                  >
                    <span>{{ row.sensitive ? '******' : row.value }}</span>
                  </AutoTip>
                </template>
              </DescriptionTable>
            </template>
          </a-form-item>
        </a-form>
      </div>
      <EditPageFooter v-if="pageAction === PageAction.EDIT">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            :loading="submitLoading"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import {
    PageAction,
    validateLabelNameRegx,
    validateInputLength,
    InputWidth,
    EnvironmentTypeMap,
    EnvironmentTypeOrder
  } from '@/views/config';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import _, {
    assignIn,
    toLower,
    keys,
    some,
    map,
    get,
    isEqual,
    cloneDeep,
    reduce,
    pick,
    each
  } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import usePageAction from '@/hooks/use-page-action';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DescriptionTable from '@/components/description-table/index.vue';
  import { ConnectorFormData, CustomAttrbute } from '../config/interface';
  import { operationRootBread, ConnectorCategory } from '../config';
  import { createConnector, updateConnector, queryItemConnector } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const setPropertyStyle = (style) => {
    return {
      'display': 'flex',
      'align-items': 'center',
      ...style
    };
  };
  const labelOption = {
    style: {
      key: setPropertyStyle({ 'flex-basis': '280px' }),
      description: setPropertyStyle({ 'flex-basis': '110px' }),
      value: setPropertyStyle({ 'flex-basis': '320px' })
    }
  };
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const triggerValidate = ref(false);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    name: '',
    configData: {},
    description: '',
    configVersion: 'v1',
    applicableEnvironmentType: '',
    type: '',
    category: ConnectorCategory.Custom,
    enableFinOps: false
  });

  const EnvironmentTypeList = computed(() => {
    return _.map(userStore.applicableEnvironmentTypes, (item) => {
      return {
        label: t(EnvironmentTypeMap[item] || ''),
        value: item,
        order: EnvironmentTypeOrder[item]
      };
    }).sort((a, b) => a.order - b.order);
  });

  const visibleOptions = computed(() => {
    return [
      {
        label: t('operation.connectors.attribute.visible'),
        value: 1
      },
      {
        label: t('operation.connectors.attribute.invisible'),
        value: 0
      }
    ];
  });
  const attributeList = ref<CustomAttrbute[]>([
    {
      key: '',
      value: '',
      type: 'string',
      visible: true,
      ...labelOption
    }
  ]);

  const title = computed(() => {
    if (id) {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.reinstall.custom')
      });
    }
    return t('operation.connectors.title.new', {
      type: t('operation.connectors.reinstall.custom')
    });
  });
  const handleAddLabel = (obj) => {
    attributeList.value.push({
      key: '',
      value: '',
      type: 'string',
      visible: true,
      ...labelOption
    });
  };
  const handleDeleteLabel = (list, index) => {
    const len = list.length || 0;
    if (len < 2) return;
    list?.splice(index, 1);
  };

  const checkAttributeValid = () => {
    triggerValidate.value = some(
      attributeList.value,
      (item) => item.key && !item.value
    );
  };
  const setAttributeList = () => {
    const configData = formData.configData || {};
    attributeList.value = map(keys(configData), (key) => {
      return {
        key,
        value: get(configData, `${key}.value`) || '',
        default: get(configData, `${key}.value`) || '', // default value
        type: get(configData, `${key}.type`) || 'string',
        visible: !get(configData, `${key}.visible`),
        sensitive: !get(configData, `${key}.visible`),
        ...labelOption
      };
    }) as never[];
    if (!attributeList.value.length) {
      attributeList.value = [
        {
          key: '',
          value: '',
          type: 'string',
          visible: true,
          ...labelOption
        }
      ];
    }
  };

  const setConfigData = () => {
    const list = _.filter(
      attributeList.value,
      (item) => item.key
    ) as CustomAttrbute[];
    const data = reduce(
      list,
      (obj, item) => {
        if (item.key) {
          obj[item.key] = {
            ...pick(item, ['value']),
            visible: !item.visible
          };
        }
        return obj;
      },
      {}
    );
    formData.configData = data;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    checkAttributeValid();
    if (!res && !triggerValidate.value) {
      try {
        submitLoading.value = true;
        setConfigData();
        copyFormData = cloneDeep(formData);
        if (id) {
          await updateConnector(formData);
        } else {
          await createConnector(formData);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
      return true;
    }
    scrollToView();

    return false;
  };
  const initConfigDataValue = () => {
    const configData = formData.configData || {};
    each(keys(configData) || [], (key) => {
      configData[key].value = configData[key].value || '';
    });
  };
  const getConnectorInfo = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const { data } = await queryItemConnector({ id });
      assignIn(formData, data);
      setAttributeList();
      initConfigDataValue();
      copyFormData = cloneDeep(formData);
    } catch (error) {
      // ignore
    }
  };
  const cancelCallback = () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW
    ) {
      pageAction.value = PageAction.VIEW;
      getConnectorInfo();
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    setConfigData();

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
    setConfigData();
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
    getConnectorInfo();
    setBreadCrumbList();
  };
  defineExpose({
    init,
    handleSubmit
  });
  init();
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.ConnectorCustomDetail
  };
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }

    :deep(.arco-select-view-single) {
      .arco-select-view-prefix {
        padding-right: 5px;
      }
    }

    .readonly-view-label.p-l-0 {
      padding-left: 0;
    }
  }
</style>

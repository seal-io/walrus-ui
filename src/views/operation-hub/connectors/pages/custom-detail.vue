<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle
      :title="title"
      show-back
      :show-edit="pageAction === 'view'"
      @edit="handleEdit"
    ></GroupTitle>
    <div>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('operation.connectors.form.name')"
          field="name"
          :rules="[
            {
              required: pageAction === 'edit',
              message: t('operation.connectors.rule.name')
            },
            {
              match: /^[A-Za-z0-9]([A-Za-z0-9-_]*[A-Za-z0-9])?$/,
              message: $t('operation.environments.name.tips')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.name"
            style="width: 500px"
            :max-length="30"
            show-word-limit
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
        </a-form-item>
        <!-- <a-form-item
          field="description"
          :hide-asterisk="false"
          label="描述"
          :validate-trigger="['change']"
        >
          <a-textarea
            v-model="formData.description"
            style="width: 500px"
            :spellcheck="false"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item> -->
        <a-form-item
          :label="$t('operation.connectors.form.type')"
          field="type"
          :rules="[
            {
              required: pageAction === 'edit',
              message: $t('operation.connectors.type.rule')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.type"
            style="width: 500px"
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.type || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('operation.connectors.form.attribute')"
          field="configData"
          :rules="[
            {
              required: pageAction === 'edit',
              message: $t('operation.connectors.attribute.rule')
            }
          ]"
        >
          <a-space
            v-if="attributeList?.length && pageAction === 'edit'"
            fill
            style="display: flex; flex-direction: column; width: 1000px"
            direction="vertical"
          >
            <xInputGroup
              v-for="(sItem, sIndex) in attributeList"
              :key="sIndex"
              v-model:dataKey="sItem.key"
              v-model:dataValue="sItem.type"
              v-model:dataDesc="sItem.value"
              v-model:dataExtra="sItem.visible"
              :data-default="sItem.default"
              :data-item="sItem"
              show-description
              show-extra
              separator=""
              :trigger-validate="triggerValidate"
              width="500px"
              class="group-item"
              :wrap-align="sItem.type === 'dynamic' ? 'flex-start' : 'center'"
              :placeholder="{
                value: $t('common.input.type'),
                description: $t('common.input.value'),
                key: $t('common.input.key'),
                extra: $t('common.input.visible')
              }"
              :components="{
                string: 'Input',
                number: 'InputNumber',
                bool: 'Checkbox',
                dynamic: 'AceEditor'
              }"
              :value-options="variableTypeList"
              :max-length="null"
              :label-list="attributeList"
              :position="sIndex"
              @add="(obj) => handleAddLabel(obj)"
              @delete="handleDeleteLabel(attributeList, sIndex)"
            ></xInputGroup>
          </a-space>
          <template v-if="pageAction === 'view' && attributeList?.length">
            <labelsList
              style="margin-left: 12px"
              :labels="formData.configData"
            ></labelsList>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <EditPageFooter v-if="pageAction === 'edit'">
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleSubmit"
          >{{ $t('common.button.confirm') }}</a-button
        >
      </template>
      <a-button
        type="outline"
        class="cap-title cancel-btn"
        @click="handleCancel"
        >{{ $t('common.button.cancel') }}</a-button
      >
    </EditPageFooter>
  </comCard>
</template>

<script lang="ts" setup>
  import {
    assignIn,
    toLower,
    keys,
    some,
    map,
    get,
    isEqual,
    cloneDeep,
    reduce,
    pick
  } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import usePageAction from '@/hooks/use-page-action';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { variableTypeList } from '@/views/application-management/applications/config';
  import labelsList from '@/views/application-management/applications/components/app-info/labels-list.vue';
  import { ConnectorFormData, CustomAttrbute } from '../config/interface';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

  const setPropertyStyle = (style) => {
    return {
      'display': 'flex',
      'align-items': 'center',
      ...style
    };
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
    type: '',
    category: 'Custom',
    enableFinOps: false
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
      visible: 0,
      extraCom: 'Select',
      extraProps: {
        options: visibleOptions
      },
      style: {
        key: {
          'display': 'flex',
          'align-items': 'center',
          'flex-basis': '200px'
        },
        value: {
          'display': 'flex',
          'align-items': 'center',
          'flex-basis': '150px'
        },
        extra: {
          'display': 'flex',
          'align-items': 'center',
          'flex-basis': '150px'
        }
      }
    }
  ]);

  const labelOption = computed(() => {
    return {
      extraCom: 'Select',
      extraProps: {
        options: [
          {
            label: t('operation.connectors.attribute.visible'),
            value: 1
          },
          {
            label: t('operation.connectors.attribute.invisible'),
            value: 0
          }
        ]
      },
      style: {
        key: setPropertyStyle({ 'flex-basis': '200px' }),
        value: setPropertyStyle({ 'flex-basis': '150px' }),
        extra: setPropertyStyle({ 'flex-basis': '150px' })
      }
    };
  });
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
      visible: 0,
      ...labelOption.value
    });
    console.log('attributeList===', attributeList.value);
  };
  const handleDeleteLabel = (list, index) => {
    const len = list.length || 0;
    if (len < 2) return;
    list?.splice(index, 1);
  };

  const checkAttributeValid = () => {
    triggerValidate.value = some(attributeList.value, (item) => !item.key);
  };
  const setLabelList = () => {
    const configData = formData.configData || {};
    attributeList.value = map(keys(configData), (key) => {
      return {
        key,
        value: get(configData, `${key}.value`) || '',
        default: get(configData, `${key}.value`) || '',
        type: get(configData, `${key}.type`) || 'string',
        visible: get(configData, `${key}.visible`) ? 1 : 0,
        ...labelOption.value
      };
    }) as never[];
    if (!attributeList.value.length) {
      attributeList.value = [
        {
          key: '',
          value: '',
          type: 'string',
          visible: 0,
          ...labelOption.value
        }
      ];
    }
    console.log('attributeList===', attributeList.value);
  };
  const setConfigData = () => {
    const data = reduce(
      attributeList.value,
      (obj, item) => {
        if (item.key) {
          obj[item.key] = {
            ...pick(item, ['value', 'type']),
            visible: !!item.visible
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
    }
  };
  const getConnectorInfo = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const { data } = await queryItemConnector({ id });
      assignIn(formData, data);
      setLabelList();
      setConfigData();
      copyFormData = cloneDeep(formData);
    } catch (error) {
      console.log(error);
    }
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
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
    console.log('formData====', formData, copyFormData);
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
    await getConnectorInfo();
  };
  init();
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
  }
</style>

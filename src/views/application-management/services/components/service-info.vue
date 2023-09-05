<template>
  <div class="service">
    <a-form
      ref="formref"
      class="basic-form p-10"
      :model="formData"
      auto-label-width
      style="width: 600px"
      label-align="left"
    >
      <a-row>
        <a-col>
          <a-form-item :label="$t(`applications.projects.form.label`)">
            <LabelsList :labels="formData.labels"></LabelsList>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item :label="$t('common.table.description')">
            <span class="readonly-view-label">{{ formData.description }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="variables m-t-10">
      <a-tabs
        v-if="formTabs.length > 1"
        lazy-load
        class="page-line-tabs"
        :active-key="activeKey"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="group in formTabs"
          :key="group"
          :title="variablesGroup[group]?.label"
        >
          <div class="content-wrap">
            <div v-if="subGroupList.length" class="side-menu">
              <div
                v-for="k in subGroupList"
                :key="k"
                class="menu-item"
                :class="{ active: activeSubGroup === k }"
                @click.stop="handleClickSubGroup(k)"
                >{{ k }}</div
              >
            </div>
            <a-descriptions
              :column="{ lg: 2, md: 1 }"
              style="flex: 1"
              bordered
              layout="inline-vertical"
              :data="variablesDataList"
            >
              <template #value="{ data }">
                <div>
                  <!-- empty value -->
                  <span
                    v-if="
                      _.isEmpty(
                        _.get(
                          variablesGroupForm,
                          `${group}.attributes.${data.name}`
                        )
                      )
                    "
                  ></span>
                  <!-- sensitive -->
                  <span v-else-if="data.sensitive">
                    {{
                      _.get(
                        variablesGroupForm,
                        `${group}.attributes.${data.name}`
                      )
                        ? '******'
                        : ''
                    }}
                  </span>
                  <!-- list -->
                  <span
                    v-else-if="
                      schemaType.isListNumber(data.type) ||
                      schemaType.isListString(data.type)
                    "
                    >{{
                      _.join(
                        _.get(
                          variablesGroupForm,
                          `${group}.attributes.${data.name}`
                        ),
                        ','
                      )
                    }}</span
                  >
                  <!-- map -->
                  <span v-else-if="schemaType.isMapString(data.type)">
                    <LabelsList
                      :labels="
                        _.get(
                          variablesGroupForm,
                          `${group}.attributes.${data.name}`
                        )
                      "
                    ></LabelsList>
                  </span>
                  <!-- yaml -->
                  <a-textarea
                    v-else-if="
                      schemaType.isCollectionType(data.type) ||
                      schemaType.isUnknownType(data.type)
                    "
                    class="border-less"
                    readonly
                    :auto-size="{ maxRows: 8 }"
                    :model-value="
                      json2Yaml(
                        _.get(
                          variablesGroupForm,
                          `${group}.attributes.${data.name}`
                        )
                      )
                    "
                  ></a-textarea>
                  <!-- default -->
                  <span v-else>{{
                    _.get(
                      variablesGroupForm,
                      `${group}.attributes.${data.name}`
                    )
                  }}</span>
                </div>
              </template>
              <template #label="{ data }">
                <span style="font-weight: 400">{{
                  data.label || data.name
                }}</span>
              </template>
            </a-descriptions>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-descriptions
        v-if="formTabs.length < 2"
        :column="{ lg: 2, md: 1 }"
        bordered
        layout="inline-vertical"
        :data="variablesGroup[defaultGroupKey]?.variables"
      >
        <template #value="{ data }">
          <span
            v-if="
              _.isEmpty(
                _.get(
                  variablesGroupForm[defaultGroupKey]?.attributes,
                  `${data.name}`
                )
              ) &&
              _.isObject(
                _.get(
                  variablesGroupForm[defaultGroupKey]?.attributes,
                  `${data.name}`
                )
              )
            "
          ></span>
          <a-textarea
            v-else-if="
              schemaType.isCollectionType(data.type) ||
              schemaType.isUnknownType(data.type)
            "
            readonly
            :auto-size="{ maxRows: 8 }"
            :model-value="
              json2Yaml(
                _.get(
                  variablesGroupForm,
                  `${defaultGroupKey}.attributes.${data.name}`
                )
              )
            "
          ></a-textarea>
          <span v-else class="bold-400">{{
            _.get(
              variablesGroupForm[defaultGroupKey]?.attributes,
              `${data.name}`
            )
          }}</span>
        </template>
        <template #label="{ data }">
          <span class="bold-400">{{ data.name }}</span>
        </template>
      </a-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, computed, nextTick } from 'vue';
  import { schemaType } from '@/components/form-create/config/interface';
  import { json2Yaml } from '@/components/form-create/config/yaml-parse';
  import { getObjectConditionValue } from '@/components/form-create/config/utils';
  import LabelsList from './labels-list.vue';
  import useServiceData from '../hooks/use-service-data';

  const {
    initInfo,
    formData,
    defaultGroupKey,
    variablesGroup,
    variablesGroupForm
  } = useServiceData();

  const formref = ref();
  const loading = ref(false);
  const activeKey = ref('');
  const subGroupList = ref<string[]>([]);
  const activeSubGroup = ref('');
  const formTabs = ref<string[]>([]);

  const variablesDataList = computed(() => {
    const list =
      _.get(variablesGroup.value, `${activeKey.value}.variables`) || [];
    const result = _.filter(list, (item) => {
      return !item.subGroup || item.subGroup === activeSubGroup.value;
    });
    return result;
  });

  const handleClickSubGroup = (k) => {
    activeSubGroup.value = k;
  };
  const setFormTabs = () => {
    let list = _.keys(variablesGroup.value);
    if (_.includes(list, defaultGroupKey)) {
      list = [defaultGroupKey, ..._.pull(list, defaultGroupKey)];
    }
    formTabs.value = list;
  };

  const setSubGroupList = () => {
    const groupData = _.get(variablesGroup.value, activeKey.value);
    subGroupList.value = [...(groupData?.subGroup || [])];
    activeSubGroup.value = _.get(subGroupList.value, '0');
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
    setSubGroupList();
  };
  const filterGroupVariables = () => {
    _.each(_.keys(variablesGroup.value), (group) => {
      let variables = _.get(variablesGroup.value, `${group}.variables`) || [];
      variables = _.filter(variables, (item) => {
        if (item.showIf) {
          const attributes = _.get(
            variablesGroupForm.value,
            `${group}.attributes`
          );
          return getObjectConditionValue(item, attributes);
        }
        return true;
      });
      _.set(variablesGroup.value, `${group}.variables`, variables);
    });
  };

  const initData = async () => {
    await initInfo();
    filterGroupVariables();
    setFormTabs();
    nextTick(() => {
      handleTabChange(_.get(formTabs.value, '0'));
    });
  };
  defineExpose({
    initData
  });
</script>

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }

    .arco-modal-body {
      padding-bottom: 0;
    }

    .arco-modal-footer {
      border-top: 1px solid var(--color-neutral-3);
    }
  }
</style>

<style lang="less" scoped>
  @import url('@/components/form-create/style/side-menu.less');

  .service {
    :deep(.arco-tabs-nav-tab-list) {
      padding-left: 10px;
    }

    :deep(.arco-form-item) {
      margin-bottom: 0;

      .arco-form-item-label {
        font-size: 14px;
      }
    }

    :deep(.arco-tabs-content) {
      padding: 16px 0 0 0;
    }

    :deep(.arco-descriptions-layout-inline-vertical) {
      .arco-descriptions-body {
        border: none;
      }

      .arco-descriptions-table {
        border-collapse: separate;
        border-spacing: 10px;

        .arco-descriptions-item {
          padding: 10px;
          border: 1px solid var(--color-border-2);
          border-radius: var(--border-radius-small);
        }
      }

      .arco-textarea-wrapper {
        background-color: var(--color-fill-2);
        border: none;
      }
    }
  }
</style>

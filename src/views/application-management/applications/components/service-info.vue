<template>
  <div class="service">
    <a-form
      ref="formref"
      :model="formData"
      auto-label-width
      style="flex-direction: row; width: 600px"
    >
      <a-form-item :label="$t('common.table.name')">
        <span class="readonly-view-label">{{ formData.name }}</span>
      </a-form-item>
      <a-form-item :label="$t('applications.applications.table.module')">
        <span class="readonly-view-label">{{
          getListValue(formData.template.id, templateList, 'id')
        }}</span>
      </a-form-item>
      <a-form-item :label="$t('applications.applications.history.version')">
        <span class="readonly-view-label">{{
          getListValue(formData.templateVersion, templateVersionList, 'value')
        }}</span>
      </a-form-item>
    </a-form>
    <div class="variables">
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
              :column="2"
              style="flex: 1"
              :data="variablesDataList"
            >
              <template #value="{ data }">
                <div>
                  <span
                    v-if="
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
                  <span v-else>{{
                    _.get(
                      variablesGroupForm,
                      `${group}.attributes.${data.name}`
                    )
                  }}</span>
                </div>
              </template>
              <template #label="{ data }">
                <span style="font-weight: 400">{{ data.label }}</span>
              </template>
            </a-descriptions>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-descriptions
        v-if="formTabs.length < 2"
        :column="2"
        :data="variablesGroup[defaultGroupKey]?.variables"
      >
        <template #value="{ data }">
          <a-textarea
            v-if="
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
          <span v-else style="font-weight: 400">{{
            _.get(
              variablesGroupForm[defaultGroupKey]?.attributes,
              `${data.name}`
            )
          }}</span>
        </template>
        <template #label="{ data }">
          <span style="font-weight: 400">{{ data.name }}</span>
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
  import LabelsList from './app-info/labels-list.vue';
  import useServiceData from '../hooks/use-service-data';

  const {
    init,
    formData,
    defaultGroupKey,
    variablesGroup,
    variablesGroupForm,
    templateVersionList,
    templateList
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
    console.log('list===', list);
    return _.filter(list, (item) => {
      return !item.subGroup || item.subGroup === activeSubGroup.value;
    });
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
  const getListValue = (value, list, k) => {
    const d = _.find(list, (item) => {
      return item[k] === value;
    });
    return d?.label || d?.id;
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
  const initData = async () => {
    await init();
    setFormTabs();
    nextTick(() => {
      handleTabChange(_.get(formTabs.value, '0'));
    });
  };
  initData();
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
    :deep(.arco-form-item) {
      margin-bottom: 5px;

      .arco-form-item-label {
        font-size: 14px;
      }
    }
  }
</style>

<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    unmount-on-close
    :title="$t('applications.applications.detail.createInstance')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        layout="vertical"
      >
        <a-descriptions
          v-if="status === 'edit'"
          :data="dataList"
          class="margin-b10"
        />
        <a-form-item
          v-if="status === 'create'"
          :label="$t('common.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.module.rule.name') },
            {
              match: validateAppNameRegx,
              message: $t('applications.applications.rule.allName')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            style="width: 100%"
            :max-length="30"
            show-word-limit
          ></a-input>
          <template #extra>
            <span class="tips">{{
              $t('applications.applications.rule.allName')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          v-if="status === 'create'"
          :label="$t('applications.applications.detail.env')"
          field="environment.id"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.instance.rule.env') }
          ]"
        >
          <a-select
            v-model="formData.environment.id"
            style="width: 100%"
            :options="environmentList"
            @change="handleEnvChange"
          ></a-select>
          <template #extra>
            <span class="tips">{{ $t('applications.instance.env.tips') }}</span>
          </template>
        </a-form-item>
        <a-form-item :label="$t('applications.applications.tags.title')">
          <createTags v-model:tags="formData.remarkTags"></createTags>
        </a-form-item>
        <!-- <a-form-item
          :label="$t('common.table.description')"
          field="description"
        >
          <a-textarea
            v-model="formData.description"
            :max-length="200"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          >
          </a-textarea>
        </a-form-item> -->
        <!-- <a-form-item label="标签">
          <div
            v-for="(sItem, sIndex) in labelList"
            :key="sIndex"
            style="margin-bottom: 10px"
          >
            <xInputGroup
              v-model:dataKey="sItem.key"
              v-model:value="formData.labels"
              always-delete
              :trigger-validate="triggerValidate"
              width="100%"
              separator=""
              class="group-item"
              :label-list="labelList"
              :position="sIndex"
              @add="(obj) => handleAddLabel(obj, labelList)"
              @delete="handleDeleteLabel(labelList, sIndex)"
            >
              <template #value>
                <a-input
                  v-model="sItem.value"
                  :placeholder="$t('common.input.value')"
                  :error="!sItem.value && triggerValidate"
                ></a-input>
              </template>
            </xInputGroup>
          </div>
          <div v-if="!labelList.length">
            <a-tooltip :content="$t('applications.applications.labels.title')">
              <thumbButton
                :size="30"
                font-size="16px"
                @click="handleAdd"
              ></thumbButton>
            </a-tooltip>
          </div>
        </a-form-item> -->
        <div
          v-if="variablesList?.length"
          style="margin-bottom: 10px; text-align: left"
          >{{ $t('applications.applications.variables.title') }}</div
        >
        <a-form-item
          v-for="(item, index) in variablesList"
          :key="index"
          :label="item.name"
          :field="`variables.${item.name}`"
          validate-trigger="change"
          :rules="[
            {
              validator(val, callback) {
                validateVariable(item.value, callback, item.type);
              }
            }
          ]"
        >
          <component
            :is="get(internalComponents, componentsMap[item.type])"
            v-model="item.value"
            style="width: 100%"
            show-word-limit
            :show-gutter="true"
            :editor-id="`${item.name}`"
            lang="yaml"
            :editor-default-value="item.default"
          ></component>
        </a-form-item>
        <div v-if="status === 'edit'">
          <div class="margin-b10" style="text-align: left">{{
            $t('applications.applications.history.diff.upgrade')
          }}</div>
          <AceEditor
            v-if="removeLines.length || addLines.length"
            ref="editor"
            read-only
            style="width: 100%"
            :remove-lines="removeLines"
            :add-lines="addLines"
            editor-id="firstEditor"
            :editor-default-value="codeResult"
            lang="json"
            :height="460"
          ></AceEditor>
          <div v-else style="color: var(--color-text-3); text-align: left">{{
            $t('applications.applications.history.diff.same')
          }}</div>
        </div>
      </a-form>
    </a-spin>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
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
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import _, { get, find, cloneDeep } from 'lodash';
  import { ref, reactive, PropType, watch, inject, computed } from 'vue';
  import {
    json2Yaml,
    yaml2Json,
    unknowType,
    validateYaml
  } from '@/components/form-create/config/yaml-parse';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateAppNameRegx } from '@/views/config';
  import internalComponents from '@/components/form-create/components/internal';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { getListLabel } from '@/utils/func';
  import useCodeDiff from '@/hooks/use-code-diff';
  import { Variables } from '../config/interface';
  import { componentsMap, instanceUpgradeView } from '../config';
  import createTags from './create-tags.vue';
  import {
    deployApplication,
    upgradeApplicationInstance,
    diffInstanceSpec
  } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    status: {
      type: String,
      default() {
        return 'create';
      }
    },
    variables: {
      type: Array as PropType<Variables[]>,
      default() {
        return [];
      }
    },
    environmentList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },

    activeInstanceInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  const emit = defineEmits(['save', 'upgrade', 'update:show', 'update:status']);
  const instanceInfo = inject(
    'instanceInfo',
    ref({
      name: '',
      environment: {
        id: ''
      }
    })
  );
  const {
    removeLines,
    addLines,
    codeResult,
    setDiffResult,
    getCodeResult,
    getDiffResultLines,
    clearDiffLines
  } = useCodeDiff();
  const { route, t } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const variablesList = ref<Variables[]>([]);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const triggerValidate = ref(false);
  const formData = reactive({
    name: '',
    variables: {},
    remarkTags: [],
    // description: '',
    // labels: {},
    environment: {
      id: '',
      name: ''
    }
  });

  const dataList = computed(() => {
    const list = _.map(instanceUpgradeView, (o) => {
      const item = _.cloneDeep(o);
      if (item.key === 'environment.id') {
        item.value = getListLabel(
          _.get(formData, item.key),
          props.environmentList
        );
      } else {
        item.value = _.get(formData, item.key);
      }
      item.label = t(item.label);
      return item;
    });
    return list;
  });

  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const handleAdd = () => {
    labelList.value.push({ key: '', value: '' });
  };

  const validateVariable = (val, callback, type) => {
    if (type !== unknowType.dynamic) {
      callback();
    }
    const result = validateYaml(val);
    if (!result.empty && result.error) {
      callback(`${result.error?.message}`);
    }
    callback();
  };

  const setLabelList = () => {
    labelList.value = _.map(_.keys(formData.labels), (k) => {
      return {
        key: k,
        value: _.get(formData, `labels.${k}`)
      };
    });
  };
  const setVariablesList = () => {
    variablesList.value = _.map(props.variables, (o) => {
      const item = cloneDeep(o);
      if (item.type === unknowType.dynamic) {
        item.value = json2Yaml(item.default);
        item.default = json2Yaml(item.default);
      } else if (item.type === 'bool') {
        item.value = !!item.default;
      } else {
        item.value = item.default;
      }
      return item;
    });
  };
  const setFormVariables = () => {
    formData.variables = _.reduce(
      variablesList.value,
      (obj, item) => {
        if (item.type === unknowType.dynamic) {
          obj[item.name] = yaml2Json(item.value);
        } else if (item.type === 'number') {
          obj[item.name] = _.isNumber(item.value) ? item.value : null;
        } else {
          obj[item.name] = item.value;
        }
        return obj;
      },
      {}
    );
  };
  const handleEnvChange = (val) => {
    const data = find(props.environmentList, (item) => item.value === val);
    formData.environment.name = data?.label || '';
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        setFormVariables();
        submitLoading.value = true;
        // TODO
        if (props.status === 'create') {
          const resData = await deployApplication({
            ...formData,
            application: {
              id: route.query.id || ''
            }
          });
          const environment = cloneDeep(formData.environment);
          setTimeout(() => {
            emit(
              'save',
              {
                ...resData?.data,
                environment
              },
              props.status
            );
          }, 100);
        } else {
          await upgradeApplicationInstance({
            ...formData,
            application: {
              id: route.query.id || ''
            },
            id: props.activeInstanceInfo.id
          });
          setTimeout(() => {
            emit('upgrade', props.activeInstanceInfo.id);
          }, 100);
        }
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const resetForm = () => {
    formData.name = '';
    formData.environment.id = '';
    formData.environment.name = '';
    formData.variables = {};
    formData.remarkTags = [];
    // formData.description = '';
    // formData.labels = {};
    clearDiffLines();
  };
  const setDeployVariables = () => {
    formData.variables = _.reduce(
      props.variables,
      (obj, item) => {
        obj[item.name] = item.default;
        return obj;
      },
      {}
    );
  };
  const getInstanceSpecDiff = async () => {
    if (!props.activeInstanceInfo.id) return;
    try {
      const params = {
        instanceID: props.activeInstanceInfo.id
      };
      const { data } = await diffInstanceSpec(params);
      const diffContent = {
        old: JSON.stringify(
          _.pick(data.old, ['variables', 'modules']),
          null,
          2
        ),
        new: JSON.stringify(_.pick(data.new, ['variables', 'modules']), null, 2)
      };
      setDiffResult(diffContent.old, diffContent.new);
      getCodeResult();
      getDiffResultLines();
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => props.status,
    () => {
      if (props.status === 'edit') {
        formData.name =
          get(props.activeInstanceInfo, 'name') || instanceInfo.value.name;
        formData.environment.id =
          get(props.activeInstanceInfo, 'environment.id') ||
          instanceInfo.value.environment.id;
      }
    },
    {
      immediate: true
    }
  );
  const handleBeforeOpen = () => {
    // setLabelList();
    setVariablesList();
    setDeployVariables();
    getInstanceSpecDiff();
  };
  const handleBeforeClose = () => {
    emit('update:status', 'create');
    resetForm();
  };
</script>

<style></style>

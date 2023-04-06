<template>
  <div>
    <a-form ref="formref" :model="formData" auto-label-width layout="vertical">
      <a-grid :cols="24">
        <a-grid-item :span="12">
          <a-form-item
            :label="$t('applications.applications.form.name')"
            field="name"
            :rules="[
              {
                required: true,
                message: $t('applications.applications.rule.name')
              },
              {
                match: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
                message: $t('applications.applications.rule.allName')
              }
            ]"
          >
            <a-input
              v-model="formData.name"
              :max-length="30"
              show-word-limit
              style="width: 100%"
            ></a-input>
            <template #extra>
              <span class="tips">{{
                $t('applications.applications.rule.allName')
              }}</span>
            </template>
          </a-form-item>
          <a-form-item :label="$t('common.table.description')">
            <a-textarea
              v-model="formData.description"
              :max-length="200"
              show-word-limit
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            ></a-textarea>
          </a-form-item>
          <a-form-item :label="$t('applications.applications.form.label')">
            <div style="display: flex; flex-direction: column; width: 100%">
              <div v-if="labelList.length" class="var-item-title">
                <span class="label">{{
                  $t('applications.applications.form.key')
                }}</span>
                <span class="label">
                  <span class="holder"></span>
                  <span>{{ $t('applications.applications.form.value') }}</span>
                </span>
                <span class="btn"></span>
              </div>
              <div
                v-for="(sItem, sIndex) in labelList"
                :key="sIndex"
                style="margin-bottom: 10px"
              >
                <xInputGroup
                  v-model:dataKey="sItem.key"
                  v-model:dataValue="sItem.value"
                  v-model:value="formData.labels"
                  always-delete
                  :trigger-validate="triggerValidate"
                  width="100%"
                  class="group-item"
                  :label-list="labelList"
                  :position="sIndex"
                  @add="(obj) => handleAddLabel(obj, labelList)"
                  @delete="handleDeleteLabel(labelList, sIndex)"
                ></xInputGroup>
              </div>
              <div v-if="!labelList.length">
                <a-tooltip
                  :content="$t('applications.applications.labels.title')"
                >
                  <thumbButton
                    :size="30"
                    font-size="16px"
                    @click="handleAdd"
                  ></thumbButton>
                </a-tooltip>
              </div>
            </div>
          </a-form-item>
        </a-grid-item>
      </a-grid>
    </a-form>
    <labelsModal
      v-model:show="showLabelsModal"
      v-model:labels="formData.labels"
    ></labelsModal>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import useCallCommon from '@/hooks/use-call-common';
  import { assignIn, keys, get, each, map, some } from 'lodash';
  import { ref, reactive, PropType, watch, provide } from 'vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import labelsModal from './labels-modal.vue';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultValue: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  provide('showHintInput', false);
  const { route } = useCallCommon();
  const formref = ref();
  const id = route.query.id as string;
  const showLabelsModal = ref(false);
  const triggerValidate = ref(false);
  const editEnable = reactive({
    name: false,
    description: false,
    label: false
  });
  const formData = reactive({
    name: '',
    createTime: '',
    updateTime: '',
    description: '',
    labels: {}
  });
  const labelList = ref<{ key: string; value: string }[]>([]);
  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const handleAdd = () => {
    labelList.value.push({ key: '', value: '' });
  };
  const handleEditLabels = () => {
    showLabelsModal.value = true;
  };
  const getLabelList = () => {
    labelList.value = [];
    const labelKeys = keys(get(formData, 'labels'));
    labelList.value = map(labelKeys, (k) => {
      return {
        key: k,
        value: get(formData, `labels.${k}`)
      };
    });
    // if (!labelList.value.length) {
    //   labelList.value = [{ key: '', value: '' }];
    // }
  };
  const validateLabels = () => {
    triggerValidate.value = some(labelList.value, (item) => !item.key);
    return triggerValidate.value;
  };
  const getFormData = async () => {
    const labelsRes = validateLabels();
    const res = await formref.value.validate();
    if (!res && !labelsRes) {
      return formData;
    }
    return false;
  };
  defineExpose({
    getFormData
  });
  watch(
    () => props.defaultValue,
    () => {
      assignIn(formData, props.defaultValue);
      getLabelList();
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  .labels-tips {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
  }

  .labels-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .label-item {
      display: inline-block;
      max-width: 160px;
      height: 24px;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 2px 10px;
      line-height: 20px;
      // text-align: center;
      // text-overflow: ellipsis;
      // overflow: hidden;
      white-space: nowrap;
      background-color: rgba(var(--arcoblue-1), 1);
      // color: var(--color-text-2);
      border-radius: 12px;
    }
  }

  .var-item-title {
    display: flex;
    margin-bottom: 10px;

    .label {
      flex: 1;
      font-weight: 500;
    }

    .holder {
      padding: 0 4px;
    }

    .btn {
      flex-basis: 54px;
    }
  }
</style>

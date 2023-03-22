<template>
  <div>
    <a-form ref="formref" :model="formData" auto-label-width layout="vertical">
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item
            label="应用名称"
            field="name"
            :rules="[{ required: true, message: '名称必填' }]"
          >
            <a-input
              v-model="formData.name"
              :max-length="50"
              show-word-limit
              style="width: 100%"
            ></a-input>
          </a-form-item>
          <a-form-item label="描述">
            <a-input
              v-model="formData.description"
              :max-length="200"
              show-word-limit
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            ></a-input>
          </a-form-item>
          <div v-if="id">
            <a-form-item label="创建时间" disabled>
              <a-input
                :model-value="
                  dayjs(formData.createTime).format('YYYY-MM-DD HH:mm:ss')
                "
                style="width: 100%"
              ></a-input>
            </a-form-item>
            <a-form-item label="更新时间" disabled>
              <a-input
                :model-value="
                  dayjs(formData.updateTime).format('YYYY-MM-DD HH:mm:ss')
                "
                style="width: 100%"
              ></a-input>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('applications.projects.form.label')">
            <a-space
              v-if="labelList.length"
              style="display: flex; flex-direction: column"
              direction="vertical"
            >
              <xInputGroup
                v-for="(sItem, sIndex) in labelList"
                :key="sIndex"
                v-model:dataKey="sItem.key"
                v-model:dataValue="sItem.value"
                v-model:value="formData.labels"
                width="500px"
                class="group-item"
                :label-list="labelList"
                :position="sIndex"
                @add="(obj) => handleAddLabel(obj, labelList)"
                @delete="handleDeleteLabel(labelList, sIndex)"
              ></xInputGroup>
            </a-space>
            <div v-else class="labels-tips">
              <a-button type="text" size="small" @click="handleAdd">
                <icon-plus style="margin-right: 6px" />
                <span>添加标签</span>
              </a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import useCallCommon from '@/hooks/use-call-common';
  import { assignIn, keys, get, each, map } from 'lodash';
  import { ref, reactive, PropType, watch, provide } from 'vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';

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
  const getFormData = async () => {
    const res = await formref.value.validate();
    if (!res) {
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
</style>

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
            <a-input v-model="formData.name" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col v-if="id" :span="12">
          <a-form-item label="创建时间" disabled>
            <a-input
              v-model="formData.createTime"
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="描述">
            <a-textarea
              v-model="formData.description"
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            ></a-textarea>
          </a-form-item>
        </a-col>
        <a-col v-if="id" :span="12">
          <a-form-item label="更新时间" disabled>
            <a-input
              v-model="formData.updateTime"
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :label="$t('applications.projects.form.label')">
        <a-space
          style="display: flex; flex-direction: column"
          direction="vertical"
        >
          <xInputGroup
            v-for="(sItem, sIndex) in labelList"
            :key="sIndex"
            v-model:dataKey="sItem.key"
            v-model:dataValue="sItem.value"
            v-model:value="formData.labels"
            width="580px"
            class="group-item"
            :label-list="labelList"
            :position="sIndex"
            @add="(obj) => handleAddLabel(obj, labelList)"
            @delete="handleDeleteLabel(labelList, sIndex)"
          ></xInputGroup>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import useCallCommon from '@/hooks/use-call-common';
  import { assignIn, keys, get, each, map } from 'lodash';
  import { ref, reactive, PropType, watch } from 'vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
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
  const getLabelList = () => {
    labelList.value = [];
    const labelKeys = keys(get(formData, 'labels'));
    labelList.value = map(labelKeys, (k) => {
      return {
        key: k,
        value: get(formData, `labels.${k}`)
      };
    });
    if (!labelList.value.length) {
      labelList.value = [{ key: '', value: '' }];
    }
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
    () => props.dataInfo,
    () => {
      assignIn(formData, props.dataInfo);
      getLabelList();
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less"></style>

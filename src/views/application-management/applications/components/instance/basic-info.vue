<template>
  <div>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="Name">
            <a-input v-model="formData.name" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="CreateTime">
            <a-input
              v-model="formData.createTime"
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="Application">
            <a-input style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Environment">
            <a-input style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="Status">
            <a-input style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Access URL">
            <a-input style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { assignIn, keys, get, each, map } from 'lodash';
  import { ref, reactive, PropType, watch } from 'vue';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
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
  watch(
    () => props.dataInfo,
    () => {
      assignIn(formData, props.dataInfo);
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less"></style>

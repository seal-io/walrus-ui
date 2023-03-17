<template>
  <div>
    <a-form
      ref="formref"
      :model="formData"
      auto-label-width
      disabled
      layout="vertical"
    >
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="Name">
            <a-input v-model="formData.name" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Status">
            <a-input v-model="formData.status" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="Application">
            <a-input
              v-model="formData.application.name"
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Environment">
            <a-input
              v-model="formData.environment.name"
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="CreateTime">
            <a-input
              :model-value="
                dayjs(formData.createTime).format('YYYY-MM-DD HH:mm:ss')
              "
              style="width: 100%"
            ></a-input>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="Access URL">
            <a-input style="width: 100%"></a-input>
          </a-form-item>
        </a-col> -->
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { assignIn, keys, get, each, map } from 'lodash';
  import { ref, reactive, PropType, watch, inject, watchEffect } from 'vue';
  import { InstanceData } from '../../config/interface';

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
    status: '',
    environment: { name: '' },
    application: {
      name: ''
    }
  });
  const instanceInfo = inject(
    'instanceInfo',
    ref({
      name: '',
      createTime: '',
      updateTime: ''
    })
  );
  const appInfo = inject('appInfo', reactive({ name: '' }));
  const labelList = ref<{ key: string; value: string }[]>([]);
  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };

  watchEffect(() => {
    assignIn(formData, instanceInfo.value, {
      application: { name: appInfo.name }
    });
  });
</script>

<style lang="less"></style>

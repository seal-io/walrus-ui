<template>
  <div class="basic-info">
    <a-descriptions :data="basicDataList">
      <a-descriptions-item
        v-for="(item, index) in basicDataList"
        :key="index"
        :label="item.label"
      >
        <StatusLabel
          v-if="item.key === 'status'"
          :zoom="0.9"
          :status="{
            status: item.value,
            text: item.value,
            message: '',
            transitioning: ['Deleting', 'Deploying'].includes(
              get(item, 'value')
            ),
            error: ['DeployFailed', 'DeleteFailed'].includes(get(item, 'value'))
          }"
        ></StatusLabel>
        <span v-else>{{ item.value }}</span>
      </a-descriptions-item>
    </a-descriptions>
    <!-- <a-form
      ref="formref"
      :model="formData"
      auto-label-width
      disabled
      layout="inline"
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
      </a-row>
    </a-form> -->
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { assignIn, keys, get, each, map } from 'lodash';
  import {
    ref,
    reactive,
    PropType,
    watch,
    inject,
    watchEffect,
    computed
  } from 'vue';
  import { InstanceData } from '../../config/interface';
  import { instanceBasicInfo } from '../../config';

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

  const basicDataList = computed(() => {
    return map(instanceBasicInfo, (item) => {
      return {
        label: item.label,
        key: item.key,
        value: item.formatter
          ? item.formatter(get(formData, item.key))
          : get(formData, item.key)
      };
    });
  });
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

<style lang="less" scoped>
  .basic-info {
    :deep(.arco-descriptions-row) {
      .arco-descriptions-item-label-block {
        font-weight: 400;
      }
    }
  }
</style>

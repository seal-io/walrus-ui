<template>
  <div class="basic-info">
    <a-descriptions :data="basicDataList" :column="2">
      <a-descriptions-item
        v-for="(item, index) in basicDataList"
        :key="index"
        :label="item.label"
        :span="item.span"
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
        <div v-else>{{ item.value }}</div>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import useCallCommon from '@/hooks/use-call-common';
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
  const { t } = useCallCommon();
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
        ...item,
        label: t(item.label),
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

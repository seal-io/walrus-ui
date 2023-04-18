<template>
  <div>
    <a-cascader
      :loading="loading"
      :model-value="resourceKey"
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      :placeholder="$t('applications.applications.logs.holder')"
      @change="handleObjectChange"
    ></a-cascader>
    <xTerminal :url="wssURL"></xTerminal>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, computed, onMounted, watch, nextTick } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import { queryApplicationResource } from '../../../api';
  import { Cascader } from '../../../config/interface';
  import {
    generateResourcesKeys,
    getResourceId,
    getDefaultValue
  } from '../../../config';

  const { host, protocol } = window.location;
  const proto = protocol === 'https:' ? 'wss' : 'ws';
  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const resourceKey = ref('');
  const containerList = ref<Cascader[]>([]);
  const loading = ref(false);

  const terminalTypeList = ['bash', 'sh', 'powershell', 'pwsh', 'cmd'];
  const wssURL = computed(() => {
    if (!resourceId.value || !resourceKey.value) {
      return '';
    }
    return `${proto}://${host}/v1/application-resources/${resourceId.value}/exec?key=${resourceKey.value}`;
  });
  const handleObjectChange = (val) => {
    const result = getResourceId(val);
    console.log('handleObjectChange:', result);
    resourceKey.value = result.key;
    resourceId.value = result.id;
  };
  const resetData = () => {
    containerList.value = [];
  };
  const getApplicationResource = async () => {
    resetData();
    if (!instanceId.value) return;
    try {
      loading.value = true;
      const params = {
        instanceID: instanceId.value,
        page: 1,
        perPage: -1
      };
      const { data } = await queryApplicationResource(params);
      const list = data?.items || [];
      // const list = testData;
      containerList.value = generateResourcesKeys(list, 'executable');
      const defaultValue = getDefaultValue(containerList.value);
      handleObjectChange(defaultValue);
      loading.value = false;
      console.log('containerList===', defaultValue);
    } catch (error) {
      loading.value = false;
      console.log(error);
      containerList.value = [];
    }
  };
  onMounted(() => {
    // getApplicationResource();
  });
  watch(
    () => instanceId.value,
    () => {
      nextTick(() => {
        getApplicationResource();
      });
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped></style>

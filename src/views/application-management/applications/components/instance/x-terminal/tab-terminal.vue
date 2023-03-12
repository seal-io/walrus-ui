<template>
  <div>
    <a-cascader
      :model-value="resourceKey"
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      placeholder="请选择对象"
      @change="handleObjectChange"
    ></a-cascader>
    <xTerminal :url="wssURL"></xTerminal>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, computed, onMounted } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import { queryApplicationResource } from '../../../api';
  import { Cascader } from '../../../config/interface';
  import { generateResourcesKeys, getResourceId } from '../../../config';

  const localServer = window.location.host;
  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const resourceKey = ref('');
  const containerList = ref<Cascader[]>([]);

  const wssURL = computed(() => {
    if (!resourceId.value || !resourceKey.value) {
      return '';
    }
    return `wss://${localServer}/v1/application-resources/${resourceId.value}/exec?key=${resourceKey.value}`;
  });
  const handleObjectChange = (val) => {
    const result = getResourceId(val);
    resourceKey.value = result.key;
    resourceId.value = result.id;
  };
  const getApplicationResource = async () => {
    if (!instanceId.value) return;
    try {
      const params = {
        instanceID: instanceId.value,
        page: 1,
        perPage: -1
      };
      const { data } = await queryApplicationResource(params);
      const list = data?.items || [];
      // const list = testData;
      containerList.value = generateResourcesKeys(list, 'executable');
    } catch (error) {
      console.log(error);
      containerList.value = [];
    }
  };
  onMounted(() => {
    getApplicationResource();
  });
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <a-cascader
      :loading="isLoading"
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
  import qs from 'query-string';
  import {
    inject,
    ref,
    computed,
    onMounted,
    watch,
    nextTick,
    PropType
  } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import { useRoute } from 'vue-router';
  import { queryApplicationResource } from '../../../api';
  import { Cascader, InstanceResource } from '../../../config/interface';
  import {
    generateResourcesKeys,
    getResourceId,
    getDefaultValue
  } from '../../../config/utils';

  const props = defineProps({
    resourceList: {
      type: Array as PropType<InstanceResource[]>,
      default() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const route = useRoute();
  const { host, protocol } = window.location;
  const proto = protocol === 'https:' ? 'wss' : 'ws';
  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const resourceKey = ref('');
  const projectID = route.params.projectId;
  let timer: any = null;
  const containerList = ref<Cascader[]>([]);
  const loading = ref(false);

  const wssURL = computed(() => {
    if (!resourceId.value || !resourceKey.value) {
      return '';
    }
    return `${proto}://${host}/v1/application-resources/${
      resourceId.value
    }/exec?${qs.stringify({
      key: resourceKey.value,
      projectID
    })}`;
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
        serviceID: instanceId.value,
        page: -1
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
    () => props.resourceList,
    (list) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        containerList.value = generateResourcesKeys(list, 'executable');
        const defaultValue = getDefaultValue(containerList.value);
        handleObjectChange(defaultValue);
        console.log(
          'containerList====',
          containerList.value,
          props.resourceList
        );
      }, 100);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped></style>

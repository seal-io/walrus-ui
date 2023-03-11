<template>
  <div class="tab-logs-wrap">
    <a-cascader
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      placeholder="请选择对象"
      @change="handleObjectChange"
    ></a-cascader>
    <a-textarea
      v-model="content"
      readonly
      :auto-size="{ minRows: 10, maxRows: 20 }"
    ></a-textarea>
    <!-- <AceEditor :model-value="content" read-only></AceEditor> -->
  </div>
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  import { createWebSocketUrl } from '@/hooks/use-websocket';
  import { get, split, map, filter } from 'lodash';
  import {
    onMounted,
    ref,
    inject,
    computed,
    onBeforeUnmount,
    watch,
    onUnmounted
  } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { InstanceResource, Cascader } from '../../config/interface';
  import { generateResourcesKeys } from '../../config';
  import {
    queryApplicationResource,
    queryApplicationResourceKeys
  } from '../../api';
  import testData from '../../config/data';

  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const logKey = ref('');
  const wssInstance: any = ref('');
  const content = ref('');
  const dataList = ref<InstanceResource[]>([]);
  const containerList = ref<Cascader[]>([]);

  // const content = computed(() => {
  //   return wssInstance.value?.data;
  // });
  const createWebSockerConnection = () => {
    if (!logKey.value || !resourceId.value) return;
    const wssURL = createWebSocketUrl(
      `/application-resources/${resourceId.value}/log?key=${logKey.value}`
    );
    wssInstance.value = useWebSocket(wssURL, {
      // autoReconnect: {
      //   retries: 3,
      //   delay: 1000,
      //   onFailed() {
      //     console.log('Failed to connect WebSocket after 3 retries');
      //   }
      // }
      autoReconnect: false
    });
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
      containerList.value = generateResourcesKeys(list, 'loggable');
    } catch (error) {
      console.log(error);
      containerList.value = [];
      dataList.value = [];
    }
  };

  const getResourceId = (val) => {
    const res = split(val, '?');
    const d = get(res, 1);
    return {
      key: get(res, 0),
      id: get(split(d, '='), 1)
    };
  };
  const handleObjectChange = (val) => {
    const result = getResourceId(val);
    logKey.value = result.key;
    resourceId.value = result.id;
    content.value = '';
    createWebSockerConnection();

    console.log('object:', val, wssInstance.value);
  };
  const init = async () => {
    await getApplicationResource();
    // await getResourceKeys();
  };
  onMounted(() => {
    init();
  });
  watch(
    () => wssInstance.value?.data,
    (newVal) => {
      if (newVal) {
        content.value = `${content.value}${newVal}`;
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => wssInstance.value?.status,
    (newVal) => {
      console.log('wss status:', newVal);
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    wssInstance.value?.close?.();
  });
</script>

<style></style>

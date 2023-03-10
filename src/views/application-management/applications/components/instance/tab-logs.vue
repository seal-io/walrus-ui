<template>
  <div class="tab-logs-wrap">
    <a-cascader
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      :placeholder="$t('applications.applications.container.holder')"
    ></a-cascader>
    <AceEditor :model-value="content" read-only></AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  import { createWebSocketUrl } from '@/hooks/use-websocket';
  import { get, map, filter } from 'lodash';
  import { onMounted, ref, inject } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { InstanceResource, KeysItem, Cascader } from '../../config/interface';
  import { generateResourcesKeys } from '../../config';
  import {
    queryApplicationResource,
    queryApplicationResourceKeys,
    queryApplicationResourceLogs
  } from '../../api';
  import testData from '../../config/data';

  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const content = ref('');
  const dataList = ref<InstanceResource[]>([]);
  const containerList = ref<Cascader[]>([]);

  const createWebSockerConnection = () => {
    const wssURL = createWebSocketUrl(
      `/application-resources/${resourceId.value}/log`
    );
    const { status, data, send, open, close } = useWebSocket(wssURL, {
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          console.log('Failed to connect WebSocket after 3 retries');
        }
      }
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
      // const list = data?.items || [];
      const list = testData;
      containerList.value = generateResourcesKeys(list, 'loggable');
      console.log('containerList=====', containerList.value);
    } catch (error) {
      console.log(error);
      containerList.value = [];
      // dataList.value = [];
    }
  };
  const getResourceKeys = async () => {
    if (!resourceId.value) return;
    try {
      const { data } = await queryApplicationResourceKeys({
        id: resourceId.value
      });
    } catch (error) {
      console.log(error);
    }
  };
  const init = async () => {
    await getApplicationResource();
    // await getResourceKeys();
  };
  onMounted(() => {
    init();
  });
</script>

<style></style>

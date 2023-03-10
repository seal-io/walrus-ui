<template>
  <div class="tab-logs-wrap">
    <a-space>
      <a-select
        style="width: 200px; margin-bottom: 8px"
        allow-search
        placeholder="请选择资源"
      >
        <a-option
          v-for="(item, index) in dataList"
          :key="index"
          :value="item.id"
          :label="item.name"
        ></a-option>
        <template #empty>
          <span></span>
        </template>
      </a-select>
      <a-select
        style="width: 200px; margin-bottom: 8px"
        :options="containerList"
        :placeholder="$t('applications.applications.container.holder')"
      ></a-select>
    </a-space>
    <AceEditor :model-value="content" read-only></AceEditor>
  </div>
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  import { createWebSocketUrl } from '@/hooks/use-websocket';
  import { get } from 'lodash';
  import { onMounted, ref, inject } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { InstanceResource } from '../../config/interface';
  import {
    queryApplicationResource,
    queryApplicationResourceKeys,
    queryApplicationResourceLogs
  } from '../../api';

  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const content = ref('');
  const dataList = ref<InstanceResource[]>([]);
  const podList = ref([]);
  const containerList = ref([
    { label: 'container1', value: 'a' },
    { label: 'container2', value: 'b' },
    { label: 'container3', value: 'c' }
  ]);
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
      dataList.value = data?.items || [];
      resourceId.value = get(dataList.value, '0.id') || '';
    } catch (error) {
      console.log(error);
      dataList.value = [];
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
    await getResourceKeys();
  };
  onMounted(() => {
    init();
  });
</script>

<style></style>

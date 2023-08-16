<template>
  <div
    :id="containerId"
    class="service-terminal"
    style="position: relative; z-index: 3001"
  >
    <a-select
      v-model="resourceKey"
      style="width: 240px; margin-bottom: 10px"
      :options="dataList"
      :popup-container="getContainer()"
      @change="handleKeyChange"
    ></a-select>
    <xTerminal
      ref="terminal"
      :url="wssURL"
      :height="height"
      style="min-height: 270px"
    ></xTerminal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import qs from 'query-string';
  import {
    inject,
    ref,
    computed,
    onMounted,
    watch,
    nextTick,
    PropType,
    onBeforeUnmount
  } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import { useRoute } from 'vue-router';
  import {
    SERVICE_RESOURCE_API_PREFIX,
    SERVICE_API_PREFIX,
    SERVICE_API
  } from '@/views/application-management/services/api';
  import { ResourceKey } from '../../../config/interface';

  const props = defineProps({
    containerId: {
      type: String,
      default() {
        return '';
      }
    },
    nodeInfo: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    height: {
      type: Number,
      default: 270
    },
    dataList: {
      type: Array as PropType<ResourceKey[]>,
      default() {
        return [];
      }
    }
  });
  const route = useRoute();
  const { host, protocol } = window.location;
  const proto = protocol === 'https:' ? 'wss' : 'ws';
  const resourceId = ref('');
  const resourceKey = ref('');
  const terminal = ref();
  const projectID = route.params.projectId;
  let timer: any = null;

  const wssURL = computed(() => {
    if (!resourceId.value || !resourceKey.value) {
      return '';
    }
    return `${proto}://${host}/v1${SERVICE_RESOURCE_API_PREFIX()}/resources/${
      resourceId.value
    }/exec?${qs.stringify({
      key: resourceKey.value,
      projectID
    })}`;
  });
  const handleKeyChange = (val) => {
    const result = _.find(props.dataList, (item) => item.value === val);

    resourceKey.value = result?.value || '';
    resourceId.value = result?.id || '';
  };
  const getContainer = () => {
    return document.getElementById(props.containerId) || document.body;
  };
  watch(
    () => props.dataList,
    (list) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleKeyChange(_.get(list, '0.value'));
      }, 100);
    },
    {
      immediate: true,
      deep: true
    }
  );
  onBeforeUnmount(() => {
    terminal.value?.destoryedTerm?.();
  });
</script>

<style lang="less" scoped></style>

<template>
  <div class="tab-logs-wrap">
    <a-cascader
      :loading="isLoading"
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      :model-value="logKey"
      :placeholder="$t('applications.applications.logs.holder')"
      @change="handleObjectChange"
    ></a-cascader>
    <div class="wrap">
      <div class="content">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import Convert from 'ansi-to-html';
  import { get, split } from 'lodash';
  // import stripAnsi from 'strip-ansi';
  import hasAnsi from 'has-ansi';
  import { ref, inject, watch, PropType } from 'vue';
  import { InstanceResource, Cascader } from '../../config/interface';
  import { generateResourcesKeys, getDefaultValue } from '../../config/utils';
  import {
    queryApplicationResource,
    getPermissionRouteParams
  } from '../../api';
  import testData from '../../config/data';

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
  const { setChunkRequest } = useSetChunkRequest();
  const serviceId = inject('serviceId', ref(''));
  const resourceId = ref('');
  const logKey = ref('');
  const content = ref('');
  const loading = ref(false);
  let timer: any = null;
  const containerList = ref<Cascader[]>([]);
  const convert = new Convert();

  const updateContent = (newVal) => {
    if (hasAnsi(newVal)) {
      // content.value = `${content.value}${convert.toHtml(newVal)}`;
      content.value = `${convert.toHtml(newVal)}`;
    } else {
      // content.value = `${content.value}${newVal}`;
      content.value = `${newVal}`;
    }
  };
  const createChunkConnection = async () => {
    if (!logKey.value || !resourceId.value) return;
    const url = `/service-resources/${resourceId.value}/log`;
    setChunkRequest({
      url,
      params: {
        key: logKey.value,
        watch: true,
        ...getPermissionRouteParams()
      },
      contentType: 'text',
      handler: updateContent
    });
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
    createChunkConnection();
  };
  const resetData = () => {
    containerList.value = [];
    content.value = '';
  };

  watch(
    () => props.resourceList,
    (list) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        containerList.value = generateResourcesKeys(list, 'loggable');
        const defaultValue = getDefaultValue(containerList.value);
        handleObjectChange(defaultValue);
        console.log('containerList===', containerList.value);
      }, 100);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  .tab-logs-wrap {
    .wrap {
      height: 460px;
      padding: 5px 0 5px 10px;
      overflow: hidden;
      background-color: var(--color-fill-2);
      border-radius: var(--border-radius-small);

      .content {
        height: 450px;
        overflow: auto;
        font-size: 14px;
        line-height: 22px;
        white-space: pre-wrap;
        background-color: var(--color-fill-2);
      }
    }
  }
</style>

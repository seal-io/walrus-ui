<template>
  <div
    :id="containerId"
    class="tab-logs-wrap"
    style="position: relative; z-index: 3001"
  >
    <a-select
      v-model="logKey"
      style="width: 240px; margin-bottom: 10px"
      :options="dataList"
      :popup-container="getContainer()"
      @change="handleKeyChange"
    ></a-select>
    <div class="wrap" :style="{ height: `${height}px` }">
      <div class="content">
        <div class="text" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import Convert from 'ansi-to-html';
  import { get, split, find } from 'lodash';
  import hasAnsi from 'has-ansi';
  import { ref, inject, watch, PropType } from 'vue';
  import usePermissionParams from '@/views/application-management/hooks/use-permission-params';
  import { Cascader, ResourceKey } from '../../config/interface';

  const props = defineProps({
    containerId: {
      type: String,
      default() {
        return '';
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
  const permissionParams = usePermissionParams();
  const { setChunkRequest } = useSetChunkRequest();
  const resourceId = ref('');
  const logKey = ref('');
  const content = ref('');
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
        ...permissionParams
      },
      contentType: 'text',
      handler: updateContent
    });
  };

  const handleKeyChange = (val) => {
    const result = find(props.dataList, (item) => item.value === val);
    logKey.value = result?.value || '';
    resourceId.value = result?.id || '';
    content.value = '';
    createChunkConnection();
  };
  const resetData = () => {
    containerList.value = [];
    content.value = '';
  };
  const getContainer = () => {
    return document.getElementById(props.containerId) || document.body;
  };
  watch(
    () => props.dataList,
    (list) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleKeyChange(get(list, '0.value'));
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
      padding: 5px 0 5px 10px;
      overflow: auto;
      background-color: var(--color-fill-2);
      border-radius: var(--border-radius-small);

      .content {
        overflow: auto;
        font-size: 14px;
        line-height: 22px;
        white-space: pre-wrap;
        background-color: var(--color-fill-2);
      }
    }
  }
</style>

<template>
  <div
    :id="containerId"
    class="tab-logs-wrap"
    style="position: relative; z-index: 3001"
  >
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-select
          v-model="logKey"
          style="width: 240px; height: 36px"
          :options="dataList"
          :popup-container="getContainer()"
          @change="handleKeyChange"
        ></a-select>
        <a-input-number
          v-model="filterParams.tailLines"
          :min="1"
          style="width: 180px; height: 36px"
          :placeholder="$t('applications.resource.log.lastlines')"
          allow-clear
        ></a-input-number>
        <a-checkbox v-model="filterParams.timestamps">
          <span class="color-text-3">{{
            $t('applications.resource.log.showtime')
          }}</span>
        </a-checkbox>
        <a-checkbox v-model="filterParams.previous">
          <span class="color-text-3">{{
            $t('applications.resource.log.lastlog')
          }}</span>
        </a-checkbox>
        <a-checkbox v-model="breakLine">
          <span class="color-text-3">{{
            $t('applications.resource.log.breakLine')
          }}</span>
        </a-checkbox>
        <a-button type="primary" class="m-l-10" @click="handleSearch">{{
          $t('common.button.search')
        }}</a-button>
      </template>
    </FilterBox>
    <div class="wrap" :style="{ height: `${height}px` }">
      <div class="content" :class="{ 'line-break': breakLine }">
        <div class="text" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import Convert from 'ansi-to-html';
  import { get, find, pickBy } from 'lodash';
  import hasAnsi from 'has-ansi';
  import { ref, watch, PropType, reactive } from 'vue';
  import { SERVICE_API, SERVICE_API_PREFIX } from '../../api';
  import { ResourceKey } from '../../config/interface';

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
  const { setChunkRequest } = useSetChunkRequest();
  const resourceId = ref('');
  const logKey = ref('');
  const content = ref('');
  const breakLine = ref(false);
  let timer: any = null;
  const convert = new Convert();
  const filterParams = reactive({
    tailLines: undefined, //  last ? lines
    // sinceSeconds: 0,
    previous: false, // container logs last stop
    timestamps: false // show time
  });

  const updateContent = (newVal) => {
    if (hasAnsi(newVal)) {
      content.value = `${convert.toHtml(newVal)}`;
    } else {
      content.value = `${newVal}`;
    }
  };
  const createChunkConnection = async () => {
    if (!logKey.value || !resourceId.value) return;
    const url = `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      props.nodeInfo.resourceID
    }/components/${resourceId.value}/log`;
    setChunkRequest({
      url,
      params: {
        key: logKey.value,
        ...pickBy(filterParams, (val) => val),
        watch: true
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
  const handleSearch = () => {
    content.value = '';
    createChunkConnection();
  };
  const getContainer = () => {
    return document.getElementById(props.containerId) || document.body;
  };
  watch(
    () => props.dataList,
    (list) => {
      console.log('list===========00', list);
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
      background-color: var(--color-logs-bg);
      border-radius: var(--border-radius-small);

      .content {
        &.line-break {
          word-wrap: break-word;
        }
        overflow: auto;
        color: var(--color-logs-text);
        font-size: var(--font-size-small);
        line-height: 22px;
        white-space: pre-wrap;
        background-color: var(--color-logs-bg);
      }
    }
  }
</style>

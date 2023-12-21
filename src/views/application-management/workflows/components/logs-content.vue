<template>
  <div
    :id="containerId"
    class="tab-logs-wrap"
    style="position: relative; z-index: 3001"
  >
    <FilterBox v-if="url" style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input-number
          v-model="filterParams.tailLines"
          :min="1"
          style="width: 180px"
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
        <a-button type="primary" class="m-l-10" @click="handleSearch">{{
          $t('common.button.search')
        }}</a-button>
      </template>
    </FilterBox>
    <div class="wrap" :style="{ height: `${height}px` }">
      <div class="content">
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

  const props = defineProps({
    containerId: {
      type: String,
      default() {
        return '';
      }
    },
    url: {
      type: String,
      default() {
        return '';
      }
    },
    isStatic: {
      type: Boolean,
      default() {
        return false;
      }
    },
    logContent: {
      type: String,
      default() {
        return '';
      }
    },
    height: {
      type: Number,
      default: 270
    }
  });
  const { setChunkRequest } = useSetChunkRequest();
  const content = ref('');
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
    if (!props.url) return;
    setChunkRequest({
      url: props.url,
      params: {
        ...pickBy(filterParams, (val) => val),
        watch: true
      },
      contentType: 'text',
      handler: updateContent
    });
  };

  const handleKeyChange = () => {
    content.value = '';
    createChunkConnection();
  };
  const handleSearch = () => {
    content.value = '';
    createChunkConnection();
  };
  watch(
    () => props.logContent,
    (val) => {
      if (val) {
        updateContent(val);
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.url,
    (val) => {
      if (val) {
        handleKeyChange();
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .tab-logs-wrap {
    .wrap {
      padding: 5px 0 5px 10px;
      overflow: auto;
      background-color: #181d28;
      border-radius: var(--border-radius-small);

      .content {
        overflow: auto;
        color: #ddd;
        font-size: 14px;
        line-height: 22px;
        white-space: pre-wrap;
        background-color: #181d28;
      }
    }
  }
</style>

<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :unmount-on-close="true"
    :body-style="{
      'padding': '0',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    :title="`${$t('applications.instance.tab.term')}-${nodeInfo.name}/${
      nodeInfo.description
    }`"
    :render-to-body="false"
    @open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <template #title>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div>{{
          `${$t('applications.instance.tab.term')}-${nodeInfo.name}`
        }}</div>
        <a-select
          v-model="info.key"
          style="width: 300px"
          :options="dataList"
          @change="handleKeyChange"
        ></a-select>
      </div>
    </template>
    <div>
      <xTerminal ref="terminal" :url="wssURL"></xTerminal>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #cancel>
          <a-button
            :type="'primary'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import qs from 'query-string';
  import { ref, PropType, onBeforeUnmount, reactive } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import { SERVICE_RESOURCE_API_PREFIX } from '@/views/application-management/services/api';
  import router from '@/router';
  import { ResourceKey } from '../../../../config/interface';

  const props = defineProps({
    nodeInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    dataList: {
      type: Object as PropType<ResourceKey[]>,
      default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['update:show']);
  const terminal = ref();
  const { host, protocol } = window.location;
  const proto = protocol === 'https:' ? 'wss' : 'ws';
  const info = reactive({
    key: '',
    id: ''
  });
  const wssURL = ref('');

  const setWssuRL = () => {
    if (!info.key || !info.id) {
      wssURL.value = '';
      return;
    }
    wssURL.value = `${proto}://${host}/v1/${SERVICE_RESOURCE_API_PREFIX()}/resources/${
      info.id
    }/exec?${qs.stringify({
      key: info.key
    })}`;
  };
  const handleKeyChange = (value) => {
    const data = _.find(props.dataList, (item) => item.value === value);
    info.key = data?.value || '';
    info.id = data?.id || '';
    setWssuRL();
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleBeforeOpen = () => {
    const data = _.get(props.dataList, '0') || {};
    info.key = data?.value || '';
    info.id = data?.id || '';
    setWssuRL();
  };
  const handleBeforeClose = () => {
    terminal.value?.destoryedTerm?.();
  };
</script>

<style lang="less" scoped></style>

<template>
  <a-modal
    :top="modalTop"
    :closable="false"
    :align-center="false"
    :width="700"
    :fullscreen="fullscreen"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      height: fullscreen ? 'auto' : '500px',
      overflow: 'hidden',
      paddingBottom: 0
    }"
    :esc-to-close="false"
    unmount-on-close
    modal-class="log-detail-modal"
    :title="$t('applications.applications.history.running')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <template #title>
      <div class="relative flex-1 align-center">
        <a-link
          class="icon iconfont full-btn size-16"
          :class="{
            'icon-fullscreen': !fullscreen,
            'icon-fullscreen-exit': fullscreen
          }"
          @click="handleToggleFullScreen"
        ></a-link>
        <span>{{ $t('applications.applications.history.running') }}</span>
      </div>
    </template>
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-descriptions :data="dataList" :column="{ xs: 1, md: 2, lg: 2 }">
        <a-descriptions-item
          v-for="(item, index) in dataList"
          :key="index"
          :label="item.label"
        >
          <StatusLabel
            v-if="item.key === 'status'"
            style="display: flex; align-items: center"
            :zoom="0.9"
            :status="{
              status: item.value?.summaryStatus || '',
              text: item.value?.summaryStatus,
              message: '',
              transitioning: get(item, 'value.transitioning'),
              error: get(item, 'value.error')
            }"
          ></StatusLabel>
          <span v-else-if="item.key === 'duration'">
            <ClockTimer
              :start-time="get(revisionData, 'createTime')"
              :show="showTimer"
              :value="item.value"
              :stopped="isStopped"
            ></ClockTimer>
          </span>
          <span v-else>{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
      <div class="logs-content" style="text-align: left">
        <div class="label">{{
          initialStatus?.summaryStatus === RevisionStatus.Running
            ? $t('applications.applications.logs.live')
            : $t('applications.applications.instance.log')
        }}</div>
        <revisionLogs
          v-if="initialStatus?.summaryStatus === RevisionStatus.Running"
          :show="show"
          :fullscreen="fullscreen"
          :revision-id="get(revisionData, 'id')"
        ></revisionLogs>
        <div v-else class="content-wrap" :class="{ fullscreen: fullscreen }">
          {{ get(revisionData, 'record') || '' }}
        </div>
      </div>
    </a-spin>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { each, get, map, cloneDeep } from 'lodash';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import { ref, PropType, watch, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import ClockTimer from '@/components/clock-timer/index.vue';
  import revisionLogs from './revision-logs.vue';
  import { revisionDetailConfig, RevisionStatus } from '../config';
  import { queryServiceRevisionsDetail } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    revisionId: {
      type: String,
      default() {
        return '';
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    initialStatus: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emit = defineEmits(['update:show']);
  const { t } = useCallCommon();
  const loading = ref(false);
  const showTimer = ref(true);
  const fullscreen = ref(false);
  const revisionData = ref({});

  const modalTop = computed(() => {
    return fullscreen.value ? 0 : '10%';
  });
  const isStopped = computed(() => {
    const status = get(revisionData.value, 'status.summaryStatus') || '';
    return [RevisionStatus.Succeeded, RevisionStatus.Failed].includes(status);
  });
  const dataList = computed(() => {
    const res = map(revisionDetailConfig, (item) => {
      return {
        label: t(item.label),
        key: item.key,
        value:
          item?.formatter?.(get(revisionData.value, item.key)) ||
          get(revisionData.value, item.key) ||
          ''
      };
    });
    return res;
  });

  const handleToggleFullScreen = () => {
    fullscreen.value = !fullscreen.value;
  };

  const handleCancel = () => {
    showTimer.value = false;
    emit('update:show', false);
  };
  const handleOk = async () => {
    showTimer.value = false;
    emit('update:show', false);
  };

  const fetchData = async () => {
    if (!props.revisionId) return;
    try {
      loading.value = true;
      const params = {
        id: props.revisionId,
        serviceID: get(props.dataInfo, 'resource.id')
      };
      const { data } = await queryServiceRevisionsDetail(params);
      revisionData.value = data;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      revisionData.value = {};
    }
  };

  watch(
    () => props.dataInfo,
    () => {
      if (props.initialStatus?.summaryStatus === RevisionStatus.Running) {
        revisionData.value = cloneDeep(props.dataInfo);
      } else {
        fetchData();
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  const handleBeforeOpen = () => {
    showTimer.value = true;
  };
  const handleBeforeClose = () => {
    showTimer.value = false;
    fullscreen.value = false;
    emit('update:show', false);
  };
</script>

<style lang="less">
  .log-detail-modal {
    .full-btn {
      position: absolute;
      top: 5px;
      left: -8px;
    }

    .logs-content {
      .content-wrap {
        min-height: 200px;
        max-height: 360px;
        padding: 0 10px;
        overflow-y: auto;
        white-space: pre-wrap;
        background-color: var(--color-fill-2);
        border: 1px solid var(--color-border-2);
        border-radius: var(--border-radius-small);

        &.fullscreen {
          max-height: calc(100vh - 254px);
        }
      }

      .label {
        margin-top: 10px;
        margin-bottom: 10px;
        color: var(--color-text-3);
      }
    }

    .arco-descriptions-row {
      .arco-descriptions-item-label-block {
        font-weight: 400;
      }
    }
  }
</style>

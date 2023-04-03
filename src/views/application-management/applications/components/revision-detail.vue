<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ height: '490px', overflow: 'auto' }"
    modal-class="log-detail-modal"
    :title="$t('applications.applications.history.detail')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-descriptions :data="dataList" :column="{ xs: 1, md: 3, lg: 4 }">
        <a-descriptions-item
          v-for="(item, index) in dataList"
          :key="index"
          :label="item.label"
        >
          <StatusLabel
            v-if="item.key === 'status'"
            :zoom="0.9"
            :status="{
              status: item.value,
              text: item.value,
              message: '',
              transitioning: get(item, 'value') === 'Running',
              error: get(item, 'value') === 'Failed'
            }"
          ></StatusLabel>
          <span v-else>{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
      <div class="logs-content" style="text-align: left">
        <div class="label">{{
          get(revisionData, 'status') === 'Running'
            ? $t('applications.applications.logs.live')
            : $t('applications.applications.instance.log')
        }}</div>
        <deployLogs
          v-if="get(revisionData, 'status') === 'Running'"
          :revision-id="get(revisionData, 'id')"
        ></deployLogs>
        <div v-else class="content-wrap">
          {{ get(revisionData, 'statusMessage') || '' }}
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
  import { each, get, map } from 'lodash';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import { ref, PropType, watch, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import deployLogs from './deploy-logs.vue';
  import { revisionDetailConfig } from '../config';
  import { queryApplicationRevisionsDetail } from '../api';

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
    }
  });
  const emit = defineEmits(['update:show']);
  const { t } = useCallCommon();
  const loading = ref(false);
  const revisionData = ref({});

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
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    emit('update:show', false);
  };

  const fetchData = async () => {
    if (!props.revisionId) return;
    try {
      loading.value = true;
      const params = {
        id: props.revisionId
      };
      const { data } = await queryApplicationRevisionsDetail(params);
      revisionData.value = data;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      revisionData.value = {};
      console.log(error);
    }
  };

  watch(
    () => props.revisionId,
    () => {
      fetchData();
    },
    {
      immediate: true
    }
  );
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {
    emit('update:show', false);
    // revisionData.value = {};
  };
</script>

<style lang="less">
  .log-detail-modal {
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

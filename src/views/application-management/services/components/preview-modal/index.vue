<template>
  <a-modal
    top="10%"
    :closable="true"
    :align-center="false"
    :width="800"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="title"
    :footer="false"
    unmount-on-close
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div :loading="loading" style="width: 100%; text-align: center">
      <div>
        <BasicData :data-info="basicData"></BasicData>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, PropType } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import BasicInfo from '../basic-info.vue';
  import { runBasicConfig } from '../../config';
  import BasicData from './basic-data.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    runInfo: {
      type: Object as PropType<any>,
      default() {
        return {
          id: '12312',
          changes: {
            add: 2,
            delete: 1,
            change: 3
          },
          createdBy: 'admin',
          duration: 123,
          changeComment: 'test'
        };
      }
    }
  });
  const basicData = ref({
    id: '12312',
    changes: {
      add: 2,
      delete: 1,
      change: 3
    },
    createdBy: 'admin',
    duration: 123,
    changeComment: 'test',
    status: {
      summaryStatus: 'Ready'
    }
  });
  const basicDataList = useBasicInfoData(runBasicConfig, basicData);
  const emit = defineEmits(['save', 'update:show']);
  const loading = ref(false);

  const handleOk = () => {
    emit('save');
  };
  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>

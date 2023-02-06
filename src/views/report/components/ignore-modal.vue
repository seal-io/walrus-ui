<template>
  <div id="containerOci" class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :title="title"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <template #title>
        <div
          style="
            width: 500px;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            text-overflow: ellipsis;
          "
          >{{ title }}</div
        >
      </template>
      <a-spin :loading="loading" style="width: 100%; text-align: center">
        <a-form ref="formref" :model="formData" auto-label-width>
          <a-form-item
            hide-asterisk
            field="dismissReason"
            :label="$t('report.detail.ignore.reason')"
            validate-trigger="change"
            :rules="[
              {
                required: true,
                message: $t('report.detail.ignore.rule.reason'),
              },
            ]"
          >
            <a-select v-model="formData.dismissReason">
              <a-option
                v-for="item in ignoreReasonList"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ $t(item.label) }}</span>
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            hide-asterisk
            field="days"
            :label="$t('report.detail.ignore.expire')"
            validate-trigger="change"
            :rules="[
              {
                required: true,
                message: $t('report.detail.ignore.rule.expire'),
              },
            ]"
          >
            <a-radio-group v-model="formData.days">
              <a-radio
                v-for="item in ignorePeriodList"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ $t(item.label, { day: item.days }) }}</span>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            hide-asterisk
            field="dismissComment"
            :label="$t('report.detail.ignore.comment')"
            validate-trigger="change"
            :rules="[
              {
                required: false,
              },
            ]"
          >
            <a-textarea
              v-model="formData.dismissComment"
              max-length="200"
              show-word-limit
            ></a-textarea>
          </a-form-item>
        </a-form>
      </a-spin>
      <template #footer>
        <EditPageFooter>
          <template #save>
            <a-button
              :loading="submitLoading"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              :type="'outline'"
              class="cap-title cancel-btn"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </template>
        </EditPageFooter>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { get, toNumber } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import dayjs from 'dayjs';
  import { PropType, reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { issuesItem, createViolationIgnore } from '../api/report';
  import { ignoreReasonList, ignorePeriodList } from '../configs';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Object as PropType<issuesItem>,
      default() {
        return {};
      },
    },
    status: {
      type: String as PropType<'create' | 'update'>,
      default() {
        return 'create';
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const uploadRef = ref();
  const files = ref([]);
  const { loading, setLoading } = useLoading();
  const emit = defineEmits(['save', 'update:show']);
  const submitLoading = ref(false);
  const formref = ref();
  const formData = reactive({
    id: '',
    dismissType: 'temporary', // permanent
    days: 30,
    dismissReason: '', // falsePositive, acceptable, nofix, fixing
    dismissComment: '',
    // dismissExpiry: ''
  });

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleBeforeClose = () => {
    formref.value.resetFields();
  };
  const handleOk = async (e) => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        formData.dismissType = formData.days === 0 ? 'permanent' : 'temporary';
        formData.id = props.data?.id as string;
        submitLoading.value = true;
        await createViolationIgnore(formData);
        submitLoading.value = false;
        emit('save');
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const initFormData = () => {
    if (props.status === 'update' && get(props.data, 'dismissInfo.dismissed')) {
      formData.dismissComment =
        get(props.data, 'dismissInfo.dismissComment') || '';
      formData.dismissReason =
        get(props.data, 'dismissInfo.dismissReason') || '';
      const dismissAt = dayjs(get(props.data, 'dismissInfo.dismissAt'));
      const dismissExpiry = dayjs(get(props.data, 'dismissInfo.dismissExpiry'));
      const days = dayjs.duration(dismissExpiry.diff(dismissAt)).asDays();
      formData.days = days < 0 ? 0 : toNumber(days);
    }
  };
  const handleBeforeOpen = async () => {
    initFormData();
    console.log('open');
  };
</script>

<style lang="less">
  .arco-trigger-content.image-import-modal {
    .arco-select-dropdown-list-wrapper {
      max-height: 140px;
    }
  }
</style>

<style lang="less" scoped>
  .image-name {
    // font-size: 12px;
    color: var(--color-text-3);
  }

  :deep(.arco-upload-wrapper) {
    text-align: left;
  }
</style>

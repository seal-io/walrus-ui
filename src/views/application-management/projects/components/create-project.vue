<template>
  <a-modal
    top="10%"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('applications.applications.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[{ required: true, message: '项目名称必填' }]"
        >
          <a-input
            v-model="formData.name"
            style="width: 100%"
            :max-length="50"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item :label="$t('common.table.description')">
          <a-textarea
            v-model="formData.description"
            :max-length="200"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          v-for="(item, index) in labelList"
          :key="index"
          :label="`标签${index + 1}`"
        >
          <a-input-group style="width: 430px">
            <a-input></a-input><span style="padding: 0 4px">:</span
            ><a-input></a-input>
          </a-input-group>
          <a-space class="btn-wrapper">
            <icon-minus-circle
              v-if="labelList.length > 1"
              class="size-20"
              @click="handleDeleteLabel(index)"
            ></icon-minus-circle>
            <icon-plus-circle-fill
              v-if="index === labelList.length - 1"
              class="size-20"
              style="margin-left: 5px"
              @click="handleAddLabel"
            ></icon-plus-circle-fill>
          </a-space>
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
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';

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
    }
  });
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = reactive({
    name: '',
    description: ''
  });
  const labelList = ref([{ label: 'label', value: 'dev' }]);
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        setTimeout(() => {
          emit('save');
        }, 200);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleAddLabel = () => {
    labelList.value.push({ label: 'label1', value: 'dev' });
  };
  const handleDeleteLabel = (index) => {
    labelList.value.splice(index, 1);
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

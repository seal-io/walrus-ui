<template>
  <a-drawer
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :title="title"
    :unmount-on-close="true"
    :closable="false"
    style="margin-top: 56px"
    @cancel="handleCancel"
    @ok="handleOk"
    @open="handleBeforeOpen"
    @close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('cost.analyse.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[{ required: true, message: '视角名称必填' }]"
        >
          <a-input v-model="formData.name"></a-input>
        </a-form-item>
        <a-form-item label="过滤器">
          <ConditionFilter></ConditionFilter>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <EditPageFooter style="margin: 0; padding: 0" align="left">
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
  </a-drawer>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ConditionFilter from './condition-filter.vue';

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
    name: ''
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

  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style></style>

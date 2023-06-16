<template>
  <a-modal
    top="10%"
    simple
    :closable="false"
    :align-center="false"
    :width="500"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '400px',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="oci-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div style="display: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          field="name"
          :label="$t('common.table.name')"
          validate-trigger="change"
          hide-asterisk
          :rules="[
            { required: true, message: $t('applications.module.rule.name') },
            {
              match: validateAppNameRegx,
              message: $t('applications.applications.rule.allName')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            style="width: 100%"
            :max-length="30"
            show-word-limit
            :placeholder="$t('applications.applications.instance.cloneName')"
          ></a-input>
          <template #extra>
            <span class="tips">{{
              $t('applications.applications.rule.allName')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('applications.applications.tags.title')"
          :label-col-style="{ lineHeight: 1.8 }"
        >
          <createTags v-model:tags="formData.remarkTags"></createTags>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
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
  import { validateAppNameRegx } from '@/views/config';
  import createTags from './create-tags.vue';
  import { cloneApplicationInstance } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    serviceID: {
      type: String,
      default() {
        return '';
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    }
  });

  const emit = defineEmits(['save', 'update:show']);
  const formref = ref();
  const formData = reactive({
    name: '',
    remarkTags: []
  });
  const submitLoading = ref(false);

  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        const { data } = await cloneApplicationInstance({
          id: props.serviceID,
          name: formData.name
        });
        emit('update:show', false);
        emit('save', data);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeOpen = () => {
    formData.name = '';
    formData.remarkTags = [];
  };
  const handleBeforeClose = () => {};
</script>

<style></style>

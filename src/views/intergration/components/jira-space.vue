<template>
  <div class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :visible="show"
      :mask-closable="false"
      :title="$t('intergration.jira.form.title')"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('intergration.createApp.jiraurl')"
          field="resourceURL"
          :rules="[
            { required: true, message: $t('intergration.rules.jiraurl') },
          ]"
        >
          <a-select
            v-model="formData.resourceURL"
            :loading="resourceLoading"
            @change="handleResourceChange"
          >
            <template #empty><span></span></template>
            <a-option
              v-for="item in resourceList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <EditPageFooter :style="{ 'margin-top': 0 }">
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
  import { find, get, map } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive, ref } from 'vue';
  import {
    submitResourceUrl,
    queryAccessResource,
  } from '../api/project-management';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    id: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const resourceList = ref<{ label: string; value: string; id: string }[]>([]);
  const emit = defineEmits(['save', 'update:show']);
  const submitLoading = ref(false);
  const resourceLoading = ref(false);
  const formref = ref();
  const formData = reactive({
    resourceID: '',
    resourceURL: '',
  });

  const handleCancel = () => {
    emit('update:show', false);
    setTimeout(() => {
      Object.assign(formData, {
        resourceID: '',
        resourceURL: '',
        id: '',
      });
    }, 200);
  };
  const submitFormData = async () => {
    const data = {
      ...formData,
      id: props.id,
    };
    await submitResourceUrl(data);
  };
  const handleResourceChange = (value) => {
    const data = find(resourceList.value, (item) => item.value === value);
    formData.resourceID = get(data, 'id') || '';
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        await submitFormData();
        emit('save');
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const getResourceList = async () => {
    try {
      resourceLoading.value = true;
      const { data } = await queryAccessResource({ id: props.id });
      resourceList.value = map(data, (item) => {
        return {
          value: item.url,
          label: item.name,
          id: item.id,
        };
      });
      resourceLoading.value = false;
    } catch (error) {
      console.log(error);
    }
  };
  const handleBeforeClose = () => {
    Object.assign(formData, {
      resourceID: '',
      resourceURL: '',
      id: '',
    });
  };
  const handleBeforeOpen = () => {
    getResourceList();
  };
</script>

<style></style>

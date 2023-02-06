<template>
  <div class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      :ok-text="
        action === 'create'
          ? $t('common.button.save')
          : $t('common.button.confirm')
      "
      :visible="show"
      :footer="false"
      :mask-closable="true"
      :hide-cancel="formData.builtin"
      :title="
        action === 'create'
          ? $t('license.modal.title')
          : `${formData.name}-${$t('license.modal.title.view')}`
      "
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-form
        ref="formref"
        :model="formData"
        :disabled="formData.builtin"
        auto-label-width
      >
        <!-- <a-form-item
          field="name"
          :label="$t('license.modal.name')"
          validate-trigger="change"
          :rules="[{ required: true, message: $t('license.form.rules.name') }]"
        >
          <a-input v-model="formData.name" />
        </a-form-item> -->
        <a-form-item
          field="description"
          hide-label
          hide-asterisk
          :disabled="false"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('license.form.rules.description') },
          ]"
        >
          <a-textarea
            v-model="formData.text"
            :auto-size="{ maxRows: 15 }"
          ></a-textarea>
        </a-form-item>
        <!-- <a-form-item
          field="link"
          :label="$t('license.modal.link')"
          validate-trigger="change"
          :rules="[
            { required: false, match: urlReg, message: $t('system.rules.url') },
          ]"
        >
          <a-input v-model="formData.link" />
        </a-form-item>
        <a-form-item
          field="tags"
          :label="$t('license.modal.tags')"
          validate-trigger="change"
          :rules="[
            { required: false, message: $t('license.edit.form.rules.tags') },
          ]"
        >
          <a-select v-model="formData.tags" multiple :max-tag-count="2">
            <a-option
              v-for="item in tagNameList"
              :key="item"
              :value="item"
              :label="item"
            ></a-option>
          </a-select>
        </a-form-item> -->
      </a-form>
      <template #footer>
        <!-- <EditPageFooter :style="{ 'margin-top': 0 }">
          <template #save>
            <a-button
              v-show="!formData.builtin"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              :type="!formData.builtin ? 'outline' : 'primary'"
              class="cap-title cancel-btn"
              @click="handleCancel"
              >{{
                !formData.builtin
                  ? $t('common.button.cancel')
                  : $t('common.button.confirm')
              }}</a-button
            >
          </template>
        </EditPageFooter> -->
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { join, omit, pick } from 'lodash';
  import { onMounted, reactive, ref } from 'vue';
  import { urlReg } from '@/utils/validate';
  import {
    createLicense,
    updateLicense,
    licensePostParams,
    queryTagList,
  } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    action: {
      type: String,
      default() {
        return 'create';
      },
    },
  });
  const emit = defineEmits(['licenseSave', 'update:show']);
  const formref = ref();
  const tagNameList = ref([]);
  const formData: licensePostParams & { text: string } = reactive({
    name: '',
    description: '',
    id: '',
    link: '',
    tags: [],
    builtin: false,
    text: '',
  });

  const handleCancel = () => {
    emit('update:show', false);
    setTimeout(() => {
      Object.assign(formData, {
        name: '',
        description: '',
        id: '',
        link: '',
        tags: [],
        builtin: false,
      });
    }, 200);
  };
  const submitFormData = async () => {
    if (props.action === 'create') {
      const data = omit(formData, ['id']);
      await createLicense({ ...data });
    } else {
      await updateLicense({ ...formData });
    }
  };
  const handleOk = async () => {
    if (formData.builtin) {
      emit('update:show', false);
      return;
    }
    const res = await formref.value?.validate();
    if (!res) {
      await submitFormData();
      emit('licenseSave', formData);
      emit('update:show', false);
    }
  };

  const handleBeforeClose = () => {
    // Object.assign(formData, {
    //   name: '',
    //   description: '',
    //   id: '',
    //   link: '',
    //   tags: [],
    //   builtin: false,
    // });
    emit('update:show', false);
    emit('licenseSave');
  };
  const getTagNameList = async () => {
    const { data } = await queryTagList();
    tagNameList.value = [].concat(data || []);
  };
  const handleBeforeOpen = () => {
    const data =
      pick(props.dataInfo, [
        'name',
        'description',
        'id',
        'link',
        'builtin',
        'tags',
        'text',
      ]) || {};
    Object.assign(formData, data);
    console.log('formData===', formData, props.dataInfo);
  };
  onMounted(() => {
    getTagNameList();
  });
</script>

<style></style>

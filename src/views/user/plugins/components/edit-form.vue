<template>
  <div class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :ok-text="
        action === 'create'
          ? $t('common.button.save')
          : $t('common.button.confirm')
      "
      :visible="show"
      :mask-closable="false"
      :hide-cancel="formData.builtIn"
      :title="
        action === 'create'
          ? $t('plugin.modal.title')
          : $t('plugin.modal.title.edit')
      "
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-form
        ref="formref"
        :model="formData"
        :disabled="formData.builtIn"
        auto-label-width
      >
        <a-form-item
          field="name"
          :label="$t('plugin.form.name')"
          validate-trigger="change"
          :disabled="action === 'edit'"
          :rules="[{ required: true, message: $t('plugin.form.rules.name') }]"
        >
          <a-input v-model="formData.name" />
        </a-form-item>
        <!-- <a-form-item
          :label="$t('plugin.form.category')"
          field="category"
          :rules="[
            { required: true, message: $t('plugin.form.rules.category') },
          ]"
        >
          <a-select v-model="formData.category">
            <a-option
              v-for="item in categoryList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          field="description"
          :label="$t('plugin.form.description')"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('plugin.form.rules.description') },
          ]"
        >
          <a-textarea v-model="formData.description"></a-textarea>
        </a-form-item>
        <a-form-item
          field="url"
          :disabled="action === 'edit'"
          :label="$t('plugin.form.url')"
          validate-trigger="change"
          :rules="[
            { required: true, match: urlReg, message: $t('system.rules.url') },
          ]"
        >
          <a-input v-model="formData.url" />
        </a-form-item>
        <a-form-item
          :disabled="action === 'edit'"
          field="checksum"
          :label="$t('plugin.form.checksum')"
          validate-trigger="change"
          :rules="[{ required: false, message: $t('system.rules.url') }]"
        >
          <a-input v-model="formData.checksum" />
        </a-form-item>
      </a-form>
      <template #footer>
        <EditPageFooter :style="{ 'margin-top': 0 }">
          <template #save>
            <a-button
              v-show="!formData.builtIn"
              :loading="submitLoading"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              :type="!formData.builtIn ? 'outline' : 'primary'"
              class="cap-title cancel-btn"
              @click="handleCancel"
              >{{
                !formData.builtIn
                  ? $t('common.button.cancel')
                  : $t('common.button.confirm')
              }}</a-button
            >
          </template>
        </EditPageFooter>
        <!-- <a-space
          :size="40"
          align="center"
          fill
          style="justify-content: center; padding-left: 90px"
        >
          
          
        </a-space> -->
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, pick } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive, ref } from 'vue';
  import { urlReg } from '@/utils/validate';
  import { categoryList } from '@/views/policy/config';
  import { createPlugins, updatePlugins, PostFormData } from '../api';

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
  const submitLoading = ref(false);
  const formref = ref();
  const formData: PostFormData = reactive({
    name: '',
    description: '',
    id: '',
    url: '',
    checksum: '',
    category: '',
    enabled: true,
    builtIn: false,
  });

  const handleCancel = () => {
    emit('update:show', false);
    setTimeout(() => {
      Object.assign(formData, {
        name: '',
        description: '',
        id: '',
        url: '',
        checksum: '',
        category: '',
        enabled: true,
        builtIn: false,
      });
    }, 200);
  };
  const submitFormData = async () => {
    // console.log('formData===', cloneDeep(formData))
    if (props.action === 'create') {
      const data = pick(formData, [
        'name',
        'description',
        'url',
        'builtIn',
        'checksum',
        'enabled',
      ]);
      await createPlugins(data);
    } else {
      await updatePlugins(formData);
    }
  };
  const handleOk = async () => {
    if (formData.builtIn) {
      emit('update:show', false);
      return;
    }
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        await submitFormData();
        emit('licenseSave');
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeClose = () => {
    Object.assign(formData, {
      name: '',
      description: '',
      id: '',
      url: '',
      checksum: '',
      enabled: true,
      builtIn: false,
    });
    emit('licenseSave');
  };
  const handleBeforeOpen = () => {
    // const data =
    //   pick(props.dataInfo, [
    //     'name',
    //     'description',
    //     'id',
    //     'url',
    //     'builtIn',
    //     'checksum',
    //     'enabled',
    //   ]) || {};
    Object.assign(formData, props.dataInfo);
    console.log('formData===', formData, props.dataInfo);
  };
</script>

<style></style>

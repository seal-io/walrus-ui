<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="$t('common.title.basicInfo')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          field="displayName"
          hide-label
          validate-trigger="change"
          :rules="[
            {
              required: true,
              message: $t('workflow.form.rules.displayName')
            }
          ]"
        >
          <seal-input
            v-model="formData.displayName"
            :label="$t('workflow.form.displayName')"
            :required="true"
            style="width: 100%"
            :max-length="63"
            show-word-limit
          ></seal-input>
        </a-form-item>
        <a-form-item
          field="name"
          hide-label
          validate-trigger="change"
          :rules="[
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model="formData.name"
            :label="$t('workflow.form.name')"
            :required="true"
            :disabled="!!id"
            style="width: 100%"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <template #extra>
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template>
        </a-form-item>
        <a-form-item :label="$t('common.table.description')" hide-label>
          <seal-textarea
            v-model="formData.description"
            :label="$t('common.table.description')"
            :max-length="200"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></seal-textarea>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <EditPageFooter>
        <template #save>
          <a-button
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
  import useCallCommon from '@/hooks/use-call-common';
  import { validateLabelNameRegx } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { ref, PropType } from 'vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default: 'create'
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emits = defineEmits([
    'submit',
    'cancel',
    'update:show',
    'update:dataInfo'
  ]);
  const { route } = useCallCommon();
  const id = route.query.pid as string;
  const formref = ref();
  const formData = ref({
    displayName: '',
    name: '',
    type: 'default',
    description: '',
    parallelism: 0
  });

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      emits('update:dataInfo', { ...formData.value });
      emits('update:show', false);
    }
  };

  const handleCancel = () => {
    emits('update:show', false);
  };

  const handleBeforeClose = () => {
    // reset form
    formref.value?.resetFields();
  };

  const handleBeforeOpen = () => {
    formData.value = Object.assign(formData.value, { ...props.dataInfo });
  };
</script>

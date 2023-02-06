<template>
  <div class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      :ok-text="$t('common.button.confirm')"
      :visible="show"
      :footer="false"
      :mask-closable="true"
      :hide-cancel="formData.builtin"
      :title="`${formData.name}-${$t('license.modal.title.view')}`"
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
        <a-form-item
          field="description"
          hide-label
          hide-asterisk
          :disabled="false"
        >
          <a-textarea
            v-model="formData.text"
            :auto-size="{ maxRows: 15 }"
          ></a-textarea>
        </a-form-item>
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
  const formData = reactive({
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
        text: '',
        builtin: false,
      });
    }, 200);
  };
  const handleOk = async () => {
    emit('update:show', false);
  };

  const handleBeforeClose = () => {
    emit('update:show', false);
    emit('licenseSave');
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
  };
</script>

<style></style>

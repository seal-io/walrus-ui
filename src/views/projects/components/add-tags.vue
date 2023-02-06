<template>
  <div id="tagscontainer" class="container tags-container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      style="min-height: 350px"
      popup-container="#tagscontainer"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :title="$t('projects.resource.tags.title')"
      @open="handleOpened"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          style="margin-bottom: 10px"
          hide-asterisk
          field="name"
          :label="$t('projects.resource.tags.label')"
        >
          <a-input
            ref="tagInput"
            v-model.trim="values"
            :max-length="30"
            show-word-limit
            style="width: 480px; background: #f2f3f5"
            @change="handleTagEdit"
          ></a-input>
          <template #extra>{{ $t('projects.resource.tags.desc') }}</template>
        </a-form-item>
        <a-form-item>
          <a-space
            v-if="formData.tagsList.length"
            wrap
            fill
            style="width: 480px"
          >
            <a-tag
              v-for="item in formData.tagsList"
              :key="item"
              closable
              @close="handleDeleteTag(item)"
              >{{ item }}</a-tag
            >
          </a-space>
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
  import { uniq, without, trim } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive, ref, PropType, onMounted } from 'vue';
  import { urlReg } from '@/utils/validate';
  import { setResourceTags } from '@/api/projects';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    resourceId: {
      type: String,
      default() {
        return '';
      },
    },
    tags: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
  });
  const tagInput = ref();
  const emit = defineEmits(['save', 'update:show']);
  const submitLoading = ref(false);
  const formref = ref();
  const formData = reactive({
    tagsList: [],
  });
  const values = ref<string>('');
  const handleCancel = () => {
    emit('update:show', false);
  };
  const submitFormData = async () => {
    const params = {
      id: props.resourceId,
      tags: { tags: formData.tagsList },
    };
    setResourceTags(params);
  };
  const handleTagEdit = (val) => {
    // const val = list
    //   .map((item) => {
    //     return trim(item);
    //   })
    //   .filter((s) => {
    //     return !!s;
    //   });
    if (val) {
      formData.tagsList = uniq(formData.tagsList.concat(val));
      values.value = '';
    }
  };
  const handleDeleteTag = (item) => {
    const list = without(formData.tagsList, item);
    formData.tagsList = [].concat(list as never[]);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        await submitFormData();
        setTimeout(() => {
          emit('save');
        }, 100);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeClose = () => {
    formref.value.resetFields();
    values.value = '';
  };
  const handleBeforeOpen = () => {
    const list = props.tags || [];
    formData.tagsList = [].concat(list as never[]);
  };
  const handleOpened = () => {
    if (tagInput.value) {
      tagInput.value.focus();
    }
  };
</script>

<style lang="less" scoped>
  .tags-container {
    :deep(.arco-space-wrap) {
      padding: 10px;
      background: var(--color-fill-2);

      .arco-tag {
        background: #fff;
      }
    }

    :deep(.arco-input-wrapper) {
      background-color: var(--color-fill-2);
    }

    .tags-desc {
      margin-left: 3px;
      color: var(--color-text-3);
      font-size: 12px;
    }
  }
</style>

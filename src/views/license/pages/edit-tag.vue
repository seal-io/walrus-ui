<template>
  <div class="container">
    <StepsGroup
      :step="1"
      :list="stepList"
      style="margin-top: 40px; margin-bottom: 30px"
    ></StepsGroup>
    <a-card class="general-card q-s-w-card">
      <div class="title"
        >{{ title }}—<span class="sub-title">{{
          $t(get(stepList, '0'))
        }}</span></div
      >
      <a-form
        ref="formref"
        :disabled="formData.builtin"
        :model="formData"
        layout="vertical"
        auto-label-width
      >
        <a-form-item
          field="name"
          :disabled="!!groupId"
          :label="$t('license.edit.form.groupName')"
          class="s-input"
          :rules="[
            { required: true, message: $t('license.edit.form.rules.name') },
          ]"
        >
          <a-input v-model="formData.name"></a-input>
        </a-form-item>
        <!-- <a-form-item 
        field="category" 
        :label="$t('license.edit.form.category')"
        :rules="[
            { required: true, message: $t('license.edit.form.rules.category') },
          ]" 
         >
          <a-select v-model="formData.category" style="width: 550px;">
            <a-option
              v-for="item in tagCategoryList"
              :key="item"
              :value="item"
              :label="item"
            ></a-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          :label="$t('license.edit.form.description')"
          :rules="[
            {
              required: false,
              message: $t('license.edit.form.rules.description'),
            },
          ]"
          field="description"
        >
          <a-textarea v-model="formData.description"></a-textarea>
        </a-form-item>

        <a-form-item class="edit-footer-wrap" :disabled="false">
          <EditPageFooter>
            <template #default>
              <div>
                <a-button
                  v-if="!formData.builtin"
                  :loading="submitLoading"
                  type="primary"
                  class="cap-title-save save-btn"
                  @click="handleSubmit"
                  >{{ $t('common.button.save') }}</a-button
                >
                <a-button
                  v-if="formData.builtin"
                  :loading="submitLoading"
                  type="outline"
                  style="width: 120px"
                  class="cap-title-save save-btn"
                  @click="handleCancel"
                  >{{ $t('common.button.back') }}</a-button
                >
              </div>
            </template>
            <template #cancel>
              <a-button
                v-if="groupId"
                type="outline"
                class="cap-title cancel-btn"
                @click="handleNext"
                >{{ $t('common.button.next') }}</a-button
              >
            </template>
            <template #save>
              <a-button
                v-if="!formData.builtin"
                type="outline"
                class="cap-title cancel-btn"
                @click="handleCancel"
                >{{ $t('common.button.back') }}</a-button
              >
            </template>
          </EditPageFooter>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { pick, get, cloneDeep, isEqual } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onMounted, reactive, ref, computed } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import StepsGroup from '../components/steps-group.vue';
  import {
    createGroups,
    updateLicenseGroup,
    queryLicenseGroupsItem,
    queryTagCategory,
  } from '../api';
  import { FormDataType } from '../config/interface';

  const { t } = useI18n();
  const formref = ref();
  const route = useRoute();
  const router = useRouter();
  const groupId = get(route.query, 'groupId') || '';
  const submitLoading = ref(false);
  const tagCategoryList = ref([]);
  let copyFormData: any = {};
  const formData = reactive({
    id: '',
    name: '',
    description: '',
    builtin: get(route.query, 'builtin') === '1',
  });

  const title = computed(() => {
    if (!groupId) {
      return t('license.modal.group.title');
    }
    if (groupId && formData.builtin) {
      return t('license.modal.group.view');
    }
    return t('license.modal.group.edit');
  });
  const stepList = computed(() => {
    if (formData.id) {
      return ['license.edit.step.tag', 'license.edit.step.licenselist'];
    }
    return ['license.edit.step.create', 'license.edit.step.license'];
  });
  const handleCancel = () => {
    router.push({
      name: 'licenseList',
    });
  };
  const handleNext = () => {
    router.push({
      name: 'tagLicense',
      query: {
        tagName: formData.name,
        groupId,
        builtin: formData.builtin ? '1' : '0',
        action: groupId ? '0' : '1',
      },
    });
  };
  const getLicenseGroupsInfo = async () => {
    copyFormData = cloneDeep(formData);
    if (!groupId) return;
    try {
      const { data } = await queryLicenseGroupsItem(groupId);
      Object.assign(formData, data);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const res = await formref.value.validate();
    if (!res) {
      submitLoading.value = true;
      let id = groupId || '';
      let isBuiltIn = formData.builtin;
      copyFormData = cloneDeep(formData);
      const dataInfo = pick(formData, ['name', 'description']);
      try {
        if (groupId) {
          await updateLicenseGroup({ ...dataInfo, id: formData.id });
          submitLoading.value = false;
        } else {
          const { data } = await createGroups(dataInfo);
          submitLoading.value = false;
          id = data.id;
          isBuiltIn = data.builtin;
        }
        router.push({
          name: 'tagLicense',
          query: {
            tagName: formData.name,
            groupId: id,
            builtin: isBuiltIn ? '1' : '0',
            action: groupId ? '0' : '1', // 0: create 1:edit
          },
        });
      } catch (error) {
        submitLoading.value = false;
        console.log(error);
      }
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    console.log('leave');
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback(to, from, () => {
        copyFormData = cloneDeep(formData);
        router.push({
          name: to.name as string,
        });
      });
      return false;
    }
    return true;
  });
  const getTagCategoryList = async () => {
    const { data } = await queryTagCategory();
    tagCategoryList.value = [].concat(data || []);
  };
  const initData = async () => {
    // 1.
    getLicenseGroupsInfo();
    // getTagCategoryList()
  };
  onMounted(() => {
    initData();
  });
</script>

<style lang="less" scoped>
  .container {
    .title {
      margin-bottom: 20px;
      padding-bottom: 10px;
      font-weight: 500;
      font-size: 14px;
      border-bottom: 1px solid var(--seal-border-gray-2);

      .sub-title {
        font-weight: 400;
        font-size: 14px;
      }
    }

    .selected-list-wrap {
      border: 1px solid var(--color-neutral-3);
      border-radius: var(--border-radius-small);

      .s-title {
        display: flex;
        justify-content: space-between;
        height: 36px;
        padding: 0 10px;
        color: var(--color-text-1);
        font-weight: 500;
        background-color: var(--color-fill-1);
      }

      :deep(.arco-list-item) {
        padding: 7px 15px;
      }
    }

    .cap-title-save {
      width: 96px;
    }

    .data-selector-wrap {
      display: flex;
      justify-content: space-between;
    }

    .add-li.arco-btn-size-small {
      margin-top: 10px;
      padding: 0 6px;
    }

    :deep(.arco-card-body) {
      padding: 20px;
    }

    // :deep(.arco-space-fill) {
    //   justify-content: center;
    // }
    :deep(.arco-form) {
      .s-input .arco-input-wrapper {
        width: 550px;
      }

      .arco-transfer-view {
        width: 550px;
        min-width: 350px;
        // height: 300px;
      }

      .arco-transfer-view-search {
        padding-top: 4px;
      }

      .arco-transfer-view-header {
        height: 36px;
        line-height: 36px;
      }

      .arco-textarea-wrapper {
        width: 550px;
      }

      .trans-input {
        .arco-input-wrapper {
          height: 28px;
        }
      }

      .arco-list-content {
        .arco-empty {
          display: none;
        }
      }
    }
  }
</style>

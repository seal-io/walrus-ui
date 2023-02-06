<template>
  <div class="container">
    <!-- <StepsGroup
      :step="step"
      :list="['license.edit.step.tag', 'license.edit.step.licenselist']"
      :status="status"
      :loading="stepLoading"
      style="margin-top: 40px; margin-bottom: 30px"
    ></StepsGroup> -->
    <a-card class="general-card q-s-w-card">
      <div class="title">{{ title }}</div>
      <a-form
        ref="formref"
        :model="formData"
        layout="vertical"
        auto-label-width
      >
        <a-form-item
          field="name"
          :disabled="!!formData.id"
          :label="$t('license.edit.form.groupName')"
          class="s-input"
          :rules="[
            { required: true, message: $t('license.edit.form.rules.name') },
          ]"
        >
          <a-input
            v-model="formData.name"
            :max-length="30"
            show-word-limit
          ></a-input>
          <template #extra>{{ $t('license.edit.form.nameExtra') }}</template>
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
          :disabled="formData.builtin"
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
        <a-form-item
          :label="
            formData.builtin
              ? $t('license.edit.form.license')
              : $t('license.edit.form.selectLicense')
          "
          class="trans-input"
          field="licenseID"
          :validate-trigger="['change']"
          :rules="[
            {
              required: false,
              message: $t('license.edit.form.rules.licenseIds'),
            },
          ]"
        >
          <div>
            <sl-transfer
              v-model="formData.licenseID"
              :title="[
                $t('license.edit.selectable'),
                $t('license.edit.selected'),
              ]"
              :width="[550, 550]"
              :data="licenseList"
              @change="handleDataChange"
            ></sl-transfer>
          </div>
        </a-form-item>

        <a-form-item class="edit-footer-wrap" :disabled="false">
          <EditPageFooter>
            <template #cancel>
              <a-button
                type="outline"
                class="cap-title cancel-btn"
                @click="handleCancel"
                >{{ $t('common.button.cancel') }}</a-button
              >
            </template>
            <template #save>
              <a-button
                type="primary"
                class="cap-title save-btn"
                @click="handleSubmit"
                >{{ $t('common.button.save') }}</a-button
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
  import {
    pick,
    get,
    cloneDeep,
    isEqual,
    map,
    remove,
    concat,
    filter,
  } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onMounted, reactive, ref, computed } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import slTransfer from '@/components/sl-transfer/index.vue';
  import StepsGroup from '../components/steps-group.vue';
  import {
    createGroups,
    updateLicenseGroup,
    queryLicenseGroupsItem,
    queryTagCategory,
    licenseGroupRow,
    queryLicenseList,
    updateBatchLicense,
  } from '../api';
  import { FormDataType } from '../config/interface';

  const { t } = useI18n();
  const formref = ref();
  const route = useRoute();
  const router = useRouter();
  const groupId = get(route.query, 'groupId') || '';
  const tagName = get(route.query, 'tagName') || '';
  const builtIn = get(route.query, 'builtin') === '1';
  const submitLoading = ref(false);
  const status = ref<'wait' | 'process' | 'finish' | 'error'>('process');
  const step = ref(builtIn ? 2 : 1);
  const stepLoading = ref(false);
  const tagCategoryList = ref([]);
  const licenseList = ref<licenseGroupRow[]>([]);
  const licenseBindingsList = ref<licenseGroupRow[]>([]);
  let copyFormData: any = {};
  const formData = reactive({
    id: get(route.query, 'groupId') || '',
    name: '',
    description: '',
    licenseID: [] as Array<string | number>,
    builtin: get(route.query, 'builtin') === '1',
  });

  const title = computed(() => {
    if (!groupId) {
      return t('license.modal.group.title');
    }
    return t('license.modal.group.edit');
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
  const getBindLicenses = async () => {
    if (!tagName) {
      licenseBindingsList.value = [];
      return;
    }
    try {
      const params = {
        page: 1,
        perPage: 2000,
        tags: tagName,
      };
      const { data } = await queryLicenseList(params);
      const list = data.items || [];
      licenseBindingsList.value = map(list, (sItem) => {
        sItem.value = sItem.id as string;
        sItem.label = sItem.name as string;
        return sItem;
      });
      formData.licenseID = map(list, (item) => {
        return item.id;
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getTagCategoryList = async () => {
    const { data } = await queryTagCategory();
    tagCategoryList.value = [].concat(data || []);
  };
  // query license list
  const getLicenseList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 2000,
        sort: 'name',
      };
      const { data } = await queryLicenseList(params);
      licenseList.value = data.items || [];
      licenseList.value = licenseList.value.map((item) => {
        item.value = item.id as string;
        item.label = item.name as string;
        return item;
      });
    } catch (error) {
      licenseList.value = [];
    }
  };

  const getLicenseGroupsInfo = async () => {
    if (!groupId) return;
    const { data } = await queryLicenseGroupsItem(groupId);
    Object.assign(formData, data);
  };
  const handleDataChange = (value) => {
    formData.licenseID = [].concat(value);
    // console.log('selected:value', value, formData.licenseID);
  };
  const getTagsLicenses = () => {
    const removeTagsLicense = filter(licenseBindingsList.value, (item) => {
      return !formData.licenseID.includes(item.id);
    });
    const selectedTagsLicense = filter(licenseList.value, (sItem) => {
      return formData.licenseID.includes(sItem.id);
    });
    let addTagsLicense = map(selectedTagsLicense, (oItem) => {
      const o = cloneDeep(oItem);
      const l = concat(o.tags || [], formData.name);
      return {
        id: o.id,
        tags: [...new Set(l)],
      };
    });
    if (removeTagsLicense.length) {
      const list = map(removeTagsLicense, (pItem) => {
        const p = cloneDeep(pItem);
        remove(p.tags, (tag) => tag === formData.name);
        return {
          id: p.id,
          tags: p.tags,
        };
      });
      addTagsLicense = concat(addTagsLicense, list);
    }
    // console.log(
    //   'selectedTagsLicense===',
    //   formData.licenseID,
    //   addTagsLicense,
    //   selectedTagsLicense,
    //   removeTagsLicense
    // );
    return addTagsLicense;
  };
  const handleCreate = async () => {
    const data = getTagsLicenses();
    await updateBatchLicense(data);
  };
  const handleSubmitLicense = async () => {
    step.value = 2;
    await handleCreate();
  };
  const handleSubmitTags = async () => {
    step.value = 1;
    if (formData.builtin) return;
    const dataInfo = pick(formData, ['name', 'description']);
    if (formData.id) {
      await updateLicenseGroup({ ...dataInfo, id: formData.id as string });
    } else {
      const { data } = await createGroups(dataInfo);
      Object.assign(formData, data);
    }
  };
  const handleSubmit = async () => {
    const res = await formref.value.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        stepLoading.value = true;
        status.value = 'process';
        await handleSubmitTags();
        await handleSubmitLicense();
        copyFormData = cloneDeep(formData);
        submitLoading.value = false;
        stepLoading.value = false;
        status.value = 'finish';
        router.back();
      } catch (error) {
        submitLoading.value = false;
        stepLoading.value = false;
        status.value = 'error';
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

  const getTagDetail = async () => {
    await Promise.all([
      getLicenseGroupsInfo(),
      getBindLicenses(),
      getLicenseList(),
    ]);
    copyFormData = cloneDeep(formData);
  };
  const initData = async () => {
    // 1.
    getTagDetail();
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

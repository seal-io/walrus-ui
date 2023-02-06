<template>
  <div class="container">
    <StepsGroup
      :step="2"
      :list="stepList"
      style="margin-top: 40px; margin-bottom: 30px"
    ></StepsGroup>
    <a-card class="general-card q-s-w-card">
      <div class="title"
        >{{ title }}—<span class="sub-title">{{
          $t(get(stepList, '1'))
        }}</span></div
      >
      <a-form
        ref="formref"
        :model="formData"
        layout="vertical"
        auto-label-width
      >
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
            <!-- <div v-if="formData.builtin" class="selected-list-wrap">
              <div class="s-title">
                <a-space>
                  <span
                    >{{ $t('license.edit.form.licenseList') }}({{
                      licenseBindingsList.length || 0
                    }})</span
                  >
                </a-space>
              </div>
              <a-list
                :max-height="200"
                :bordered="false"
                style="width: 550px; min-height: 100px"
                size="small"
              >
                <a-list-item
                  v-for="(item, index) in licenseBindingsList"
                  :key="index"
                >
                  {{ item.label }}
                </a-list-item>
              </a-list>
            </div> -->
            <sl-transfer
              v-model="formData.licenseID"
              :title="[
                $t('license.edit.selectable'),
                $t('license.edit.selected'),
              ]"
              :width="[550, 550]"
              :data="licenseList"
              @select="handleSelected"
              @change="handleDataChange"
            ></sl-transfer>
          </div>
          <!-- <template #extra>
            <a-button
              size="small"
              type="outline"
              class="add-li"
              @click="handleAddLicense"
            >
              <template #icon>
                <icon-plus />
              </template>
              <span>{{ $t('license.button.add') }}</span>
            </a-button>
          </template> -->
        </a-form-item>
        <a-form-item class="edit-footer-wrap" :disabled="false">
          <EditPageFooter>
            <template #default>
              <div>
                <a-button
                  :loading="submitLoading"
                  type="primary"
                  class="cap-title-save save-btn"
                  @click="handleSubmit"
                  >{{ $t('common.button.save') }}</a-button
                >
              </div>
            </template>
            <template #save>
              <a-button
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
    <addOne
      v-model:show="show"
      action="create"
      @licenseSave="handleSaveLicense"
    ></addOne>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { get, cloneDeep, map, isEqual, filter, concat, remove } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onMounted, reactive, ref, computed, markRaw } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import slTransfer from '@/components/sl-transfer/index.vue';
  import StepsGroup from '../components/steps-group.vue';
  import {
    queryLicenseGroupsItem,
    queryLicenseList,
    licenseGroupRow,
    updateBatchLicense,
  } from '../api';
  import { FormDataType } from '../config/interface';
  import addOne from '../components/add-one.vue';

  const { t } = useI18n();
  const formref = ref();
  const route = useRoute();
  const router = useRouter();
  const groupId = get(route.query, 'groupId') || '';
  const tagName = get(route.query, 'tagName') || '';
  const rawRoute = markRaw(route.query);
  const submitLoading = ref(false);
  const isLoaded = ref(false);
  const show = ref<boolean>(false);
  const licenseList = ref<licenseGroupRow[]>([]);
  let copyFormData: any = {};
  const licenseBindingsList = ref<licenseGroupRow[]>([]);
  const formData = reactive({
    name: '',
    category: '',
    builtin: get(route.query, 'builtin') === '1',
    licenseID: [] as Array<string | number>,
    description: '',
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
    if (rawRoute.action === '0') {
      return ['license.edit.step.tag', 'license.edit.step.licenselist'];
    }
    return ['license.edit.step.create', 'license.edit.step.license'];
  });
  const handleCancel = () => {
    router.push({
      name: 'licenseEdit',
      query: {
        groupId,
        builtin: get(route.query, 'builtin'),
      },
    });
  };
  const handleAddLicense = () => {
    show.value = true;
  };
  const handleSelected = (selected) => {
    console.log('selected==', selected);
  };
  const handleDataChange = (value) => {
    formData.licenseID = [].concat(value);
    console.log('selected:value', value, formData.licenseID);
  };
  const handleDataSelect = (selected) => {
    console.log('selected:', selected);
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
  // query license list
  const getLicenseList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 2000,
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

  const handleSaveLicense = async (data) => {
    await getLicenseList();
  };
  const getLicenseTagInfo = async () => {
    if (!groupId) return;
    try {
      const { data } = await queryLicenseGroupsItem(groupId);
      Object.assign(formData, data);
    } catch (error) {
      console.log(error);
    }
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
      console.log('selectedTagsLicense==', list);
      addTagsLicense = concat(addTagsLicense, list);
    }
    console.log(
      'selectedTagsLicense===',
      formData.licenseID,
      addTagsLicense,
      selectedTagsLicense,
      removeTagsLicense
    );
    return addTagsLicense;
  };
  const handleCreate = async () => {
    const data = getTagsLicenses();
    await updateBatchLicense(data);
    router.push({
      name: 'licenseList',
    });
  };
  const handleSubmit = async () => {
    const res = await formref.value.validate();
    if (!res) {
      submitLoading.value = true;
      copyFormData = cloneDeep(formData);
      await handleCreate();
      submitLoading.value = false;
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

  const initData = async () => {
    // 1.
    await getLicenseTagInfo();
    Promise.all([getBindLicenses(), getLicenseList()]).then(() => {
      isLoaded.value = true;
      copyFormData = cloneDeep(formData);
    });
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

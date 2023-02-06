<template>
  <div class="application-edit">
    <comCard :body-style="{ marginTop: '20px', padding: '20px' }">
      <group-title :title="title"></group-title>
      <a-form
        ref="formref"
        style="width: 500px"
        :model="formData"
        layout="vertical"
        auto-label-width
      >
        <a-form-item
          field="name"
          hide-asterisk
          :label="$t('applications.edit.form.name')"
          :rules="[
            { required: true, message: $t('applications.edit.rules.name') },
          ]"
        >
          <a-input
            v-model="formData.name"
            :max-length="30"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item
          field="description"
          hide-asterisk
          :label="$t('applications.edit.form.description')"
        >
          <a-textarea
            v-model="formData.description"
            show-word-limit
            max-length="200"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          field="selectors"
          hide-asterisk
          :label="$t('applications.edit.form.tags')"
          :rules="[
            { required: true, message: $t('applications.edit.rules.tags') },
          ]"
        >
          <a-select
            v-model="formData.selectors"
            multiple
            allow-search
            allow-clear
            :max-tag-count="3"
            @change="handleSelectorsChange"
          >
            <a-option
              v-for="(item, index) in tagsList"
              :key="index"
              :value="item.value"
              >{{ item.label }}</a-option
            >
            <template #empty><span></span></template>
          </a-select>
        </a-form-item>
      </a-form>
      <comCard padding="0">
        <template #title>
          <span>{{ $t('applications.edit.form.assets') }}</span>
          <span>{{ `(${total})` }}</span>
        </template>
        <a-table
          column-resizable
          style="margin-top: 10px"
          :loading="loading"
          :data="dataList"
          :pagination="false"
        >
          <template #columns>
            <a-table-column
              :title="$t('applications.table.list.name')"
              data-index="name"
            ></a-table-column>
            <a-table-column
              :title="$t('applications.edit.title.version')"
              data-index="version"
            >
              <template #cell="{ record }">
                <span>{{ record.version || '-' }} </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('applications.table.list.type')">
              <template #cell="{ record }">
                <span
                  class="repo-icon"
                  :style="{
                    'background-image': `url(${get(
                      repoIcon,
                      toLower(record.provider)
                    )})`,
                  }"
                ></span>
                <span class="source">{{ record.provider }} </span>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t('applications.edit.form.tags')"
              data-index="tags"
            >
              <template #cell="{ record }">
                <a-tag
                  v-for="(val, index) in record.tags"
                  :key="index"
                  color="#0DA5AA"
                  size="small"
                  style="margin-right: 4px; padding: 0 4px"
                  >{{ val }}</a-tag
                >
              </template>
            </a-table-column>
          </template>
        </a-table>
        <div style="margin-top: 20px">
          <a-pagination
            size="small"
            :total="total"
            :page-size="queryParams.perPage"
            :current="queryParams.page"
            show-total
            show-page-size
            :hide-on-single-page="queryParams.perPage === 10"
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </comCard>
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
            :loading="submitLoading"
            type="primary"
            class="cap-title save-btn"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
      </EditPageFooter>
    </comCard>
  </div>
</template>

<script lang="ts" setup>
  import { toLower, get, assignIn, map } from 'lodash';
  import { ref, computed, reactive } from 'vue';
  import { repoIcon } from '@/views/intergration/config';
  import useCallCommon from '@/hooks/use-call-common';
  import comCard from '@/components/page-wrap/com-card.vue';
  import groupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useLoading from '@/hooks/loading';
  import {
    tableListRow,
    queryDataList,
    TableQueryParams,
  } from '@/api/projects';
  import {
    FormDataType,
    submitFormData,
    updateFormData,
    queryAppsItem,
    queryResourceTags,
  } from '../api/applications';

  const formref = ref();
  const submitLoading = ref(false);
  const { t, route, router } = useCallCommon();
  const { loading, setLoading } = useLoading();
  const dataList = ref<tableListRow[]>([]);
  const total = ref(0);
  const id = route.query.id as string;
  const tagsList = ref<{ value: string; label: string }[]>([]);
  const title = computed(() => {
    if (id) {
      return t('applications.edit.title.view');
    }
    return t('applications.list.button.add');
  });
  const formData: FormDataType = reactive({
    name: '',
    selectors: [],
    description: '',
  });
  const queryParams = reactive({
    page: 1,
    perPage: 10,
  });
  const handleSubmit = async () => {
    const err = await formref.value.validate();
    console.log('err:', err);
    if (err) {
      return;
    }
    try {
      submitLoading.value = true;
      if (id) {
        await updateFormData(formData);
      } else {
        await submitFormData(formData);
      }
      submitLoading.value = false;
      router.back();
    } catch (error) {
      console.log(error);
      submitLoading.value = false;
    }
  };
  const getTagsList = async () => {
    try {
      const { data } = await queryResourceTags();
      tagsList.value = map(data, (item) => {
        return {
          label: item,
          value: item,
        };
      });
      return tagsList.value;
    } catch (error) {
      tagsList.value = [];
      return [];
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        ...queryParams,
        tags: formData.selectors,
        all: true,
      };
      const { data } = await queryDataList(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      setLoading(false);
    } catch (error) {
      dataList.value = [];
      setLoading(false);
      console.log(error);
    }
  };
  const handleSelectorsChange = (val) => {
    if (!val.length) {
      dataList.value = [];
      return;
    }
    queryParams.page = 1;
    fetchData();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    fetchData();
  };

  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    fetchData();
  };
  const getApplicationItem = async () => {
    const { data } = await queryAppsItem({ id });
    assignIn(formData, data);
  };
  const initData = async () => {
    await getTagsList();
    if (!id) return;
    await getApplicationItem();
    await fetchData();
  };
  const handleCancel = () => {
    router.back();
  };
  initData();
</script>

<style lang="less" scoped>
  .repo-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: -4px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
</style>

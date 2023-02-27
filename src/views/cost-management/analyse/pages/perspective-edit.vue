<template>
  <ComCard top-gap>
    <GroupTitle title="新建视图"></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('cost.analyse.table.name')"
        field="name"
        validate-trigger="change"
        :rules="[{ required: true, message: '视角名称必填' }]"
      >
        <a-input
          v-model="formData.name"
          :max-length="50"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item label="Group By">
        <a-select></a-select>
      </a-form-item>
      <a-form-item label="过滤器">
        <ConditionFilter></ConditionFilter>
      </a-form-item>

      <a-form-item label="Share Cost">
        <template #label>
          <div style="display: flex; align-items: center">
            <span
              >Share Cost
              <a-tooltip content="Define Share Cost Buckets">
                <icon-info-circle /> </a-tooltip
            ></span>
          </div>
        </template>
        <ConditionFilter></ConditionFilter>
        <template #extra>
          <div style="display: flex; align-items: center; margin-top: 10px">
            <div style="margin-right: 10px">Sharing Strategy</div>
            <a-radio-group>
              <a-radio
                v-for="item in costShareMode"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}</a-radio
              >
            </a-radio-group>
          </div>
        </template>
      </a-form-item>
      <a-form-item label="">
        <!-- <template #label>
          <div style="display: flex; align-items: center">
            <span
              >Idle Cost
              <a-tooltip content="Manage Idle Cost Sharing Strategy">
                <icon-info-circle /> </a-tooltip
            ></span>
          </div>
        </template> -->
        <a-select :options="costShareMode" placeholder="Idle Cost"></a-select>
      </a-form-item>
    </a-form>
    <EditPageFooter>
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ConditionFilter from '../components/condition-filter.vue';
  import { costShareMode } from '../config';
  import { filtersData } from '../config/testData';
  import {
    queryItemPerspective,
    createPerspective,
    updatePerspective
  } from '../api';

  const { t, router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = reactive({
    name: ''
  });
  const handleCancel = () => {
    router.back();
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const getPerspectiveInfo = () => {};
</script>

<style></style>

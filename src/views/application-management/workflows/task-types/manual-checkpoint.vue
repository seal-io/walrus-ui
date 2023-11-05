<template>
  <a-spin :loading="loading" style="width: 100%">
    <div :style="{ width: `${InputWidth.LARGE}px` }">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          field="name"
          hide-label
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('workflow.task.rules.taskName') }
          ]"
        >
          <seal-input
            v-model="formData.name"
            :label="$t('workflow.stage.add.taskName')"
            :required="true"
            style="width: 100%"
            :max-length="63"
            show-word-limit
          ></seal-input>
        </a-form-item>
        <a-form-item
          field="approvalType"
          hide-label
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('workflow.task.rules.approvalMode') }
          ]"
        >
          <seal-select
            v-model="formData.approvalType"
            :label="$t('workflow.stage.add.approvalMode')"
            :required="true"
            :mutiple="true"
            style="width: 100%"
          >
            <a-option
              v-for="item in approvalTypes"
              :key="item.value"
              :value="item.value"
            >
              <span
                >{{ $t(item.label)
                }}<span style="color: var(--color-text-3)" class="mleft-5">{{
                  `(${$t(item.description)})`
                }}</span></span
              >
            </a-option>
          </seal-select>
        </a-form-item>
        <a-form-item
          field="approvalUsers"
          hide-label
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('workflow.task.rules.approvalUser') }
          ]"
        >
          <seal-select
            v-model="formData.approvalUsers"
            :label="$t('workflow.stage.add.approvalUser')"
            :loading="loading"
            :required="true"
            :options="subjectList"
            :multiple="true"
            style="width: 100%"
          >
          </seal-select>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { InputWidth } from '@/views/config';
  import { ref, watch, onMounted, computed } from 'vue';
  import { queryProjectSubjects } from '@/views/application-management/projects/api';
  import { approvalRoles, approvalTypes } from '../config';

  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'edit';
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const emits = defineEmits(['submit']);
  const formref = ref();
  const loading = ref(false);
  const subjectList = ref<{ label: string; value: string }[]>([]);
  const formData = ref({
    name: '',
    approvalType: '',
    approvalUsers: []
  });

  const getProjectSubjectList = async () => {
    try {
      loading.value = true;
      const params = {
        page: -1
      };
      const { data } = await queryProjectSubjects(params);
      subjectList.value = _.map(data.items || [], (item) => {
        return {
          label: _.get(item, 'subject.name'),
          value: _.get(item, 'subject.id'),
          role: _.get(item, 'role.id')
        };
      });
    } catch (error) {
      subjectList.value = [];
    } finally {
      loading.value = false;
    }
  };
  const save = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      return formData.value;
    }
    return false;
  };
  const initFormData = () => {
    if (props.action === 'create') {
      formData.value = {
        name: '',
        approvalType: '',
        approvalUsers: []
      };
      return;
    }
    formData.value = {
      name: props.dataInfo.spec?.name,
      approvalType: props.dataInfo.spec?.approvalType,
      approvalUsers: props.dataInfo.spec?.approvalUsers
    };
  };
  const initData = async () => {
    await getProjectSubjectList();
    initFormData();
  };
  watch(
    () => props.show,
    (val) => {
      if (val) {
        initData();
      } else {
        loading.value = false;
      }
    },
    {
      immediate: true
    }
  );
  defineExpose({
    save,
    initFormData
  });
</script>

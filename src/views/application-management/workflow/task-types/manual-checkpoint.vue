<template>
  <div>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item field="name" hide-label validate-trigger="change">
        <seal-input
          v-model="formData.name"
          label="任务名称"
          :required="true"
          style="width: 100%"
          :max-length="63"
          show-word-limit
        ></seal-input>
      </a-form-item>
      <a-form-item field="type" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.type"
          label="验证者方式"
          :required="true"
          style="width: 100%"
        >
          <a-option
            v-for="item in approvalTypes"
            :key="item.value"
            :value="item.value"
          >
            <span
              >{{ item.label
              }}<span style="color: var(--color-text-3)" class="mleft-5">{{
                `(${item.description})`
              }}</span></span
            >
          </a-option>
        </seal-select>
      </a-form-item>
      <a-form-item field="role" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.role"
          label="验证者类型"
          :required="true"
          style="width: 100%"
          @change="handleRoleChange"
        >
          <a-option
            v-for="item in approvalRoles"
            :key="item.value"
            :value="item.value"
          >
            <span
              >{{ item.label
              }}<span style="color: var(--color-text-3)" class="mleft-5">{{
                `(${item.description})`
              }}</span></span
            >
          </a-option>
        </seal-select>
      </a-form-item>
      <a-form-item field="flowRole" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.flowRole"
          label="流水线角色"
          :required="true"
          :options="pipelineRoles"
          style="width: 100%"
        ></seal-select>
      </a-form-item>
      <a-form-item field="date" hide-label validate-trigger="change">
        <seal-date-picker
          v-model="formData.date"
          label="截止时间"
          :required="true"
          style="width: 100%"
        ></seal-date-picker>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { approvalRoles, approvalTypes } from '../config';

  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'edit';
      }
    }
  });

  const emits = defineEmits(['submit']);
  const formref = ref();
  const formData = ref({
    name: '',
    type: '',
    role: '',
    flowRole: '',
    date: ''
  });

  const pipelineRoles = computed(() => {
    const data = approvalRoles.find(
      (item) => item.value === formData.value.role
    );
    return data?.items || [];
  });

  const handleRoleChange = (value) => {
    formData.value.flowRole = '';
  };

  const save = async () => {
    const res = await formref.value?.validate();
    if (res) {
      return formData.value;
    }
    return false;
  };
  const initFormData = (data) => {
    formData.value = {
      name: data.name,
      type: data.type,
      role: data.role,
      flowRole: data.flowRole,
      date: data.date
    };
  };
  defineExpose({
    save,
    initFormData
  });
</script>

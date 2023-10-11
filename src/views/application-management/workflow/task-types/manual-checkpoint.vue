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
        ></seal-select>
      </a-form-item>
      <a-form-item field="role" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.role"
          label="验证者类型"
          :required="true"
          style="width: 100%"
        ></seal-select>
      </a-form-item>
      <a-form-item field="flowRole" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.flowRole"
          label="流水线角色"
          :required="true"
          style="width: 100%"
        ></seal-select>
      </a-form-item>
      <a-form-item field="date" hide-label validate-trigger="change">
        <seal-select
          v-model="formData.date"
          label="截止时间"
          :required="true"
          style="width: 100%"
        ></seal-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
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
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (res) {
      try {
        emits('submit', formData.value);
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  };
</script>

<template>
  <div class="wrapper">
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="名称">
            <a-input v-model="formData.name" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="值">
            <a-input v-model="formData.value" style="width: 100%"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="描述">
            <a-textarea
              v-model="formData.description"
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            ></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { assignIn, keys, get, each, map } from 'lodash';
  import { ref, reactive, PropType, watch } from 'vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const formData = reactive({
    name: '',
    description: '',
    value: ''
  });
</script>

<style lang="less" scoped>
  .wrapper {
    padding: 10px;
  }
</style>

<template>
  <div class="wrapper">
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item
            label="名称"
            field="name"
            :rules="[
              { required: true, message: '名称必填' },
              { validator: validatorName }
            ]"
          >
            <a-input
              v-model="formData.name"
              style="width: 100%"
              :max-length="50"
              show-word-limit
              @input="handleInput"
            ></a-input>
          </a-form-item>
          <!-- <a-form-item label="类型">
            <a-select
              v-model="formData.type"
              style="width: 100%"
              :options="variablesTypeList"
              @change="handleInput"
            >
            </a-select>
          </a-form-item> -->
          <a-form-item label="值">
            <a-input
              v-model="formData.default"
              style="width: 100%"
              @input="handleInput"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="描述">
            <a-textarea
              v-model="formData.description"
              style="width: 100%"
              :auto-size="{ minRows: 4, maxRows: 6 }"
              @input="handleInput"
            ></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- <EditPageFooter style="margin-top: 0">
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          @click="handleOk"
          >{{ $t('common.button.confirm') }}</a-button
        >
      </template>
    </EditPageFooter> -->
  </div>
</template>

<script lang="ts" setup>
  import { assignIn, cloneDeep, uniq } from 'lodash';
  import { ref, reactive, PropType, watch, defineExpose } from 'vue';
  // import EditPageFooter from '@/components/edit-page-footer/index.vue';
  // import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  // import { variablesTypeList } from '../../config';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    variablesData: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    }
  });
  const formref = ref();
  const emits = defineEmits(['comfirm', 'update:dataInfo']);
  const formData = reactive({
    name: '',
    description: '',
    default: '',
    type: 'string'
  });
  const handleOk = () => {
    const res = formref.value.validate();
    if (!res) {
      emits('comfirm');
    }
  };
  const getFormData = async () => {
    const result = await formref.value?.validate();
    if (!result) {
      return formData;
    }
    return false;
  };
  const validatorName = (value, callback) => {
    const list = cloneDeep(props.variablesData || []);
    if (value && uniq(list).length !== props.variablesData.length) {
      callback('存在相同的变量名');
    } else {
      callback();
    }
  };
  const handleInput = () => {
    emits('update:dataInfo', formData);
  };
  watch(
    () => props.dataInfo,
    () => {
      assignIn(formData, cloneDeep(props.dataInfo));
    },
    {
      immediate: true,
      deep: true
    }
  );
  defineExpose({
    getFormData
  });
</script>

<style lang="less" scoped>
  .wrapper {
    padding: 10px;
  }
</style>

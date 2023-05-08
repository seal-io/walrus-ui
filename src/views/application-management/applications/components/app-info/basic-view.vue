<template>
  <div class="basic-info">
    <a-row :cols="24">
      <a-col :span="16">
        <a-descriptions :data="basicConfigList" :column="2">
          <template #label="{ label }">
            <span>{{ $t(label) }}</span>
          </template>
          <template #value="{ data }">
            <LabelsList
              v-if="data.key === 'labels'"
              :labels="formData[data.key]"
            ></LabelsList>
            <span
              v-else
              style="
                display: inline-block;
                min-width: fit-content;
                max-width: 200px;
                white-space: pre-wrap;
              "
              >{{
                data.formatter
                  ? data.formatter(formData[data.key])
                  : formData[data.key]
              }}</span
            >
          </template>
        </a-descriptions>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { BasicDescription } from '@/views/config/interface';
  import { ref, watch, computed, defineExpose } from 'vue';
  import LabelsList from './labels-list.vue';
  import { applicationBasicInfo } from '../../config';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const formData = ref<any>({
    name: '',
    createTime: '',
    updateTime: '',
    lables: {},
    description: ''
  });

  const emits = defineEmits(['save', 'update:dataInfo']);
  const showLabelsModal = ref(false);
  const basicConfigList = ref<BasicDescription[]>(
    _.cloneDeep(applicationBasicInfo)
  );

  const getFormData = () => {
    const valid = _.find(basicConfigList.value, (item) => {
      return item.required && !formData.value[item.key];
    });
    if (valid) {
      return false;
    }
    return formData.value;
  };
  const handleEdit = (item) => {
    item.editable = true;
    if (item.key === 'labels') {
      showLabelsModal.value = true;
    }
  };
  const handleCancel = (item) => {
    item.editable = false;
    formData.value[item.key] = props.dataInfo[item.key];
  };
  const handleSave = (item) => {
    if (!getFormData()) {
      return;
    }
    item.editable = false;
    emits('update:dataInfo', formData.value);
    setTimeout(() => {
      emits('save');
    }, 100);
  };
  const handleSaveCall = () => {
    emits('update:dataInfo', formData.value);
    setTimeout(() => {
      emits('save');
    }, 100);
  };

  defineExpose({
    getFormData
  });
  watch(
    () => props.dataInfo,
    () => {
      formData.value = _.cloneDeep(props.dataInfo);
      console.log('formData===999', formData.value);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  @import url('@/views/commons/style/custom-grid.less');

  .basic-info {
    :deep(.arco-descriptions-row) {
      .arco-descriptions-item-label-block {
        font-weight: 400;
      }
    }
  }
</style>

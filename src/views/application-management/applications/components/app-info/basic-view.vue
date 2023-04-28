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
    <!-- <a-grid :cols="24" class="custom-grid">
      <a-grid-item
        v-for="(item, index) in basicConfigList"
        :key="index"
        :span="item.span"
        :label="item.label"
      >
        <div class="custom-grid-content">
          <div class="label">
            <span>{{ $t(item.label) }}</span>
          </div>
          <div class="value">
            <LabelsList
              v-if="item.key === 'labels'"
              :labels="formData[item.key]"
            ></LabelsList>
            <div v-if="!item.editable && item.key !== 'labels'">
              <span>{{
                item.formatter
                  ? item.formatter(formData[item.key])
                  : formData[item.key]
              }}</span>
            </div>
            <a-input
              v-if="item.editable && item.form === 'input'"
              v-model="formData[item.key]"
              :max-length="50"
              show-word-limit
              :error="!formData[item.key] && item.required"
            ></a-input>
            <a-textarea
              v-if="item.editable && item.form === 'textarea'"
              v-model="formData[item.key]"
              :max-length="200"
              show-word-limit
            ></a-textarea>
          </div>
        </div>
      </a-grid-item>
    </a-grid> -->
    <labelsModal
      v-model:show="showLabelsModal"
      v-model:labels="formData.labels"
      @save="handleSaveCall"
    ></labelsModal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import { BasicDescription } from '@/views/config/interface';
  import { ref, watch, computed, defineExpose } from 'vue';
  import labelsModal from './labels-modal.vue';
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
  const labelList = ref<{ key: string; value: string }[]>([]);
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

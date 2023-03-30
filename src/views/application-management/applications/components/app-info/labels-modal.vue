<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="720"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    title="标签管理"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-space direction="vertical" :size="12">
      <xInputGroup
        v-for="(sItem, sIndex) in labelList"
        :key="sIndex"
        v-model:dataKey="sItem.key"
        v-model:dataValue="sItem.value"
        v-model:value="labelsData"
        :trigger-validate="validateTrigger"
        width="600px"
        class="group-item"
        :label-list="labelList"
        :position="sIndex"
        @add="(obj) => handleAddLabel(obj, labelList)"
        @delete="handleDeleteLabel(labelList, sIndex)"
      ></xInputGroup>
    </a-space>
    <template #footer>
      <EditPageFooter>
        <template #save>
          <a-button
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
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { cloneDeep, get, keys, map, some } from 'lodash';
  import { ref, watch, provide } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    labels: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emit = defineEmits(['save', 'update:show', 'update:labels']);
  provide('showHintInput', false);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const labelsData = ref({});
  const validateTrigger = ref(false);
  const formref = ref();

  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    validateTrigger.value = some(labelList.value, (item) => {
      return !item.key || !item.value;
    });
    console.log('labels=====', validateTrigger.value, labelList.value);
    if (!validateTrigger.value) {
      try {
        // TODO
        emit('update:labels', labelsData.value);

        setTimeout(() => {
          emit('save');
        }, 200);
        emit('update:show', false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const initData = () => {
    labelsData.value = cloneDeep(props.labels);
    labelList.value = map(keys(props.labels), (key) => {
      return {
        key,
        value: get(props.labels, key)
      };
    });
    if (!labelList.value.length) {
      labelList.value = [{ key: '', value: '' }];
    }
  };
  const handleBeforeOpen = () => {
    initData();
  };
  const handleBeforeClose = () => {};
</script>

<style></style>

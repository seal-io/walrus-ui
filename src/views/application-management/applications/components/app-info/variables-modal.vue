<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="800"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    title="编辑变量"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <a-button
        size="small"
        type="outline"
        style="margin-bottom: 8px"
        @click="handleSelect"
        ><icon-plus style="margin-right: 5px" />{{
          $t('applications.applications.variables.button')
        }}</a-button
      >
      <moduleWrapper
        v-for="(item, index) in variablesList"
        :key="index"
        style="margin-bottom: 10px"
        :title="item.name || $t('applications.applications.variables.label')"
        :status="collapseStatus === index"
        @delete="handleDeleteVariable(index)"
      >
        <variableForm
          :key="index"
          :ref="(el: refItem) => setRefMap(el, `variableform${index}`)"
          v-model:data-info="variablesList[index]"
          :reserve-fields="reserveFields"
          :variables-data="variablesData"
        ></variableForm>
      </moduleWrapper>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
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
  import _, { get, some } from 'lodash';
  import { ref, PropType, ComponentPublicInstance, computed } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import variableForm from './variable-form.vue';
  import { Variables } from '../../config/interface';
  import { reserveFields } from '../../config';
  import moduleWrapper from '../module-wrapper.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    variables: {
      type: Array as PropType<Variables[]>,
      default() {
        return {};
      }
    },
    labels: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emit = defineEmits(['save', 'update:show', 'update:variables']);
  type refItem = Element | ComponentPublicInstance | null;
  const refMap: Record<string, refItem> = {};
  const labelList = ref<{ key: string; value: string }[]>([]);
  const labelsData = ref({});
  const validateTrigger = ref(false);
  const formref = ref();
  const collapseStatus = ref(0);
  const variablesList = ref<Variables[]>([]);

  const variablesData = computed(() => {
    const res = _.map(props.variables, (item) => {
      return item.name;
    });
    return res;
  });
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const getRefFormData = async () => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap).map(async (key) => {
        const refEL = refMap[key];
        const moduleForm = await refEL?.getFormData?.();
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };
  const handleOk = async () => {
    const variableFormResult = await getRefFormData();
    const validateVariabel = _.find(variableFormResult, (val) => !val.formData);
    if (validateVariabel) {
      const i = get(_.split(validateVariabel?.tab || '', 'variableform'), 1);
      collapseStatus.value = +i;
      return;
    }
    try {
      // TODO
      emit('update:variables', variablesList.value);
      console.log('variablesList====', variablesList.value);
      setTimeout(() => {
        emit('save');
      }, 200);
      emit('update:show', false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelect = () => {
    variablesList.value = _.concat(variablesList.value, {
      name: '',
      default: '',
      description: '',
      type: 'string'
    });
    collapseStatus.value = variablesList.value?.length - 1 || 0;
  };
  const handleDeleteVariable = (index) => {
    variablesList.value.splice(index, 1);
  };
  const handleBeforeOpen = () => {
    variablesList.value = props.variables || [];
    console.log('variablesList===', variablesList.value);
  };
  const handleBeforeClose = () => {};
</script>

<style></style>

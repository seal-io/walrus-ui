<template>
  <a-card class="setting-params" :bordered="false" hoverable>
    <template #title>
      <div>{{ $t(title) }}</div>
    </template>
    <template #extra>
      <a-space>
        <a-link v-show="editable" @click="handleEdit"><icon-edit /></a-link>
      </a-space>
    </template>
    <div>
      <a-form
        ref="formref"
        :model="formData"
        :disabled="!editable || isDisabled"
        layout="vertical"
      >
        <!-- top node -->
        <template v-if="!dataInfo.dataList || !dataInfo.dataList.length">
          <a-form-item
            :hide-label="true"
            :hide-asterisk="false"
            :field="dataInfo.id"
            :validate-trigger="['blur', 'change']"
            :rules="getRules(dataInfo)"
          >
            <form-component
              v-model="formData[dataInfo.id]"
              :editable="dataInfo.editable"
              :options="dataInfo.children"
              :match-type="dataInfo.component.match"
              :com-type="dataInfo.component.type"
              :binds="dataInfo.component.binds"
              :data-info="dataInfo"
            ></form-component>
            <template #label>
              <span
                ><span>{{ $t(dataInfo.label) }}</span>
                <!-- <span v-if="dataInfo.desc" class="label-desc"
                  >({{ $t(dataInfo.desc) }})</span> -->
                <a-tooltip v-if="dataInfo.desc" :content="dataInfo.desc">
                  <icon-question-circle />
                </a-tooltip>
              </span>
            </template>
          </a-form-item>
        </template>
        <template v-if="dataInfo.dataList && dataInfo.dataList.length">
          <div v-for="item in dataInfo.dataList" :key="item.id">
            <template v-if="item.type === 'text'">
              <div :style="item.style">{{ $t(item.label) }}</div>
            </template>
            <template
              v-for="child in item.childProperties"
              v-else-if="item?.childProperties?.length"
              :key="child.id"
            >
              <a-form-item
                v-if="showId(child) && formData[item.id]"
                :class="{ 's-item': child.component.type === 'switch' }"
                :label="$t(child.label)"
                :hide-label="false"
                :hide-asterisk="false"
                :field="`${item.id}.${child.id}`"
                :validate-trigger="['blur', 'change']"
                :rules="getRules(child)"
              >
                <form-component
                  :key="child.id"
                  v-model="formData[item.id][child.id]"
                  :editable="child.editable"
                  :options="child.children || []"
                  :com-type="child.component.type"
                  :binds="child.component.binds"
                  :data-info="dataInfo"
                ></form-component>
                <template #label>
                  <span
                    ><span>{{ $t(child.label) }}</span>
                    <a-tooltip v-if="child.desc" :content="$t(child.desc)">
                      <icon-question-circle class="label-item-icon" />
                    </a-tooltip>
                  </span>
                </template>
                <template #extra>
                  <span v-if="child.component.extra">{{
                    $t(child.component.extra)
                  }}</span>
                </template>
              </a-form-item>
            </template>
            <a-form-item
              v-else-if="showId(item)"
              :class="{ 's-item': item.component.type === 'switch' }"
              :label="$t(item.label)"
              :hide-label="false"
              :hide-asterisk="false"
              :field="item.id"
              :validate-trigger="['blur', 'change']"
              :rules="getRules(item)"
            >
              <form-component
                v-model="formData[item.id]"
                :editable="item.editable"
                :options="item.children || []"
                :com-type="item.component.type"
                :binds="item.component.binds"
                :data-info="dataInfo"
              ></form-component>
              <template #label>
                <span
                  ><span>{{ $t(item.label) }}</span>
                  <a-tooltip v-if="item.desc" :content="$t(item.desc)">
                    <icon-question-circle class="label-item-icon" />
                  </a-tooltip>
                </span>
              </template>
              <template #extra>
                <span v-if="item.component.extra">{{
                  $t(item.component.extra)
                }}</span>
              </template>
            </a-form-item>
          </div>
        </template>
      </a-form>
    </div>
    <EditPageFooter v-show="!isDisabled">
      <template #save>
        <a-button type="primary" class="save-btn" @click="handleUpdate">{{
          $t('common.button.save')
        }}</a-button>
      </template>
      <template #cancel>
        <a-button type="outline" class="cancel-btn" @click="handleCancel">{{
          $t('common.button.cancel')
        }}</a-button>
      </template>
    </EditPageFooter>
  </a-card>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { isArray, each, isObject, keys } from 'lodash';
  import {
    reactive,
    ref,
    computed,
    onMounted,
    PropType,
    watch,
    toRef,
    toRefs,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import validate from '@/utils/validate';
  import { SettingsItem, ValueType } from '../configs';
  import { updateUserSettingBatch, BatchItem } from '../../api/system';
  import formComponent from './form-component.vue';

  interface formDataType {
    [key: string]: any;
  }
  const props = defineProps({
    editable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    dataInfo: {
      type: Object as PropType<SettingsItem>,
      default() {
        return {};
      },
    },
  });

  const { t } = useI18n();
  const emits = defineEmits(['settingSave']);
  const router = useRouter();
  const formref = ref();
  const formData = ref({}); // all field's value is string
  let rawDataList: SettingsItem[] = [];
  const isDisabled = ref<boolean>(true);

  const getRules = (data) => {
    const { validator } = data.component;
    const matchReg = data.component.match;
    const msg = data.component.message;
    if (matchReg) {
      return [
        {
          required: data.component.required,
          message: t('system.rules.value'),
        },
        {
          match: validate[matchReg],
          required: data.component.required,
          message: t(msg),
        },
        {
          validator,
        },
      ];
    }
    return [
      {
        required: data.component.required,
        message: t('system.rules.value'),
      },
      {
        validator,
      },
    ];
  };
  const setFormData = () => {
    formref.value.resetFields();
    if (!props.dataInfo.dataList || !props.dataInfo.dataList.length) {
      formData.value[props.dataInfo.id] = props.dataInfo.value;
    } else {
      props.dataInfo.dataList.forEach((item) => {
        if (item?.childProperties?.length) {
          formData.value[item.id] = {};
          each(item.childProperties, (child) => {
            formData.value[item.id][child.id] = item.value[child.id];
          });
        } else {
          formData.value[item.id] = item.value;
        }
      });
    }
    console.log('formData11==', formData.value);
  };
  const showId = (item) => {
    if (item.type === 'layout') return false;
    if (item.show) return item.show(formData.value);
    if (!item.parentId) return true;
    if (item.parentId && formData.value[item.parentId] === item.parentValue) {
      return true;
    }
    return false;
  };
  const setRawDataList = () => {
    if (!props.dataInfo.dataList || !props.dataInfo.dataList.length) {
      rawDataList.push({ ...props.dataInfo });
    } else {
      rawDataList = [].concat(props.dataInfo.dataList as never);
    }
  };
  // getvalues for submit to server

  const handleEdit = () => {
    isDisabled.value = !isDisabled.value;
  };
  const handleCancel = () => {
    isDisabled.value = true;
    // reset formData
    setFormData();
  };
  const formatValue = (list: string[]) => {
    const len = list.length;
    const last = list[len - 1];
    if (last === '') {
      list.pop();
      formatValue(list);
    } else {
      return list.join('/');
    }
    return list.join('/');
  };
  const getValueList = () => {
    const list: Array<BatchItem> = [];
    rawDataList.forEach((item) => {
      if (item.editable) {
        list.push({
          id: item.id,
          value: isObject(formData.value[item.id])
            ? JSON.stringify(formData.value[item.id])
            : formData.value[item.id],
        });
      }
    });
    return list;
  };
  const handleUpdate = async (value) => {
    formref.value.validate((errors) => {
      console.log('errors==', errors);
      if (errors) return;
      try {
        const valueList = getValueList();
        updateUserSettingBatch(valueList).then((res) => {
          Message.success(t('common.message.success'));
          isDisabled.value = true;
          emits('settingSave');
        });
      } catch (error) {
        console.log(error);
      }
    });
  };
  watch(
    () => props.dataInfo,
    (val) => {
      setFormData();
      setRawDataList();
    },
    {
      deep: true,
      immediate: false,
    }
  );
  // watch(formData, (val)=> {
  //   console.log('watch-formData:', formData)
  // },{deep: true})
</script>

<style lang="less" scoped>
  .setting-params {
    // :deep(.arco-space-fill) {
    //   justify-content: flex-end;
    // }
    .label-desc {
      padding-left: 5px;
      color: var(--color-text-3);
      font-size: 12px;
    }

    :deep(.arco-form-item) {
      &.s-item {
        margin-bottom: 20px;
      }

      &.hidden {
        display: none;
      }

      .label-item-icon {
        vertical-align: -2px;
      }
    }

    :deep(.arco-card-header) {
      .arco-card-header-title {
        color: var(--seal-color-text-6);
        font-size: 14px;
      }

      .arco-icon {
        font-size: 16px;
      }
    }
  }
</style>

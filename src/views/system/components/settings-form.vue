<template>
  <div class="setting-params">
    <div>
      <a-form ref="formref" :model="formData" layout="vertical">
        <!-- top node -->
        <template v-if="!dataInfo.dataList || !dataInfo.dataList.length">
          <a-form-item
            :hide-label="true"
            :hide-asterisk="false"
            :field="dataInfo.key"
            :validate-trigger="['blur', 'input', 'change']"
            :rules="getRules(dataInfo)"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <form-component
              v-model="formData[dataInfo.key]"
              :width="`${InputWidth.LARGE}px`"
              :label="$t(dataInfo.label)"
              :popup-info="$t(dataInfo.desc || '')"
              :required="dataInfo.component.required"
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
                <a-tooltip v-if="dataInfo.desc" :content="dataInfo.desc">
                  <icon-question-circle />
                </a-tooltip>
              </span>
            </template>
          </a-form-item>
        </template>

        <template v-if="dataInfo.dataList && dataInfo.dataList.length">
          <div v-for="(item, index) in dataInfo.dataList" :key="item.key">
            <template v-if="item?.childProperties?.length">
              <template v-for="child in item.childProperties" :key="child.key">
                <a-form-item
                  v-if="showId(child) && formData[item.key]"
                  :class="{ 's-item': child.component.type === 'switch' }"
                  :label="$t(child.label)"
                  :hide-label="true"
                  :hide-asterisk="false"
                  :field="`${item.key}.${child.key}`"
                  :validate-trigger="['blur', 'input', 'change']"
                  :rules="getRules(child)"
                >
                  <form-component
                    :key="child.key"
                    v-model="formData[item.key][child.key]"
                    :width="`${InputWidth.LARGE}px`"
                    :label="$t(child.label)"
                    :popup-info="$t(child.desc || '')"
                    :required="child.component.required"
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
                  <!-- <template #extra>
                    <span v-if="child.component.extra">{{
                      $t(child.component.extra)
                    }}</span>
                  </template> -->
                </a-form-item>
              </template>
            </template>
            <!-- ====== subGroupTitle  start===== -->
            <template v-else-if="item?.subGroup?.length">
              <div
                class="sub-group-title"
                :class="[`sub-group-title-${index}`]"
                :style="{ ...item.style, display: 'flex', alignItems: 'cener' }"
              >
                <span>{{ $t(item.label) }}</span>
                <span class="flex mleft-5">
                  <a-tooltip
                    v-if="
                      !item.isEditable &&
                      userStore.hasRolesActionsPermission({
                        resource: Resources.Settings,
                        actions: [Actions.POST]
                      })
                    "
                    :content="$t('common.button.edit')"
                  >
                    <a-link @click="handleEditSubGroup(item)"
                      ><icon-edit
                    /></a-link>
                  </a-tooltip>
                  <a-tooltip
                    v-if="item.isEditable"
                    :content="$t('common.button.cancel')"
                  >
                    <a-link @click="handleEditCancel(item)"
                      ><icon-undo
                    /></a-link>
                  </a-tooltip>
                  <a-tooltip
                    v-if="item.isEditable"
                    :content="$t('common.button.save')"
                  >
                    <a-link class="mleft-5" @click="handleSaveSubGroup(item)"
                      ><icon-save
                    /></a-link>
                  </a-tooltip>
                </span>
              </div>
              <template
                v-for="subGroupItem in item.subGroup"
                :key="subGroupItem.key"
              >
                <a-form-item
                  v-if="showId(subGroupItem)"
                  :class="{
                    's-item': subGroupItem.component.type === 'switch'
                  }"
                  :label="$t(subGroupItem.label)"
                  :hide-label="true"
                  :hide-asterisk="false"
                  :field="`${subGroupItem.key}`"
                  :validate-trigger="['blur', 'input', 'change']"
                  :rules="getRules(subGroupItem)"
                >
                  <form-component
                    :key="subGroupItem.key"
                    v-model="formData[subGroupItem.key]"
                    :width="`${InputWidth.LARGE}px`"
                    :label="$t(subGroupItem.label)"
                    :popup-info="$t(subGroupItem.desc || '')"
                    :required="subGroupItem.component.required"
                    :editable="item.isEditable && subGroupItem.editable"
                    :options="subGroupItem.children || []"
                    :com-type="subGroupItem.component.type"
                    :binds="subGroupItem.component.binds"
                    :data-info="dataInfo"
                  ></form-component>
                  <template #label>
                    <span
                      ><span>{{ $t(subGroupItem.label) }}</span>
                      <a-tooltip
                        v-if="subGroupItem.desc"
                        :content="$t(subGroupItem.desc)"
                      >
                        <icon-question-circle class="label-item-icon" />
                      </a-tooltip>
                    </span>
                  </template>
                  <template v-if="subGroupItem.showExtra" #extra>
                    <div :style="{ width: `${InputWidth.LARGE}px` }">
                      <span
                        v-if="subGroupItem.extraHtml"
                        v-html="$t(subGroupItem.component.extra || '')"
                      ></span>
                      <span v-else-if="subGroupItem.component.extra">{{
                        $t(subGroupItem.component.extra)
                      }}</span>
                    </div>
                  </template>
                </a-form-item>
              </template>
            </template>
            <!-- ====== subGroupTitle  end===== -->
            <a-form-item
              v-else-if="showId(item)"
              :class="{ 's-item': item.component.type === 'switch' }"
              :label="$t(item.label)"
              :hide-label="true"
              :hide-asterisk="false"
              :field="item.key"
              :validate-trigger="['blur', 'input', 'change']"
              :rules="getRules(item)"
            >
              <form-component
                v-model="formData[item.key]"
                :width="`${InputWidth.LARGE}px`"
                :label="$t(item.label)"
                :popup-info="$t(item.desc || '')"
                :required="item.component.required"
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
              <!-- <template #extra>
                <span v-if="item.component.extra">{{
                  $t(item.component.extra)
                }}</span>
              </template> -->
            </a-form-item>
          </div>
        </template>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { InputWidth } from '@/views/config';
  import { useUserStore } from '@/store';
  import _, { isArray, map, each, isObject, keys } from 'lodash';
  import { deleteModal } from '@/utils/monitor';
  import { ref, PropType, watch, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import validate from '@/utils/validate';
  import { SettingsItem, ValueType } from '../config';
  import { updateUserSettingBatch, BatchItem } from '../api/setting';
  import formComponent from './form-component.vue';

  interface formDataType {
    [key: string]: any;
  }
  const props = defineProps({
    editable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    dataInfo: {
      type: Object as PropType<SettingsItem>,
      default() {
        return {};
      }
    }
  });

  const userStore = useUserStore();
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
          message: t('system.rules.value')
        },
        {
          match: validate[matchReg],
          required: data.component.required,
          message: t(msg)
        },
        {
          validator
        }
      ];
    }
    return [
      {
        required: data.component.required,
        message: data.component.message
          ? t(data.component.message)
          : t('system.rules.value')
      },
      {
        validator
      }
    ];
  };
  const setFormData = () => {
    formref.value?.resetFields();
    if (!props.dataInfo.dataList || !props.dataInfo.dataList.length) {
      formData.value[props.dataInfo.key] = props.dataInfo.value;
    } else {
      props.dataInfo.dataList.forEach((item) => {
        if (item?.childProperties?.length) {
          formData.value[item.key] = {};
          each(item.childProperties, (child) => {
            formData.value[item.key][child.key] = item.value[child.key];
          });
        } else if (item?.subGroup?.length) {
          // current schema
          const subList = item?.subGroup;
          each(subList, (child) => {
            formData.value[child.key] = child.value;
          });
        } else {
          formData.value[item.key] = item.value;
        }
      });
    }
  };
  // check those fields that must has Id attribute
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
  const getValueList = (fieldList) => {
    const list: Array<BatchItem> = [];
    fieldList.forEach((item) => {
      if (item.editable) {
        list.push({
          name: item.key,
          value: isObject(formData.value[item.key])
            ? JSON.stringify(formData.value[item.key])
            : formData.value[item.key]
        });
      }
    });
    return list;
  };
  const handleUpdate = async (group) => {
    const fieldList = group.subGroup || [];
    const fields = map(fieldList, (item) => {
      return item.key;
    });
    const res = await formref.value.validateField([...fields]);
    if (!res) {
      try {
        const valueList = getValueList(fieldList);
        await updateUserSettingBatch({ items: valueList });
        Message.success(t('common.message.success'));
        emits('settingSave');
        nextTick(() => {
          group.isEditable = false;
        });
      } catch (error) {
        // ignore
      }
    }
  };
  const handleEditSubGroup = (item) => {
    item.isEditable = true;
    const subGroup = item.subGroup ?? [];
    nextTick(() => {
      _.each(subGroup, (subItem) => {
        if (subItem?.sensitive && subItem?.configured) {
          formData.value[subItem.key] = '';
        }
      });
    });
  };
  const handleEditCancel = (item) => {
    item.isEditable = false;
    const subGroup = item.subGroup ?? [];
    _.each(subGroup, (subItem) => {
      if (subItem.sensitive && subItem.configured) {
        formData.value[subItem.key] = '********';
      }
    });
  };
  const handleSaveSubGroup = async (item) => {
    const clearList = _.filter(item.subGroup, (subItem) => {
      return (
        _.get(subItem, 'configured') &&
        !_.get(formData.value, subItem.key) &&
        !_.get(subItem, 'component.required')
      );
    });
    if (clearList.length) {
      const tips = _.map(clearList, (o) => {
        return `${t(o.label)}\n`;
      });
      deleteModal({
        title: 'account.settings.clear.tips',
        okText: 'common.button.save',
        content: _.join(tips, ''),
        onOk: () => {
          handleUpdate(item);
        }
      });
    } else {
      handleUpdate(item);
    }
  };
  watch(
    () => props.dataInfo,
    (val) => {
      setFormData();
      setRawDataList();
    },
    {
      deep: true,
      immediate: false
    }
  );
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
        font-size: var(--font-size-large);
      }
    }

    .sub-group-title {
      padding-bottom: 8px;

      &.sub-group-title-0 {
        margin-top: 0 !important;
      }
    }
  }
</style>

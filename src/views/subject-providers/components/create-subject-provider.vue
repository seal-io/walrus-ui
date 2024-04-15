<template>
  <a-modal
    top="5%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'overflow': 'auto',
      'line-height': 1
    }"
    modal-class="user-modal"
    unmount-on-close
    :title="
      action === 'edit'
        ? $t('profile.account.edit')
        : $t('profile.account.create')
    "
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        hide-label
        field="metadata.name"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            match: validateUserNameRegx,
            message: $t('account.create.rules.username')
          }
        ]"
      >
        <seal-input
          v-model.trim="formData.metadata.name"
          :label="$t('profile.account.name')"
          :required="true"
          :max-length="validateInputLength.NAME"
          show-word-limit
          style="width: 100%"
          :disabled="action === 'edit'"
        ></seal-input>
      </a-form-item>
      <a-form-item
        hide-label
        field="spec.displayName"
        :validate-trigger="['change', 'input']"
      >
        <seal-input
          v-model.trim="formData.spec.displayName"
          :label="$t('settings.user.nickName')"
          :required="false"
          :max-length="30"
          show-word-limit
          style="width: 100%"
        ></seal-input>
      </a-form-item>
      <a-form-item
        :label="$t('profile.account.role')"
        field="roleId"
        hide-label
        validate-trigger="change"
        :rules="[
          {
            required: false,
            message: $t('propfile.account.settings.rules.role')
          }
        ]"
      >
        <seal-select
          v-model="formData.spec.type"
          :label="$t('common.table.type')"
          style="width: 100%"
          @change="handleTypeChange"
        >
          <template #prefix>
            <ProviderIcon
              :provider="_.toLower(formData.spec?.type || '')"
            ></ProviderIcon>
          </template>
          <a-option
            v-for="(item, index) in providerList"
            :key="index"
            :value="item.value"
          >
            <ProviderIcon :provider="_.toLower(item.value)"></ProviderIcon>
            <span class="m-l-10">{{ $t(item.label) }}</span>
          </a-option>
        </seal-select>
      </a-form-item>
      <a-form-item
        hide-label
        :field="`spec.externalConfig.${_.toLower(formData.spec.type)}.clientID`"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            message: $t('common.form.rule.input', { name: 'ClientID' })
          }
        ]"
      >
        <seal-input
          :model-value="
            _.get(
              formData,
              `spec.externalConfig.${_.toLower(formData.spec.type)}.clientID`,
              ''
            )
          "
          label="ClientID"
          :required="true"
          style="width: 100%"
          @update:modelValue="
            (val) => {
              _.set(
                formData,
                `spec.externalConfig.${_.toLower(formData.spec.type)}.clientID`,
                val
              );
            }
          "
          @change="
            (val) => {
              _.set(
                formData,
                `spec.externalConfig.${_.toLower(formData.spec.type)}.clientID`,
                val
              );
            }
          "
        ></seal-input>
      </a-form-item>
      <a-form-item
        hide-label
        :field="`spec.externalConfig.${_.toLower(
          formData.spec.type
        )}.clientSecret`"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            message: $t('common.form.rule.input', { name: 'ClientSecret' })
          }
        ]"
      >
        <seal-input-password
          :model-value="
            _.get(
              formData,
              `spec.externalConfig.${_.toLower(
                formData.spec.type
              )}.clientSecret`,
              ''
            )
          "
          label="ClientSecret"
          :required="true"
          style="width: 100%"
          @update:modelValue="
            (val) => {
              _.set(
                formData,
                `spec.externalConfig.${_.toLower(
                  formData.spec.type
                )}.clientSecret`,
                val
              );
            }
          "
          @change="
            (val) => {
              _.set(
                formData,
                `spec.externalConfig.${_.toLower(
                  formData.spec.type
                )}.clientSecret`,
                val
              );
            }
          "
        ></seal-input-password>
      </a-form-item>
      <a-form-item :label="$t('common.table.description')" hide-label>
        <seal-textarea
          v-model="formData.spec.description"
          :label="$t('common.table.description')"
          :max-length="validateInputLength.DESC"
          show-word-limit
          style="width: 100%"
          :auto-size="{ minRows: 4, maxRows: 6 }"
        ></seal-textarea>
      </a-form-item>
    </a-form>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
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
  import _ from 'lodash';
  import { ref, reactive, PropType, computed } from 'vue';
  import { validateUserNameRegx, validateInputLength } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import {
    GlobalNamespace,
    createSubjectProvider,
    updateSubjectProvider
  } from '../api';
  import { ResourceKinds, apiVersion, ProviderTypes } from '../config';
  import { FormData } from '../config/interface';

  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'create'; // create, edit
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataInfo: {
      type: Object as PropType<FormData>,
      default() {
        return {};
      }
    }
  });

  const emits = defineEmits(['update:show', 'update:action', 'save']);
  const submitLoading = ref(false);
  const formref = ref();
  const formData = ref<FormData>({
    apiVersion,
    kind: ResourceKinds.SubjectProvider,
    metadata: {
      name: '',
      namespace: GlobalNamespace
    },
    spec: {
      description: '',
      displayName: '',
      type: ProviderTypes.GitHub,
      externalConfig: {
        github: {
          clientID: '',
          clientSecret: ''
        }
      }
    },
    status: {
      loginWithPassword: false
    }
  });

  const providerList = computed(() => {
    return _.map(_.keys(ProviderTypes), (key) => {
      return {
        label: key,
        value: ProviderTypes[key]
      };
    });
  });

  const handleTypeChange = (value) => {
    formData.value.spec.type = value;
    formData.value.spec.externalConfig = {
      [_.toLower(value)]: {
        clientID: '',
        clientSecret: ''
      }
    };
  };
  const handleBeforeOpen = () => {
    if (props.action === 'edit') {
      formData.value = _.cloneDeep(props.dataInfo);
    }
  };

  const handleBeforeClose = () => {
    formref.value.resetFields();
    formData.value = {
      apiVersion,
      kind: ResourceKinds.SubjectProvider,
      metadata: {
        name: '',
        namespace: GlobalNamespace
      },
      spec: {
        description: '',
        displayName: '',
        type: ProviderTypes.GitHub,
        externalConfig: {
          github: {
            clientID: '',
            clientSecret: ''
          }
        }
      },
      status: {
        loginWithPassword: false
      }
    };
  };

  const handleCancel = () => {
    emits('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value.validate();
    if (res) return;
    submitLoading.value = true;
    try {
      if (props.action === 'create') {
        await createSubjectProvider({
          data: formData.value,
          namespace: GlobalNamespace
        });
      } else {
        await updateSubjectProvider({
          data: formData.value,
          namespace: GlobalNamespace,
          name: formData.value.metadata.name
        });
      }
      emits('save');
      emits('update:show', false);
    } catch (error) {
      console.error(error);
    } finally {
      submitLoading.value = false;
    }
  };
</script>

<template>
  <a-modal
    top="10%"
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
        :label="$t('profile.account.name')"
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
          :max-length="30"
          show-word-limit
          style="width: 100%"
          :disabled="action === 'edit'"
        ></seal-input>
      </a-form-item>
      <a-form-item hide-label field="spec.displayName">
        <seal-input
          v-model.trim="formData.spec.displayName"
          :label="$t('settings.user.nickName')"
          :required="false"
          :max-length="validateInputLength.NAME"
          show-word-limit
          style="width: 100%"
        ></seal-input>
      </a-form-item>
      <a-form-item
        hide-label
        field="spec.email"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            message: $t('common.form.rule.input', {
              name: $t('settings.user.email')
            })
          }
        ]"
      >
        <seal-input
          v-model.trim="formData.spec.email"
          :label="$t('settings.user.email')"
          :required="true"
          style="width: 100%"
        ></seal-input>
      </a-form-item>
      <a-form-item
        field="spec.credential"
        :validate-trigger="['change', 'input']"
        hide-label
        :rules="[
          {
            required: action === 'create',
            message: $t('account.create.rules.password')
          }
        ]"
      >
        <a-input-group style="width: 100%">
          <seal-input-password
            v-model="formData.spec.credential"
            style="
              width: 100%;
              border-radius: var(--border-radius-small) 0 0
                var(--border-radius-small);
            "
            :label="$t('profile.account.password')"
            :required="action === 'create'"
          />
          <a-button
            type="primary"
            style="width: 60px; height: 54px"
            @click="handleGeneratePassword"
          >
            <template #icon>
              <a-tooltip :content="$t('profile.account.creatrandom')">
                <i class="iconfont icon-refresh size-24"></i>
              </a-tooltip>
            </template>
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item
        :label="$t('profile.account.role')"
        field="spec.role"
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
          v-model="formData.spec.role"
          :label="$t('profile.account.role')"
          style="width: 100%"
          @change="handleRoleChange"
        >
          <template #prefix>
            <i
              style="color: var(--color-text-selected)"
              class="iconfont size-14"
              :class="[
                _.get(
                  _.find(roleList, (item) => item.value === formData.spec.role),
                  'icon'
                ) || 'icon-user'
              ]"
            ></i>
          </template>
          <a-option
            v-for="(item, index) in roleList"
            :key="index"
            :value="item.value"
          >
            <i
              class="iconfont mright-5 size-14"
              :class="[item.icon]"
              style="color: var(--sealblue-6)"
            ></i>
            <span>{{ $t(item.label) }}</span>
          </a-option>
        </seal-select>
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
  import { ref, reactive, PropType } from 'vue';
  import { validateUserNameRegx, validateInputLength } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { accountTypeList, roleTypeList, RoleType } from '../config/users';
  import { RoleItem } from '../config/interface';
  import {
    createSubject,
    updateSubject,
    ResourceKinds,
    GlobalNamespace,
    apiVersion
  } from '../api/users';

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
      type: Object,
      default() {
        return {};
      }
    },
    roleList: {
      type: Array as PropType<RoleItem[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['update:show', 'update:action', 'save']);
  const submitLoading = ref(false);
  const formref = ref();
  const formData = ref<any>({
    kind: ResourceKinds.Subject,
    apiVersion,
    metadata: {
      namespace: GlobalNamespace,
      name: ''
    },
    spec: {
      description: '',
      email: '',
      displayName: '',
      provider: 'default',
      credential: '',
      role: RoleType.User
    }
  });

  const handleRoleChange = (value) => {};
  const handleGeneratePassword = () => {
    formData.value.spec.credential = _.get(
      Math.random().toString(32).split('.'),
      '1'
    );
  };
  const handleOk = async () => {
    const res = await formref.value.validate();
    try {
      if (!res) {
        submitLoading.value = true;

        if (props.action === 'create') {
          await createSubject({
            namespace: GlobalNamespace,
            data: formData.value
          });
        } else {
          await updateSubject({
            namespace: GlobalNamespace,
            name: formData.value.metadata.name,
            data: formData.value
          });
        }
        submitLoading.value = false;
        emits('save');
        emits('update:show', false);
      }
    } catch (error) {
      submitLoading.value = false;
    }
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const reset = () => {
    formData.value = {
      kind: ResourceKinds.Subject,
      apiVersion,
      metadata: {
        namespace: GlobalNamespace,
        name: ''
      },
      spec: {
        description: '',
        email: '',
        displayName: '',
        provider: 'default',
        credential: '',
        role: RoleType.User
      }
    };
  };
  const handleBeforeOpen = () => {
    if (props.action === 'edit') {
      formData.value = _.cloneDeep(props.dataInfo);
    }
  };
  const handleBeforeClose = () => {
    reset();
    formref.value.clearValidate();
  };
</script>

<style lang="less">
  .arco-modal.user-modal {
    .arco-input-group {
      .seal-relative.wrapper {
        border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);

        .arco-input-wrapper {
          border-right: none;
        }
      }
    }
  }
</style>

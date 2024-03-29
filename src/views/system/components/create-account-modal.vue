<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="500"
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
        field="name"
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
          v-model.trim="formData.name"
          :label="$t('profile.account.name')"
          :required="true"
          :max-length="30"
          show-word-limit
          style="width: 100%"
          :disabled="action === 'edit'"
        ></seal-input>
      </a-form-item>
      <a-form-item
        :label="$t('profile.account.password')"
        field="password"
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
            v-model="formData.password"
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
          v-model="formData.roleId"
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
                  _.find(roleList, (item) => item.value === formData.roleId),
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
  import { validateUserNameRegx } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { accountTypeList, roleTypeList } from '../config/users';
  import { RoleItem } from '../config/interface';
  import { createSubject, updateSubject } from '../api/users';

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
  const formData = reactive({
    kind: 'user',
    domain: 'builtin',
    name: '',
    password: '',
    roleId: '0'
  });

  const handleRoleChange = (value) => {};
  const handleGeneratePassword = () => {
    formData.password = _.get(Math.random().toString(32).split('.'), '1');
  };
  const handleOk = async () => {
    const res = await formref.value.validate();
    try {
      if (!res) {
        submitLoading.value = true;
        const data: any = _.pickBy(formData, (val) => val);
        if (formData.roleId !== '0') {
          data.roles = [
            {
              role: {
                id: formData.roleId
              }
            }
          ];
        } else {
          data.roles = [];
        }
        if (props.action === 'create') {
          await createSubject(data);
        } else {
          await updateSubject(data);
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
    formData.roleId = '0';
    formData.name = '';
    formData.password = '';
  };
  const handleBeforeOpen = () => {
    if (props.action === 'edit') {
      _.assignIn(
        formData,
        _.pick(props.dataInfo, ['kind', 'name', 'id', 'domain'])
      );
      formData.roleId = _.get(props.dataInfo, 'roles.0.role.id') || '0';
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

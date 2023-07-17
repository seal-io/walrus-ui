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
    modal-class="oci-modal"
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
      <!-- <a-form-item
        :label="$t('profile.account.kind')"
        field="kind"
        validate-trigger="change"
        :rules="[
          {
            required: true,
            message: $t('propfile.account.settings.rules.type')
          }
        ]"
      >
        <a-select v-model="formData.kind">
          <a-option
            v-for="item in accountTypeList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          ></a-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item :label="$t('profile.account.domain')" field="domain">
        <a-input v-model="formData.domain" disabled></a-input>
      </a-form-item> -->
      <a-form-item
        :label="$t('profile.account.name')"
        field="name"
        validate-trigger="change"
        :rules="[
          {
            required: true,
            match: validateUserNameRegx,
            message: $t('account.create.rules.username')
          }
        ]"
      >
        <a-input
          v-model.trim="formData.name"
          :max-length="39"
          show-word-limit
          style="width: 400px"
          :disabled="action === 'edit'"
        ></a-input>
        <template #extra>
          <div>{{ $t('account.create.rules.username') }}</div>
        </template>
      </a-form-item>
      <a-form-item :label="$t('profile.account.password')" field="password">
        <a-input-group style="width: 400px">
          <a-input-password v-model="formData.password" style="width: 370px" />
          <a-button type="primary" @click="handleGeneratePassword">
            <template #icon>
              <a-tooltip :content="$t('profile.account.creatrandom')">
                <i class="iconfont icon-random size-20"></i>
              </a-tooltip>
            </template>
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item
        :label="$t('profile.account.role')"
        field="roleId"
        validate-trigger="change"
        :rules="[
          {
            required: false,
            message: $t('propfile.account.settings.rules.role')
          }
        ]"
      >
        <a-select
          v-model="formData.roleId"
          style="width: 400px"
          @change="handleRoleChange"
        >
          <template #prefix>
            <i
              style="color: var(--sealblue-6)"
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
        </a-select>
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
      console.log(error);
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

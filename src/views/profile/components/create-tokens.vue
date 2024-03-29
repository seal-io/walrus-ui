<template>
  <a-modal
    top="10%"
    :align-center="false"
    :visible="show"
    :closable="false"
    :mask-closable="false"
    :ok-text="$t('common.button.save')"
    :title="$t('account.settings.tokens.new')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        field="name"
        :label="$t('account.settings.tokens.name')"
        hide-label
        validate-trigger="change"
        :rules="[
          {
            required: true,
            message: $t('account.settings.token.rules.name')
          }
        ]"
      >
        <seal-input
          v-model.trim="formData.name"
          :style="{ width: `${InputWidth.LARGE}px` }"
          :required="true"
          :label="$t('account.settings.tokens.name')"
        />
      </a-form-item>
      <a-form-item
        field="expirationSeconds"
        hide-label
        :label="$t('account.settings.tokens.expiration')"
        validate-trigger="change"
        :rules="[
          {
            required: true,
            message: $t('account.settings.token.rules.expire')
          }
        ]"
      >
        <seal-select
          v-model="formData.expirationSeconds"
          class="expire-select"
          :style="{ width: `${InputWidth.LARGE}px` }"
          :required="true"
          :label="$t('account.settings.tokens.expiration')"
        >
          <a-option
            v-for="(item, index) in expireList"
            :key="index"
            :value="item.label"
          >
            <span
              class="opts-item"
              style="position: relative; padding-left: 25px"
            >
              <icon-check-circle-fill
                v-show="formData.expirationSeconds === item.label"
                style="
                  position: absolute;
                  top: 1px;
                  left: 0;
                  color: #4cd263;
                  font-size: var(--font-size-large);
                "
              />
              <span class="label">{{ $t(item.label) }}</span>
            </span>
          </a-option>
        </seal-select>
      </a-form-item>
    </a-form>
    <template #footer>
      <EditPageFooter :style="{ 'margin-top': 0 }">
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
            type="outline"
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
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import dayjs from 'dayjs';
  import { InputWidth } from '@/views/config';
  import { cloneDeep } from 'lodash';
  import { reactive, ref } from 'vue';
  import { createTokens, FormDataType } from '../api/tokens';
  import { expireList } from '../config';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emit = defineEmits(['tokenSave', 'update:show']);
  const formref = ref();
  const formData: FormDataType = reactive({
    name: '',
    expirationSeconds: 'account.settings.expire.never'
  });

  const handleCancel = () => {
    emit('update:show', false);
  };
  const getExpireValue = () => {
    const data = cloneDeep(formData);
    const selected = expireList.find(
      (item) => data.expirationSeconds === item.label
    );
    if (selected?.type === 'never') {
      data.expirationSeconds = null;
      return data;
    }
    const d1 = dayjs().add(
      selected?.value as number,
      `${selected?.type}` as never
    );
    const d2 = dayjs();
    data.expirationSeconds = d1.diff(d2, 'second');
    return data;
  };
  const submitFormData = async () => {
    const info = getExpireValue();
    const { data } = await createTokens(info);
    return data;
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      const data = await submitFormData();
      emit('tokenSave', cloneDeep(data));
      emit('update:show', false);
    }
  };

  const handleBeforeClose = () => {
    Object.assign(formData, {
      name: '',
      expirationSeconds: 'account.settings.expire.never'
    });
    emit('tokenSave');
  };
  const handleBeforeOpen = () => {};
</script>

<style lang="less" scoped>
  .container {
    .opts-item {
      position: relative;
      padding-left: 20px;

      :deep(.arco-icon) {
        position: absolute;
      }

      .label {
        margin-left: 10px;
      }
    }
  }
</style>

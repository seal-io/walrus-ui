<template>
  <div class="btn-box">
    <a-tooltip
      v-if="!editable || includes(layout, 'edit')"
      :content="$t('common.button.edit')"
    >
      <a-link>
        <icon-edit @click="handleEdit"></icon-edit>
      </a-link>
    </a-tooltip>
    <a-tooltip
      v-if="editable && includes(layout, 'cancel')"
      :content="$t('common.button.cancel')"
    >
      <a-link>
        <icon-font type="icon-quxiao" @click="handleCancel"></icon-font>
      </a-link>
    </a-tooltip>
    <a-tooltip
      v-if="editable && includes(layout, 'save')"
      :content="$t('common.button.save')"
    >
      <a-link>
        <icon-save stype="icon-quxiao" @click="handleSave"></icon-save>
      </a-link>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';

  defineProps({
    editable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    layout: {
      type: Array,
      default() {
        return ['edit', 'cancel', 'save'];
      }
    }
  });

  const emits = defineEmits(['update:editable', 'cancel', 'save']);
  const handleEdit = () => {
    emits('update:editable', true);
  };
  const handleCancel = () => {
    emits('cancel');
  };
  const handleSave = () => {
    emits('save');
  };
</script>

<style lang="less" scoped>
  .btn-box {
    display: flex;
    align-items: center;
  }
</style>

<template>
  <div class="selector-wrap">
    <a-select
      v-model="values"
      :placeholder="$t('operation.environments.detail.holder')"
      multiple
      allow-search
      size="small"
      style="width: 240px"
    >
      <a-option v-for="item in list" :key="item.value" :value="item.value">{{
        item.label
      }}</a-option>
      <template #footer>
        <div style="display: flex; justify-content: space-around; padding: 6px">
          <a-button type="primary" size="mini" @click="handleConfirm">{{
            $t('common.button.confirm')
          }}</a-button>
          <a-button type="outline" size="mini" @click="handleCancel">{{
            $t('common.button.cancel')
          }}</a-button>
        </div>
      </template>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref, watchEffect } from 'vue';
  import { EnvironmentRow } from '../config/interface';

  const props = defineProps({
    list: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },
    selected: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['update:selected', 'update:show', 'change']);
  const values = ref<string[]>([]);

  const handleConfirm = () => {
    emits('update:selected', values.value);
    setTimeout(() => {
      emits('change', values.value);
      emits('update:show', false);
    });
  };
  const handleCancel = () => {
    setTimeout(() => {
      emits('update:show', false);
    });
  };
  watchEffect(() => {
    values.value = [].concat(props.selected as never);
  });
</script>

<style></style>

<template>
  <div class="selector-wrap">
    <a-select
      v-model="values"
      :placeholder="$t('operation.environments.detail.holder')"
      multiple
      :max-tag-count="1"
      allow-search
      style="width: 386px"
      @change="handleChange"
    >
      <a-option style="display: none"></a-option>
      <a-option
        v-for="item in list"
        :key="item.value"
        :value="item.value"
        :disabled="includes(selected, item.value)"
        >{{ item.label }}</a-option
      >
      <!-- <template #footer>
        <div style="display: flex; justify-content: space-around; padding: 6px">
          <a-button type="primary" size="mini" @click="handleConfirm">{{
            $t('common.button.confirm')
          }}</a-button>
          <a-button type="outline" size="mini" @click="handleCancel">{{
            $t('common.button.cancel')
          }}</a-button>
        </div>
      </template> -->
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';
  import { PropType, ref, watchEffect } from 'vue';

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
    connectorIDs: {
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
  const emits = defineEmits(['confirm', 'update:show', 'update:connectorIDs']);
  const values = ref<string[]>([]);

  const handleConfirm = () => {
    emits('confirm', values.value);
  };
  const handleChange = () => {
    emits('update:connectorIDs', values.value);
    emits('confirm', values.value);
  };
  const handleCancel = () => {
    setTimeout(() => {
      values.value = [];
      emits('update:show', false);
    }, 100);
  };
  watchEffect(() => {
    values.value = [...props.connectorIDs];
  });
</script>

<style></style>

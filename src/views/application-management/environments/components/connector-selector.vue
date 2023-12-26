<template>
  <div class="selector-wrap">
    <a-select
      v-model="values"
      :placeholder="placeholder"
      multiple
      :max-tag-count="1"
      allow-search
      size="large"
      style="width: 386px"
      @change="handleChange"
    >
      <a-option style="display: none"></a-option>
      <a-option
        v-for="(item, index) in list"
        :key="index"
        :value="item[keyMap.value]"
        :disabled="includes(selected, item[keyMap.value])"
        >{{ item[keyMap.label] }}
        <span style="color: var(--color-text-3)" class="font-12">{{
          item.tips ? `(${$t(item.tips)})` : ''
        }}</span></a-option
      >
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { includes } from 'lodash';
  import { PropType, ref, watchEffect } from 'vue';

  const props = defineProps({
    list: {
      type: Array as PropType<
        { label: string; value: string; project?: object; tips?: string }[]
      >,
      default() {
        return [];
      }
    },
    keyMap: {
      type: Object as PropType<{ label: string; value: string }>,
      default() {
        return {
          label: 'label',
          value: 'value'
        };
      }
    },
    placeholder: {
      type: String,
      default() {
        return '';
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

<template>
  <div class="container">
    <a-space class="sl-transfer" fill :size="20">
      <sl-transfer-view
        :title="title[0] || titleList[0]"
        :style="{ width: `${width[0]}px` }"
        :selected-list="sourceSelected"
        :list="sourceList"
        @clear="handleClear('source')"
        @selected="handleSourceSelected"
        @selected-all="(val) => handleSelectedAll(val, 'source')"
        @input="(val) => handleSearchInput(val, 'source')"
      ></sl-transfer-view>
      <a-space direction="vertical" :size="20">
        <a-button
          shape="circle"
          :disabled="!sourceSelected.length"
          @click="handleAdd"
        >
          <icon-right />
        </a-button>
        <a-button
          shape="circle"
          :disabled="!targetSelected.length"
          @click="handleRemove"
        >
          <icon-left />
        </a-button>
      </a-space>
      <sl-transfer-view
        :title="title[1] || titleList[1]"
        :style="{ width: `${width[1]}px` }"
        :selected-list="targetSelected"
        :list="targetList"
        @clear="handleClear('target')"
        @selected="handleTargetSelected"
        @selected-all="(val) => handleSelectedAll(val, 'target')"
        @input="(val) => handleSearchInput(val, 'target')"
      ></sl-transfer-view>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import slTransferView from './components/sl-transfer-view.vue';
  import { ListItem } from './config';

  const emit = defineEmits([
    'update:modelValue',
    'input',
    'selected',
    'change',
  ]);
  const { t } = useI18n();
  const titleList = [t('license.edit.selectable'), t('license.edit.selected')];
  const props = defineProps({
    modelValue: {
      type: Array as PropType<Array<string | number>>,
      default() {
        return [];
      },
    },
    title: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
    width: {
      type: Array,
      default() {
        return [300, 300];
      },
    },
    data: {
      type: Array as PropType<ListItem[]>,
      default() {
        return [];
      },
    },
  });
  const targetSelected = ref<Array<string | number>>([]);
  const sourceSelected = ref<Array<string | number>>([]);
  const sourceList = computed(() => {
    return props.data.filter((item) => {
      return !props.modelValue.includes(item.value as string);
    });
  });
  const targetList = computed(() => {
    return props.data.filter((item) => {
      return props.modelValue.includes(item.value as string);
    });
  });
  const handleSourceSelected = (val, item) => {
    if (val) {
      sourceSelected.value = sourceSelected.value.concat(item.value);
    } else {
      sourceSelected.value = sourceSelected.value.filter(
        (s) => s !== item.value
      );
    }
    emit('selected', sourceSelected.value, 'source');
  };
  const handleTargetSelected = (val, item) => {
    if (val) {
      targetSelected.value = targetSelected.value.concat(item.value);
    } else {
      targetSelected.value = targetSelected.value.filter(
        (s) => s !== item.value
      );
    }
    emit('selected', targetSelected.value, 'target');
  };
  const handleClear = (type) => {
    if (type === 'target') {
      targetSelected.value = [];
    } else {
      sourceSelected.value = [];
    }
  };
  const handleSelectedAll = (val, type) => {
    if (type === 'source') {
      sourceSelected.value = [].concat(val);
    } else {
      targetSelected.value = [].concat(val);
    }
    emit('selected', val, type);
  };
  const handleSearchInput = (val, type) => {
    emit('input', val, type);
  };
  const handleRemove = () => {
    const arr = props.modelValue.filter((item) => {
      return !targetSelected.value.includes(item);
    });
    emit('update:modelValue', arr);
    targetSelected.value = [];
    emit('change', arr);
  };
  const handleAdd = () => {
    const arr = sourceSelected.value.concat(props.modelValue);
    emit('update:modelValue', arr);
    sourceSelected.value = [];
    emit('change', arr);
  };
</script>

<style lang="less" scoped>
  .container {
    margin-top: 0;

    :deep(.arco-space-fill) {
      &.sl-transfer {
        justify-content: flex-start;
      }
    }
  }
</style>

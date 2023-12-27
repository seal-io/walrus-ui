<template>
  <div class="sl-transfer-wrap">
    <a-space class="header">
      <div class="title">
        <a-checkbox
          :model-value="selectedAll"
          :indeterminate="indeterminate"
          @change="handleSelectAll"
          >{{ title }}</a-checkbox
        >
      </div>
      <div class="select-val"
        >{{ selectedList.length || 0 }} / {{ dataList.length || 0 }}</div
      >
    </a-space>
    <div class="search-wrap">
      <a-input-search
        v-model="filterVal"
        allow-clear
        @input="handleSearchInput"
        @clear="handleClear"
      ></a-input-search>
    </div>
    <div class="content-list">
      <a-list
        :data="dataList"
        :bordered="false"
        :virtual-list-props="{
          height: 200
        }"
      >
        <template #item="{ item, index }">
          <a-list-item :key="index">
            <a-list-item-meta :description="item.label">
              <template #description>
                <div class="description" fill>
                  <a-checkbox
                    ref="refCheckBox"
                    :model-value="selectedList.includes(item.id)"
                    @change="(val) => handleSelectChange(val, item)"
                    >{{ item.label }}</a-checkbox
                  >
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
        <template #empty><span></span></template>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { lowerCase, map } from 'lodash';
  import { ref, computed, PropType } from 'vue';
  import { ListItem } from '../config';

  const emit = defineEmits(['input', 'selected', 'selectedAll', 'clear']);
  const props = defineProps({
    list: {
      type: Array as PropType<ListItem[]>,
      required: true,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    selectedList: {
      type: Array,
      default() {
        return [];
      }
    }
  });
  const refCheckBox = ref();
  const filterVal = ref('');
  const dataList = computed(() => {
    if (filterVal.value) {
      return props.list.filter((item) => {
        return lowerCase(item.label).includes(lowerCase(filterVal.value));
      });
    }
    return props.list;
  });
  const indeterminate = computed(() => {
    return (
      props.selectedList.length > 0 &&
      props.selectedList.length < props.list.length
    );
  });
  const selectedAll = computed(() => {
    return (
      props.selectedList.length > 0 &&
      props.selectedList.length === props.list.length
    );
  });
  const toggleCheckBox = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    refCheckBox.value.dispatchEvent(event);
  };
  const handleClick = () => {
    toggleCheckBox();
  };
  const handleSelectAll = (val) => {
    let arr = [];
    if (val) {
      arr = map(dataList.value, (item) => item.value) as never[];
    } else {
      arr = [];
    }
    emit('selectedAll', arr);
  };
  const handleSearchInput = (val) => {
    emit('input', '');
  };
  const handleClear = () => {
    filterVal.value = '';
    emit('input', '');
  };
  const handleSelectChange = (val, item) => {
    emit('selected', val, item);
  };
</script>

<style lang="less" scoped>
  .sl-transfer-wrap {
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-small);

    :deep(.arco-list-wrapper) {
      min-height: 200px;
    }

    :deep(.arco-empty) {
      display: none;
    }

    .header {
      display: flex;
      justify-content: space-between;
      height: 36px;
      padding: 0 10px;
      color: var(--color-text-1);
      background-color: var(--color-fill-1);

      .title {
        font-weight: var(--font-weight-medium);
        font-size: 14px;
      }

      .select-val {
        color: var(--color-text-3);
        font-size: 12px;
      }
    }

    .search-wrap {
      padding: 5px 10px;
    }

    .content-list {
      :deep(.arco-list-item) {
        box-sizing: border-box;
        height: 36px;
        padding: 0 10px !important;
        color: var(--color-text-2);
        line-height: 36px;
        border: none;
        cursor: pointer;

        &:hover {
          color: var(--color-text-1);
          background-color: var(--color-fill-2);
        }
      }

      :deep(.arco-list-item-content) {
        width: 100%;
      }

      :deep(.arco-checkbox-label) {
        color: var(--color-text-2);
      }

      :deep(.arco-list-item-meta) {
        padding: 0;

        .arco-list-item-meta-content {
          width: 100%;
        }

        .arco-checkbox {
          width: 100%;
        }
      }
    }
  }
</style>

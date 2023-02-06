<template>
  <div class="filter-list-wrap">
    <div v-if="showIconButton" class="icon-button">
      <span @click="handleClickReset">
        <slot name="icon-button"></slot>
      </span>
    </div>
    <a-menu
      mode="vertical"
      :style="{ width: '100%', height: '100%' }"
      :open-keys="menuOpenKeys"
      :default-collapsed="true"
      :selected-keys="[]"
      :collapsed="isCollapse"
      @sub-menu-click="handleSubMenuClick"
      @collapse="handleCollapse"
    >
      <a-sub-menu
        v-for="item in configList"
        :key="item.type"
        :class="{ opened: menuOpenKeys.includes(item.type) }"
      >
        <template #title>{{ $t(item.title) }}</template>
        <template #icon><icon-right /></template>
        <template #expand-icon-down></template>
        <a-menu-item v-for="sItem in item.children" :key="sItem.title">
          <a-checkbox
            :model-value="sItem.checked"
            @change="(val) => handleCheckChange(val, sItem, item)"
            >{{ sItem.isLocale ? $t(sItem.title) : sItem.title }}</a-checkbox
          >
          <!-- <span class="c-value">{{ sItem.value }}</span> -->
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, PropType, computed } from 'vue';
  import { filterConfig, childrenItem, filterItem } from '../config';

  const props = defineProps({
    showIconButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    integrationList: {
      type: Array as PropType<childrenItem[]>,
      default() {
        return [];
      },
    },
  });
  const emit = defineEmits(['change']);

  type strNum = string | boolean | number;
  interface FiltersValue {
    [key: string]: strNum[];
  }
  const filters = reactive<FiltersValue>({});
  const configList = computed(() => {
    const list = JSON.parse(JSON.stringify(filterConfig));
    list.forEach((item) => {
      if (!filters[item.filterType]) {
        filters[item.filterType] = [];
      }
      if (item.filterType === 'provider') {
        item.children = [...props.integrationList];
        item.children.forEach((s) => {
          s.checked = filters[item.filterType].includes(s.id);
        });
      } else {
        item.children.forEach((s) => {
          s.checked = filters[item.filterType].includes(s.id);
        });
      }
    });
    console.log('integrationList===', props.integrationList);
    return list;
  });

  const isCollapse = ref<boolean>(false);
  const menuOpenKeys = ref<strNum[]>([1, 2, 3]);
  const handleCollapse = (type: string, collapse: boolean) => {
    console.log({ type, collapse });
  };

  const handleSubMenuClick = (key: string, openKeys: string[]) => {
    menuOpenKeys.value = openKeys;
    console.log({ key, openKeys });
  };

  const handleClickReset = () => {
    filters.provider = [];
    filters.withIssues = [];
    configList.value.forEach((item: filterItem) => {
      item.children.forEach((o: childrenItem) => {
        o.checked = false;
      });
    });
    emit('change', filters);
  };

  const handleCheckChange = (
    checked: boolean | (string | number | boolean)[],
    item: childrenItem,
    parent: filterItem
  ) => {
    if (!filters[parent.filterType]) {
      filters[parent.filterType] = [];
    }
    if (checked) {
      filters[parent.filterType].push(item.id);
      filters[parent.filterType] = [...new Set(filters[parent.filterType])];
    } else {
      filters[parent.filterType] = filters[parent.filterType].filter(
        (val) => val !== item.id
      );
    }
    item.checked = filters[parent.filterType].includes(item.id);
    console.log('value:', checked, filters);
    emit('change', filters);
  };
</script>

<style scoped lang="less">
  .filter-list-wrap {
    box-sizing: border-box;
    width: 100%;
    background-color: var(--color-neutral-2);

    .icon-button {
      display: flex;
      justify-content: flex-start;
      padding-left: 15px;
    }

    :deep(.arco-menu-inner) {
      padding: 0;
      text-transform: capitalize;
    }

    :deep(.arco-menu-item) {
      display: flex;
      justify-content: flex-start;

      .arco-menu-item-inner {
        display: flex;
        justify-content: space-between;
      }
    }

    :deep(.arco-menu-inline) {
      &.opened {
        .arco-menu-icon {
          transform: rotate(90deg);
          transition: transform 0.3s;
        }
      }
    }

    :deep(.arco-menu-inline-header) {
      .arco-menu-icon {
        margin-right: 10px;
        transition: transform 0.3s;
      }
    }
  }
</style>

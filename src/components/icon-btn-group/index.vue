<template>
  <a-space class="icon-btn-group" :size="10">
    <span
      v-for="item in iconList"
      :key="item.icon"
      class="item"
      :class="{ active: active === item.view }"
      @click="handleToggle(item.view)"
    >
      <i
        v-if="item.iconfont"
        :style="{ ...item.style }"
        class="iconfont"
        :class="[{ active: active === item.view }, item.icon]"
      ></i>
      <component
        :is="item.icon"
        v-else
        :style="{ ...item.style }"
        :class="{ active: active === item.view }"
      />
    </span>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';

  interface IconBtn {
    icon: string;
    view: string;
    iconfont: boolean;
    style?: Record<string, string>;
  }
  defineProps({
    iconList: {
      type: Array as PropType<IconBtn[]>,
      default() {
        return [];
      }
    },
    active: {
      type: String,
      default: ''
    }
  });
  const emits = defineEmits(['change', 'update:active']);

  const handleToggle = (view: string) => {
    emits('change', view);
    emits('update:active', view);
  };
</script>

<style lang="less" scoped>
  .icon-btn-group {
    display: flex;
    align-items: center;
    height: max-content;
    padding: 0;
    font-size: 0;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 16px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-1);
      }

      &.active {
        background-color: var(--color-fill-1);
      }
    }

    :deep(.arco-icon),
    .iconfont {
      // margin-right: 6px;
      color: var(--color-text-2);
      font-size: 16px;
      cursor: pointer;

      &:hover {
        color: rgb(var(--arcoblue-6));
      }
    }

    .arco-icon.active,
    .iconfont.active {
      color: rgb(var(--arcoblue-6));
    }
  }
</style>

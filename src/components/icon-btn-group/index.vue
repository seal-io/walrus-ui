<template>
  <a-space class="icon-btn-group">
    <span v-for="item in iconList" :key="item.icon">
      <icon-font
        v-if="item.iconfont"
        :type="item.icon"
        :class="{ active: active === item.view }"
        @click="handleToggle(item.view)"
      />
      <component
        :is="item.icon"
        v-else
        :class="{ active: active === item.view }"
        @click="handleToggle(item.view)"
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
    padding: 0;

    :deep(.arco-icon) {
      margin-right: 6px;
      color: var(--color-text-2);
      font-size: 20px;
      border-radius: 4px;
      cursor: pointer;
      .hoverable();

      &:hover {
        color: rgb(var(--arcoblue-6));
        .hoverableHover();
      }
    }

    .arco-icon.active {
      color: rgb(var(--arcoblue-6));
      box-shadow: var(--seal-hoverable-shadow);
    }
  }
</style>

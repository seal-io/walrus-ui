<template>
  <div class="button-menu-wrap">
    <a-tooltip :content="content">
      <a-button
        class="nav-btn"
        :class="{ bordered: bordered }"
        type="outline"
        shape="circle"
        :style="$attrs.style"
        :bordered="bordered"
        @click="setDropDownVisible"
      >
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </a-button>
    </a-tooltip>
    <a-dropdown
      v-if="dropList.length"
      trigger="click"
      style="top: 50px"
      @select="menuClick"
    >
      <div ref="trigger" class="trigger-btn"></div>
      <template #content>
        <a-doption
          v-for="item in dropList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref } from 'vue';

  type MenuClickType = (str?: unknown) => unknown;
  const props = defineProps({
    content: {
      type: String,
      default() {
        return '';
      }
    },
    bordered: {
      type: Boolean,
      default() {
        return true;
      }
    },
    dropList: {
      type: Array as PropType<{ value: string; label: string }[]>,
      default() {
        return [];
      }
    },
    menuClick: {
      type: Function as PropType<MenuClickType>,
      default() {
        return null;
      }
    }
  });
  const trigger = ref();

  const setDropDownVisible = () => {
    if (props.dropList.length) {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      trigger.value.dispatchEvent(event);
    } else if (props.menuClick) {
      props.menuClick();
    }
  };
</script>

<style lang="less" scoped>
  .button-menu-wrap {
    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: var(--font-size-large);

      &:hover {
        border: none;
      }

      &.bordered {
        border-color: var(--seal-color-text-1);
      }
    }

    .trigger-btn {
      position: absolute;
      bottom: 14px;
    }
  }
</style>

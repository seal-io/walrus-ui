<template>
  <div class="app-menu-list">
    <div class="title">资源</div>
    <ul>
      <li
        v-for="item in list"
        :key="item.value"
        class="item"
        :class="{ actived: actived === item.value }"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue-demi';

  defineProps({
    list: {
      type: Array as PropType<{ value: string; label: string }[]>,
      default() {
        return [];
      },
    },
    actived: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const emits = defineEmits(['click']);
  const handleClick = (item) => {
    emits('click', item.value);
  };
</script>

<style lang="less" scoped>
  .app-menu-list {
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      font-weight: 500;
    }

    ul,
    li {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    .item {
      width: inherit;
      height: 36px;
      padding: 5px 10px;
      overflow: hidden;
      font-weight: 500;
      font-size: 14px;
      line-height: 26px;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px solid var(--seal-border-gray-2);
      border-radius: 2px;
      cursor: pointer;

      &:hover {
        // background-color: var(--seal-color-bg-1);
        color: var(--sealblue-6);
        // transition: all .6s var(--seal-transition-func);
      }

      &.actived {
        color: #fff;
        background-color: var(--seal-color-bg-1);
      }
      // transition: all .6s var(--seal-transition-func);
    }
  }
</style>

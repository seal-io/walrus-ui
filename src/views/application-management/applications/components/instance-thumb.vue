<template>
  <div
    class="thumb-item"
    :class="{ active: active }"
    :style="{
      width: `${get(size, 0) || size}px`,
      height: `${get(size, 1) || size}px`
    }"
  >
    <a-dropdown
      v-if="actions.length"
      size="small"
      style="line-height: 30px"
      position="bl"
      @select="handleClick"
    >
      <a-link
        size="mini"
        style="position: absolute; top: 0; right: 0"
        @click.stop="() => {}"
      >
        <template #icon
          ><icon-more style="font-size: 18px; stroke-width: 5"
        /></template>
      </a-link>
      <template #content>
        <a-doption
          v-for="item in actions"
          :key="item.value"
          :value="item.value"
          :style="{
            'line-height': '32px',
            'color':
              item.value === 'delete'
                ? 'rgb(var(--danger-6))'
                : 'var(--color-text-2)'
          }"
          ><component :is="item.icon" style="margin-right: 5px"></component
          >{{ $t(item.label) }}</a-doption
        >
      </template>
    </a-dropdown>
    <div class="status">
      <slot name="status"></slot>
    </div>
    <div class="name"
      ><slot>{{ dataInfo.name }}</slot></div
    >
    <div class="description"
      ><slot name="description">{{ dataInfo.type }}</slot></div
    >
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { InstanceData } from '../config/interface';

  type actioneItem = {
    label: string;
    value: string;
    icon: string;
  };
  const props = defineProps({
    actions: {
      type: Array as PropType<actioneItem[]>,
      default() {
        return [];
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    size: {
      type: [Number, Array],
      default() {
        return 100;
      }
    },
    active: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['change', 'edit', 'upgrade']);
  const handleCheckedChange = (val) => {
    console.log('val:', val);
    emits('change', val, props.dataInfo.id);
  };
  const handleClick = (val) => {
    console.log('value===', val);
    emits(val);
  };
</script>

<style lang="less" scoped>
  .thumb-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 5px;
    .thumbCard();

    &:hover {
      .thumbCardHover();
    }

    .name {
      width: -webkit-fill-available;
      margin-bottom: 10px;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }

    .description {
      width: -webkit-fill-available;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }

    .status {
      position: absolute;
      top: 0;
      left: 4px;
      transform: scale(0.8);
    }

    :deep(.arco-link-icon) {
      margin-right: 0;
    }

    &.active {
      .thumbCardHover();
    }
  }
</style>

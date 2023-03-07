<template>
  <div
    class="thumb-item"
    :class="{ active: active }"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <a-dropdown
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
        <template #icon><icon-more style="font-size: 18px" /></template>
      </a-link>
      <template #content>
        <a-doption v-for="item in actions" :key="item.value" :value="item.value"
          ><icon-delete style="margin-right: 5px" />{{
            $t(item.label)
          }}</a-doption
        >
      </template>
    </a-dropdown>

    <div class="name"
      ><slot>{{ dataInfo.name }}</slot></div
    >
    <div
      ><slot name="description">{{ dataInfo.type }}</slot></div
    >
  </div>
</template>

<script lang="ts" setup>
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
      type: Number,
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
  const emits = defineEmits(['change', 'edit']);
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
      margin-bottom: 10px;
    }

    :deep(.arco-link-icon) {
      margin-right: 0;
    }

    &.active {
      .thumbCardHover();
    }
  }
</style>

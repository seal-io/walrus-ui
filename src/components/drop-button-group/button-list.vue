<template>
  <a-space :size="16">
    <a-tooltip
      v-for="item in actions"
      :key="item.label"
      :content="$t(item.label)"
    >
      <a-link
        type="text"
        size="small"
        :status="item.status"
        :disabled="!!item.disabled"
        @click="handleClick(item)"
      >
        <template #icon>
          <i v-if="item.iconfont" :class="['iconfont', item.icon]"></i>
          <component
            :is="item.icon"
            v-else
            v-bind="item.props"
            class="size-14"
          ></component>
        </template>
      </a-link>
    </a-tooltip>
  </a-space>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { MoreAction } from '@/views/config/interface';

  defineProps({
    actions: {
      type: Array as PropType<MoreAction[]>,
      default() {
        return [];
      }
    }
  });
  const emits = defineEmits(['select']);

  const handleClick = (data) => {
    emits('select', data.value);
  };
</script>

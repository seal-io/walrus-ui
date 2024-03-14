<template>
  <a-dropdown
    size="small"
    position="bl"
    :popup-container="containerId"
    :trigger="trigger"
    @select="handleSelectAction"
  >
    <a-link size="mini" style="padding: 4px 1px" @click.stop="() => {}">
      <icon-more-vertical
        style="margin-right: 0; font-size: 16px; stroke-width: 5"
      />
    </a-link>
    <template #content>
      <a-doption
        v-for="(item, index) in actions"
        :key="index"
        :value="item.value"
        :style="{
          color: 'var(--color-text-2)'
        }"
      >
        <a-link :status="item.status" :hoverable="false"
          ><i
            v-if="item.iconfont"
            class="iconfont m-r-8"
            :class="[item.icon]"
          ></i>
          <component :is="item.icon" v-else class="m-r-8"></component
          >{{ $t(item.label) }}</a-link
        >
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { MoreAction } from '@/views/config/interface';

  const props = defineProps({
    actions: {
      type: Array as PropType<MoreAction[]>,
      default: () => []
    },
    containerId: {
      type: String,
      default() {
        return null;
      }
    },
    trigger: {
      type: String as PropType<'click' | 'hover'>,
      default() {
        return 'click';
      }
    }
  });

  const emits = defineEmits(['select']);
  const handleSelectAction = (value) => {
    emits('select', value);
  };
</script>

<script lang="ts">
  export default {
    inheritAttrs: false
  };
</script>

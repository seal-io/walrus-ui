<template>
  <a-dropdown
    size="small"
    style="line-height: 30px"
    position="bl"
    :popup-container="containerId"
    @select="handleSelectAction"
  >
    <a-link size="mini" @click.stop="() => {}">
      <template #icon
        ><icon-more style="margin-right: 0; font-size: 18px; stroke-width: 5"
      /></template>
    </a-link>
    <template #content>
      <a-doption
        v-for="(item, index) in actions"
        :key="index"
        :value="item.value"
        :style="{
          lineHeight: '28px',
          color: 'var(--color-text-2)'
        }"
      >
        <component :is="item.icon" style="margin-right: 8px"></component
        >{{ $t(item.label) }}
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
    }
  });

  const emits = defineEmits(['select']);
  const handleSelectAction = (value) => {
    emits('select', value);
  };
</script>

<template>
  <a-dropdown-button
    size="small"
    class="action-dropdown"
    @select="handleSelect"
  >
    <a-tooltip :content="$t(_.get(_.head(actions), 'label') || '')">
      <a-link
        class="mright-0"
        :hoverable="false"
        size="small"
        :disabled="_.get(_.head(actions), 'disabled')"
        @click="handleClick(_.head(actions))"
      >
        <template #icon>
          <component
            v-bind="_.get(_.head(actions), 'props') || ''"
            :is="_.get(_.head(actions), 'icon') || ''"
            class="size-14"
          ></component>
        </template>
      </a-link>
    </a-tooltip>
    <template #icon>
      <icon-more style="font-size: 18px; stroke-width: 5" />
    </template>
    <template #content>
      <a-doption
        v-for="item in _.tail(actions)"
        :key="item.value"
        :value="item.value"
      >
        <a-link
          type="text"
          size="small"
          :status="item.status"
          :disabled="item.disabled"
        >
          <template #icon>
            <component
              :is="item.icon"
              v-bind="item.props"
              class="size-14"
            ></component>
          </template>
          {{ $t(item.label) }}
        </a-link>
      </a-doption>
    </template>
  </a-dropdown-button>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType } from 'vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { MoreAction } from '@/views/config/interface';

  defineProps({
    actions: {
      type: Array as PropType<MoreAction[]>,
      default() {
        return [];
      }
    }
  });

  const emits = defineEmits(['click', 'select']);
  const handleClick = (data) => {
    emits('click', data);
  };
  const handleSelect = (val) => {
    emits('select', val);
  };
</script>

<style lang="less" scoped>
  .action-dropdown {
    .mright-0 {
      position: relative;

      :deep(.arco-link-icon) {
        margin-right: 0;
      }

      &::after {
        position: absolute;
        top: -2px;
        right: -5px;
        bottom: -2px;
        left: -5px;
        display: inline-block;
        content: '';
      }
    }
  }
</style>

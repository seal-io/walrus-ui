<template>
  <a-dropdown-button
    v-if="layout === 'vertical'"
    size="small"
    class="action-dropdown"
    @select="handleSelect"
  >
    <a-tooltip :content="$t(_.get(_.head(actions), 'label') || '')">
      <a-link
        class="mright-0"
        :hoverable="false"
        size="small"
        :disabled="!!_.get(_.head(actions), 'disabled')"
        @click="handleClick(_.head(actions))"
      >
        <template #icon>
          <component
            v-bind="_.get(_.head(actions), 'props') || ''"
            :is="_.get(_.head(actions), 'icon') || ''"
            class="size-14"
            style="color: var(--sealblue-6)"
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
          :disabled="!!item.disabled"
        >
          <!-- <template #icon>
            <component
              :is="item.icon"
              v-bind="item.props"
              class="size-14"
            ></component>
          </template> -->

          <span class="flex flex-align-center">
            <span>
              <i
                v-if="item.iconfont"
                :class="[item.icon]"
                :style="{ ...item.style }"
                class="iconfont size-14"
              ></i>
              <component
                :is="item.icon"
                v-else
                v-bind="item.props"
                :style="item.style"
                class="size-14"
              ></component>
            </span>
            <span class="mleft-5">{{ $t(item.label) }}</span>
          </span>
        </a-link>
      </a-doption>
    </template>
  </a-dropdown-button>
  <buttonList v-else :actions="actions" @select="handleSelect"> </buttonList>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType } from 'vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { MoreAction } from '@/views/config/interface';
  import buttonList from './button-list.vue';

  defineProps({
    actions: {
      type: Array as PropType<MoreAction[]>,
      default() {
        return [];
      }
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default() {
        return 'vertical';
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

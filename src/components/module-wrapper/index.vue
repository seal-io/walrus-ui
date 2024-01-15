<template>
  <div class="mo-wrap" :class="{ disabled }">
    <div class="title" :class="{ 'no-del-btn': !showDelete }">
      <div class="text-wrap" @click.stop="handleCollapse">
        <a-space>
          <span v-if="showArrow" class="text">
            <icon-right v-if="!isCollapse" />
            <icon-down v-else />
          </span>
          <slot name="title"
            ><span>{{ title }}</span></slot
          >
        </a-space>
      </div>
      <slot name="right">
        <a-button
          v-if="showDelete"
          status="danger"
          type="text"
          @click.stop="handleDelete"
        >
          <template #icon>
            <icon-delete style="font-size: 16px" />
          </template>
        </a-button>
      </slot>
    </div>
    <slTransition>
      <div v-show="isCollapse">
        <div class="content" :class="{ inner: innerWrap }">
          <slot></slot>
        </div>
      </div>
    </slTransition>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { deleteModal } from '@/utils/monitor';

  const props = defineProps({
    title: {
      type: String,
      default() {
        return '';
      }
    },
    innerWrap: {
      type: Boolean,
      default() {
        return false;
      }
    },
    status: {
      type: Boolean,
      default() {
        return false;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showArrow: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showDelete: {
      type: Boolean,
      default() {
        return true;
      }
    }
  });
  const emits = defineEmits(['delete', 'update:status', 'collapse']);
  const isCollapse = ref(props.status);
  const handleCollapse = () => {
    if (props.disabled) return;
    isCollapse.value = !isCollapse.value;
    emits('update:status', isCollapse.value);
    emits('collapse', isCollapse.value);
  };
  const handleDeleteConfirm = () => {
    emits('delete');
  };
  const handleDelete = () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  watchEffect(() => {
    isCollapse.value = props.status;
  });
</script>

<style lang="less" scoped>
  .mo-wrap {
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 10px;
      font-weight: var(--font-weight-medium);
      font-size: 14px;
      background-color: var(--color-fill-1);
      cursor: pointer;

      .text-wrap {
        display: flex;
        flex: 1;
        height: 100%;
      }

      &.no-del-btn {
        justify-content: space-between;
      }
    }

    .text {
      display: flex;
    }

    .collapse-icon {
      color: rgba(var(--arcoblue-6), 0.7);
      font-size: var(--font-size-large);
      cursor: pointer;
      transition: all 0.2s var(--seal-transition-func);
      .hoverable();

      &:hover {
        .hoverableHover();

        color: rgba(var(--arcoblue-6), 0.7);
      }

      &.collapse {
        transition: all 0.2s var(--seal-transition-func);
      }
    }

    .content {
      padding: 10px;

      &.inner {
        padding: 0;
      }
    }
  }
</style>

<template>
  <div class="mo-wrap">
    <div class="title">
      <span class="text">
        <icon-double-right
          class="collapse-icon"
          style="margin-right: 6px; font-size: 16px"
          :class="{ collapse: isCollapse }"
          @click="handleCollapse"
        />
        <span>{{ title }}</span>
      </span>
      <icon-delete class="btn" style="font-size: 18px" @click="handleDelete" />
    </div>
    <slTransition>
      <div v-show="isCollapse">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </slTransition>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { propsToAttrMap } from '@vue/shared';
  import { watch } from 'fs';

  const props = defineProps({
    title: {
      type: String,
      default() {
        return '';
      }
    },
    status: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['delete']);
  const isCollapse = ref(props.status);
  const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
  const handleDeleteConfirm = () => {
    console.log('delete');
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
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      padding: 0 10px;
      font-weight: 500;
      font-size: 14px;
      background-color: var(--color-fill-2);

      :deep(.arco-icon) {
        color: rgb(var(--arcoblue-6));
        .hoverable();

        &:hover {
          .hoverableHover();

          color: rgb(var(--arcoblue-5));
          border-radius: 8px;
        }
      }
    }

    .text {
      display: flex;
    }

    .collapse-icon {
      transition: transform 0.2s var(--seal-transition-func);

      &.collapse {
        transform: rotate(90deg);
        transition: transform 0.2s var(--seal-transition-func);
      }
    }

    .content {
      padding: 10px;
    }
  }
</style>

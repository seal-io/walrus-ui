<template>
  <div class="mo-wrap">
    <div
      class="title"
      :class="{ 'no-del-btn': !showDelete }"
      @click="handleCollapse"
    >
      <a-space>
        <span class="text">
          <!-- <i
            class="collapse-icon iconfont"
            :class="{
              'collapse': isCollapse,
              'icon-collapsedown': !isCollapse,
              'icon-collapseup': isCollapse
            }"
          /> -->
          <!-- <icon-caret-right v-if="!isCollapse" />
          <icon-caret-down v-else /> -->
          <icon-right v-if="!isCollapse" />
          <icon-down v-else />
        </span>
        <slot name="title"
          ><span>{{ title }}</span></slot
        >
      </a-space>
      <a-button
        v-if="showDelete"
        status="danger"
        type="text"
        @click.stop="handleDelete"
      >
        <template #icon>
          <icon-delete style="font-size: 18px" />
        </template>
      </a-button>
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
    showDelete: {
      type: Boolean,
      default() {
        return true;
      }
    }
  });
  const emits = defineEmits(['delete']);
  const isCollapse = ref(props.status);
  const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
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
      height: 36px;
      padding: 0 10px;
      font-weight: 500;
      font-size: 14px;
      background-color: var(--color-fill-2);
      cursor: pointer;

      &.no-del-btn {
        justify-content: space-between;
      }

      // :deep(.arco-icon) {
      //   color: rgb(var(--arcoblue-6));
      //   .hoverable();

      //   &:hover {
      //     .hoverableHover();

      //     color: rgb(var(--arcoblue-5));
      //     border-radius: 8px;
      //   }
      // }
    }

    .text {
      display: flex;
    }

    .collapse-icon {
      color: rgba(var(--arcoblue-6), 0.7);
      font-size: 16px;
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

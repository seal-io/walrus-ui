<template>
  <div
    class="group-title"
    :class="{
      'bordered': bordered,
      'is-detail': isDetail,
      'iconed': iconed,
      'flex-start': flexStart
    }"
  >
    <div class="label">
      <a-link v-if="showBack" @click="handleBack"
        ><icon-arrow-left style="stroke-width: 5; font-size: 16px"
      /></a-link>
      <a-divider v-if="showBack" direction="vertical"></a-divider>
      <div class="title-wrap">
        <slot name="title">{{ title }}</slot>
        <slot name="extra"></slot>
        <a-link v-if="showEdit" class="m-l-10" @click="handleEdit">
          <icon-edit></icon-edit>
          <span class="mleft-5">{{ $t('common.button.edit') }}</span>
        </a-link>
      </div>
    </div>
    <div><slot name="right" class="right"></slot></div>
  </div>
</template>

<script lang="ts" setup>
  import useCallCommon from '@/hooks/use-call-common';

  defineProps({
    title: String,
    bordered: {
      type: Boolean,
      default() {
        return true;
      }
    },
    flexStart: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isDetail: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showBack: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    iconed: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['edit']);
  const { router } = useCallCommon();
  const handleBack = () => {
    router.back();
  };
  const handleEdit = () => {
    emits('edit');
  };
</script>

<style lang="less" scoped>
  .group-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-weight: var(--font-weight-regular);

    &.iconed {
      padding-left: 8px;
    }

    &.iconed::before {
      position: absolute;
      top: 0;
      bottom: 10px;
      left: 0;
      display: inline-block;
      width: 3px;
      background-color: rgba(var(--arcoblue-6), 0.8);
      border-radius: 0 4px 4px 0;
      content: '';
    }

    &.bordered {
      font-weight: var(--font-weight-regular);
      border-bottom: 1px solid var(--seal-border-gray);
    }

    &.is-detail {
      margin-bottom: 10px;
      border-bottom: 1px solid var(--color-white);
    }

    &.flex-start {
      .label {
        .title-wrap {
          justify-content: flex-start;
        }
      }
    }

    .label {
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--color-text-2);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-large);

      .title-wrap {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>
